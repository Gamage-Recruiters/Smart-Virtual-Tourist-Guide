export const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || '';

const NOMINATIM_HEADERS = { 'Accept-Language': 'en' };

// Cache configuration
const CACHE_CONFIG = {
  EXPIRATION_TIME: 30 * 60 * 1000, // 30 minutes in milliseconds
};

// Search results cache with timestamps
const searchCache = {
  autocomplete: new Map(),
  geocode: new Map(),
  photos: new Map(),
  nearbyPlaces: new Map(),
};

// Clear expired cache entries
const clearExpiredCache = (cacheMap) => {
  const now = Date.now();
  for (const [key, { timestamp }] of cacheMap.entries()) {
    if (now - timestamp > CACHE_CONFIG.EXPIRATION_TIME) {
      cacheMap.delete(key);
    }
  }
};

// Get cached result or null if expired
const getCachedResult = (cacheMap, key) => {
  clearExpiredCache(cacheMap);
  const cached = cacheMap.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_CONFIG.EXPIRATION_TIME) {
    return cached.data;
  }
  return null;
};

// Store result in cache
const setCacheResult = (cacheMap, key, data) => {
  cacheMap.set(key, { data, timestamp: Date.now() });
};

const formatNominatimPlace = (result) => ({
  place_id: String(result.place_id),
  name: result.display_name?.split(',')[0] || result.display_name,
  displayName: result.display_name?.split(',')[0] || result.display_name,
  formatted: result.display_name,
  formatted_address: result.display_name,
  structured_formatting: {
    main_text: result.display_name?.split(',')[0] || result.display_name,
    secondary_text: result.display_name?.split(',').slice(1, 3).join(',').trim() || '',
  },
  geometry: { location: { lat: Number(result.lat), lng: Number(result.lon) } },
  lat: Number(result.lat),
  lng: Number(result.lon),
  lon: Number(result.lon),
});

const fetchNominatimSearch = async (input) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=lk&q=${encodeURIComponent(input)}`, { headers: NOMINATIM_HEADERS });
  if (!response.ok) return [];
  return (await response.json()).map(formatNominatimPlace);
};

// Wikipedia API to fetch location images
export const fetchWikipediaImages = async (locationName) => {
  if (!locationName) return [];
  
  const cacheKey = `wiki_images_${locationName.toLowerCase()}`;
  
  // Check cache first
  const cached = getCachedResult(searchCache.photos, cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    // Search for Wikipedia articles about the location
    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(locationName)}&format=json&origin=*`
    );
    if (!searchResponse.ok) return [];
    const searchData = await searchResponse.json();
    const searchResults = searchData.query?.search || [];
    
    if (searchResults.length === 0) return [];
    
    // Get the first matching article
    const articleTitle = searchResults[0].title;
    
    // Fetch images from the article
    const imagesResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=images&format=json&origin=*&imlimit=20`
    );
    if (!imagesResponse.ok) return [];
    const imagesData = await imagesResponse.json();
    
    const pages = imagesData.query?.pages || {};
    const images = [];
    
    for (const page of Object.values(pages)) {
      const pageImages = page.images || [];
      for (const img of pageImages) {
        if (img.title.match(/\.(jpg|jpeg|png|gif)$/i) && 
            !img.title.match(/(logo|icon|shield|flag|map|chart|diagram)/i)) {
          // Get image info to get the thumbnail URL
          const imageInfoResponse = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(img.title)}&prop=imageinfo&iiprop=url&format=json&origin=*`
          );
          if (imageInfoResponse.ok) {
            const imageInfoData = await imageInfoResponse.json();
            const imagePages = imageInfoData.query?.pages || {};
            for (const imagePage of Object.values(imagePages)) {
              if (imagePage.imageinfo?.[0]?.url) {
                images.push(imagePage.imageinfo[0].url);
                if (images.length >= 8) break;
              }
            }
          }
          if (images.length >= 8) break;
        }
      }
      if (images.length >= 8) break;
    }
    
    setCacheResult(searchCache.photos, cacheKey, images);
    return images;
  } catch (error) {
    return [];
  }
};

