import bikeIcon from '../assets/bikeIcon.png';
import manIcon from '../assets/manIcon.png';
import busIcon from '../assets/busIcon.png';
import carIcon from '../assets/carIcon.png';

export const MODE_CONFIGS = [
  { key: 'drive', label: 'Drive', icon: carIcon, travelMode: 'DRIVING', multiplier: 1 },
  { key: 'bike', label: 'Bike', icon: bikeIcon, travelMode: 'BICYCLING', multiplier: 1.35 },
  { key: 'transit', label: 'Transit', icon: busIcon, travelMode: 'TRANSIT', multiplier: 1.85 },
  { key: 'walk', label: 'Walk', icon: manIcon, travelMode: 'WALKING', multiplier: 8.5 },
];

export const SHOW_CRIME_LABELS_ON_START_MAP = false;
export const SHOW_ROADBLOCK_LABELS_ON_START_MAP = false;

export const SRI_LANKA_BOUNDS = {
  north: 10.0,
  south: 5.7,
  east: 82.1,
  west: 79.4,
};

export const CATEGORY_TYPES = {
  Restaurant: { type: 'restaurant', keyword: 'restaurant' },
  'Petrol Station': { type: 'gas_station' },
  'Coffee Shop': { type: 'cafe', keyword: 'coffee shop' },
  Supermarket: { type: 'supermarket', keyword: 'supermarket' },
};

export const POI_ATTRACTION_KEYWORDS = [
  { type: 'tourist_attraction', keyword: 'tourist attraction', radius: 2000 },
];

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

export const formatCompactDuration = (minutes) => {
  if (!Number.isFinite(minutes) || minutes <= 0) return '--';
  if (minutes >= 24 * 60) {
    const days = Math.max(1, Math.round(minutes / (24 * 60)));
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} hr`;
  return `${hours} hr ${remainingMinutes} min`;
};

export const estimateModeDuration = (baseMinutes, multiplier) => {
  if (!baseMinutes) return '--';
  return formatCompactDuration(Math.max(1, Math.round(baseMinutes * multiplier)));
};

export const buildRouteDescription = (route, idx, allRoutes) => {
  if (!route || allRoutes.length === 0) return { summary: '', petrol: '' };

  const others = allRoutes.filter((_, i) => i !== idx);
  const mins = route.durationMinutes;
  const parseKm = (distance = '') => parseFloat(distance.replace(/[^0-9.]/g, '')) || 0;
  const distKm = parseKm(route.distance);
  const otherDists = others.map((item) => parseKm(item.distance)).filter((distance) => distance > 0);
  const avgOtherDist = otherDists.length ? otherDists.reduce((a, b) => a + b, 0) / otherDists.length : distKm;
  const distDiff = distKm - avgOtherDist;
  const distNote = Math.abs(distDiff) < 0.5
    ? 'similar in distance'
    : distDiff > 0
      ? `${Math.abs(distDiff).toFixed(1)} km longer in distance`
      : `${Math.abs(distDiff).toFixed(1)} km shorter in distance`;

  const fasterCount = others.filter((item) => item.durationMinutes > mins).length;
  const slowerCount = others.filter((item) => item.durationMinutes < mins).length;
  let summary;
  if (allRoutes.length === 1) summary = `This is the only available route and is ${distNote}.`;
  else if (slowerCount === 0 && fasterCount > 0) summary = `This route is faster than ${fasterCount} alternative${fasterCount > 1 ? 's' : ''} and ${distNote}.`;
  else if (fasterCount === 0 && slowerCount > 0) summary = `This route is slower than ${slowerCount} alternative${slowerCount > 1 ? 's' : ''} and ${distNote}.`;
  else if (fasterCount > 0 && slowerCount > 0) summary = `This route is faster than ${fasterCount} alternative${fasterCount > 1 ? 's' : ''}, slower than ${slowerCount}, and ${distNote}.`;
  else summary = `This route has similar travel time and is ${distNote}.`;

  const maxMins = Math.max(...allRoutes.map((item) => item.durationMinutes).filter((minutes) => minutes > 0));
  const saving = maxMins > 0 && mins < maxMins ? Math.round(((maxMins - mins) / maxMins) * 100) : 0;
  return { summary, petrol: saving > 0 ? saving : 0 };
};

export const describeRoute = (route, idx, allRoutes) => {
  if (!route || allRoutes.length === 0) return 'Suggested route';
  const mins = route.durationMinutes;
  const allMins = allRoutes.map((item) => item.durationMinutes).filter((minutes) => minutes > 0);
  const minTime = Math.min(...allMins);
  const maxTime = Math.max(...allMins);
  const routeLabel = allRoutes.length === 1 || mins === minTime
    ? 'Fastest route'
    : mins === maxTime
      ? 'Slowest route'
      : `${formatCompactDuration(mins - minTime)} slower`;
  const via = route.summary ? `via ${route.summary}` : '';
  const traffic = route.traffic || (() => {
    const ratio = allRoutes.length > 1 ? mins / minTime : 1;
    return ratio >= 1.4 ? 'Heavy traffic' : ratio >= 1.15 ? 'Moderate traffic' : 'Light traffic';
  })();
  return [routeLabel, traffic, via].filter(Boolean).join(' · ');
};

export const buildRouteSummary = describeRoute;
