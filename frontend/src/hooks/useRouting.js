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
    // Always use driving API — OSRM demo server returns identical data for all profiles
    const apiMode = 'drive';

    // Apply mode-specific time multiplier (car=1, bike=1.35, transit=1.85, walk=8.5)
    const modeConfig = MODE_CONFIGS.find((m) => m.key === modeKey) || MODE_CONFIGS[0];
    const timeMultiplier = modeConfig.multiplier || 1;

    setLoadingRoutes(true);
    setError(null);
    activeRoutePairRef.current = { origin: normalizedOrigin, destination: normalizedDestination };

    try {
      const data = await fetchRoute(normalizedOrigin, normalizedDestination, apiMode, true);
      if (requestId !== routeRequestIdRef.current) return;
      const nextRoutes = (data?.features || []).map((feature) => {
        const properties = feature.properties || {};
        const coordinates = feature.geometry?.coordinates || [];
        const seconds = Math.round(Number(properties.time || properties.duration || 0) * timeMultiplier);
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
      // Always derive raw driving minutes for other mode tab estimates
      const rawDrivingMins = timeMultiplier > 0 ? Math.round(routeInfo[0].durationMinutes / timeMultiplier) : routeInfo[0].durationMinutes;
      drivingMinutesRef.current = rawDrivingMins;
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