export const fetchPhotosForPlace = async (locationName) => {
  if (!locationName) return [];
  
  const cacheKey = `photos_${locationName.toLowerCase()}`;
  
  // Check cache first
  const cached = getCachedResult(searchCache.photos, cacheKey);
  if (cached) {
    return cached;
  }
  
  // First try Wikipedia API
  const wikiImages = await fetchWikipediaImages(locationName);
  setCacheResult(searchCache.photos, cacheKey, wikiImages);
  
  if (wikiImages.length > 0) return wikiImages;
  
  // Fallback to empty array if Wikipedia doesn't have images
  return [];
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, { headers: NOMINATIM_HEADERS });
    if (!response.ok) return null;
    return formatNominatimPlace(await response.json());
  } catch (error) {
    return null;
  }
};

export const fetchAutocompleteSuggestions = async (input) => {
  try {
    const cacheKey = `autocomplete_${input.toLowerCase()}`;
    
    // Check cache first
    const cached = getCachedResult(searchCache.autocomplete, cacheKey);
    if (cached) {
      return cached;
    }
    
    if (!GEOAPIFY_API_KEY) {
      const result = await fetchNominatimSearch(input);
      setCacheResult(searchCache.autocomplete, cacheKey, result);
      return result;
    }
    
    const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(input)}&format=json&apiKey=${GEOAPIFY_API_KEY}`);
    if (!response.ok) {
      const result = await fetchNominatimSearch(input);
      setCacheResult(searchCache.autocomplete, cacheKey, result);
      return result;
    }
    
    const data = await response.json();
    const result = data.results.map(r => ({
      place_id: r.place_id,
      name: r.address_line1 || r.name || r.formatted,
      vicinity: r.address_line2 || r.city || '',
      formatted: r.formatted,
      displayName: r.address_line1 || r.name || r.formatted,
      structured_formatting: {
        main_text: r.address_line1 || r.name || r.formatted,
        secondary_text: r.address_line2 || r.city || '',
      },
      lat: r.lat,
      lon: r.lon
    }));
    
    setCacheResult(searchCache.autocomplete, cacheKey, result);
    return result;
  } catch (error) {
    try { 
      const result = await fetchNominatimSearch(input);
      const cacheKey = `autocomplete_${input.toLowerCase()}`;
      setCacheResult(searchCache.autocomplete, cacheKey, result);
      return result;
    } catch { return []; }
  }
};

export const geocodeAddress = async (input) => {
  try {
    const cacheKey = `geocode_${input.toLowerCase()}`;
    
    // Check cache first
    const cached = getCachedResult(searchCache.geocode, cacheKey);
    if (cached) {
      return cached;
    }
    
    if (!GEOAPIFY_API_KEY) {
      const result = (await fetchNominatimSearch(input))[0] || null;
      setCacheResult(searchCache.geocode, cacheKey, result);
      return result;
    }
    
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(input)}&format=json&limit=1&apiKey=${GEOAPIFY_API_KEY}`);
    if (!response.ok) {
      const result = (await fetchNominatimSearch(input))[0] || null;
      setCacheResult(searchCache.geocode, cacheKey, result);
      return result;
    }
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const r = data.results[0];
      const result = {
        place_id: r.place_id,
        name: r.address_line1 || r.name || r.formatted,
        displayName: r.address_line1 || r.name || r.formatted,
        formatted: r.formatted,
        formatted_address: r.formatted,
        geometry: { location: { lat: r.lat, lng: r.lon } },
        lat: r.lat,
        lng: r.lon,
        lon: r.lon,
      };
      setCacheResult(searchCache.geocode, cacheKey, result);
      return result;
    }
    setCacheResult(searchCache.geocode, cacheKey, null);
    return null;
  } catch (error) {
    try { 
      const result = (await fetchNominatimSearch(input))[0] || null;
      const cacheKey = `geocode_${input.toLowerCase()}`;
      setCacheResult(searchCache.geocode, cacheKey, result);
      return result;
    } catch { return null; }
  }
};

