import { useState, useRef, useCallback, useMemo } from 'react';
import { getRouteHash, getSampleCount } from '../utils/routeHelpers';
import { findAllNearbyPOIs, getCachedPOIs, setCachedPOIs, searchPlaces } from '../utils/mapServices';

/**
 * Hook for managing POI search and caching along a selected route.
 * Also handles search bar suggestions for custom stops.
 */
export function usePOISearch(directionsResultRef, selectedIdx) {
  const [allPois, setAllPois] = useState([]);
  const [poiError, setPoiError] = useState(false);
  const [poiLoading, setPoiLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Attraction');
  
  const [stopQuery, setStopQuery] = useState('');
  const [stopSuggestions, setStopSuggestions] = useState([]);
  const [stopActiveIdx, setStopActiveIdx] = useState(-1);
  
  const poiCacheRef = useRef(new Map());

  const loadPOIsForRoute = useCallback(async () => {
    const result = directionsResultRef.current;
    if (!result) return;
    const route = result.routes[selectedIdx];
    if (!route) return;

    const hash = getRouteHash(route);
    if (!hash) return;

    if (poiCacheRef.current.has(hash)) {
      setAllPois(poiCacheRef.current.get(hash));
      setPoiError(false);
      return;
    }

    const cached = getCachedPOIs(hash);
    if (cached) {
      poiCacheRef.current.set(hash, cached);
      setAllPois(cached);
      setPoiError(false);
      return;
    }

    setPoiLoading(true);
    setPoiError(false);

    try {
      const path = route.overview_path || [];
      const distM = route.legs?.[0]?.distance?.value || 5000;
      
      const sampleCount = getSampleCount(distM, 800);
      const step = Math.max(1, Math.floor(path.length / sampleCount));
      const samplePoints = [];
      for (let i = 0; i < path.length; i += step) {
        const pt = path[i];
        samplePoints.push({
          lat: typeof pt.lat === 'function' ? pt.lat() : pt.lat,
          lng: typeof pt.lng === 'function' ? pt.lng() : pt.lng
        });
      }

      const pois = await findAllNearbyPOIs(samplePoints);
      poiCacheRef.current.set(hash, pois);
      setCachedPOIs(hash, pois);
      setAllPois(pois);
    } catch (err) {
      console.error('Failed to load POIs:', err);
      setPoiError(true);
      setAllPois([]);
    } finally {
      setPoiLoading(false);
    }
  }, [directionsResultRef, selectedIdx]);

  const filteredPois = useMemo(() => {
    if (!activeCategory || activeCategory === 'all') return allPois;
    return allPois.filter(p => p.category === activeCategory);
  }, [allPois, activeCategory]);

  const fetchStopSuggestions = useCallback(async (input) => {
    if (!input.trim()) { setStopSuggestions([]); return; }
    try {
      let lat = 7.8;
      let lon = 80.7;

      const result = directionsResultRef?.current;
      if (result?.routes?.[selectedIdx]) {
        const route = result.routes[selectedIdx];
        const path = route.overview_path || [];
        if (path.length > 0) {
          const midPoint = path[Math.floor(path.length / 2)];
          lat = typeof midPoint.lat === 'function' ? midPoint.lat() : midPoint.lat;
          lon = typeof midPoint.lng === 'function' ? midPoint.lng() : midPoint.lng;
        }
      }

      // Bias search towards route midpoint if available, otherwise center of Sri Lanka
      const results = await searchPlaces(input, 5, lat, lon);
      const formatted = results.map(r => ({
        place_id: `${r.lat},${r.lon}`,
        description: r.name ? `${r.name}, ${r.address?.city || r.address?.county || r.address?.state || ''}` : r.displayName,
        geometry: { location: { lat: () => r.lat, lng: () => r.lon } },
        displayName: r.name || r.displayName,
        structured_formatting: {
          main_text: r.name || r.displayName,
          secondary_text: r.address?.city || r.address?.county || r.address?.state || ''
        }
      }));
      setStopSuggestions(formatted);
    } catch (err) {
      console.error('Failed to fetch stop suggestions', err);
      setStopSuggestions([]);
    }
  }, []);

  return {
    allPois,
    filteredPois,
    activeCategory,
    setActiveCategory,
    poiLoading,
    poiError,
    loadPOIsForRoute,
    stopQuery,
    setStopQuery,
    stopSuggestions,
    setStopSuggestions,
    stopActiveIdx,
    setStopActiveIdx,
    fetchStopSuggestions
  };
}
