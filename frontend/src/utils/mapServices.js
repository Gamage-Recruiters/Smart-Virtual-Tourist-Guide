/**
 * Central API wrapper for open-source map services.
 * Replaces all Google Maps API calls with free, no-key-required alternatives.
 *
 * APIs used:
 *   - Photon (komoot)        → Search autocomplete
 *   - Nominatim (OSM)        → Forward & reverse geocoding
 *   - OSRM                   → Route calculation
 *   - Overpass (OSM)          → Nearby place search
 *   - Wikimedia Commons       → Place photos (Geosearch by coordinates — primary)
 *   - Wikipedia pageimages    → Place photos (by title — fallback)
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ── Photon: Search Autocomplete ──
// Sri Lanka bounding box: minLon,minLat,maxLon,maxLat
const SL_BBOX = '79.6,5.9,81.9,9.9';

const TYPE_PRIORITY = {
  // Tier 1: Tourist attractions (highest priority)
  attraction: 1, viewpoint: 1, museum: 1, monument: 1, artwork: 1,
  zoo: 1, theme_park: 1, gallery: 1, castle: 1, ruins: 1,
  temple: 1, hindu_temple: 1, buddhist_temple: 1, place_of_worship: 1,
  beach: 1, waterfall: 1, national_park: 1, nature_reserve: 1,

  // Tier 2: Tourism-adjacent (hotels, guesthouses)
  hotel: 2, guest_house: 2, hostel: 2,

  // Tier 3: Administrative (deprioritized, not excluded)
  city: 3, town: 3, village: 3, district: 3, state: 3, county: 3,
};

function getTypePriority(osmValue) {
  return TYPE_PRIORITY[osmValue] ?? 2.5;
}

export async function searchPlaces(query, limit = 8, lat = 7.8, lon = 80.7) {
  if (!query?.trim()) return [];

  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=${limit * 2}&lang=en&lat=${lat}&lon=${lon}&bbox=${SL_BBOX}`;

  const res = await fetch(url);
  const data = await res.json();

  const results = (data.features || []).map(f => ({
    name: f.properties.name || f.properties.street || '',
    displayName: [f.properties.name, f.properties.city, f.properties.state]
      .filter(Boolean)
      .join(', '),
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
    osm_id: f.properties.osm_id,
    type: f.properties.osm_value,
    priority: getTypePriority(f.properties.osm_value),
  }));

  results.sort((a, b) => a.priority - b.priority);

  return results.slice(0, limit);
}

// ── Nominatim: Forward Geocoding (name → coords) ──
export async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=lk`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SmartVirtualTouristGuide/1.0' }
  });
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), displayName: data[0].display_name };
}

// ── Nominatim: Reverse Geocoding (coords → name) ──
export async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SmartVirtualTouristGuide/1.0' }
  });
  return await res.json();
}

// ── OSRM: Route Calculation ──
export async function getRoute(originLat, originLng, destLat, destLng, profile = 'driving') {
  // OSRM uses lng,lat order (not lat,lng!)
  const url = `https://router.project-osrm.org/route/v1/${profile}/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true&alternatives=true`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code !== 'Ok') return null;
  return data.routes.map(route => ({
    geometry: route.geometry,           // GeoJSON LineString
    distance: route.distance,           // meters
    duration: route.duration,           // seconds
    steps: route.legs[0]?.steps || [],
    summary: route.legs[0]?.summary || '',
  }));
}

// ── Overpass: Nearby Places ──
export async function findNearbyPlaces(lat, lng, radiusMeters = 5000, types = '"tourism"~"attraction|viewpoint|museum"') {
  const query = `[out:json][timeout:10];node[${types}](around:${radiusMeters},${lat},${lng});out body;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.elements || []).map(el => ({
    name: el.tags?.name || 'Unknown',
    lat: el.lat,
    lng: el.lon,
    type: el.tags?.tourism || el.tags?.amenity || '',
    osmId: el.id,
  }));
}

// ── Wikimedia Commons: Place Photos by Location (Geosearch — Primary) ──

async function resolveCommonsFileUrl(fileTitle) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`;
  const res = await fetch(url);
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url || null;
}

async function checkPhotoCache(lat, lng) {
  const res = await fetch(`${API_BASE}/place-photos?lat=${lat.toFixed(4)}&lng=${lng.toFixed(4)}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data?.photoUrl || null;
}

async function storePhotoCache(lat, lng, photoUrl) {
  await fetch(`${API_BASE}/place-photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4)), photoUrl }),
  });
}

export async function getPlacePhotoByLocation(lat, lng, radius = 500, placeName = null) {
  // 1. Session storage (instant, same-session dedup)
  const cacheKey = `wikicommons_${lat.toFixed(4)}_${lng.toFixed(4)}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Backend MongoDB cache (cross-session, cross-user)
  try {
    const dbCached = await checkPhotoCache(lat, lng);
    if (dbCached) {
      sessionStorage.setItem(cacheKey, JSON.stringify(dbCached));
      return dbCached;
    }
  } catch { /* cache miss, continue */ }

  // 3. Commons Geosearch with progressive radius expansion
  for (const r of [radius, 1500, 3000]) {
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lng}&gsradius=${r}&gslimit=5&gsnamespace=6&format=json&origin=*`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const results = data?.query?.geosearch || [];
      if (!results.length) continue;

      const photoUrl = await resolveCommonsFileUrl(results[0].title);
      if (photoUrl) {
        sessionStorage.setItem(cacheKey, JSON.stringify(photoUrl));
        void storePhotoCache(lat, lng, photoUrl); // fire-and-forget persist
        return photoUrl;
      }
    } catch (error) {
      console.warn(`Commons geosearch failed at radius ${r}:`, error.message);
    }
  }

  // 4. Wikipedia pageimages fallback (named landmarks with no geotagged Commons photos)
  if (placeName) {
    const namePhoto = await getPlacePhotoByName(placeName);
    if (namePhoto) {
      sessionStorage.setItem(cacheKey, JSON.stringify(namePhoto));
      void storePhotoCache(lat, lng, namePhoto); // cache the fallback result too
      return namePhoto;
    }
  }

  return null;
}

// ── Wikipedia: Place Photos by Name (Fallback) ──
export async function getPlacePhotoByName(placeName) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(placeName)}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages || {};
    const page = Object.values(pages)[0];
    return page?.thumbnail?.source || null;
  } catch (error) {
    console.warn(`Wikipedia photo load failed for ${placeName}:`, error.message);
    return null;
  }
}

// ── Overpass: Unified Batch Nearby Places ──
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

async function fetchOverpass(query) {
  for (const mirror of OVERPASS_MIRRORS) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(`${mirror}?data=${encodeURIComponent(query)}`, { signal: controller.signal });
      clearTimeout(id);
      if (res.ok) {
        return await res.json();
      } else {
        console.error('Overpass mirror returned error:', mirror, res.status, await res.text());
      }
    } catch (err) { 
      console.error('Overpass mirror fetch failed:', mirror, err.message);
    }
  }
  throw new Error('All Overpass mirrors failed');
}

export async function findAllNearbyPOIs(samplePoints, radiusMap = {
  attraction: 2000,
  fuel: 1500,
  restaurant: 800,
  cafe: 800,
  supermarket: 800,
}) {
  if (!samplePoints || samplePoints.length === 0) return [];

  // Round + dedupe sample points to avoid redundant coverage
  const points = dedupePoints(samplePoints, 3); // 3 decimal places ≈ 100m
  if (points.length === 0) return [];

  // Build "lat1,lon1,lat2,lon2,..." string safely with fixed decimals
  const coords = points.map(p => `${Number(p.lat).toFixed(5)},${Number(p.lng).toFixed(5)}`).join(',');

  const query = `[out:json][timeout:25];