export const fetchNearbyPlaces = async (lat, lng, categories, radius = 2000, limit = 20) => {
  try {
    // Create cache key from parameters
    const cacheKey = `nearby_${lat.toFixed(4)}_${lng.toFixed(4)}_${categories}_${radius}_${limit}`;
    
    // Check cache first
    const cached = getCachedResult(searchCache.nearbyPlaces, cacheKey);
    if (cached) {
      return cached;
    }
    
    if (!GEOAPIFY_API_KEY) {
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const params = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        category: categories,
        radius: String(radius),
        limit: String(limit),
      });
      const backendResponse = await fetch(`${backendUrl}/nearby-places?${params}`);
      if (backendResponse.ok) {
        const result = await backendResponse.json();
        setCacheResult(searchCache.nearbyPlaces, cacheKey, result);
        return result;
      }
    }
    const selector = categories === 'tourist_attraction'
      ? '[tourism~"attraction|museum|viewpoint|theme_park|zoo"]'
      : categories === 'accommodation.hotel'
        ? '[tourism=hotel]'
        : categories === 'gas_station'
          ? '[amenity=fuel]'
          : categories === 'supermarket'
            ? '[shop=supermarket]'
            : categories === 'restaurant'
              ? '[amenity~"restaurant|fast_food"]'
              : `[amenity=${categories}]`;
    const query = `[out:json][timeout:25];nwr(around:${radius},${lat},${lng})${selector};out center;`;
    const urls = GEOAPIFY_API_KEY
      ? [`https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lng},${lat},${radius}&bias=proximity:${lng},${lat}&limit=${limit}&apiKey=${GEOAPIFY_API_KEY}`]
      : [
          'https://overpass-api.de/api/interpreter',
          'https://overpass.kumi.systems/api/interpreter',
          'https://overpass.private.coffee/api/interpreter',
        ].map((endpoint) => `${endpoint}?data=${encodeURIComponent(query)}`);
    let response;
    for (const url of urls) {
      try {
        const candidate = await fetch(url);
        if (candidate.ok) {
          response = candidate;
          break;
        }
      } catch {
        // Try the next public OSM endpoint.
      }
    }
    if (!response) return [];
    const data = await response.json();
    if (!GEOAPIFY_API_KEY) {
      const result = (data.elements || []).slice(0, limit).map((element) => ({
        place_id: String(element.id),
        placeId: String(element.id),
        name: element.tags?.name || 'Unnamed place',
        formatted_address: element.tags?.['addr:street'] || '',
        vicinity: element.tags?.['addr:street'] || '',
        rating: null,
        lat: element.lat ?? element.center?.lat,
        lon: element.lon ?? element.center?.lon,
        location: {
          lat: element.lat ?? element.center?.lat,
          lng: element.lon ?? element.center?.lon,
        },
      }));
      setCacheResult(searchCache.nearbyPlaces, cacheKey, result);
      return result;
    }
    const result = data.features.map(f => ({
      place_id: f.properties.place_id,
      placeId: f.properties.place_id,
      name: f.properties.name || f.properties.formatted,
      formatted_address: f.properties.formatted || f.properties.address_line2 || '',
      vicinity: f.properties.address_line2 || f.properties.street || '',
      rating: 4.5, // Geoapify doesn't easily expose rating without details, mock it for now
      lat: f.properties.lat,
      lon: f.properties.lon,
      location: { lat: f.properties.lat, lng: f.properties.lon },
    }));
    setCacheResult(searchCache.nearbyPlaces, cacheKey, result);
    return result;
  } catch (error) { return []; }
};

