const ALLOWED_CATEGORIES = new Set([
  'restaurant',
  'gas_station',
  'cafe',
  'supermarket',
  'tourist_attraction',
  'accommodation.hotel',
  'hospital',
]);

const CATEGORY_SEARCH_QUERIES = {
  restaurant: ['restaurant', 'fast food'],
  gas_station: ['fuel', 'petrol station'],
  cafe: ['cafe', 'coffee shop'],
  supermarket: ['supermarket'],
  tourist_attraction: ['attraction', 'viewpoint', 'museum'],
  'accommodation.hotel': ['hotel', 'guest house'],
  hospital: ['hospital', 'clinic'],
};

const CATEGORY_DEFAULT_PHOTOS = {
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80',
  gas_station: 'https://images.unsplash.com/photo-1527018606412-036174576421?w=500&auto=format&fit=crop&q=80',
  cafe: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
  supermarket: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
  tourist_attraction: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
  'accommodation.hotel': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80',
  hospital: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&auto=format&fit=crop&q=80',
};

const getNumber = (value, fallback, min, max) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max ? number : fallback;
};

// Haversine distance in meters between two lat/lng coordinates
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

// Perpendicular distance in meters from point p to line segment (a -> b)
const distanceToSegment = (p, a, b) => {
  const l2 = (b.lat - a.lat) ** 2 + (b.lng - a.lng) ** 2;
  if (l2 === 0) return { dist: haversineDistance(p.lat, p.lng, a.lat, a.lng), proj: a };
  let t = ((p.lat - a.lat) * (b.lat - a.lat) + (p.lng - a.lng) * (b.lng - a.lng)) / l2;
  t = Math.max(0, Math.min(1, t));
  const proj = { lat: a.lat + t * (b.lat - a.lat), lng: a.lng + t * (b.lng - a.lng) };
  return { dist: haversineDistance(p.lat, p.lng, proj.lat, proj.lng), proj, t };
};

// Distance in meters from point p to polyline, plus closest segment index and projection
const distanceToPolyline = (p, points) => {
  let minDist = Infinity;
  let bestSegIndex = 0;
  let bestProj = points[0];
  for (let i = 0; i < points.length - 1; i++) {
    const { dist, proj } = distanceToSegment(p, points[i], points[i + 1]);
    if (dist < minDist) {
      minDist = dist;
      bestSegIndex = i;
      bestProj = proj;
    }
  }
  return { minDist, bestSegIndex, bestProj };
};

// Calculate cumulative polyline distance up to a point projection
const calculateProgressAlongPolyline = (bestSegIndex, bestProj, points) => {
  let totalDist = 0;
  for (let i = 0; i < bestSegIndex; i++) {
    totalDist += haversineDistance(points[i].lat, points[i].lng, points[i + 1].lat, points[i + 1].lng);
  }
  if (points[bestSegIndex]) {
    totalDist += haversineDistance(points[bestSegIndex].lat, points[bestSegIndex].lng, bestProj.lat, bestProj.lng);
  }
  return Math.round(totalDist);
};

// Format a Nominatim raw search result into an application place object
const formatPlace = (r, category, polylinePoints = null) => {
  const lat = Number(r.lat);
  const lon = Number(r.lon);
  let name = r.name || r.display_name?.split(',')[0] || '';
  if (!name || name.toLowerCase() === 'unnamed place') {
    name = r.display_name?.split(',')[0] || 'Point of Interest';
  }

  const addrParts = r.display_name?.split(',') || [];
  const vicinity = addrParts.slice(1, 4).join(',').trim() || r.display_name || '';

  // Calculate rating based on importance or stable hash
  let rating = 4.2;
  if (r.importance && Number(r.importance) > 0) {
    rating = Math.min(4.9, Math.max(3.8, 3.8 + Number(r.importance) * 12));
  } else {
    const hash = String(r.place_id).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    rating = 4.0 + (hash % 10) * 0.1;
  }
  rating = Math.round(rating * 10) / 10;

  const photo = CATEGORY_DEFAULT_PHOTOS[category] || CATEGORY_DEFAULT_PHOTOS.restaurant;

  const place = {
    place_id: String(r.place_id),
    placeId: String(r.place_id),
    name,
    category,
    formatted_address: r.display_name || '',
    vicinity,
    rating,
    photo,
    lat,
    lon,
    location: { lat, lng: lon },
  };

  if (polylinePoints && polylinePoints.length > 0) {
    const { minDist, bestSegIndex, bestProj } = distanceToPolyline({ lat, lng: lon }, polylinePoints);
    place.distanceFromRouteMeters = Math.round(minDist);
    place.distanceFromRouteText = minDist < 1000
      ? `${Math.round(minDist)} m off route`
      : `${(minDist / 1000).toFixed(1)} km off route`;
    place.progressMeters = calculateProgressAlongPolyline(bestSegIndex, bestProj, polylinePoints);
  }

  return place;
};

