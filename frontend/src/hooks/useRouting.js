import { useCallback, useRef, useState } from 'react';
import { fetchRoute } from '../utils/geoapifyService';
import {
  MODE_CONFIGS,
  formatCompactDuration,
  parseDurationToMinutes,
} from '../constants/direction';

const vehicleModes = { bus: 'transit', bike: 'bike', car: 'drive', man: 'walk' };

const toLocation = (value) => {
  if (typeof value?.lat === 'function' && typeof value?.lng === 'function') {
    return { lat: value.lat(), lng: value.lng() };
  }
  if (typeof value?.lat === 'number' && typeof value?.lng === 'number') {
    return { lat: value.lat, lng: value.lng };
  }
  if (value?.location) return toLocation(value.location);
  if (value?.geometry?.location) return toLocation(value.geometry.location);
  return null;
};

export const useRouting = (mapEngine = {}, pendingVehicle, showDetailsPanel = true) => {
  const [routes, setRoutes] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [selectedMode, setSelectedMode] = useState(vehicleModes[pendingVehicle] || 'drive');
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [error, setError] = useState(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const routeRequestIdRef = useRef(0);
  const modeMinutesCache = useRef({});
  const drivingMinutesRef = useRef(0);
  const directionsResultRef = mapEngine.directionsResultRef || useRef(null);
  const activeRoutePairRef = mapEngine.activeRoutePairRef || useRef({ origin: null, destination: null });
  const selectRouteRef = mapEngine.selectRouteRef || useRef(null);

  const requestDirections = useCallback(async (origin, destination, modeKey = selectedMode) => {
    const normalizedOrigin = toLocation(origin);
    const normalizedDestination = toLocation(destination);
    if (!normalizedOrigin || !normalizedDestination) {
      setError('Please select valid starting and destination locations.');
      return;
    }

    const requestId = ++routeRequestIdRef.current;
    const mode = modeKey === 'bike' ? 'bicycle' : modeKey === 'walk' ? 'walk' : 'drive';
    setLoadingRoutes(true);
    setError(null);
    activeRoutePairRef.current = { origin: normalizedOrigin, destination: normalizedDestination };

    try {
      const data = await fetchRoute(normalizedOrigin, normalizedDestination, mode, true);
      if (requestId !== routeRequestIdRef.current) return;
      const nextRoutes = (data?.features || []).map((feature) => {
        const properties = feature.properties || {};
        const coordinates = feature.geometry?.coordinates || [];
        const seconds = Number(properties.time || properties.duration || 0);
        const meters = Number(properties.distance || 0);
        const overviewPath = coordinates.map(([lng, lat]) => ({ lat, lng }));
        return {
          overview_path: overviewPath,
          summary: properties.route_summary || properties.mode || 'Suggested route',
          legs: [{
            duration: { value: seconds, text: formatCompactDuration(seconds / 60) },
            distance: { value: meters, text: meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m` },
            steps: [],
            start_location: overviewPath[0],
            end_location: overviewPath[overviewPath.length - 1],
          }],
        };
      });
      if (!nextRoutes.length) throw new Error('No route found between these locations.');

      const routeInfo = nextRoutes.map((route) => ({
        duration: route.legs[0].duration.text,
        durationMinutes: parseDurationToMinutes(route.legs[0].duration.text),
        distance: route.legs[0].distance.text,
        summary: route.summary,
        traffic: 'Light traffic',
      }));
      directionsResultRef.current = { routes: nextRoutes };
      setRoutes(routeInfo);
      setSelectedIdx(0);
      modeMinutesCache.current[modeKey] = routeInfo[0].durationMinutes;
      if (modeKey === 'drive') drivingMinutesRef.current = routeInfo[0].durationMinutes;
      setFallbackMode(false);
    } catch (routeError) {
      if (requestId !== routeRequestIdRef.current) return;
      setRoutes([]);
      directionsResultRef.current = null;
      setError(routeError.message || 'Could not find a route.');
    } finally {
      if (requestId === routeRequestIdRef.current) setLoadingRoutes(false);
    }
  }, [activeRoutePairRef, directionsResultRef, selectedMode]);

  const selectRoute = useCallback((idx) => {
    setSelectedIdx(idx);
    selectRouteRef.current?.(idx);
  }, [selectRouteRef]);

  return {
    routes,
    setRoutes,
    selectedIdx,
    setSelectedIdx,
    selectedMode,
    setSelectedMode,
    loadingRoutes,
    setLoadingRoutes,
    error,
    setError,
    fallbackMode,
    setFallbackMode,
    directionsResultRef,
    selectedRoute: routes[selectedIdx] || routes[0] || null,
    selectedRouteMinutes: parseDurationToMinutes(routes[selectedIdx]?.duration),
    requestDirections,
    selectRoute,
    modeMinutesCache,
    drivingMinutesRef,
    mapEngine,
    showDetailsPanel,
    modeConfigs: MODE_CONFIGS,
  };
};

export default useRouting;