export const fetchNearbyPlacesAlongRoute = async (path, categories, radius = 3000, limit = 30) => {
  if (!path || !path.length) return [];

  const points = path.filter((_, index) => index % Math.max(1, Math.floor(path.length / 25)) === 0)
    .slice(0, 20)
    .map((point) => ({
      lat: typeof point.lat === 'function' ? point.lat() : Number(point.lat),
      lng: typeof point.lng === 'function' ? point.lng() : Number(point.lng),
    }))
    .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));

  if (points.length < 2) return [];

  const cacheKey = `along_route_${points[0].lat.toFixed(3)}_${points[0].lng.toFixed(3)}_${points[points.length - 1].lat.toFixed(3)}_${categories}_${radius}_${limit}`;
  const cached = getCachedResult(searchCache.nearbyPlaces, cacheKey);
  if (cached) return cached;

  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const params = new URLSearchParams({
    category: categories,
    radius: String(radius),
    limit: String(limit),
    points: JSON.stringify(points),
  });

  try {
    const response = await fetch(`${backendUrl}/nearby-places/along-route?${params}`, {
      signal: AbortSignal.timeout(12000),
    });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setCacheResult(searchCache.nearbyPlaces, cacheKey, data);
        return data;
      }
    }
  } catch {
  }

  // Client-side Nominatim Viewbox Fallback (works directly in browser via CORS)
  try {
    const queryMap = {
      restaurant: 'restaurant',
      gas_station: 'fuel',
      cafe: 'cafe',
      supermarket: 'supermarket',
      tourist_attraction: 'attraction',
      'accommodation.hotel': 'hotel',
      hospital: 'hospital',
    };
    const q = queryMap[categories] || categories;

    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    for (const p of points) {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
    }

    const bufferLat = radius / 111000;
    const bufferLng = radius / (111000 * Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180)));
    const viewbox = [
      (minLng - bufferLng).toFixed(5),
      (maxLat + bufferLat).toFixed(5),
      (maxLng + bufferLng).toFixed(5),
      (minLat - bufferLat).toFixed(5),
    ].join(',');

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&viewbox=${viewbox}&bounded=1&limit=${limit}&countrycodes=lk&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en' },
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      const rawData = await res.json();
      if (Array.isArray(rawData)) {
        const R = 6371000;
        const havDist = (lat1, lon1, lat2, lon2) => {
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLon = ((lon2 - lon1) * Math.PI) / 180;
          const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };

        const distToSeg = (p, a, b) => {
          const l2 = (b.lat - a.lat) ** 2 + (b.lng - a.lng) ** 2;
          if (l2 === 0) return havDist(p.lat, p.lng, a.lat, a.lng);
          let t = ((p.lat - a.lat) * (b.lat - a.lat) + (p.lng - a.lng) * (b.lng - a.lng)) / l2;
          t = Math.max(0, Math.min(1, t));
          return havDist(p.lat, p.lng, a.lat + t * (b.lat - a.lat), a.lng + t * (b.lng - a.lng));
        };

        const distToRoute = (p) => {
          let min = Infinity;
          for (let i = 0; i < points.length - 1; i++) {
            const d = distToSeg(p, points[i], points[i + 1]);
            if (d < min) min = d;
          }
          return min;
        };

        const categoryPhotos = {
          restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80',
          gas_station: 'https://images.unsplash.com/photo-1527018606412-036174576421?w=500&auto=format&fit=crop&q=80',
          cafe: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
          supermarket: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
        };

        const formatted = rawData.map((item) => {
          const lat = Number(item.lat);
          const lon = Number(item.lon);
          const dist = distToRoute({ lat, lng: lon });
          const name = item.name || item.display_name?.split(',')[0] || 'Point of Interest';
          const addrParts = item.display_name?.split(',') || [];
          const vicinity = addrParts.slice(1, 3).join(',').trim();
          return {
            place_id: String(item.place_id),
            placeId: String(item.place_id),
            name,
            category: categories,
            vicinity: vicinity || item.display_name,
            formatted_address: item.display_name,
            rating: 4.4,
            photo: categoryPhotos[categories] || categoryPhotos.restaurant,
            lat,
            lon,
            location: { lat, lng: lon },
            distanceFromRouteMeters: Math.round(dist),
            distanceFromRouteText: dist < 1000 ? `${Math.round(dist)} m off route` : `${(dist / 1000).toFixed(1)} km off route`,
          };
        }).filter((item) => item.distanceFromRouteMeters <= radius && item.name && item.name !== 'Unnamed place');

        setCacheResult(searchCache.nearbyPlaces, cacheKey, formatted);
        return formatted;
      }
    }
  } catch {
  }

  return [];
};