(
  node["amenity"~"restaurant|cafe|fuel"](around:${radiusMap.restaurant},${coords});
  node["shop"="supermarket"](around:${radiusMap.supermarket},${coords});
  node["tourism"~"attraction|viewpoint|museum"](around:${radiusMap.attraction},${coords});
);
out body;`;

  const data = await fetchOverpass(query);
  return dedupeAndTag(data?.elements || []);
}

function dedupePoints(points, decimals) {
  const seen = new Set();
  return points.filter(p => {
    const key = `${p.lat.toFixed(decimals)},${p.lng.toFixed(decimals)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeAndTag(elements) {
  const seen = new Set();
  return elements.reduce((acc, el) => {
    const key = `${el.lat.toFixed(5)},${el.lon.toFixed(5)}`;
    if (seen.has(key)) return acc;
    seen.add(key);
    
    let category = 'other';
    if (el.tags?.amenity === 'restaurant') category = 'Restaurant';
    else if (el.tags?.amenity === 'fuel') category = 'Petrol Station';
    else if (el.tags?.amenity === 'cafe') category = 'Coffee Shop';
    else if (el.tags?.shop === 'supermarket') category = 'Supermarket';
    else if (el.tags?.tourism) category = 'Attraction';

    acc.push({
      name: el.tags?.name || 'Unknown',
      lat: el.lat,
      lng: el.lon,
      category: category,
      vicinity: el.tags?.['addr:street'] || el.tags?.['addr:city'] || '',
      osmId: el.id,
      placeId: `osm-${el.id}`,
      location: { lat: el.lat, lng: el.lon },
    });
    return acc;
  }, []);
}

export function getCachedPOIs(routeHash, maxAgeMs = 30 * 60 * 1000) {
  try {
    const raw = sessionStorage.getItem(`poi_${routeHash}`);
    if (!raw) return null;
    const { pois, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > maxAgeMs) {
      sessionStorage.removeItem(`poi_${routeHash}`);
      return null;
    }
    return pois;
  } catch (e) {
    return null;
  }
}

export function setCachedPOIs(routeHash, pois) {
  try {
    sessionStorage.setItem(
      `poi_${routeHash}`,
      JSON.stringify({ pois, timestamp: Date.now() })
    );
  } catch (e) {
    // storage quota exceeded — fail silently, RAM cache still works
  }
}
