import { useState, useRef, useCallback } from 'react';
import L from 'leaflet';
import { getRoute } from '../utils/mapServices';
import { getBlueMarkerIcon, getNavigationMarkerIcon, createRouteLabel } from '../utils/leafletSetup';
import { MODE_CONFIGS, formatCompactDuration, parseDurationToMinutes, formatManeuverInstruction } from '../utils/routeHelpers';

/**
 * Hook that encapsulates OSRM route fetching, route normalization,
 * route drawing, and selected-route state.
 *
 * @param {React.RefObject<L.Map>} mapInstanceRef
 * @param {Object} opts
 * @param {boolean} opts.showDetailsPanel
 * @param {string} opts.selectedMode
 * @param {Function} opts.setEtaData
 * @param {React.RefObject} opts.appNavigateRef
 * @param {React.RefObject} opts.setTitleRef
 * @param {React.RefObject} opts.setEtaDataRef
 * @returns {Object}
 */
export function useRouting(mapInstanceRef, opts = {}) {
  const {
    showDetailsPanel = true,
    selectedMode = 'drive',
    setEtaData,
    appNavigateRef,
    setTitleRef,
    setEtaDataRef,
    carIconUrl,
    clockIconUrl,
  } = opts;

  const [routes, setRoutes] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [error, setError] = useState(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [modeDurations, setModeDurations] = useState({});

  const routeRequestIdRef = useRef(0);
  const renderersRef = useRef([]);
  const clickPathsRef = useRef([]);
  const routeLabelsRef = useRef([]);
  const directionsResultRef = useRef(null);
  const selectRouteRef = useRef(null);
  const activeRoutePairRef = useRef({ origin: null, destination: null });
  const drivingMinutesRef = useRef(0);
  const modeMinutesCache = useRef({});

  const clearRouteOverlays = useCallback(() => {
    renderersRef.current.forEach((r) => r.remove());
    clickPathsRef.current.forEach((p) => p.remove());
    routeLabelsRef.current.forEach((l) => l.remove());
    renderersRef.current = [];
    clickPathsRef.current = [];
    routeLabelsRef.current = [];
  }, []);

  const drawSelectedRoute = useCallback((idx) => {
    const result = directionsResultRef.current;
    if (!result || !mapInstanceRef.current) return;
    // Clear existing overlays (not flood/crime/roadblock — those are managed by useSafetyAlerts)
    renderersRef.current.forEach((r) => r.remove());
    clickPathsRef.current.forEach((p) => p.remove());
    routeLabelsRef.current.forEach((l) => l.remove());
    renderersRef.current = [];
    clickPathsRef.current = [];
    routeLabelsRef.current = [];
    setSelectedIdx(idx);

    result.routes.forEach((route, i) => {
      const isSelected = i === idx;
      const coords = route.overview_path.map(p => [
        typeof p.lat === 'function' ? p.lat() : p.lat,
        typeof p.lng === 'function' ? p.lng() : p.lng,
      ]);

      if (isSelected) {
        const polyline = L.polyline(coords, { color: '#1A73E8', weight: 5, opacity: 1 }).addTo(mapInstanceRef.current);
        renderersRef.current.push(polyline);
      } else {
        if (!showDetailsPanel) return;
        const border = L.polyline(coords, { color: '#00b3f4', weight: 7, opacity: 0.5 }).addTo(mapInstanceRef.current);
        const line = L.polyline(coords, { color: '#9E9E9E', weight: 4, opacity: 0.85 }).addTo(mapInstanceRef.current);
        renderersRef.current.push(border, line);
      }

      const clickPath = L.polyline(coords, { color: 'transparent', weight: 40, opacity: 0, interactive: true }).addTo(mapInstanceRef.current);
      if (i !== idx) clickPath.on('click', () => selectRouteRef.current?.(i));

      const path = route.overview_path;
      const midPoint = path[Math.floor(path.length / 2)];
      const leg = route.legs?.[0];
      const duration = leg?.duration?.text || '--';
      const distance = leg?.distance?.text || '--';
      const durationMins = leg?.duration?.value ? Math.round(leg.duration.value / 60) : 0;

      if (showDetailsPanel) {
        let labelContent = '';
        if (isSelected) {
          labelContent = `
            <div style="background-color:#104bc0;color:#fff;padding:8px 12px;border-radius:8px;font-family:Inter,sans-serif;font-size:16px;font-weight:600;box-shadow:0 4px 6px rgba(0,0,0,0.3);display:inline-block;white-space:nowrap;position:relative;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                ${duration}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:14px;font-weight:400;">
                Tolls
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <div style="position:absolute;bottom:-6px;left:20px;width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid #104bc0;"></div>
            </div>`;
        } else {
          labelContent = `
            <div style="background-color:#fff;color:#333;padding:8px 12px;border-radius:8px;font-family:Inter,sans-serif;font-size:16px;font-weight:600;box-shadow:0 4px 6px rgba(0,0,0,0.15);display:inline-block;white-space:nowrap;position:relative;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                ${duration}
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:14px;font-weight:400;color:#666;">
                Tolls
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
            </div>`;
        }
        const label = createRouteLabel(mapInstanceRef.current, midPoint, labelContent, () => {
          if (!isSelected) selectRouteRef.current?.(i);
        });
        routeLabelsRef.current.push(label);
      } else if (!showDetailsPanel && isSelected) {
        const labelContent = `<div id="eta-label-overlay" style="width:190px;height:102px;border-radius:10px;background:linear-gradient(90deg, #FFFFFF 0%, #A0DBFF 100%);box-shadow:0px 2px 2px 0px #00000040;display:flex;flex-direction:column;justify-content:center;padding:12px 16px;gap:8px;cursor:pointer;"><div style="display:flex;align-items:center;gap:8px;"><img src="${carIconUrl}" style="width:18px;height:18px;object-fit:contain" /><span style="font-weight:600;color:#111827;font-size:14px;">${distance}</span></div><div style="display:flex;align-items:center;gap:8px;"><img src="${clockIconUrl}" style="width:18px;height:18px;object-fit:contain" /><span style="font-weight:600;color:#111827;font-size:14px;">ETA: ${duration}</span></div></div>`;
        const etaClickHandler = () => {
          appNavigateRef?.current?.('eta');
          setTitleRef?.current?.(`ETA: ${duration}`);
          setEtaDataRef?.current?.({ distance, duration, durationMinutes: durationMins, traffic: 'Light traffic', mode: selectedMode, selectedRouteIndex: i });
        };
        const label = createRouteLabel(mapInstanceRef.current, midPoint, labelContent, etaClickHandler);
        routeLabelsRef.current.push(label);
      }

      clickPathsRef.current.push(clickPath);
    });
  }, [mapInstanceRef, showDetailsPanel, carIconUrl, clockIconUrl, selectedMode, appNavigateRef, setTitleRef, setEtaDataRef]);

  const selectRoute = useCallback((idx) => {
    drawSelectedRoute(idx);
  }, [drawSelectedRoute]);

  selectRouteRef.current = selectRoute;

  const requestDirections = useCallback(async (origin, destinationLocation, modeKey) => {
    if (!mapInstanceRef.current) return;
    let oLat, oLng;
    if (typeof origin?.lat === 'function') { oLat = origin.lat(); oLng = origin.lng(); }
    else if (typeof origin?.lat === 'number') { oLat = origin.lat; oLng = origin.lng; }
    else if (origin?.location) { oLat = typeof origin.location.lat === 'function' ? origin.location.lat() : origin.location.lat; oLng = typeof origin.location.lng === 'function' ? origin.location.lng() : origin.location.lng; }
    else { setError('Please select a valid starting location.'); return; }

    let dLat, dLng;
    if (typeof destinationLocation?.lat === 'function') { dLat = destinationLocation.lat(); dLng = destinationLocation.lng(); }
    else if (typeof destinationLocation?.lat === 'number') { dLat = destinationLocation.lat; dLng = destinationLocation.lng; }
    else if (destinationLocation?.geometry?.location) { const loc = destinationLocation.geometry.location; dLat = typeof loc.lat === 'function' ? loc.lat() : loc.lat; dLng = typeof loc.lng === 'function' ? loc.lng() : loc.lng; }
    else { setError('Please select a valid destination.'); return; }

    const normalizedOrigin = { lat: oLat, lng: oLng };
    const normalizedDestination = { lat: dLat, lng: dLng };
    activeRoutePairRef.current = { origin: normalizedOrigin, destination: normalizedDestination };
    const modeConfig = MODE_CONFIGS.find((mode) => mode.key === modeKey) || MODE_CONFIGS[0];
    const requestId = ++routeRequestIdRef.current;
    setLoadingRoutes(true);
    setError(null);
    clearRouteOverlays();

    try {
      const osrmRoutes = await getRoute(oLat, oLng, dLat, dLng, modeConfig.osrmProfile);
      if (requestId !== routeRequestIdRef.current) return;
      if (!osrmRoutes || osrmRoutes.length === 0) {
        setLoadingRoutes(false);
        setError('No route found between these locations. Try different points.');
        setRoutes([]); directionsResultRef.current = null; return;
      }

      const normalizedRoutes = osrmRoutes.map((route) => {
        const distM = route.distance;
        const durS = modeKey === 'drive' ? route.duration : route.duration * modeConfig.multiplier;
        const durMins = Math.round(durS / 60);
        const distText = distM >= 1000 ? `${(distM / 1000).toFixed(1)} km` : `${Math.round(distM)} m`;
        const durText = formatCompactDuration(durMins);
        const overviewPath = (route.geometry?.coordinates || []).map(c => ({ lat: c[1], lng: c[0] }));
        const steps = (route.steps || []).map((step) => {
          const instructionText = formatManeuverInstruction(step);
          return {
            instructions: instructionText,
            name: step.name || '',
            maneuver: {
              type: step.maneuver?.type || 'turn',
              modifier: step.maneuver?.modifier || '',
              instruction: instructionText,
              location: step.maneuver?.location || null,
              bearing_after: step.maneuver?.bearing_after,
              bearing_before: step.maneuver?.bearing_before,
            },
            distance: {
              value: step.distance,
              text: step.distance >= 1000 ? `${(step.distance / 1000).toFixed(1)} km` : `${Math.round(step.distance)} m`,
            },
            duration: {
              value: step.duration,
              text: formatCompactDuration(Math.round(step.duration / 60)),
            },
            start_location: step.maneuver?.location ? { lat: step.maneuver.location[1], lng: step.maneuver.location[0] } : overviewPath[0],
            end_location: overviewPath[overviewPath.length - 1],
          };
        });
        return {
          overview_path: overviewPath,
          legs: [{ distance: { value: distM, text: distText }, duration: { value: durS, text: durText }, steps, start_location: overviewPath[0] || normalizedOrigin, end_location: overviewPath[overviewPath.length - 1] || normalizedDestination }],
          summary: route.summary || 'Suggested route',
        };
      });

      const result = { routes: normalizedRoutes };
      directionsResultRef.current = result;
      setLoadingRoutes(false);
      setFallbackMode(false);
      const routeInfoList = normalizedRoutes.map((r) => {
        const leg = r.legs[0];
        return {
          duration: leg.duration?.text || '--',
          durationMinutes: leg.duration?.value ? Math.round(leg.duration.value / 60) : 0,
          distance: leg.distance?.text || '--',
          summary: r.summary,
          traffic: 'Light traffic',
          steps: leg.steps || [],
          overview_path: r.overview_path || [],
        };
      });
      setRoutes(routeInfoList);
      let shortestIdx = 0; let minDist = Infinity;
      normalizedRoutes.forEach((r, i) => { const d = r.legs?.[0]?.distance?.value || Infinity; if (d < minDist) { minDist = d; shortestIdx = i; } });
      setSelectedIdx(shortestIdx);
      drawSelectedRoute(shortestIdx);

      if (normalizedRoutes[shortestIdx]?.overview_path?.length > 0) {
        const bounds = L.latLngBounds(normalizedRoutes[shortestIdx].overview_path.map(p => [p.lat, p.lng]));
        mapInstanceRef.current.fitBounds(bounds, { padding: [60, 30] });
      }
      if (!showDetailsPanel && routeInfoList[shortestIdx]) {
        const info = routeInfoList[shortestIdx];
        setEtaData?.({ distance: info.distance, duration: info.duration, durationMinutes: info.durationMinutes, traffic: info.traffic, mode: selectedMode });
      }
      modeMinutesCache.current[modeConfig.key] = routeInfoList[0]?.durationMinutes || 0;
      setModeDurations((current) => ({
        ...current,
        [modeConfig.key]: routeInfoList[0]?.durationMinutes || 0,
      }));
      if (modeConfig.osrmProfile === 'driving') drivingMinutesRef.current = routeInfoList[0]?.durationMinutes || 0;

      return { normalizedRoutes, routeInfoList, shortestIdx };
    } catch (err) {
      if (requestId !== routeRequestIdRef.current) return;
      setLoadingRoutes(false);
      console.error('OSRM route error:', err);
      setError('Could not find a route to this destination.');
      setRoutes([]); directionsResultRef.current = null;
    }
  }, [mapInstanceRef, showDetailsPanel, selectedMode, setEtaData, clearRouteOverlays, drawSelectedRoute]);

  return {
    routes, setRoutes,
    selectedIdx, setSelectedIdx,
    loadingRoutes,
    error, setError,
    fallbackMode, setFallbackMode,
    directionsResultRef,
    activeRoutePairRef,
    drivingMinutesRef,
    modeMinutesCache,
    modeDurations,
    routeRequestIdRef,
    clearRouteOverlays,
    drawSelectedRoute,
    selectRoute,
    requestDirections,
  };
}
