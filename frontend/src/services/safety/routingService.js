/**
 * Routing Service — OSRM Integration
 *
 * Uses the free OSRM public demo server to fetch routes for
 * driving, cycling, and walking profiles.
 *
 * Note: The demo server is rate-limited and has no SLA.
 * For production, consider self-hosting OSRM or using OpenRouteService.
 */

const PROFILE_MAP = {
  car: 'car',
  bike: 'bike',
  foot: 'foot',
};

/**
 * Fetch a route from OSRM for a single profile.
 * @param {string} profile - 'car' | 'bike' | 'foot'
 * @param {number} originLat
 * @param {number} originLng
 * @param {number} destLat
 * @param {number} destLng
 * @returns {Promise<{ distance: number, duration: number, geometry: [number, number][] }>}
 */
export async function fetchRoute(profile, originLat, originLng, destLat, destLng) {
  const mode = PROFILE_MAP[profile] || 'car';

  // OSRM expects coordinates as lng,lat (GeoJSON order)
  // For routing.openstreetmap.de, the path mode is routed-{car/bike/foot} and inner profile is always 'driving'
  const url = `https://routing.openstreetmap.de/routed-${mode}/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=false`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM error: HTTP ${res.status}`);

  const data = await res.json();

  if (data.code !== 'Ok' || !data.routes?.length) {
    throw new Error(data.message || 'No route found');
  }

  const route = data.routes[0];

  return {
    distance: route.distance,   // meters
    duration: route.duration,   // seconds
    // Flip GeoJSON [lng, lat] → Leaflet [lat, lng]
    geometry: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
  };
}

/**
 * Fetch routes for ALL profiles in parallel.
 * Returns an object keyed by profile name.
 * Failed profiles will be null.
 *
 * @param {number} originLat
 * @param {number} originLng
 * @param {number} destLat
 * @param {number} destLng
 * @returns {Promise<{ car: object|null, bike: object|null, foot: object|null }>}
 */
export async function fetchAllRoutes(originLat, originLng, destLat, destLng) {
  const profiles = ['car', 'bike', 'foot'];
  const results = {};

  await Promise.allSettled(
    profiles.map(async (profile) => {
      try {
        results[profile] = await fetchRoute(profile, originLat, originLng, destLat, destLng);
      } catch (err) {
        console.warn(`Route fetch failed for ${profile}:`, err.message);
        results[profile] = null;
      }
    })
  );

  return results;
}
