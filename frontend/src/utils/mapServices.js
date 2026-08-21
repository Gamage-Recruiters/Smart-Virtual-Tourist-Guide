/**
 * Central API wrapper for open-source map services.
 * Replaces all Google Maps API calls with free, no-key-required alternatives.
 *
 * APIs used:
 *   - Photon (komoot)   → Search autocomplete
 *   - Nominatim (OSM)   → Forward & reverse geocoding
 *   - OSRM              → Route calculation
 *   - Overpass (OSM)     → Nearby place search
 *   - Wikimedia Commons  → Place photos
 */

// ── Photon: Search Autocomplete ──
export async function searchPlaces(query, limit = 5) {
  if (!query?.trim()) return [];
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=${limit}&lang=en&lat=7.8&lon=80.7`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.features || []).map(f => ({
    name: f.properties.name || f.properties.street || '',
    displayName: [f.properties.name, f.properties.city, f.properties.state].filter(Boolean).join(', '),
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
    osm_id: f.properties.osm_id,
    type: f.properties.osm_value,
  }));
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

// ── Wikimedia: Place Photos ──
export async function getPlacePhoto(placeName) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(placeName)}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
  const res = await fetch(url);
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const page = Object.values(pages)[0];
  return page?.thumbnail?.source || null;
}
