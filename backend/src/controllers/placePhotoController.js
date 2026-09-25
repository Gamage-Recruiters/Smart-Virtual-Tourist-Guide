import PlacePhoto from '../models/placePhoto.js';
import { searchPlacePhotos } from '../services/photoProviders.js';

const USER_AGENT = 'SVTG/1.0 (Smart Virtual Tourist Guide, intern project)';
const TARGET_PHOTOS = 5;
const MIN_ACCEPTABLE_CACHE = 3; // legacy records with fewer than this are topped up, not trusted as-is

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

const GOOD_ENOUGH = 3;

const IRRELEVANT_CATEGORY_HINTS = [
  'vehicle', 'automobile', 'car', 'bus', 'truck', 'train',
  'bird', 'mammal', 'animal', 'cat', 'dog', 'insect', 'fish',
  'portrait', 'people', 'logo', 'flag of', 'diagram', 'map of',
  'screenshot', 'text', 'sign', 'icon'
];

async function fetchCategories(titles) {
  if (!titles || titles.length === 0) return {};
  try {
    const titlesParam = titles.map(encodeURIComponent).join('|');
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${titlesParam}&prop=categories&cllimit=500&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return {};
    const data = await res.json();
    const pages = data?.query?.pages || {};
    
    const result = {};
    for (const page of Object.values(pages)) {
      if (page.title) {
        result[page.title] = (page.categories || []).map(c => c.title.toLowerCase());
      }
    }
    return result;
  } catch (err) {
    console.warn('Failed to fetch categories:', err.message);
    return {};
  }
}

function isLikelyRelevant(categories) {
  // Fail-open: if no categories are present, assume it's a valid photo
  if (!categories || categories.length === 0) return true;
  for (const cat of categories) {
    if (IRRELEVANT_CATEGORY_HINTS.some(hint => cat.includes(hint))) {
      return false; // Found an irrelevant hint
    }
  }
  return true;
}

