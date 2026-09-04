import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import middle from '../assets/middle.png';
import coins from '../assets/coins.png';
import shareIcon from '../assets/shareIcon.png';
import clockIcon from '../assets/clockIcon.png';
import blueLocationIcon from '../assets/directionCircle.png';
import redPinIcon from '../assets/locationRed.png';
import gpsIcon from '../assets/gpsSearch.png';
import threeDots from '../assets/3dots.png';
import upDown from '../assets/upDown.png';
import closeIcon from '../assets/closeIcon.png';
import { usePageTitle } from '../contexts/PageTitleContext';
import { fetchRoute, fetchAutocompleteSuggestions, fetchNearbyPlacesAlongRoute } from '../utils/geoapifyService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { checkRouteForFlood } from '../utils/floodService';
import { saveFavoritePlace, fetchCrimeAlerts, fetchRoadBlockages } from '../services/api';
import LocationInput from '../components/LocationInput';
import carIcon from '../assets/carIcon.png';
import {
  MODE_CONFIGS,
  CATEGORY_TYPES,
  POI_ATTRACTION_KEYWORDS,
  SHOW_CRIME_LABELS_ON_START_MAP,
  SHOW_ROADBLOCK_LABELS_ON_START_MAP,
  parseDurationToMinutes,
  formatCompactDuration,
  estimateModeDuration,
  buildRouteDescription,
  describeRoute,
} from '../constants/direction';
import { useNavigation } from '../hooks/useNavigation';
import { useMapEngine } from '../hooks/useMapEngine';
import { useRouting } from '../hooks/useRouting';
import AddStopPanel from './AddStopPanel';
import { formatStepInstruction, getManeuverIconType, formatDistance } from '../utils/navigationHelper';

