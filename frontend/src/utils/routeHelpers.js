/**
 * Route calculation and description utilities.
 * Extracted from Direction.jsx to keep the component focused on rendering.
 */
import carIcon from '../assets/carIcon.png';
import bikeIcon from '../assets/bikeIcon.png';
import busIcon from '../assets/busIcon.png';
import manIcon from '../assets/manIcon.png';

/** Transport mode configurations for OSRM routing */
export const MODE_CONFIGS = [
  { key: 'drive', label: 'Drive', icon: carIcon, osrmProfile: 'driving', multiplier: 1 },
  { key: 'bike', label: 'Bike', icon: bikeIcon, osrmProfile: 'cycling', multiplier: 1.35 },
  { key: 'transit', label: 'Transit', icon: busIcon, osrmProfile: 'driving', multiplier: 1.85 },
  { key: 'walk', label: 'Walk', icon: manIcon, osrmProfile: 'foot', multiplier: 8.5 },
];

/**
 * Create a hash key for a route based on start/mid/end points and path length.
 * Used for POI caching.
 * @param {Object} route
 * @returns {string}
 */
export const getRouteHash = (route) => {
  const path = route?.overview_path || [];
  if (!path.length) return '';
  const start = path[0];
  const end = path[path.length - 1];
  const mid = path[Math.floor(path.length / 2)];
  const round = (n) => typeof n === 'function' ? n().toFixed(3) : n.toFixed(3);
  return [
    round(start.lat), round(start.lng),
    round(mid.lat), round(mid.lng),
    round(end.lat), round(end.lng),
    path.length,
  ].join('_');
};

/**
 * Calculate how many sample points to use for POI search along a route.
 * @param {number} routeDistanceMeters
 * @param {number} radius
 * @returns {number}
 */
export const getSampleCount = (routeDistanceMeters, radius) => {
  const coverage = radius * 1.5;
  const needed = Math.ceil(routeDistanceMeters / coverage);
  return Math.min(Math.max(needed, 3), 8);
};

/**
 * Parse a human-readable duration text into total minutes.
 * Handles formats like "2 days 3 hours 15 min".
 * @param {string} durationText
 * @returns {number}
 */
export const parseDurationToMinutes = (durationText = '') => {
  const normalized = durationText.toLowerCase();
  const dayMatch = normalized.match(/(\d+)\s*day/);
  const hourMatch = normalized.match(/(\d+)\s*hour/);
  const minuteMatch = normalized.match(/(\d+)\s*min/);

  const days = dayMatch ? Number(dayMatch[1]) : 0;
  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;

  return (days * 24 * 60) + (hours * 60) + minutes;
};

/**
 * Format minutes into a compact human-readable duration.
 * @param {number} minutes
 * @returns {string} e.g. "2 hr 15 min", "45 min", "1 day"
 */
export const formatCompactDuration = (minutes) => {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return '--';
  }

  if (minutes >= 24 * 60) {
    const days = Math.max(1, Math.round(minutes / (24 * 60)));
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};

/**
 * Estimate duration for a different transport mode based on a base duration and multiplier.
 * @param {number} baseMinutes
 * @param {number} multiplier
 * @returns {string}
 */
export const estimateModeDuration = (baseMinutes, multiplier) => {
  if (!baseMinutes) return '--';
  return formatCompactDuration(Math.max(1, Math.round(baseMinutes * multiplier)));
};

/**
 * Build a human-readable description comparing a route to its alternatives.
 * @param {Object} route
 * @param {number} idx
 * @param {Array} allRoutes
 * @returns {{ summary: string, petrol: number }}
 */
export const buildRouteDescription = (route, idx, allRoutes) => {
  if (!route || allRoutes.length === 0) return { summary: '', petrol: '' };

  const others = allRoutes.filter((_, i) => i !== idx);
  const mins = route.durationMinutes;

  // Distance comparison
  const parseKm = (d = '') => parseFloat(d.replace(/[^0-9.]/g, '')) || 0;
  const distKm = parseKm(route.distance);
  const otherDists = others.map(r => parseKm(r.distance)).filter(d => d > 0);
  const avgOtherDist = otherDists.length ? otherDists.reduce((a, b) => a + b, 0) / otherDists.length : distKm;
  const distDiff = distKm - avgOtherDist;
  const distNote =
    Math.abs(distDiff) < 0.5 ? 'similar in distance'
    : distDiff > 0 ? `${Math.abs(distDiff).toFixed(1)} km longer in distance`
    : `${Math.abs(distDiff).toFixed(1)} km shorter in distance`;

  // Time comparison
  const fasterCount = others.filter(r => r.durationMinutes > mins).length;
  const slowerCount = others.filter(r => r.durationMinutes < mins).length;

  let summary;
  if (allRoutes.length === 1) {
    summary = `This is the only available route and is ${distNote}.`;
  } else if (slowerCount === 0 && fasterCount > 0) {
    summary = `This route is faster than ${fasterCount} alternative${fasterCount > 1 ? 's' : ''} and ${distNote}.`;
  } else if (fasterCount === 0 && slowerCount > 0) {
    summary = `This route is slower than ${slowerCount} alternative${slowerCount > 1 ? 's' : ''} and ${distNote}.`;
  } else if (fasterCount > 0 && slowerCount > 0) {
    summary = `This route is faster than ${fasterCount} alternative${fasterCount > 1 ? 's' : ''}, slower than ${slowerCount}, and ${distNote}.`;
  } else {
    summary = `This route has similar travel time and is ${distNote}.`;
  }

  // Petrol saving vs slowest
  const maxMins = Math.max(...allRoutes.map(r => r.durationMinutes).filter(m => m > 0));
  const saving = maxMins > 0 && mins < maxMins ? Math.round(((maxMins - mins) / maxMins) * 100) : 0;
  const petrol = saving > 0 ? saving : 0;

  return { summary, petrol };
};

/**
 * Generate a one-line description for a route (e.g. "Fastest route · Light traffic · via A1").
 * @param {Object} route
 * @param {number} idx
 * @param {Array} allRoutes
 * @returns {string}
 */
export const describeRoute = (route, idx, allRoutes) => {
  if (!route || allRoutes.length === 0) return 'Suggested route';

  const mins = route.durationMinutes;
  const allMins = allRoutes.map(r => r.durationMinutes).filter(m => m > 0);
  const minTime = Math.min(...allMins);
  const maxTime = Math.max(...allMins);

  let routeLabel;
  if (allRoutes.length === 1) {
    routeLabel = 'Fastest route';
  } else if (mins === minTime) {
    routeLabel = 'Fastest route';
  } else if (mins === maxTime) {
    routeLabel = 'Slowest route';
  } else {
    const timeDiff = mins - minTime;
    routeLabel = `${formatCompactDuration(timeDiff)} slower`;
  }

  const via = route.summary ? `via ${route.summary}` : '';
  // Use real traffic from API if available, else fall back to ratio-based
  const traffic = route.traffic || (() => {
    const ratio = allRoutes.length > 1 ? mins / minTime : 1;
    return ratio >= 1.4 ? 'Heavy traffic' : ratio >= 1.15 ? 'Moderate traffic' : 'Light traffic';
  })();

  return [routeLabel, traffic, via].filter(Boolean).join(' · ');
};

/**
 * Strip HTML tags from a navigation instruction string.
 * @param {string} html
 * @returns {string}
 */
export const sanitizeInstruction = (html = '') => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
