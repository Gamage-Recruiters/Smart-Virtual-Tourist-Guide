/**
 * Format a duration in seconds into a human-readable string.
 * @param {number} seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '--';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  if (hours < 24) return mins > 0 ? `${hours}hr ${mins}` : `${hours}hr`;
  const days = Math.round(hours / 24);
  return `${days} day${days > 1 ? 's' : ''}`;
}

/**
 * Format a distance in meters into a human-readable string.
 * @param {number} meters
 * @returns {string}
 */
export function formatDistance(meters) {
  if (!meters && meters !== 0) return '--';
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