// Helper: Wikimedia Commons Geosearch.
// Accumulates DISTINCT photo urls across radii instead of returning on the first hit,
// so one place can fill most/all of the 5-photo grid by itself.
export async function fetchCommonsPhotos(lat, lng, max = TARGET_PHOTOS) {
  const seen = new Set();
  const urls = [];

  for (const r of [500, 1500, 3000]) {
    if (urls.length >= max || urls.length >= GOOD_ENOUGH) break;
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query` +
        `&generator=geosearch&ggscoord=${lat}|${lng}&ggsradius=${r}&ggslimit=10&ggsnamespace=6` +
        `&prop=imageinfo&iiprop=url|mime&iiurlwidth=800&format=json`;
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
      if (!res.ok) continue;
      const data = await res.json();
      const pages = data?.query?.pages || {};

      const newPages = Object.values(pages).filter(p => p.pageid && !seen.has(p.pageid));
      if (!newPages.length) continue;

      const candidatePages = [];
      for (const page of newPages) {
        seen.add(page.pageid); // mark all as seen
        const info = page?.imageinfo?.[0];
        const isPhoto = info && (!info.mime || ['image/jpeg', 'image/png', 'image/webp'].includes(info.mime));
        if (isPhoto) {
          candidatePages.push(page);
        }
      }

      if (candidatePages.length === 0) continue;

      // Fetch categories for all candidate photos in one batch
      const titles = candidatePages.map(p => p.title);
      const categoriesMap = await fetchCategories(titles);

      for (const page of candidatePages) {
        const pageCategories = categoriesMap[page.title] || [];
        
        // Filter irrelevant photos before adding to urls
        if (isLikelyRelevant(pageCategories)) {
          if (urls.length >= max) break;
          const info = page?.imageinfo?.[0];
          const thumbUrl = info.thumburl || info.url;
          if (thumbUrl && !urls.includes(thumbUrl)) urls.push(thumbUrl);
        }
      }
    } catch (error) {
      console.warn(`Commons geosearch failed at radius ${r}:`, error.message);
    }
  }
  return urls;
}

// Helper: Wikipedia Pageimages Batch.
// The pageimages API only ever returns 1 thumbnail per article (their limit, not ours),
// so this stays a fallback for places Commons found nothing for — never the primary source.
async function fetchWikipediaPhotosBatch(names) {
  if (names.length === 0) return {};
  try {
    const titles = names.map(encodeURIComponent).join('|');
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${titles}&prop=pageimages&format=json&pithumbsize=800&redirects=1`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return {};
    const data = await res.json();
    const pages = data?.query?.pages || {};

    const result = {};
    for (const page of Object.values(pages)) {
      if (page.title && page.thumbnail?.source) {
        result[page.title.toLowerCase()] = page.thumbnail.source;
      }
    }

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

  // Deduplicate incoming places (order preserved — the searched place should be places[0])
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

  // 1. Batch read from DB.
  // A cached entry only counts as a full hit once it has enough photos to be useful;
  // thin/legacy entries (old 1-photo records, or previously-capped results) are topped up below.
  const orQueries = uniquePlaces.map(p => ({ lat: p.lat, lng: p.lng }));
  const cachedRecords = await PlacePhoto.find({ $or: orQueries });

  const dbCache = new Map();      // key -> urls to use as-is (>= MIN_ACCEPTABLE_CACHE, or confirmed 0)
  const topUpNeeded = new Map();  // key -> urls already known, but worth extending

  for (const record of cachedRecords) {
    const key = `${record.lat},${record.lng}`;
    const urls = (record.photoUrls && record.photoUrls.length > 0)
      ? record.photoUrls
      : (record.photoUrl ? [record.photoUrl] : []);

    if (urls.length === 0 && record.photoUrls) {
      dbCache.set(key, []); // confirmed 0 photos — trust it, don't refetch every search
    } else if (urls.length >= MIN_ACCEPTABLE_CACHE) {
      dbCache.set(key, urls);
    } else if (urls.length > 0) {
      topUpNeeded.set(key, urls); // e.g. legacy 1-photo record — reuse it, but try to extend it
    }
  }

  const finalPhotos = new Set();
  const results = [];
  const namesForWikipedia = [];
  const missesToSave = [];
  const foundToSave = [];

  const addPhoto = (url) => {
    if (url && !finalPhotos.has(url) && results.length < TARGET_PHOTOS) {
      finalPhotos.add(url);
      results.push(url);
      return true;
    }
    return false;
  };

  // 2. Process places in order: confirmed cache hits, then top-ups, then fresh fetches
  for (const p of uniquePlaces) {
    if (results.length >= TARGET_PHOTOS) break;

    if (dbCache.has(p.key)) {
      for (const u of dbCache.get(p.key)) {
        if (results.length >= TARGET_PHOTOS) break;
        addPhoto(u);
      }
      continue;
    }

    const known = topUpNeeded.get(p.key) || [];
    for (const u of known) addPhoto(u);
    if (results.length >= TARGET_PHOTOS) continue;

    // Dedupe concurrent identical requests
    let fetchPromise = inFlightRequests.get(p.key);
    if (!fetchPromise) {
      fetchPromise = searchPlacePhotos(p, TARGET_PHOTOS);
      inFlightRequests.set(p.key, fetchPromise);
      fetchPromise.finally(() => inFlightRequests.delete(p.key));
    }

    const photoUrls = await fetchPromise;
    const merged = Array.from(new Set([...known, ...photoUrls]));

    if (merged.length > 0) {
      for (const u of merged) {
        if (results.length >= TARGET_PHOTOS) break;
        addPhoto(u);
      }
      foundToSave.push({ lat: p.lat, lng: p.lng, photoUrls: merged });
    } else if (p.name) {
      namesForWikipedia.push({ lat: p.lat, lng: p.lng, name: p.name });
    } else {
      missesToSave.push({ lat: p.lat, lng: p.lng, photoUrls: [] });
    }
  }

  // 3. Wikipedia fallback batch (only for places Commons truly found nothing for)
  if (results.length < TARGET_PHOTOS && namesForWikipedia.length > 0) {
    const batchedNames = namesForWikipedia.map(n => n.name).slice(0, 50);
    const wikiResults = await fetchWikipediaPhotosBatch(batchedNames);

    for (const p of namesForWikipedia) {
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
    expiresAt.setDate(expiresAt.getDate() + (isFound ? 90 : 30));

    const bulkOps = records.map(r => ({
      updateOne: {
        filter: { lat: r.lat, lng: r.lng },
        update: { $set: { photoUrls: r.photoUrls, expiresAt } },
        upsert: true,
      },
    }));
    try {
      await PlacePhoto.bulkWrite(bulkOps);
    } catch (err) {
      console.error('Bulk write failed:', err.message);
    }
  };

  saveToDb(foundToSave, true);
  saveToDb(missesToSave, false);

  res.json({ success: true, photos: results });
};