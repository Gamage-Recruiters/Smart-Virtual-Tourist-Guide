import PlacePhoto from '../models/placePhoto.js';

const USER_AGENT = 'SVTG/1.0 (Smart Virtual Tourist Guide, intern project)';

// GET /api/place-photos?lat=X&lng=Y
export const getPlacePhoto = async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ success: false });
  const photo = await PlacePhoto.findOne({
    lat: parseFloat(parseFloat(lat).toFixed(4)),
    lng: parseFloat(parseFloat(lng).toFixed(4)),
  });
  if (!photo) return res.status(404).json({ success: false });
  const url = (photo.photoUrls && photo.photoUrls.length > 0) ? photo.photoUrls[0] : photo.photoUrl;
  if (!url) return res.status(404).json({ success: false });
  res.json({ success: true, photoUrl: url });
};

// POST /api/place-photos  { lat, lng, photoUrl }
export const createPlacePhoto = async (req, res) => {
  const { lat, lng, photoUrl } = req.body;
  if (!lat || !lng || photoUrl === undefined) return res.status(400).json({ success: false });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (photoUrl ? 90 : 7)); // 90 days if found, 7 days if no photo

  await PlacePhoto.findOneAndUpdate(
    { lat: parseFloat(parseFloat(lat).toFixed(4)), lng: parseFloat(parseFloat(lng).toFixed(4)) },
    { photoUrl, photoUrls: photoUrl ? [photoUrl] : [], expiresAt },
    { upsert: true },
  );
  res.status(201).json({ success: true });
};

// Helper: Wikimedia Commons Geosearch
async function fetchCommonsPhoto(lat, lng) {
  for (const r of [500, 1500, 3000]) {
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lng}&gsradius=${r}&gslimit=5&gsnamespace=6&format=json`;
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
      if (!res.ok) continue;
      const data = await res.json();
      const results = data?.query?.geosearch || [];
      if (!results.length) continue;

      const titles = results.slice(0, 5).map(r => encodeURIComponent(r.title)).join('|');
      const fileUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${titles}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
      const fileRes = await fetch(fileUrl, { headers: { 'User-Agent': USER_AGENT } });
      const fileData = await fileRes.json();
      const pages = fileData?.query?.pages || {};
      
      const titleToUrl = {};
      for (const page of Object.values(pages)) {
        const thumbUrl = page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url;
        if (thumbUrl) titleToUrl[page.title] = thumbUrl;
      }
      
      const urls = [];
      for (const r of results) {
        if (titleToUrl[r.title]) urls.push(titleToUrl[r.title]);
      }
      if (urls.length > 0) return urls;
    } catch (error) {
      console.warn(`Commons geosearch failed at radius ${r}:`, error.message);
    }
  }
  return [];
}

// Helper: Wikipedia Pageimages Batch
async function fetchWikipediaPhotosBatch(names) {
  if (names.length === 0) return {};
  try {
    const titles = names.map(encodeURIComponent).join('|');
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${titles}&prop=pageimages&format=json&pithumbsize=800&redirects=1`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return {};
    const data = await res.json();
    const pages = data?.query?.pages || {};

    // Create map from normalized title to url
    const result = {};
    for (const page of Object.values(pages)) {
      if (page.title && page.thumbnail?.source) {
        result[page.title.toLowerCase()] = page.thumbnail.source;
      }
    }

    // Also map redirects
    const redirects = data?.query?.redirects || [];
    for (const r of redirects) {
      if (result[r.to.toLowerCase()]) {
        result[r.from.toLowerCase()] = result[r.to.toLowerCase()];
      }
    }

    return result;
  } catch (error) {
    console.warn(`Wikipedia batch load failed:`, error.message);
    return {};
  }
}

const inFlightRequests = new Map();