// Query Nominatim using viewbox and bounded=1
const queryNominatimViewbox = async (queryText, viewboxStr, limit = 25) => {
  const url = `https://nominatim.openstreetmap.org/search` +
    `?format=jsonv2` +
    `&q=${encodeURIComponent(queryText)}` +
    `&viewbox=${viewboxStr}` +
    `&bounded=1` +
    `&limit=${limit}` +
    `&countrycodes=lk` +
    `&addressdetails=1`;

  const response = await fetch(url, {
    headers: { 'Accept-Language': 'en', 'User-Agent': 'RTNavLocationApp/1.0' },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) return [];
  const results = await response.json();
  return Array.isArray(results) ? results : [];
};

/**
 * GET /api/nearby-places
 * Search places near a single (lat, lng) point using a bounded viewbox.
 */
export const getNearbyPlaces = async (req, res) => {
  const lat = getNumber(req.query.lat, NaN, -90, 90);
  const lng = getNumber(req.query.lng, NaN, -180, 180);
  const limit = Math.floor(getNumber(req.query.limit, 15, 1, 40));
  const radius = getNumber(req.query.radius, 2500, 500, 15000);
  const category = String(req.query.category || 'restaurant');

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ message: 'Invalid coordinates.' });
  }

  const queries = CATEGORY_SEARCH_QUERIES[category] || [category];
  const bufferLat = radius / 111000;
  const bufferLng = radius / (111000 * Math.cos(lat * (Math.PI / 180)));
  const viewboxStr = [
    (lng - bufferLng).toFixed(5),
    (lat + bufferLat).toFixed(5),
    (lng + bufferLng).toFixed(5),
    (lat - bufferLat).toFixed(5),
  ].join(',');

  try {
    const seen = new Set();
    const results = [];

    for (const q of queries) {
      if (results.length >= limit) break;
      const rawPlaces = await queryNominatimViewbox(q, viewboxStr, limit);
      for (const raw of rawPlaces) {
        if (results.length >= limit) break;
        const id = String(raw.place_id);
        if (!seen.has(id)) {
          seen.add(id);
          const pLat = Number(raw.lat);
          const pLon = Number(raw.lon);
          const dist = haversineDistance(lat, lng, pLat, pLon);
          if (dist <= radius) {
            results.push(formatPlace(raw, category));
          }
        }
      }
      if (results.length >= limit) break;
    }

    return res.json(results.slice(0, limit));
  } catch (err) {
    console.error('[NearbyPlaces]', err?.message || err);
    return res.status(502).json({ message: 'Nearby-place service unavailable.' });
  }
};

/**
 * GET /api/nearby-places/along-route
 * Search places along a route polyline, filtering strictly by distance to the route.
 */
export const getNearbyPlacesAlongRoute = async (req, res) => {
  const category = String(req.query.category || req.query.query || 'restaurant');
  const limit = Math.floor(getNumber(req.query.limit, 25, 1, 50));
  const radius = getNumber(req.query.radius, 3000, 500, 10000);

  let points;
  try { points = JSON.parse(String(req.query.points || '[]')); } catch { points = []; }

  points = points
    .map((point) => ({ lat: Number(point.lat), lng: Number(point.lng) }))
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));

  if (points.length < 2) {
    return res.status(400).json({ message: 'At least 2 valid route points are required.' });
  }

  // Resolve search queries for category
  const queries = CATEGORY_SEARCH_QUERIES[category] || [category];

  // Calculate route bounding box
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  for (const p of points) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  }

  const bufferLat = radius / 111000;
  const bufferLng = radius / (111000 * Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180)));

  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;
  const maxSpan = Math.max(latSpan, lngSpan);

  // Divide route into viewboxes
  // If span <= 0.35° (~40 km), 1 viewbox covers it. Otherwise divide into 2-3 segments.
  const viewboxes = [];
  if (maxSpan <= 0.35) {
    viewboxes.push([
      (minLng - bufferLng).toFixed(5),
      (maxLat + bufferLat).toFixed(5),
      (maxLng + bufferLng).toFixed(5),
      (minLat - bufferLat).toFixed(5),
    ].join(','));
  } else {
    const numSegments = Math.min(3, Math.ceil(maxSpan / 0.3));
    const segmentLength = Math.ceil(points.length / numSegments);
    for (let s = 0; s < numSegments; s++) {
      const segPoints = points.slice(s * segmentLength, Math.min(points.length, (s + 1) * segmentLength + 1));
      if (segPoints.length > 0) {
        let sMinLat = Infinity, sMaxLat = -Infinity, sMinLng = Infinity, sMaxLng = -Infinity;
        for (const p of segPoints) {
          if (p.lat < sMinLat) sMinLat = p.lat;
          if (p.lat > sMaxLat) sMaxLat = p.lat;
          if (p.lng < sMinLng) sMinLng = p.lng;
          if (p.lng > sMaxLng) sMaxLng = p.lng;
        }
        viewboxes.push([
          (sMinLng - bufferLng).toFixed(5),
          (sMaxLat + bufferLat).toFixed(5),
          (sMaxLng + bufferLng).toFixed(5),
          (sMinLat - bufferLat).toFixed(5),
        ].join(','));
      }
    }
  }

  try {
    const seen = new Set();
    const candidatePlaces = [];

    for (const viewbox of viewboxes) {
      for (const q of queries) {
        if (candidatePlaces.length >= limit * 2) break;
        const rawResults = await queryNominatimViewbox(q, viewbox, 25);
        for (const r of rawResults) {
          const id = String(r.place_id);
          if (!seen.has(id)) {
            seen.add(id);
            candidatePlaces.push(r);
          }
        }
      }
    }

    // Filter strictly by distance to the route polyline
    const validPlaces = candidatePlaces
      .map((r) => formatPlace(r, category, points))
      .filter((place) => place.distanceFromRouteMeters <= radius && place.name)
      // Sort in order of progression along the route from start to destination
      .sort((a, b) => (a.progressMeters || 0) - (b.progressMeters || 0))
      .slice(0, limit);

    return res.json(validPlaces);
  } catch (err) {
    console.error('[NearbyPlacesAlongRoute]', err?.message || err);
    return res.status(502).json({ message: 'Nearby-place service unavailable.' });
  }
};

