/**
 * Shared geographic utility functions.
 * Extracted from Direction.jsx, Explore.jsx, and SafetyAlertTemplate.jsx
 * to eliminate code duplication.
 */

/** Sri Lanka geographic bounding box */
export const SRI_LANKA_BOUNDS = {
  north: 10.0,
  south: 5.7,
  east: 82.1,
  west: 79.4,
};

/**
 * Check whether a lat/lng coordinate falls within Sri Lanka.
 * @param {number} lat
 * @param {number} lng
 * @returns {boolean}
 */
export const isInsideSriLanka = (lat, lng) =>
  lat >= SRI_LANKA_BOUNDS.south &&
  lat <= SRI_LANKA_BOUNDS.north &&
  lng >= SRI_LANKA_BOUNDS.west &&
  lng <= SRI_LANKA_BOUNDS.east;

/**
 * Haversine distance between two points in metres.
 * Works as both `haversineDist` (Direction.jsx) and `haversineDistance` (SafetyAlertTemplate.jsx).
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in metres
 */
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Alias for backward compatibility
export const haversineDist = haversineDistance;

/**
 * Format a distance in metres to a human-readable string.
 * @param {number} metres
 * @returns {string} e.g. "1.2 km" or "450 m"
 */
export const formatDistance = (metres) => {
  if (!Number.isFinite(metres)) return '';
  if (metres >= 1000) return `${(metres / 1000).toFixed(1)} km`;
  return `${Math.max(1, Math.round(metres))} m`;
};

/**
 * Compact formatDistance without space (used by SafetyAlertTemplate).
 * @param {number} metres
 * @returns {string} e.g. "1.2km" or "450m"
 */
export const formatDistanceCompact = (metres) => {
  if (metres < 1000) return `${Math.round(metres)}m`;
  return `${(metres / 1000).toFixed(1)}km`;
};

/**
 * Find the minimum distance from a point to any point on a path (metres).
 * Handles both Google Maps LatLng objects and plain {lat, lng} objects.
 * @param {{ lat: number|Function, lng: number|Function }} point
 * @param {Array<{ lat: number|Function, lng: number|Function }>} path
 * @returns {number}
 */
export const getDistanceToPath = (point, path) => {
  const R = 6371000;
  const toRad = (v) => (v * Math.PI) / 180;
  let minDist = Infinity;
  const pLat = typeof point.lat === 'function' ? point.lat() : point.lat;
  const pLng = typeof point.lng === 'function' ? point.lng() : point.lng;
  for (const seg of path) {
    const sLat = typeof seg.lat === 'function' ? seg.lat() : seg.lat;
    const sLng = typeof seg.lng === 'function' ? seg.lng() : seg.lng;
    const dLat = toRad(pLat - sLat);
    const dLng = toRad(pLng - sLng);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(sLat)) * Math.cos(toRad(pLat)) * Math.sin(dLng / 2) ** 2;
    const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (d < minDist) minDist = d;
  }
  return minDist;
};