const Direction = ({ showDetailsPanel = true }) => {
  const { searchedPlace, userLocation, setUserLocation, setActivePage, pendingOriginLabel, pendingVehicle, setPendingOriginLabel, setPendingVehicle, setTitle, setEtaData, setSearchedPlace, setSafetyData, setShowSearchBar } = usePageTitle();

  useEffect(() => {
    setTitle('');
  }, [setTitle]);

  useEffect(() => {
    setShowSearchBar(!showDetailsPanel);
    return () => setShowSearchBar(false);
  }, [setShowSearchBar, showDetailsPanel]);

  // Expose navigation and ETA setter globally for overlay click handler
  window.setActivePageGlobal = setActivePage;
  window.setEtaTitleGlobal = setTitle;
  window.setEtaDataGlobal = setEtaData;

  const mapEngine = useMapEngine();
  const {
    mapRef, mapInstanceRef, renderersRef, clickPathsRef, routeRequestIdRef,
    originMarkerRef, destMarkerRef, userLocationRef,
    activeRoutePairRef, directionsResultRef, selectRouteRef,
    zoomOverlayRef, mapReady, setMapReady, tooltipRef, routeLabelsRef,
    floodLabelsRef, floodPollRef, crimeLabelsRef, crimeAlertsCacheRef,
    crimeRoutePathRef, roadblockLabelsRef, roadblocksCacheRef,
    roadblockRoutePathRef,
    poiMarkersRef, pathClickLabelRef, nearestHospitalOverlayRef,
    floodDetected, setFloodDetected, createRouteLabel, clearPoiMarkers: clearMapPoiMarkers,
    clearPathClickLabel: clearMapPathClickLabel, clearFloodOverlays: clearMapFloodOverlays,
    clearCrimeOverlays: clearMapCrimeOverlays, clearRoadblockOverlays: clearMapRoadblockOverlays,
    clearRouteOverlays: clearMapRouteOverlays, placeOriginMarker: placeMapOriginMarker,
    findNearestHospital: findMapNearestHospital,
  } = mapEngine;

  const routing = useRouting(mapEngine, pendingVehicle, showDetailsPanel);
  const {
    routes, setRoutes, selectedIdx, setSelectedIdx, selectedMode, setSelectedMode,
    loadingRoutes, setLoadingRoutes, error, setError, fallbackMode, setFallbackMode,
    modeMinutesCache, drivingMinutesRef,
  } = routing;

  useEffect(() => {
    if (pendingVehicle) {
      const map = { bus: 'transit', bike: 'bike', car: 'drive', man: 'walk' };
      if (map[pendingVehicle]) {
        setSelectedMode(map[pendingVehicle]);
      }
    }
  }, [pendingVehicle]);

  const [swapped, setSwapped] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [originLabel, setOriginLabel] = useState('');
  const [destPlace, setDestPlace] = useState(searchedPlace);
  const [panelOpen, setPanelOpen] = useState(true);
  const [addStopOpen, setAddStopOpen] = useState(false);
  const [currentWaypoint, setCurrentWaypoint] = useState(null);
  const waypointsRef = useRef([]);

  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  const destination = searchedPlace?.displayName || searchedPlace?.formatted_address?.split(',')[0] || searchedPlace?.name || destPlace?.displayName || destPlace?.formatted_address?.split(',')[0] || destPlace?.name || '';

  const handleAddWaypoint = (place) => {
    setCurrentWaypoint(place);
    const loc = place?.location;
    if (loc) {
      const wp = { lat: loc.lat ?? loc[0], lng: loc.lng ?? loc[1], name: place.name };
      waypointsRef.current = [wp];
      const origin = activeRoutePairRef.current?.origin || userLocationRef.current || userLocation;
      const dest = activeRoutePairRef.current?.destination || destPlace?.geometry?.location || searchedPlace?.geometry?.location || destPlace || searchedPlace;
      if (origin && dest) {
        requestDirections(origin, dest, selectedMode, waypointsRef.current);
      }
    }
  };

  const handleRemoveWaypoint = () => {
    setCurrentWaypoint(null);
    waypointsRef.current = [];
    clearPoiMarkers();
    const origin = activeRoutePairRef.current?.origin || userLocationRef.current || userLocation;
    const dest = activeRoutePairRef.current?.destination || destPlace?.geometry?.location || searchedPlace?.geometry?.location || destPlace || searchedPlace;
    if (origin && dest) {
      requestDirections(origin, dest, selectedMode, []);
    }
  };
  const stopContainerRef = useRef(null);
  const originChosenRef = useRef(false); // true only after user explicitly picks a start
  const {
    navStepIndex,
    setNavStepIndex,
    navInstruction,
    setNavInstruction,
    navDistance,
    navArrived,
    setNavArrived,
    navWatchIdRef,
    updateNavigation,
    getActiveManeuverStep,
    nextStep,
    prevStep,
  } = useNavigation(directionsResultRef, selectedIdx);

  useEffect(() => {
    if (!showDetailsPanel && directionsResultRef.current) {
      updateNavigation(userLocationRef.current || null, 0);
    }
  }, [showDetailsPanel, updateNavigation]);

  const handleNavNextStep = useCallback(() => {
    nextStep();
    const active = getActiveManeuverStep();
    if (active?.nextStep?.start_location && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([active.nextStep.start_location.lat, active.nextStep.start_location.lng]);
    }
  }, [nextStep, getActiveManeuverStep]);

  const handleNavPrevStep = useCallback(() => {
    prevStep();
    const active = getActiveManeuverStep();
    if (active?.step?.start_location && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([active.step.start_location.lat, active.step.start_location.lng]);
    }
  }, [prevStep, getActiveManeuverStep]);

  const selectedRoute = routes[selectedIdx] || routes[0] || null;
  const selectedRouteMinutes = parseDurationToMinutes(selectedRoute?.duration);
  // Always base estimates on the driving route minutes, not the current mode


  const clearPoiMarkers = clearMapPoiMarkers;
  const clearPathClickLabel = clearMapPathClickLabel;
  const clearFloodOverlays = clearMapFloodOverlays;
  const clearCrimeOverlays = clearMapCrimeOverlays;
  const clearRoadblockOverlays = clearMapRoadblockOverlays;
  const clearRouteOverlays = clearMapRouteOverlays;

  const drawSelectedRoute = (idx) => {
    const result = directionsResultRef.current;
    if (!result || !mapInstanceRef.current) return;

    clearRouteOverlays();
    setSelectedIdx(idx);

    result.routes.forEach((route, i) => {
      const isSelected = i === idx;
      if (!isSelected && !showDetailsPanel) return;

      const path = route.overview_path.map((point) => [point.lat, point.lng]);
      const polyline = L.polyline(path, {
        color: isSelected ? '#1A73E8' : '#9E9E9E',
        weight: isSelected ? 5 : 4,
        opacity: isSelected ? 1 : 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(mapInstanceRef.current);
      renderersRef.current.push(polyline);

      const clickPath = L.polyline(path, {
        color: '#000',
        weight: 24,
        opacity: 0,
      }).addTo(mapInstanceRef.current);

      if (i === idx) {
        const leg = result.routes[i]?.legs?.[0];
        const duration = leg?.duration?.text || '--';
        const distanceKm = leg?.distance?.text || '--';
        const modeConfig = MODE_CONFIGS.find(m => m.key === selectedMode) || MODE_CONFIGS[0];
        const labelHtml = `
          <div style="background:linear-gradient(135deg,#fff 0%,#EFF6FF 100%);border-radius:12px;box-shadow:0 4px 16px rgba(26,115,232,0.18);padding:10px 14px;font-family:Inter,sans-serif;pointer-events:none;white-space:nowrap;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <img src="${modeConfig.icon}" style="width:20px;height:20px;object-fit:contain"/>
              <span style="font-weight:700;font-size:14px;color:#122E63">${duration}</span>
            </div>
            <div style="font-size:13px;color:#374151">${distanceKm}</div>
          </div>`;

        clickPath.on('mousemove', (e) => {
          clearPathClickLabel();
          pathClickLabelRef.current = createRouteLabel(mapInstanceRef.current, e.latlng, labelHtml);
        });
        clickPath.on('mouseout', () => clearPathClickLabel());
        clickPath.on('click', () => clearPathClickLabel());
      } else {
        clickPath.on('click', () => selectRouteRef.current(i));
      }

      // Permanent label at route midpoint
      const midPoint = path[Math.floor(path.length / 2)];
      const leg = result.routes[i]?.legs?.[0];
      const duration = leg?.duration?.text || '--';
      const distance = leg?.distance?.text || '--';
      const freeMins = leg?.duration?.value ? Math.round(leg.duration.value / 60) : 0;
      const trafficMins = freeMins;
      const ratio = freeMins > 0 ? trafficMins / freeMins : 1;
      const traffic = ratio >= 1.4 ? 'Heavy traffic' : ratio >= 1.15 ? 'Moderate traffic' : 'Light traffic';
      const hasTrafficDelay = false;
      const shouldShowTrafficLabel = !showDetailsPanel && isSelected && (
        traffic === 'Heavy traffic' || traffic === 'Moderate traffic'
      );
      if (!showDetailsPanel) {
        // Add a clickable overlay for ETA label
        const labelContent = `
          <div id="eta-label-overlay" style="width:189.99635314941406px;height:101.90234375px;border-radius:10px;background:linear-gradient(90deg, #FFFFFF 0%, #A0DBFF 100%);box-shadow:0px 2px 2px 0px #00000040;display:flex;flex-direction:column;justify-content:center;padding:12px 16px;gap:8px;cursor:pointer;">
            <div style="display:flex;align-items:center;gap:8px;">
              <img src="${carIcon}" style="width:18px;height:18px;object-fit:contain" />
              <span style="font-weight:600;color:#111827;font-size:14px;">${distance}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <img src="${clockIcon}" style="width:18px;height:18px;object-fit:contain" />
              <span style="font-weight:600;color:#111827;font-size:14px;">ETA: ${duration}</span>
            </div>
          </div>`;
        const etaClickHandler = () => {
          if (typeof window.setActivePageGlobal === 'function') {
            window.setActivePageGlobal('eta');
          }
          if (typeof window.setEtaTitleGlobal === 'function') {
            window.setEtaTitleGlobal(`ETA: ${duration}`);
          }
          const originCoords = userLocationRef.current || activeRoutePairRef.current?.origin || userLocation;
          const destCoords = destPlace?.geometry?.location || searchedPlace?.geometry?.location || activeRoutePairRef.current?.destination || destPlace || searchedPlace;
          if (typeof window.setEtaDataGlobal === 'function') {
            window.setEtaDataGlobal({
              distance,
              duration,
              durationMinutes: trafficMins || freeMins,
              traffic,
              mode: selectedMode,
              selectedRouteIndex: i,
              origin: originCoords,
              destination: destCoords,
            });
          }
        };
        const label = createRouteLabel(mapInstanceRef.current, midPoint, labelContent, etaClickHandler);
        routeLabelsRef.current.push(label);
      }

      if (!showDetailsPanel && isSelected) {

        // ── Traffic label: find the actual worst-congested step on the route ──
        const steps = result.routes[i]?.legs?.[0]?.steps || [];
        let worstStepLocation = null;
        let worstRatio = 1;
        steps.forEach((step) => {
          const stepFree = step.duration?.value || 0;
          const stepTraffic = step.duration_in_traffic?.value || stepFree;
          const stepRatio = stepFree > 0 ? stepTraffic / stepFree : 1;
          if (stepRatio > worstRatio) {
            worstRatio = stepRatio;
            // Use the midpoint of the step's path for the label position
            const stepPath = step.path || [];
            worstStepLocation = stepPath.length > 0
              ? stepPath[Math.floor(stepPath.length / 2)]
              : step.start_location;
          }
        });
        // Fall back to 75% of overview path if no per-step traffic data
        if (!worstStepLocation && hasTrafficDelay) {
          worstStepLocation = path[Math.floor(path.length * 0.75)];
        }

        if (worstStepLocation && hasTrafficDelay) {
          const trafficLabelHtml = `
            <div style="width:140px;height:40px;border-radius:12px;background:#EAB308;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0px 2px 4px rgba(0,0,0,0.3);">
              <svg width="22" height="20" viewBox="0 0 48 44" aria-hidden="true">
                <path d="M24 3.5L3.5 39.5c-.7 1.2.2 2.7 1.6 2.7h38c1.4 0 2.3-1.5 1.6-2.7L24 3.5z" fill="none" stroke="#E53935" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="24" cy="30" r="2.6" fill="#E53935" />
                <line x1="24" y1="14" x2="24" y2="26" stroke="#E53935" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span style="font-weight:700;font-size:15px;color:#000;">Traffic</span>
            </div>`;
          const trafficOverlay = createRouteLabel(mapInstanceRef.current, worstStepLocation, trafficLabelHtml);
          routeLabelsRef.current.push(trafficOverlay);
        }


      }

      // ── Flood label (shown separately at 1/3 point of the route) ──
      // Drawn asynchronously after route is confirmed; see checkAndDrawFloodLabel below.

      clickPathsRef.current.push(clickPath);
    });
  };

  const requestDirections = async (origin, destinationLocation, modeKey, waypoints = waypointsRef.current || []) => {
    if (!mapInstanceRef.current) return;

    // Normalize origin to LatLng or LatLngLiteral
    let normalizedOrigin;
    if (typeof origin?.lat === 'function' && typeof origin?.lng === 'function') {
      normalizedOrigin = { lat: origin.lat(), lng: origin.lng() };
    } else if (typeof origin?.lat === 'number' && typeof origin?.lng === 'number') {
      normalizedOrigin = { lat: origin.lat, lng: origin.lng };
    } else if (origin?.location) {
      normalizedOrigin = origin.location;
    } else {
      console.error('Invalid origin:', origin);
      setError('Please select a valid starting location.');
      return;
    }

    // Normalize destination to LatLng or LatLngLiteral
    let normalizedDestination;
    if (typeof destinationLocation?.lat === 'function' && typeof destinationLocation?.lng === 'function') {
      normalizedDestination = { lat: destinationLocation.lat(), lng: destinationLocation.lng() };
    } else if (typeof destinationLocation?.lat === 'number' && typeof destinationLocation?.lng === 'number') {
      normalizedDestination = { lat: destinationLocation.lat, lng: destinationLocation.lng };
    } else if (destinationLocation?.geometry?.location) {
      normalizedDestination = destinationLocation.geometry.location;
    } else {
      console.error('Invalid destination:', destinationLocation);
      setError('Please select a valid destination.');
      return;
    }

    activeRoutePairRef.current = { origin: normalizedOrigin, destination: normalizedDestination };
    const requestId = ++routeRequestIdRef.current;
    const modeConfig = MODE_CONFIGS.find((mode) => mode.key === modeKey) || MODE_CONFIGS[0];

    console.log('[Direction] requestDirections called:', {
      origin: normalizedOrigin?.toString?.() || normalizedOrigin,
      destination: normalizedDestination?.toString?.() || normalizedDestination,
      mode: modeKey,
      travelMode: modeConfig.travelMode,
    });

    setLoadingRoutes(true);
    setError(null);
    clearRouteOverlays();

    try {
      const mode = modeKey === 'drive' ? 'drive' : modeKey === 'bike' ? 'bicycle' : modeKey === 'walk' ? 'walk' : 'drive';
      const data = await fetchRoute(normalizedOrigin, normalizedDestination, mode, true, waypoints);
      if (requestId !== routeRequestIdRef.current) return;
      const sourceRoutes = data?.features || [];
      if (!sourceRoutes.length) throw new Error('No route found between these locations. Try different points.');

      const result = {
        routes: sourceRoutes.map((feature) => {
          const properties = feature.properties || {};
          const coordinates = feature.geometry?.coordinates || [];
          const seconds = Number(properties.time || properties.duration || 0);
          const meters = Number(properties.distance || 0);
          const overview_path = coordinates.map(([lng, lat]) => ({ lat, lng }));
          const rawLegs = properties.legs || [];
          const legs = rawLegs.length > 0 ? rawLegs.map((l) => ({
            duration: { value: l.duration || 0, text: formatCompactDuration((l.duration || 0) / 60) },
            distance: { value: l.distance || 0, text: (l.distance || 0) >= 1000 ? `${((l.distance || 0) / 1000).toFixed(1)} km` : `${Math.round(l.distance || 0)} m` },
            steps: (l.steps || []).map((step) => {
              const coords = step.geometry?.coordinates || [];
              const startCoord = step.maneuver?.location || (coords.length > 0 ? coords[0] : null);
              const endCoord = coords.length > 0 ? coords[coords.length - 1] : startCoord;
              const formattedInstruction = formatStepInstruction(step);
              return {
                name: step.name || '',
                maneuver: step.maneuver?.type && step.maneuver.type !== 'new name'
                  ? `${step.maneuver.type}${step.maneuver.modifier ? ` ${step.maneuver.modifier}` : ''}`
                  : '',
                maneuverType: step.maneuver?.type || '',
                maneuverModifier: step.maneuver?.modifier || '',
                exit: step.maneuver?.exit,
                instructions: formattedInstruction,
                distance: step.distance,
                duration: { value: step.duration || 0 },
                start_location: startCoord ? { lng: startCoord[0], lat: startCoord[1] } : null,
                end_location: endCoord ? { lng: endCoord[0], lat: endCoord[1] } : null,
              };
            }),
            start_location: overview_path[0],
            end_location: overview_path[overview_path.length - 1],
          })) : [{
            duration: { value: seconds, text: formatCompactDuration(seconds / 60) },
            distance: { value: meters, text: meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m` },
            steps: (properties.steps || []).map((step) => {
              const coords = step.geometry?.coordinates || [];
              const startCoord = step.maneuver?.location || (coords.length > 0 ? coords[0] : null);
              const endCoord = coords.length > 0 ? coords[coords.length - 1] : startCoord;
              const formattedInstruction = formatStepInstruction(step);
              return {
                name: step.name || '',
                maneuver: step.maneuver?.type && step.maneuver.type !== 'new name'
                  ? `${step.maneuver.type}${step.maneuver.modifier ? ` ${step.maneuver.modifier}` : ''}`
                  : '',
                maneuverType: step.maneuver?.type || '',
                maneuverModifier: step.maneuver?.modifier || '',
                exit: step.maneuver?.exit,
                instructions: formattedInstruction,
                distance: step.distance,
                duration: { value: step.duration || 0 },
                start_location: startCoord ? { lng: startCoord[0], lat: startCoord[1] } : null,
                end_location: endCoord ? { lng: endCoord[0], lat: endCoord[1] } : null,
              };
            }),
            start_location: overview_path[0],
            end_location: overview_path[overview_path.length - 1],
          }];

          return {
            overview_path,
            summary: properties.route_summary || properties.mode || 'Suggested route',
            legs,
          };
        }),
      };

      setLoadingRoutes(false);
      setFallbackMode(false);
      directionsResultRef.current = result;

      const routeInfoList = result.routes.map((route) => {
        const legs = route.legs || [];
        const totalSeconds = legs.reduce((sum, l) => sum + (l.duration?.value || 0), 0) || legs[0]?.duration?.value || 0;
        const totalMeters = legs.reduce((sum, l) => sum + (l.distance?.value || 0), 0) || legs[0]?.distance?.value || 0;
        const freeMins = Math.round(totalSeconds / 60);
        return {
          duration: formatCompactDuration(freeMins),
          durationMinutes: freeMins,
          distance: totalMeters >= 1000 ? `${(totalMeters / 1000).toFixed(1)} km` : `${Math.round(totalMeters)} m`,
          summary: route.summary || 'Suggested route',
          traffic: 'Light traffic',
        };
      });

      setRoutes(routeInfoList);

      let shortestIdx = 0;
      let minDistance = Infinity;
      result.routes.forEach((route, i) => {
        const dist = route.legs?.[0]?.distance?.value || Infinity;
        if (dist < minDistance) {
          minDistance = dist;
          shortestIdx = i;
        }
      });

      setSelectedIdx(shortestIdx);
      drawSelectedRoute(shortestIdx);
      if (typeof updateNavigation === 'function') {
        updateNavigation(userLocationRef.current || null, 0);
      }

      // On the start page, fit the map to the full route so ETA labels are visible
      if (!showDetailsPanel) {
        const selectedLeg = result.routes[shortestIdx]?.legs?.[0];
        if (selectedLeg) {
          const bounds = L.latLngBounds();
          bounds.extend(selectedLeg.start_location);
          bounds.extend(selectedLeg.end_location);
          // Also include the midpoint where the ETA label sits
          const overviewPath = result.routes[shortestIdx]?.overview_path || [];
          if (overviewPath.length > 0) {
            const mid = overviewPath[Math.floor(overviewPath.length / 2)];
            bounds.extend(mid);
          }
          mapInstanceRef.current.fitBounds(bounds, { top: 60, bottom: 60, left: 30, right: 30 });
        }
      }

      // Push ETA data into context so Header can show it on the start page
      if (!showDetailsPanel && routeInfoList[shortestIdx]) {
        const info = routeInfoList[shortestIdx];
        const originCoords = userLocationRef.current || activeRoutePairRef.current?.origin || userLocation;
        const destCoords = destPlace?.geometry?.location || searchedPlace?.geometry?.location || activeRoutePairRef.current?.destination || destPlace || searchedPlace;
        setEtaData({
          distance: info.distance,
          duration: info.duration,
          durationMinutes: info.durationMinutes,
          traffic: info.traffic,
          mode: selectedMode,
          selectedRouteIndex: shortestIdx,
          origin: originCoords,
          destination: destCoords,
        });
      }

      // Real-time flood check on the selected route
      if (!showDetailsPanel) {
        const selectedRoute = result.routes[0];
        const overviewPath = selectedRoute?.overview_path || [];
        checkAndDrawFloodLabel(overviewPath);
        checkAndDrawCrimeLabels(overviewPath);
        checkAndDrawRoadblockLabels(overviewPath);
        // Poll every 5 minutes
        if (floodPollRef.current) clearInterval(floodPollRef.current);
        floodPollRef.current = setInterval(() => {
          checkAndDrawFloodLabel(overviewPath);
        }, 5 * 60 * 1000);
      }
      // Cache this mode's actual minutes
      modeMinutesCache.current[modeConfig.key] = routeInfoList[0]?.durationMinutes || 0;
      if (mode === 'drive') {
        drivingMinutesRef.current = routeInfoList[0]?.durationMinutes || 0;
      }
    } catch (routeError) {
      if (requestId !== routeRequestIdRef.current) return;
      setLoadingRoutes(false);
      setRoutes([]);
      directionsResultRef.current = null;
      setError(routeError.message || 'Could not find a route to this destination.');
    }
  };

  const selectRoute = (idx) => {
    drawSelectedRoute(idx);
  };

  selectRouteRef.current = selectRoute;

  const checkAndDrawFloodLabel = async (overviewPath) => {
    if (!mapInstanceRef.current || !overviewPath?.length || showDetailsPanel) return;
    clearFloodOverlays();

    const { isFlood, floodPoint, alert } = await checkRouteForFlood(overviewPath, destination);
    setFloodDetected(isFlood);
    if (!isFlood) return;

    // Place label at flood point or 1/3 of the path
    const fallbackPoint = overviewPath[Math.floor(overviewPath.length / 3)];
    const labelPoint = floodPoint || fallbackPoint;
    if (!labelPoint) return;

    const condition = (alert?.weatherCondition || '').toLowerCase();
    const alertLocation = (alert?.location || '').trim();
    const isSpecificallyLandslide = condition.includes('landslide');
    const isSpecificallyFlood = condition.includes('flood');
    
    let titlePrefix = 'Weather warning';
    if (isSpecificallyLandslide) titlePrefix = 'Landslide warning';
    else if (isSpecificallyFlood) titlePrefix = 'Flood warning';
    else titlePrefix = 'Landslide or flood warning';

    const labelMessage = alertLocation ? `${titlePrefix} - ${alertLocation}` : titlePrefix;

    const floodLabel = `
      <div style="
        transform: translateY(-60px);
        min-width: 220px;
        max-width: 300px;
        height: 44px;
        border-radius: 12px;
        background: #E8CC1C;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        box-shadow: 0px 2px 6px rgba(0,0,0,0.28);
        padding: 0 14px;
      ">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            fill="none" stroke="#E53935" stroke-width="1.8" stroke-linejoin="round"/>
          <line x1="12" y1="9" x2="12" y2="13" stroke="#E53935" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="12" cy="17" r="1" fill="#E53935"/>
        </svg>
        <span style="font-weight:700;font-size:11px;color:#000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${labelMessage}</span>
      </div>`;

    const overlay = createRouteLabel(mapInstanceRef.current, labelPoint, floodLabel);
    floodLabelsRef.current.push(overlay);
  };

  // Haversine distance helper (metres)
  const haversineDist = (lat1, lon1, lat2, lon2) => {
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

  /**
   * Show only the single nearest AHEAD crime alert on the map.
   * "Ahead" = the crime's closest route-point index is >= the user's closest
   * route-point index, so alerts behind the user are hidden.
   * Called on every GPS update for real-time progression.
   */
  const updateNearestCrimeLabel = (userLoc) => {
    if (!SHOW_CRIME_LABELS_ON_START_MAP) return;
    if (!mapInstanceRef.current || showDetailsPanel) return;
    clearCrimeOverlays();

    const cachedAlerts = crimeAlertsCacheRef.current;
    const overviewPath = crimeRoutePathRef.current;
    if (!cachedAlerts.length || !overviewPath.length) return;

    const userLat = userLoc?.lat;
    const userLng = userLoc?.lng;
    if (userLat == null || userLng == null) return;

    // Find the user's nearest point index on the route
    let userRouteIdx = 0;
    let userMinDist = Infinity;
    overviewPath.forEach((pt, idx) => {
      const ptLat = typeof pt.lat === 'function' ? pt.lat() : pt.lat;
      const ptLng = typeof pt.lng === 'function' ? pt.lng() : pt.lng;
      const d = haversineDist(userLat, userLng, ptLat, ptLng);
      if (d < userMinDist) {
        userMinDist = d;
        userRouteIdx = idx;
      }
    });

    // For each crime alert near the route, compute its route-index and
    // distance to the user. Keep only those AHEAD of the user.
    let bestCrime = null;
    let bestDistToUser = Infinity;

    cachedAlerts.forEach((crime) => {
      const crimeLat = crime.latitude ?? crime.lat;
      const crimeLng = crime.longitude ?? crime.lng ?? crime.lon;
      if (crimeLat == null || crimeLng == null) return;

      // Find the crime's nearest route-point
      let crimeRouteIdx = 0;
      let crimeRouteDist = Infinity;
      overviewPath.forEach((pt, idx) => {
        const ptLat = typeof pt.lat === 'function' ? pt.lat() : pt.lat;
        const ptLng = typeof pt.lng === 'function' ? pt.lng() : pt.lng;
        const d = haversineDist(crimeLat, crimeLng, ptLat, ptLng);
        if (d < crimeRouteDist) {
          crimeRouteDist = d;
          crimeRouteIdx = idx;
        }
      });

      // Must be within 5km of the route AND ahead of the user
      if (crimeRouteDist > 5000) return;
      if (crimeRouteIdx < userRouteIdx) return; // already passed

      const distToUser = haversineDist(userLat, userLng, crimeLat, crimeLng);
      if (distToUser < bestDistToUser) {
        bestDistToUser = distToUser;
        bestCrime = crime;
      }
    });

    if (!bestCrime) return;

    const crimeLat = bestCrime.latitude ?? bestCrime.lat;
    const crimeLng = bestCrime.longitude ?? bestCrime.lng ?? bestCrime.lon;
    const crimeTitle = bestCrime.title || 'Crime alert';
    const crimeLocation = bestCrime.location || '';
    const distText = bestDistToUser < 1000
      ? `${Math.round(bestDistToUser)}m away`
      : `${(bestDistToUser / 1000).toFixed(1)}km away`;
    const labelText = crimeLocation
      ? `${crimeTitle} · ${crimeLocation} · ${distText}`
      : `${crimeTitle} · ${distText}`;

    const crimeLabelHtml = `
      <div style="
        transform: translateY(-60px);
        min-width: 200px;
        max-width: 300px;
        height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, #FF5252 0%, #D32F2F 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        box-shadow: 0px 3px 8px rgba(211,47,47,0.45);
        padding: 0 14px;
      ">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            fill="none" stroke="#FFF" stroke-width="1.8" stroke-linejoin="round"/>
          <line x1="12" y1="9" x2="12" y2="13" stroke="#FFF" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="12" cy="17" r="1" fill="#FFF"/>
        </svg>
        <span style="font-weight:700;font-size:11px;color:#FFF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${labelText}</span>
      </div>`;

    const crimePos = { lat: crimeLat, lng: crimeLng };
    const overlay = createRouteLabel(mapInstanceRef.current, crimePos, crimeLabelHtml);
    crimeLabelsRef.current.push(overlay);
  };

  /* ── Fetch crime alerts and show nearest on the route ── */
  const checkAndDrawCrimeLabels = async (overviewPath) => {
    if (!SHOW_CRIME_LABELS_ON_START_MAP) return;
    if (!mapInstanceRef.current || !overviewPath?.length || showDetailsPanel) return;
    clearCrimeOverlays();

    // Store the route path for GPS-driven updates
    crimeRoutePathRef.current = overviewPath;

    try {
      const res = await fetchCrimeAlerts();
      const alerts = Array.isArray(res) ? res : (res?.data || []);
      crimeAlertsCacheRef.current = alerts;

      // Show the nearest one based on current user position
      const userLoc = userLocationRef.current;
      if (userLoc) {
        updateNearestCrimeLabel(userLoc);
      }
    } catch (err) {
      console.warn('[Direction] Failed to fetch crime alerts for map:', err.message);
    }
  };

  /**
   * Show only the single nearest AHEAD roadblock on the map.
   * "Ahead" uses route-point index progression so passed items disappear.
   */
  const updateNearestRoadblockLabel = (userLoc) => {
    if (!SHOW_ROADBLOCK_LABELS_ON_START_MAP) return;
    if (!mapInstanceRef.current || showDetailsPanel) return;
    clearRoadblockOverlays();

    const cachedRoadblocks = roadblocksCacheRef.current;
    const overviewPath = roadblockRoutePathRef.current;
    if (!cachedRoadblocks.length || !overviewPath.length) return;

    const originPos = originMarkerRef.current?.getPosition?.();
    const fallbackPoint = overviewPath[0];
    const fallbackLat = fallbackPoint ? (typeof fallbackPoint.lat === 'function' ? fallbackPoint.lat() : fallbackPoint.lat) : null;
    const fallbackLng = fallbackPoint ? (typeof fallbackPoint.lng === 'function' ? fallbackPoint.lng() : fallbackPoint.lng) : null;
    const refLat = userLoc?.lat ?? originPos?.lat?.() ?? fallbackLat;
    const refLng = userLoc?.lng ?? originPos?.lng?.() ?? fallbackLng;
    if (refLat == null || refLng == null) return;

    let userRouteIdx = 0;
    let userMinDist = Infinity;
    overviewPath.forEach((pt, idx) => {
      const ptLat = typeof pt.lat === 'function' ? pt.lat() : pt.lat;
      const ptLng = typeof pt.lng === 'function' ? pt.lng() : pt.lng;
      const d = haversineDist(refLat, refLng, ptLat, ptLng);
      if (d < userMinDist) {
        userMinDist = d;
        userRouteIdx = idx;
      }
    });

    let bestRoadblock = null;
    let bestDistToUser = Infinity;

    cachedRoadblocks.forEach((incident) => {
      const incLat = incident.latitude ?? incident.lat;
      const incLng = incident.longitude ?? incident.lng ?? incident.lon;
      if (incLat == null || incLng == null) return;

      let incidentRouteIdx = 0;
      let incidentRouteDist = Infinity;
      overviewPath.forEach((pt, idx) => {
        const ptLat = typeof pt.lat === 'function' ? pt.lat() : pt.lat;
        const ptLng = typeof pt.lng === 'function' ? pt.lng() : pt.lng;
        const d = haversineDist(incLat, incLng, ptLat, ptLng);
        if (d < incidentRouteDist) {
          incidentRouteDist = d;
          incidentRouteIdx = idx;
        }
      });

      if (incidentRouteDist > 5000) return;
      if (incidentRouteIdx < userRouteIdx) return;

      const distToUser = haversineDist(refLat, refLng, incLat, incLng);
      if (distToUser < bestDistToUser) {
        bestDistToUser = distToUser;
        bestRoadblock = incident;
      }
    });

    if (!bestRoadblock) return;

    const roadblockLat = bestRoadblock.latitude ?? bestRoadblock.lat;
    const roadblockLng = bestRoadblock.longitude ?? bestRoadblock.lng ?? bestRoadblock.lon;
    const roadblockTitle = bestRoadblock.title || bestRoadblock.incidentCategory || 'Road blockage';
    const roadblockLocation = bestRoadblock.location || bestRoadblock.locationName || bestRoadblock.address || '';
    const distText = bestDistToUser < 1000
      ? `${Math.round(bestDistToUser)}m away`
      : `${(bestDistToUser / 1000).toFixed(1)}km away`;
    const labelText = roadblockLocation
      ? `${roadblockTitle} · ${roadblockLocation} · ${distText}`
      : `${roadblockTitle} · ${distText}`;

    const roadblockLabelHtml = `
      <div style="
        transform: translateY(-60px);
        min-width: 200px;
        max-width: 310px;
        height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        box-shadow: 0px 3px 8px rgba(161,98,7,0.35);
        padding: 0 14px;
      ">
        <svg width="22" height="24" viewBox="0 0 52 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="6" y="50" width="40" height="7" rx="2" fill="#444"/>
          <rect x="8" y="50" width="36" height="4" rx="1.5" fill="#555"/>
          <path d="M18 52L24 8H28L34 52H18Z" fill="#FF6D00"/>
          <rect x="21" y="19" width="10" height="5" rx="1" fill="white" opacity="0.95"/>
          <rect x="20" y="32" width="12" height="5" rx="1" fill="white" opacity="0.95"/>
          <ellipse cx="26" cy="7" rx="3" ry="1.8" fill="#FF8F00"/>
        </svg>
        <span style="font-weight:700;font-size:11px;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${labelText}</span>
      </div>`;

    const roadblockPos = { lat: roadblockLat, lng: roadblockLng };
    const overlay = createRouteLabel(mapInstanceRef.current, roadblockPos, roadblockLabelHtml);
    roadblockLabelsRef.current.push(overlay);
  };

  const checkAndDrawRoadblockLabels = async (overviewPath) => {
    if (!SHOW_ROADBLOCK_LABELS_ON_START_MAP) return;
    if (!mapInstanceRef.current || !overviewPath?.length || showDetailsPanel) return;
    clearRoadblockOverlays();

    roadblockRoutePathRef.current = overviewPath;

    try {
      const res = await fetchRoadBlockages();
      const incidents = Array.isArray(res) ? res : (res?.incidents || res?.data || []);
      roadblocksCacheRef.current = incidents;

      updateNearestRoadblockLabel(userLocationRef.current || null);
    } catch (err) {
      console.warn('[Direction] Failed to fetch roadblock alerts for map:', err.message);
    }
  };

  const findNearestHospital = (loc) => findMapNearestHospital(loc, showDetailsPanel);

  const placeOriginMarker = placeMapOriginMarker;

  const applyOrigin = useCallback((loc, label, fireRoute = true) => {
    userLocationRef.current = loc;
    if (typeof setUserLocation === 'function') {
      setUserLocation(loc);
    }
    setOriginLabel(label);
    if (!showDetailsPanel) {
      placeOriginMarker(loc, false);
    } else {
      // On the Direction details page, show a blue dot at the user's location
      placeOriginMarker(loc, true);
      // Fit map to show both user location and destination
      const dest = destPlace || searchedPlace;
      const destLoc = dest?.geometry?.location;
      if (destLoc && mapInstanceRef.current) {
        const bounds = L.latLngBounds();
        bounds.extend({ lat: loc.lat, lng: loc.lng });
        bounds.extend(destLoc);
        mapInstanceRef.current.fitBounds(bounds, { top: 80, bottom: 80, left: 40, right: 40 });
      } else if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo({ lat: loc.lat, lng: loc.lng });
        mapInstanceRef.current.setZoom(14);
      }
    }
    if (fireRoute) {
      originChosenRef.current = true;
      const dest = destPlace || searchedPlace;
      if (dest?.geometry?.location) {
        const destLoc = dest.geometry.location;
        requestDirections(loc, destLoc, selectedMode);
      }
    }
  }, [showDetailsPanel, selectedMode, destPlace, searchedPlace, setUserLocation]);

  const onOriginSelect = useCallback((place) => {
    const loc = {
      lat: typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat,
      lng: typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng,
    };
    applyOrigin(loc, place.displayName);
  }, [applyOrigin]);

  const onDestSelect = useCallback((place) => {
    setDestPlace(place);
    setSearchedPlace(place);
    
    if (!place?.geometry?.location) {
      setError('Please select a valid destination from the suggestions.');
      return;
    }

    const loc = place.geometry.location;
    
    // Update or create destination marker
    if (destMarkerRef.current) {
      destMarkerRef.current.setLatLng([
        typeof loc.lat === 'function' ? loc.lat() : loc.lat,
        typeof loc.lng === 'function' ? loc.lng() : loc.lng,
      ]);
    } else if (mapInstanceRef.current) {
      destMarkerRef.current = L.marker([
        typeof loc.lat === 'function' ? loc.lat() : loc.lat,
        typeof loc.lng === 'function' ? loc.lng() : loc.lng,
      ]).addTo(mapInstanceRef.current);
    }

    // Request directions if origin is set
    if (userLocationRef.current) {
      requestDirections(userLocationRef.current, loc, selectedMode);
    }
  }, [selectedMode, setSearchedPlace]);

  const handleGpsSearch = useCallback(() => {
    if (!navigator.geolocation) return;

    if (navWatchIdRef.current != null) {
      navigator.geolocation.clearWatch(navWatchIdRef.current);
      navWatchIdRef.current = null;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        userLocationRef.current = loc;
        applyOrigin(loc, 'Your location', true);
        mapInstanceRef.current?.panTo(loc);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 20000 }
    );
  }, [applyOrigin]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const mapContainer = mapRef.current;
    if (!mapContainer) return undefined;
    const destLoc = (destPlace || searchedPlace)?.geometry?.location;
    
    // For start page without destination, try to use user location if available
    let initialCenter;
    if (destLoc) {
      initialCenter = {
        lat: typeof destLoc.lat === 'function' ? destLoc.lat() : destLoc.lat,
        lng: typeof destLoc.lng === 'function' ? destLoc.lng() : destLoc.lng,
      };
    } else if (!showDetailsPanel && userLocation) {
      // Start page with user location available
      initialCenter = userLocation;
    } else {
      // Default to Sri Lanka center
      initialCenter = { lat: 7.8731, lng: 80.7718 };
    }

    // Clear pending values now that they are consumed.
    if (pendingOriginLabel) setPendingOriginLabel('');
    if (pendingVehicle) setPendingVehicle(null);

    if (mapInstanceRef.current) mapInstanceRef.current.remove();
    const map = L.map(mapContainer, { zoomControl: false, attributionControl: false, scrollWheelZoom: false });
    mapInstanceRef.current = map;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      crossOrigin: true,
    }).addTo(map);
    const handleWheel = (event) => {
      if (event.ctrlKey) {
        map.scrollWheelZoom.enable();
        if (zoomOverlayRef.current) zoomOverlayRef.current.style.opacity = '0';
      } else {
        map.scrollWheelZoom.disable();
        if (zoomOverlayRef.current) {
          zoomOverlayRef.current.style.opacity = '1';
          window.clearTimeout(map.__zoomHintTimer);
          map.__zoomHintTimer = window.setTimeout(() => {
            if (zoomOverlayRef.current) zoomOverlayRef.current.style.opacity = '0';
          }, 1200);
        }
      }
    };
    mapContainer.addEventListener('wheel', handleWheel, { passive: true });
    map.setView([initialCenter.lat, initialCenter.lng], destLoc ? 12 : 7);
    requestAnimationFrame(() => {
      if (mapInstanceRef.current === map && mapContainer.isConnected) {
        map.invalidateSize();
      }
    });
    setMapReady(true);

    // Place destination marker — no route yet.
    if (destLoc) {
      destMarkerRef.current = L.marker([
        typeof destLoc.lat === 'function' ? destLoc.lat() : destLoc.lat,
        typeof destLoc.lng === 'function' ? destLoc.lng() : destLoc.lng,
      ]).addTo(map);
    }

    // Silently detect user location — place marker only, no route.
    if (userLocation) {
      applyOrigin(userLocation, 'Your location', Boolean(destLoc));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            applyOrigin(loc, 'Your location', Boolean(destLoc));
          },
          (err) => {
            // Show a helpful message if location is denied
            if (showDetailsPanel && !userLocationRef.current) {
              setTimeout(() => {
                setError('Location access denied. Please enter your starting location manually.');
              }, 500);
            }
          },
          { enableHighAccuracy: true, maximumAge: 30000, timeout: 20000 }
      );
    }
    return () => {
      routeRequestIdRef.current += 1;
      clearRouteOverlays();
      if (floodPollRef.current) clearInterval(floodPollRef.current);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      mapContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    if (!mapReady || showDetailsPanel || !navigator.geolocation) return;

    if (navWatchIdRef.current != null) {
      navigator.geolocation.clearWatch(navWatchIdRef.current);
    }

    navWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        userLocationRef.current = loc;
        placeOriginMarker(loc);
        
        // Since showDetailsPanel is false, we are actively navigating.
        // Pan the map to follow the user in real-time.
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(loc);
          if (typeof mapInstanceRef.current.setHeading === 'function' && pos.coords.heading != null && !Number.isNaN(pos.coords.heading)) {
            mapInstanceRef.current.setHeading(pos.coords.heading);
          }
        }
        
        updateNavigation(loc);
        findNearestHospital(loc);
        // Update crime label to show only the nearest ahead one
        updateNearestCrimeLabel(loc);
        // Update roadblock label to show only the nearest ahead one
        updateNearestRoadblockLabel(loc);
        if (!directionsResultRef.current) {
          const dest = destPlace || searchedPlace;
          const destLoc = dest?.geometry?.location;
          if (destLoc) {
            requestDirections(loc, destLoc, selectedMode);
          }
        }
      },
      (err) => {
        // Silently handle navigation watch errors
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 20000 }
    );

    return () => {
      if (navWatchIdRef.current != null) {
        navigator.geolocation.clearWatch(navWatchIdRef.current);
        navWatchIdRef.current = null;
      }
    };
  }, [mapReady, showDetailsPanel, destPlace, searchedPlace, destination, selectedMode, updateNavigation]);

  useEffect(() => {
    if (!mapInstanceRef.current || !originChosenRef.current) return;
    const { origin, destination: currentDestination } = activeRoutePairRef.current;
    if (!origin || !currentDestination) return;

    requestDirections(origin, currentDestination, selectedMode);
  }, [selectedMode]);

  useEffect(() => {
    if (searchedPlace) {
      setDestPlace(searchedPlace);
    }
  }, [searchedPlace]);

  useEffect(() => {
    setNavStepIndex(0);
    setNavArrived(false);
    if (userLocationRef.current) {
      updateNavigation(userLocationRef.current, 0);
    }
  }, [routes, selectedIdx, updateNavigation]);

  useEffect(() => {
    if (!mapInstanceRef.current || originChosenRef.current) return;
    const dest = destPlace || searchedPlace;
    const destLoc = dest?.geometry?.location;
    if (userLocationRef.current && destLoc) {
      originChosenRef.current = true;
      requestDirections(userLocationRef.current, destLoc, selectedMode);
    }
  }, [destPlace, searchedPlace, selectedMode]);

  const handleSwap = () => {
    const { origin, destination: currentDestination } = activeRoutePairRef.current;
    if (!origin || !currentDestination || !mapInstanceRef.current) return;

    const nextSwapped = !swapped;
    setSwapped(nextSwapped);
    setError(null);

    requestDirections(
      nextSwapped ? currentDestination : origin,
      nextSwapped ? origin : currentDestination,
      selectedMode
    );
  };

  const handleShare = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    const { origin, destination: currentDest } = activeRoutePairRef.current;
    let url = '';

    if (origin && currentDest) {
      const originLat = typeof origin.lat === 'function' ? origin.lat() : origin.lat;
      const originLng = typeof origin.lng === 'function' ? origin.lng() : origin.lng;
      const destLat = typeof currentDest.lat === 'function' ? currentDest.lat() : currentDest.lat;
      const destLng = typeof currentDest.lng === 'function' ? currentDest.lng() : currentDest.lng;
      
      const modeMap = { drive: 'fossgis_osrm_car', bike: 'fossgis_osrm_bike', walk: 'fossgis_osrm_foot' };
      const mode = modeMap[selectedMode] || 'fossgis_osrm_car';
      
      url = `https://www.openstreetmap.org/directions?engine=${mode}&route=${originLat}%2C${originLng}%3B${destLat}%2C${destLng}`;
    } else {
      const dest = destPlace || searchedPlace;
      if (dest?.geometry?.location) {
        const lat = typeof dest.geometry.location.lat === 'function' ? dest.geometry.location.lat() : dest.geometry.location.lat;
        const lng = typeof dest.geometry.location.lng === 'function' ? dest.geometry.location.lng() : dest.geometry.location.lng;
        url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
      } else if (destination) {
        url = `https://www.openstreetmap.org/search?query=${encodeURIComponent(destination)}`;
      }
    }

    const shareText = `Route to ${destination || 'location'}`;
    const fullText = url ? `${shareText}\n${url}` : shareText;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Direction route',
          text: shareText,
          url: url || undefined,
        });
        setActionMessage('Route shared.');
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullText);
        setActionMessage('Route copied to clipboard.');
      } else {
        // Fallback for older browsers or insecure contexts
        const textArea = document.createElement("textarea");
        textArea.value = fullText;
        textArea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          setActionMessage('Route copied to clipboard.');
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
          setActionMessage('Failed to share.');
        }
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // navigator.share throws an error if user cancels, so we show cancelled
      if (error.name === 'AbortError') {
        setActionMessage('Share cancelled.');
      } else {
        setActionMessage('Failed to share.');
      }
    }
  };

  const handleSave = async () => {
    const dest = destPlace || searchedPlace;
    if (dest) {
      try {
        await saveFavoritePlace(dest, 'work');
        setActionMessage('Saved');
      } catch (error) {
        console.error('Error saving favorite:', error);
        setActionMessage('Failed to save route to favorites.');
      }
    } else {
      const savedRoute = {
        destination,
        origin: userLocationRef.current,
        mode: selectedMode,
        updatedAt: new Date().toISOString(),
      };
      window.localStorage.setItem('savedDirectionRoute', JSON.stringify(savedRoute));
      setActionMessage('Saved');
    }
  };

  const handleStart = () => {
    // Keep the user's currently selected route (selectedIdx) —
    // do NOT override it with the shortest-distance route.

    setShowSearchBar(true);
    if (setActivePage) {
      setActivePage('start');
      setActionMessage('Opening start page.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const focusJourneyStart = useCallback(() => {
    if (!mapInstanceRef.current) return;

    const startLocation = originMarkerRef.current?.getLatLng()
      || userLocationRef.current
      || activeRoutePairRef.current.origin;

    if (!startLocation) return;

    mapInstanceRef.current.panTo(startLocation);
    mapInstanceRef.current.setZoom(18); // Zoom in for real-time navigation
  }, [selectedIdx]);

  useEffect(() => {
    if (!showDetailsPanel) {
      if (userLocationRef.current) {
        placeOriginMarker(userLocationRef.current);
      }
      // Re-draw the selected route so ETA labels (guarded by !showDetailsPanel)
      // are created now that we're on the start page
      if (directionsResultRef.current && mapInstanceRef.current) {
        drawSelectedRoute(selectedIdx);
      }
      // Always zoom into the user's location for real-time navigation
      focusJourneyStart();
    } else if (originMarkerRef.current) {
      mapInstanceRef.current?.removeLayer(originMarkerRef.current);
    }
  }, [showDetailsPanel]);

  const handleSafetyAlert = () => {
    const routePath = directionsResultRef.current?.routes?.[selectedIdx]?.overview_path || [];
    const selectedLeg = directionsResultRef.current?.routes?.[selectedIdx]?.legs?.[0];
    const freeMins = selectedLeg?.duration?.value ? Math.round(selectedLeg.duration.value / 60) : 0;
    const trafficMins = selectedLeg?.duration_in_traffic?.value
      ? Math.round(selectedLeg.duration_in_traffic.value / 60)
      : freeMins;
    const ratio = freeMins > 0 ? trafficMins / freeMins : 1;
    const trafficLevel = ratio >= 1.4 ? 'Heavy traffic' : ratio >= 1.15 ? 'Moderate traffic' : 'Light traffic';
    const delayMinutes = trafficMins > freeMins ? trafficMins - freeMins : 0;

    if (typeof setSafetyData === 'function') {
      setSafetyData({
        origin: originLabel || userLocationRef.current || null,
        destination,
        mode: selectedMode,
        routePath: routePath.map((point) => ({
          lat: typeof point.lat === 'function' ? point.lat() : point.lat,
          lng: typeof point.lng === 'function' ? point.lng() : point.lng,
        })),
        trafficInfo: {
          traffic: routes[selectedIdx]?.traffic || trafficLevel,
          durationMinutes: trafficMins,
          freeDurationMinutes: freeMins,
          delayMinutes,
          distance: routes[selectedIdx]?.distance || selectedLeg?.distance?.text || '--',
          summary: routes[selectedIdx]?.summary || directionsResultRef.current?.routes?.[selectedIdx]?.summary || '',
        },
      });
    }
    setActivePage && setActivePage('safety');
  };

  const handleAddStop = () => {
    setAddStopOpen(true);
  };
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const timer = setTimeout(() => {
      mapInstanceRef.current.invalidateSize();
    }, 500);
    return () => clearTimeout(timer);
  }, [addStopOpen]);

  const baseModeMinutes = selectedMode === 'drive'
    ? (selectedRouteMinutes || drivingMinutesRef.current || 215)
    : (drivingMinutesRef.current || selectedRouteMinutes || 215);

  const activeManeuver = getActiveManeuverStep();

  const isStartPage = !showDetailsPanel;
  const bannerTitle = isStartPage
    ? (navInstruction ? `${navInstruction}${navDistance ? ` in ${navDistance}` : ''}` : 'Calculating route...')
    : (navInstruction || 'Calculating route...');
  const mapHeight = showDetailsPanel ? (addStopOpen ? '450px' : '900px') : 'calc(100vh + 80px)';

  return (
    <div className="relative w-full overflow-hidden bg-[#edf7ff]" style={{ minHeight: '100vh' }}>
      {actionMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1A73E8',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 999999,
          fontWeight: 600,
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {actionMessage}
        </div>
      )}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <img src={middle} alt="Ocean background" className="h-full w-full object-cover scale-x-[1.7]" />
      </div>

      <div className="relative z-10 w-full">
        <div className="relative w-full" style={{ height: mapHeight, transition: 'height 0.35s ease' }}>
          <div ref={mapRef} className="h-full w-full shadow-[0_18px_50px_rgba(18,46,99,0.12)]" />
          {showDetailsPanel && !addStopOpen && (
            <button
              type="button"
              onClick={() => setActivePage && setActivePage('explore')}
              aria-label="Back to explore"
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 50,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#fff',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div
            ref={zoomOverlayRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 500,
              opacity: 0,
              pointerEvents: 'none',
              transition: 'opacity 0.3s ease',
              zIndex: 10,
            }}
          >
            Use Ctrl + scroll to zoom the map
          </div>
          <div
            className="absolute right-4 z-30"
            style={{ bottom: '200px', pointerEvents: 'none' }}
          >
            <button
              type="button"
              onClick={handleGpsSearch}
              aria-label="Use current location"
              style={{
                  pointerEvents: 'auto',
                  width: '45px',
                  height: '45px',
                  borderRadius: '16px',
                  border: 'none',
                  background: '#1A73E8',
                  boxShadow: '0 10px 24px rgba(26,115,232,0.28)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'absolute',        // anchor positioning
                  right: '0px',                // stick to right corner
                  bottom: 'var(--gps-margin, 8px)' // adjustable bottom margin
      
              }}
            >
              <img src={gpsIcon} alt="GPS search" style={{ width: '25px', height: '25px' }} />
            </button>
          </div>
          {!showDetailsPanel && (
            <div className="absolute left-1/2 top-6 z-[1000] w-[92%] max-w-[760px] -translate-x-1/2">
              <div className="flex items-center gap-3 sm:gap-4 rounded-2xl bg-white p-3 sm:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.18)] border border-slate-100">
                {/* Left: Maneuver Icon */}
                <div className="flex h-[62px] w-[62px] sm:h-[72px] sm:w-[72px] shrink-0 items-center justify-center rounded-xl bg-[#1A73E8] text-white shadow-sm">
                  {(() => {
                    if (navArrived) {
                      return (
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      );
                    }
                    const iconType = getManeuverIconType(activeManeuver?.step, navArrived);
                    if (iconType === 'roundabout') {
                      return (
                        <div className="relative flex items-center justify-center">
                          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.8 1.03 6.44 2.7L21 8" />
                            <polyline points="21 3 21 8 16 8" />
                          </svg>
                          {activeManeuver?.exit && (
                            <span className="absolute text-[11px] font-black">{activeManeuver.exit}</span>
                          )}
                        </div>
                      );
                    }
                    if (iconType === 'uturn') {
                      return (
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 10L4 5l5-5" />
                          <path d="M4 5h11a5 5 0 0 1 5 5v14" />
                        </svg>
                      );
                    }
                    if (iconType === 'sharp_left' || iconType === 'left') {
                      return (
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 4L4 9l5 5" />
                          <path d="M4 9h10a5 5 0 0 1 5 5v6" />
                        </svg>
                      );
                    }
                    if (iconType === 'slight_left') {
                      return (
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-25deg)' }}>
                          <path d="M12 4l-5 5h3v11h4V9h3l-5-5z" />
                        </svg>
                      );
                    }
                    if (iconType === 'sharp_right' || iconType === 'right') {
                      return (
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 4l5 5-5 5" />
                          <path d="M20 9H10a5 5 0 0 0-5 5v6" />
                        </svg>
                      );
                    }
                    if (iconType === 'slight_right') {
                      return (
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(25deg)' }}>
                          <path d="M12 4l-5 5h3v11h4V9h3l-5-5z" />
                        </svg>
                      );
                    }
                    return (
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 4l-5 5h3v11h4V9h3l-5-5z" />
                      </svg>
                    );
                  })()}
                </div>

                {/* Center: Instruction and Distance */}
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <span className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                    {navArrived
                      ? 'Arrived at destination'
                      : (navInstruction || activeManeuver?.instruction || bannerTitle || 'Follow highlighted route')}
                  </span>
                  {!navArrived && (
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {(navDistance || activeManeuver?.distanceText) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F0FE] text-[#1A73E8]">
                          {navDistance ? `in ${navDistance}` : `in ${activeManeuver.distanceText}`}
                        </span>
                      )}
                      {activeManeuver?.nextStep && (
                        <span className="text-xs text-slate-500 font-medium truncate max-w-[280px]">
                          Then {activeManeuver.nextStep.instructions || activeManeuver.nextStep.name}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Step navigation switcher */}
                {activeManeuver?.totalSteps > 1 && (
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    <button
                      type="button"
                      onClick={handleNavPrevStep}
                      disabled={activeManeuver.stepIndex === 0}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 text-base font-bold transition-colors"
                      title="Previous turn"
                    >
                      ‹
                    </button>
                    <span className="text-xs font-semibold text-slate-500 min-w-[32px] text-center">
                      {activeManeuver.stepIndex + 1}/{activeManeuver.totalSteps}
                    </span>
                    <button
                      type="button"
                      onClick={handleNavNextStep}
                      disabled={activeManeuver.stepIndex >= activeManeuver.totalSteps - 1}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 text-base font-bold transition-colors"
                      title="Next turn"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>


        {!showDetailsPanel && (
          <div className="flex items-center justify-center" style={{ marginTop: '150px', marginBottom: '150px', gap: '260px' }}>
            <button
              type="button"
              onClick={() => {
                setActivePage && setActivePage('explore');
              }}
              className="rounded-xl bg-[#e53e3e] px-12 py-4 text-lg font-semibold text-white hover:bg-[#c53030]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSafetyAlert}
              className="flex items-center gap-4 rounded-[14px] bg-[#FFD84D] px-8 py-5 text-lg font-extrabold text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition-transform duration-150 hover:scale-[1.01] hover:bg-[#ffcf2e]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E31B23] text-[18px] leading-none text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                !
              </span>
              <span>Safety Alert</span>
            </button>
          </div>
        )}

        <AddStopPanel
          isOpen={addStopOpen}
          onClose={() => setAddStopOpen(false)}
          directionsResultRef={directionsResultRef}
          selectedIdx={selectedIdx}
          mapInstanceRef={mapInstanceRef}
          poiMarkersRef={poiMarkersRef}
          onAddStop={handleAddWaypoint}
          currentStop={currentWaypoint}
        />

        {!showDetailsPanel && (
          <button
            type="button"
            onClick={() => setActivePage && setActivePage('direction')}
            aria-label="Back to direction"
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 50,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#fff',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}


        {showDetailsPanel && !addStopOpen && (
          <div style={{ maxWidth: '100%', margin: '0 auto', padding: 0 }}>
            {/* Loading indicator */}
            {loadingRoutes && (
              <div style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px',
                padding: '24px 32px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                zIndex: 99999, textAlign: 'center',
              }}>
                <div style={{
                  width: '40px', height: '40px', border: '4px solid #E8F3FF',
                  borderTop: '4px solid #1A73E8', borderRadius: '50%',
                  animation: 'spin 1s linear infinite', margin: '0 auto 12px',
                }} />
                <div style={{ color: '#122E63', fontWeight: 600, fontSize: '14px' }}>
                  Finding routes...
                </div>
                <style>{
                  `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`
                }</style>
              </div>
            )}
            {/* Slide toggle tab */}
            {!panelOpen && (
              <div
                onClick={() => setPanelOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', background: '#fff', borderRadius: '12px 12px 0 0',
                  padding: '6px 24px', boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
                  width: 'fit-content', margin: '0 auto',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </div>
            )}
            <div
              style={{
                overflow: 'hidden',
                maxHeight: panelOpen ? '1000px' : '0px',
                transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
            <div className="overflow-hidden rounded-[1px] border border-white/70 bg-white/95 shadow-[0_30px_80px_rgba(18,46,99,0.18)] backdrop-blur-md">
              <div className="px-5 py-4 sm:px-8">
                {/* Heading + share/close icons row */}
                <div className="flex items-center justify-between mb-12 mt-12">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {MODE_CONFIGS.find((m) => m.key === selectedMode)?.label || 'Drive'}
                    {fallbackMode && (
                      <span className="ml-2 text-xs font-normal text-slate-400">(driving route shown)</span>
                    )}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handleShare} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200" aria-label="Share route">
                      <img src={shareIcon} alt="Share" className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={() => setPanelOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200" aria-label="Close">
                      <img src={closeIcon} alt="Close" className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Vehicle selector row */}
                <div className="mt-12 flex items-center justify-between gap-4 w-full overflow-x-auto">
                  {MODE_CONFIGS.map((mode) => {
                    const active = mode.key === selectedMode;
                    const timeLabel = active
                      ? (selectedRoute?.duration || '--')
                      : modeMinutesCache.current[mode.key]
                        ? formatCompactDuration(modeMinutesCache.current[mode.key])
                        : estimateModeDuration(drivingMinutesRef.current || baseModeMinutes, mode.multiplier);
                    return (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => {
                          setRoutes([]);
                          setFallbackMode(false);
                          setSelectedMode(mode.key);
                        }}
                        className="flex flex-col items-center gap-1 bg-transparent border-none outline-none cursor-pointer flex-1"
                      >
                        <div className="flex items-center gap-3">
                          <img src={mode.icon} alt={mode.label} className="h-6 w-5 object-contain" />
                          <span className="text-medium font-medium text-slate-700 whitespace-nowrap">{timeLabel}</span>
                        </div>
                        {/* thin blue underline on active */}
                        <div style={{ height: '3.4px', width: '100%', marginTop: '36px', borderRadius: '2px', background: active ? '#1A73E8' : 'transparent' }} />
                      </button>
                    );
                  })}
                </div>

                {/* black line below entire selector row */}
                <div style={{ height: '1.5px', background: '#000', marginTop: '1px', marginBottom: '32px', borderRadius: '1px' }} />
              </div>

              <div className="grid gap-4 px-5 py-5 sm:px-16">
                {routes.length > 0 && selectedRoute && (
                  <div className="pt-1">
                    {/* Line 2: dynamic route description */}
                    <div className="mt-4 text-medium text-slate-600">
                      {(() => {
                        const full = describeRoute(selectedRoute, selectedIdx, routes);
                        const viaIdx = full.indexOf(' · via ');
                        const firstLine = viaIdx !== -1 ? full.slice(0, viaIdx) : full;
                        const secondLine = viaIdx !== -1 ? full.slice(viaIdx + 3) : '';
                        return (
                          <>
                            <p>{firstLine}</p>
                            {secondLine && <p className="text-slate-500">{secondLine}</p>}
                          </>
                        );
                      })()}
                      {loadingRoutes && <span className="text-slate-400 text-xs">Updating...</span>}
                    </div>

                    {currentWaypoint && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#EFF6FF',
                        border: '1px solid #93C5FD',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        marginTop: '12px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1E40AF', fontWeight: 600 }}>
                          <span>📍 Stop on route:</span>
                          <span style={{ color: '#111827' }}>{currentWaypoint.name}</span>
                          {currentWaypoint.distanceFromRouteText && (
                            <span style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 500 }}>({currentWaypoint.distanceFromRouteText})</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveWaypoint}
                          style={{
                            background: '#DBEAFE',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#1E40AF',
                            fontWeight: 700,
                            fontSize: '12px',
                          }}
                          title="Remove stop"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Line 3: toll + petrol */}
                    {(() => {
                      const { petrol } = buildRouteDescription(selectedRoute, selectedIdx, routes);
                      return (
  <p className="mt-4 text-sm text-slate-500 flex items-center gap-24">
    {/* Left side: icon + label */}
    <span className="flex items-center gap-2">
      <img src={coins} alt="Tolls icon" className="w-6 h-6 opacity-70" />
      <span>Tolls</span>
    </span>

    {/* Right side: petrol saving */}
    {petrol > 0 && <span>Saves ~{petrol}% petrol</span>}
  </p>

                      );
                    })()}

                    {/* Line 4: four action buttons */}
                    <div className="mt-12 flex items-center justify-between gap-4 w-full overflow-x-auto">
                      <button type="button" onClick={handleStart} className="flex-1 rounded-xl bg-[#1A73E8] py-4 px-2 text-medium font-semibold text-white hover:bg-[#165fbe] whitespace-nowrap">Start</button>
                      <button type="button" onClick={handleAddStop} className="flex-1 rounded-xl bg-[#1A73E8] py-4 px-2 text-medium font-semibold text-white hover:bg-[#165fbe] whitespace-nowrap">Add Stop</button>
                      <button type="button" onClick={handleShare} className="flex-1 rounded-xl bg-[#1A73E8] py-4 px-2 text-medium font-semibold text-white hover:bg-[#165fbe] whitespace-nowrap">Share</button>
                      <button type="button" onClick={handleSave} className="flex-1 rounded-xl bg-[#1A73E8] py-4 px-2 text-medium font-semibold text-white hover:bg-[#165fbe] whitespace-nowrap">Save</button>
                    </div>
                  </div>
                )}

              </div>
            </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          background: '#fff', borderRadius: '16px', padding: '24px 36px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)', zIndex: 99999,
          maxWidth: '400px', textAlign: 'center',
        }}>
          <div style={{
            color: '#e53e3e', fontWeight: 600, fontSize: '16px', marginBottom: '16px',
          }}>
            ⚠️ Route Error
          </div>
          <div style={{
            color: '#4a5568', fontSize: '14px', lineHeight: '1.5',
          }}>
            {error}
          </div>
          <button
            onClick={() => setError(null)}
            style={{
              marginTop: '20px', padding: '10px 24px',
              background: '#1A73E8', color: '#fff',
              border: 'none', borderRadius: '8px',
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            OK
          </button>
        </div>
      )}

      {/* Location panel - inside map area, top right */}
      {!isStartPage && !addStopOpen && (
        (() => {
          const content = (
            <div
              className="p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
              style={document.getElementById('header-search-portal') ? { width: '100%', minHeight: '150px', zIndex: 50, position: 'absolute', top: '-15px', right: 0 } : { position: 'absolute', top:'-70px', right: '64px', width: '880px', minHeight: '150px', zIndex: 50 }}
            >
              <div className="flex items-center gap-3 pb-4">
                <img
                  src={swapped ? redPinIcon : blueLocationIcon}
                  alt="Current location"
                  className="w-5 h-5 shrink-0"
                  style={{ width: '20px', height: '20px', objectFit: 'contain', display: 'block' }}
                />
                <LocationInput
                  placeholder="Your location"
                  initialValue={pendingOriginLabel || ''}
                  onSelect={onOriginSelect}
                  showGps
                  gpsDisplayValue="Your Location"
                  onGpsSelect={() => {
                    if (!navigator.geolocation) return;
                    if (navWatchIdRef.current != null) {
                      navigator.geolocation.clearWatch(navWatchIdRef.current);
                      navWatchIdRef.current = null;
                    }
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                        userLocationRef.current = loc;
                        applyOrigin(loc, 'Your location', true);
                      },
                      () => {},
                      { enableHighAccuracy: true, maximumAge: 30000, timeout: 20000 }
                    );
                  }}
                />
              </div>
              <div className="flex items-center gap-3 py-2">
                <img src={threeDots} alt="Separator" className="w-7 h-7" />
                <hr style={{ width: '90%', border: 'none', borderTop: '3px solid #000' }} />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <img
                  src={swapped ? blueLocationIcon : redPinIcon}
                  alt="Searched location"
                  className="w-5 h-5 shrink-0"
                  style={{ width: '20px', height: '20px', objectFit: 'contain', display: 'block' }}
                />
                <LocationInput
                  placeholder={destPlace || searchedPlace ? destination : "Enter destination first"}
                  initialValue={destination}
                  onSelect={onDestSelect}
                />
              </div>
              <div className="absolute right-4 top-1/3 z-10" onClick={handleSwap} style={{ cursor: 'pointer' }}>
                <img src={upDown} alt="Swap" className="w-6 h-12 object-contain opacity-90" />
              </div>
              <div className="absolute top-3 right-4">
                <img src={threeDots} alt="Menu" className="w-7 h-7" />
              </div>
            </div>
          );
          const portalContainer = document.getElementById('header-search-portal');
          return portalContainer ? createPortal(content, portalContainer) : content;
        })()
      )}
    </div>
  );
};

export default Direction;