export const fetchRoute = async (origin, destination, mode = 'drive', alternatives = true, waypoints = []) => {
  if (!origin || !destination) return null;
  try {
    const originLat = origin.lat ?? origin.latitude;
    const originLng = origin.lng ?? origin.lon ?? origin.longitude;
    const destinationLat = destination.lat ?? destination.latitude;
    const destinationLng = destination.lng ?? destination.lon ?? destination.longitude;

    if (originLat == null || originLng == null || destinationLat == null || destinationLng == null) {
      return null;
    }

    const normWaypoints = (waypoints || []).map((w) => ({
      lat: w.lat ?? w.latitude,
      lng: w.lng ?? w.lon ?? w.longitude,
    })).filter((w) => Number.isFinite(w.lat) && Number.isFinite(w.lng));

    // Create cache key for this route including waypoints
    const wpKey = normWaypoints.map((w) => `${w.lat.toFixed(3)}_${w.lng.toFixed(3)}`).join(':');
    const cacheKey = `route_${originLat.toFixed(4)}_${originLng.toFixed(4)}_${destinationLat.toFixed(4)}_${destinationLng.toFixed(4)}_${mode}_${wpKey}`;
    
    // Check cache first
    const cached = getCachedResult(searchCache.nearbyPlaces, cacheKey);
    if (cached) {
      return cached;
    }

    const allPoints = [
      { lat: originLat, lng: originLng },
      ...normWaypoints,
      { lat: destinationLat, lng: destinationLng },
    ];

    const osrmProfile = mode === 'walk' ? 'foot' : mode === 'bicycle' || mode === 'bike' ? 'bike' : 'driving';
    const osrmCoordinates = allPoints.map((p) => `${p.lng},${p.lat}`).join(';');
    const geoapifyWaypoints = allPoints.map((p) => `${p.lat},${p.lng}`).join('|');

    const url = GEOAPIFY_API_KEY
      ? `https://api.geoapify.com/v1/routing?waypoints=${geoapifyWaypoints}&mode=${mode}&alternatives=${alternatives}&apiKey=${GEOAPIFY_API_KEY}`
      : `https://router.project-osrm.org/route/v1/${osrmProfile}/${osrmCoordinates}?overview=full&geometries=geojson&steps=true&alternatives=${alternatives && normWaypoints.length === 0 ? 'true' : 'false'}`;

    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    
    let result;
    if (GEOAPIFY_API_KEY) {
      result = data;
    } else {
      result = {
        type: 'FeatureCollection',
        features: (data.routes || []).map((route) => {
          const legs = route.legs || [];
          const totalDistance = route.distance ?? legs.reduce((acc, l) => acc + (l.distance || 0), 0);
          const totalDuration = route.duration ?? legs.reduce((acc, l) => acc + (l.duration || 0), 0);
          const allSteps = legs.flatMap((l) => l.steps || []);
          const firstStepName = legs[0]?.steps?.[0]?.name || 'Suggested route';
          return {
            type: 'Feature',
            geometry: route.geometry,
            properties: {
              distance: totalDistance,
              time: totalDuration,
              route_summary: firstStepName,
              steps: allSteps,
              legs,
            },
          };
        }),
      };
    }
    
    setCacheResult(searchCache.nearbyPlaces, cacheKey, result);
    return result;
  } catch (error) {
    console.error('Routing Error:', error);
    return null;
  }
};