// POST /api/place-photos/suggestions
export const getSuggestions = async (req, res) => {
  const { places } = req.body;
  if (!Array.isArray(places) || places.length === 0) {
    return res.status(400).json({ success: false, photos: [] });
  }

  // Deduplicate incoming places
  const uniquePlaces = [];
  const seenKeys = new Set();
  for (const p of places) {
    if (!p.lat || !p.lng) continue;
    const rLat = parseFloat(parseFloat(p.lat).toFixed(4));
    const rLng = parseFloat(parseFloat(p.lng).toFixed(4));
    const key = `${rLat},${rLng}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniquePlaces.push({ name: p.name, lat: rLat, lng: rLng, key });
    }
  }

  // 1. Batch read from DB
  const orQueries = uniquePlaces.map(p => ({ lat: p.lat, lng: p.lng }));
  const cachedRecords = await PlacePhoto.find({ $or: orQueries });

  const dbCache = new Map();
  for (const record of cachedRecords) {
    if (record.photoUrls && record.photoUrls.length > 0) {
      dbCache.set(`${record.lat},${record.lng}`, record.photoUrls);
    } else if (record.photoUrl) {
      // Legacy record with 1 photo: use it so we don't lose the photo!
      dbCache.set(`${record.lat},${record.lng}`, [record.photoUrl]);
    } else if (record.photoUrls && record.photoUrls.length === 0) {
      // Confirmed 0 photos
      dbCache.set(`${record.lat},${record.lng}`, []);
    }
  }

  const finalPhotos = new Set();
  const results = [];
  const namesForWikipedia = [];

  // Helper to process a found photo URL
  const addPhoto = (url) => {
    if (url && !finalPhotos.has(url)) {
      finalPhotos.add(url);
      results.push(url);
    }
  };

  const missesToSave = [];
  const foundToSave = [];

  // 2. Process DB Hits and identify Misses
  for (const p of uniquePlaces) {
    if (results.length >= 5) break;

    if (dbCache.has(p.key)) {
      const urls = dbCache.get(p.key);
      if (urls && urls.length > 0) {
        for (const u of urls) {
          if (results.length >= 5) break;
          addPhoto(u);
        }
      }
    } else {
      // Need to fetch this one.
      // Dedupe concurrent identical requests using inFlightRequests
      let fetchPromise = inFlightRequests.get(p.key);
      if (!fetchPromise) {
        fetchPromise = fetchCommonsPhoto(p.lat, p.lng);
        inFlightRequests.set(p.key, fetchPromise);
        fetchPromise.finally(() => inFlightRequests.delete(p.key));
      }

      const photoUrls = await fetchPromise;
      if (photoUrls && photoUrls.length > 0) {
        for (const u of photoUrls) {
          if (results.length >= 5) break;
          addPhoto(u);
        }
        foundToSave.push({ lat: p.lat, lng: p.lng, photoUrls });
      } else {
        if (p.name) namesForWikipedia.push({ lat: p.lat, lng: p.lng, name: p.name });
      }
    }
  }

  // 3. Wikipedia Fallback Batch
  if (results.length < 5 && namesForWikipedia.length > 0) {
    const batchedNames = namesForWikipedia.map(n => n.name).slice(0, 50); // limit to 50
    const wikiResults = await fetchWikipediaPhotosBatch(batchedNames);

    for (const p of namesForWikipedia) {
      if (results.length >= 5) break;
      const url = wikiResults[p.name.toLowerCase()];
      if (url) {
        addPhoto(url);
        foundToSave.push({ lat: p.lat, lng: p.lng, photoUrls: [url] });
      } else {
        missesToSave.push({ lat: p.lat, lng: p.lng, photoUrls: [] });
      }
    }
  }

  // 4. Fire-and-forget save to DB
  const saveToDb = async (records, isFound) => {
    if (records.length === 0) return;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (isFound ? 90 : 7));

    const bulkOps = records.map(r => ({
      updateOne: {
        filter: { lat: r.lat, lng: r.lng },
        update: { $set: { photoUrls: r.photoUrls, expiresAt } },
        upsert: true
      }
    }));
    try {
      await PlacePhoto.bulkWrite(bulkOps);
    } catch (err) {
      console.error("Bulk write failed:", err.message);
    }
  };

  saveToDb(foundToSave, true);
  saveToDb(missesToSave, false);

  res.json({ success: true, photos: results });
};
