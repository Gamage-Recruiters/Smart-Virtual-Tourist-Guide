import { fetchWeatherAlerts } from '../services/api';

const FLOOD_TEXT_RE = /(flood|heavy rain|extreme rain|thunderstorm|storm|downpour|landslide|cyclone|weather alert|unsafe)/i;
const FOG_TEXT_RE = /(fog|mist|haze|smoke|dust|sand|ash|squall|tornado)/i;
const WEATHER_ALERT_RADIUS_METERS = 5000;

/**
 * Sample up to `maxSamples` evenly-spaced points from a Google Maps
 * overview_path array.
 */
function samplePath(path, maxSamples = 5) {
  if (!path || path.length === 0) return [];
  if (path.length <= maxSamples) return path;
  const step = Math.floor(path.length / maxSamples);
  return Array.from({ length: maxSamples }, (_, i) => path[i * step]);
}

const toCoord = (value) => (typeof value === 'function' ? value() : value);

const haversineDistance = (lat1, lon1, lat2, lon2) => {
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

const getSeverityText = (alert) => [
  alert?.weatherCondition,
  alert?.title,
  alert?.description,
].filter(Boolean).join(' ');

const isNearRoute = (alert, sampledPath) => {
  const alertLat = alert?.latitude ?? alert?.lat;
  const alertLng = alert?.longitude ?? alert?.lng ?? alert?.lon;
  if (alertLat == null || alertLng == null) return true;
  if (!sampledPath.length) return true;

  return sampledPath.some((point) => {
    const pointLat = toCoord(point.lat);
    const pointLng = toCoord(point.lng);
    return haversineDistance(alertLat, alertLng, pointLat, pointLng) <= WEATHER_ALERT_RADIUS_METERS;
  });
};

const readAlertsFromResponse = (res) => (Array.isArray(res) ? res : (res?.data || []));

const normalizeText = (value = '') => String(value).toLowerCase().trim();

const doesLocationMatchDestination = (alert, destination) => {
  const dest = normalizeText(destination);
  if (!dest) return false;

  const alertLocation = normalizeText(alert?.location);
  if (!alertLocation) return false;

  return alertLocation.includes(dest) || dest.includes(alertLocation);
};

const findNearestSamplePoint = (alert, sampledPath) => {
  const alertLat = alert?.latitude ?? alert?.lat;
  const alertLng = alert?.longitude ?? alert?.lng ?? alert?.lon;
  if (alertLat == null || alertLng == null || !sampledPath.length) return null;

  let nearest = null;
  let minDistance = Infinity;
  sampledPath.forEach((point) => {
    const pointLat = toCoord(point.lat);
    const pointLng = toCoord(point.lng);
    const distance = haversineDistance(alertLat, alertLng, pointLat, pointLng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = point;
    }
  });

  if (minDistance > WEATHER_ALERT_RADIUS_METERS) return null;
  return { point: nearest, distance: minDistance };
};

/**
 * Check all sampled waypoints along a Google Maps route.
 * Returns { isFlood: boolean, floodPoint: LatLng|null }
 */
export async function checkRouteForFlood(overviewPath, destination = '') {
  try {
    const weatherResponse = await fetchWeatherAlerts();
    const alerts = readAlertsFromResponse(weatherResponse);
    if (!alerts.length) return { isFlood: false, floodPoint: null, alert: null };

    const sampledPath = samplePath(overviewPath, 6);
    const candidateAlerts = alerts
      .filter((alert) => FLOOD_TEXT_RE.test(getSeverityText(alert)))
      .map((alert) => {
        const nearest = findNearestSamplePoint(alert, sampledPath);
        const locationMatched = doesLocationMatchDestination(alert, destination);
        return {
          alert,
          nearest,
          locationMatched,
        };
      })
      .filter((candidate) => Boolean(candidate.nearest) || candidate.locationMatched)
      .sort((a, b) => {
        if (a.nearest && b.nearest) return a.nearest.distance - b.nearest.distance;
        if (a.nearest) return -1;
        if (b.nearest) return 1;
        return 0;
      });

    const selected = candidateAlerts[0];
    if (!selected) return { isFlood: false, floodPoint: null, alert: null };

    return {
      isFlood: true,
      floodPoint: selected.nearest?.point || sampledPath[0] || null,
      alert: selected.alert,
    };
  } catch {
    return { isFlood: false, floodPoint: null, alert: null };
  }
}

/**
 * Check all sampled waypoints along a Google Maps route for fog / low visibility.
 * Returns { isFog: boolean, fogPoint: LatLng|null }
 */
export async function checkRouteForFog(overviewPath) {
  try {
    const weatherResponse = await fetchWeatherAlerts();
    const alerts = readAlertsFromResponse(weatherResponse);
    if (!alerts.length) return { isFog: false, fogPoint: null };

    const sampledPath = samplePath(overviewPath, 6);
    const fogAlert = alerts.find((alert) => {
      const text = getSeverityText(alert);
      return FOG_TEXT_RE.test(text) && isNearRoute(alert, sampledPath);
    });

    return { isFog: Boolean(fogAlert), fogPoint: sampledPath[0] || null };
  } catch {
    return { isFog: false, fogPoint: null };
  }
}
