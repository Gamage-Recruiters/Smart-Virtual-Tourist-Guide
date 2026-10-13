import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useUIContext } from '../contexts/UIContext';
import { useLocationContext } from '../contexts/LocationContext';
import { useNavigationContext } from '../contexts/NavigationContext';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { useLeafletMap } from '../hooks/useLeafletMap';
import { useRouting } from '../hooks/useRouting';
import { useSafetyAlerts } from '../hooks/useSafetyAlerts';
import { haversineDistance, formatDistance, calculateBearing } from '../utils/geo';
import L from 'leaflet';
import TurnBanner from '../components/Direction/TurnBanner';
import NavigationControls from '../components/Direction/NavigationControls';
import { getNavigationArrowIcon } from '../utils/leafletSetup';
import { LocateFixed } from 'lucide-react';

export default function NavigationPage() {
  const { setTitle, setShowSearchBar } = useUIContext();
  const { searchedPlace, userLocation } = useLocationContext();
  const { pendingVehicle, setEtaData, setSafetyData } = useNavigationContext();
  const appNavigate = useAppNavigate();
  const appNavigateRef = useRef(appNavigate);
  const setTitleRef = useRef(setTitle);
  const setEtaDataRef = useRef(setEtaData);

  useEffect(() => { appNavigateRef.current = appNavigate; }, [appNavigate]);
  useEffect(() => { setTitleRef.current = setTitle; }, [setTitle]);
  useEffect(() => { setEtaDataRef.current = setEtaData; }, [setEtaData]);

  useEffect(() => {
    setShowSearchBar(true);
    return () => setShowSearchBar(false);
  }, [setShowSearchBar]);

  const [navStepIndex, setNavStepIndex] = useState(0);
  const [navArrived, setNavArrived] = useState(false);
  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [isTracking, setIsTracking] = useState(true);
  
  const originMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const userLocationRef = useRef(null);
  const navWatchIdRef = useRef(null);
  const lastHeadingRef = useRef(0);
  const isTrackingRef = useRef(true);

  const setTrackingStatus = useCallback((status) => {
    setIsTracking(status);
    isTrackingRef.current = status;
  }, []);

  const mapContainerRef = useRef(null);
  const { mapInstanceRef, mapReady } = useLeafletMap(mapContainerRef, { zoom: 17 });

  const selectedMode = (() => {
    const map = { bus: 'transit', bike: 'bike', car: 'drive', man: 'walk' };
    return (pendingVehicle && map[pendingVehicle]) || 'drive';
  })();

  const routing = useRouting(mapInstanceRef, {
    showDetailsPanel: false,
    selectedMode,
    setEtaData,
    appNavigateRef,
    setTitleRef,
    setEtaDataRef
  });

  const safetyAlerts = useSafetyAlerts(mapInstanceRef, false);

  // Extract destination coordinates robustly
  const getDestinationCoords = useCallback(() => {
    const loc = searchedPlace?.geometry?.location || searchedPlace?.location || searchedPlace;
    if (loc) {
      const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
      const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
      if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    // Check savedDirectionRoute from localStorage as fallback
    try {
      const saved = JSON.parse(localStorage.getItem('savedDirectionRoute') || 'null');
      if (saved?.destination) {
        const dest = saved.destination?.geometry?.location || saved.destination?.location || saved.destination;
        const lat = typeof dest?.lat === 'function' ? dest.lat() : dest?.lat;
        const lng = typeof dest?.lng === 'function' ? dest.lng() : dest?.lng;
        if (typeof lat === 'number' && typeof lng === 'number') {
          return { lat, lng };
        }
      }
    } catch { /* ignore */ }
    return null;
  }, [searchedPlace]);

  // Extract origin coordinates
  const getInitialOrigin = useCallback(() => {
    if (userLocation) {
      const lat = typeof userLocation.lat === 'function' ? userLocation.lat() : userLocation.lat;
      const lng = typeof userLocation.lng === 'function' ? userLocation.lng() : userLocation.lng;
      if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    // Check savedDirectionRoute origin
    try {
      const saved = JSON.parse(localStorage.getItem('savedDirectionRoute') || 'null');
      if (saved?.origin) {
        const o = saved.origin?.geometry?.location || saved.origin?.location || saved.origin;
        const lat = typeof o?.lat === 'function' ? o.lat() : o?.lat;
        const lng = typeof o?.lng === 'function' ? o.lng() : o?.lng;
        if (typeof lat === 'number' && typeof lng === 'number') {
          return { lat, lng };
        }
      }
    } catch { /* ignore */ }
    // Default Colombo center fallback
    return { lat: 6.9271, lng: 79.8612 };
  }, [userLocation]);

  // Extract waypoints from localStorage
  const getWaypoints = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedDirectionRoute') || 'null');
      return saved?.waypoints || [];
    } catch { return []; }
  }, []);

  const updateNavigation = useCallback((loc) => {
    if (!loc) return;
    const waypoints = getWaypoints();
    const dest = getDestinationCoords();
    const allTargets = [...waypoints, dest].filter(Boolean);

    // Check if arrived at current leg target
    if (currentLegIndex < allTargets.length) {
      const nextTarget = allTargets[currentLegIndex];
      const distToTarget = haversineDistance(loc.lat, loc.lng, nextTarget.lat, nextTarget.lng);
      if (distToTarget <= 50) {
        if (currentLegIndex === allTargets.length - 1) {
          setNavArrived(true);
          return;
        } else {
          setCurrentLegIndex(prev => prev + 1);
          setNavStepIndex(0); // Reset step index for next leg
          return;
        }
      }
    }

    // Advance step within current leg
    const activeRoute = routing.routes?.[routing.selectedIdx];
    const steps = activeRoute?.legs?.[currentLegIndex]?.steps || activeRoute?.steps || [];
    if (steps.length > 0) {
      setNavStepIndex((currentIdx) => {
        if (currentIdx >= steps.length - 1) return currentIdx;
        const currentStep = steps[currentIdx];
        const stepLoc = currentStep.start_location || currentStep.location;
        if (stepLoc?.lat && stepLoc?.lng) {
          const distToStep = haversineDistance(loc.lat, loc.lng, stepLoc.lat, stepLoc.lng);
          if (distToStep < 30) {
            return currentIdx + 1;
          }
        }
        return currentIdx;
      });
    }
  }, [routing.routes, routing.selectedIdx, currentLegIndex, getDestinationCoords, getWaypoints]);

  // Initialize route, markers and start GPS watching
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const handleDragStart = () => setTrackingStatus(false);
    map.on('dragstart', handleDragStart);

    const dest = getDestinationCoords();
    const origin = getInitialOrigin();
    userLocationRef.current = origin;

    // Draw origin marker
    if (originMarkerRef.current) originMarkerRef.current.remove();
    originMarkerRef.current = L.marker([origin.lat, origin.lng], {
      icon: getNavigationArrowIcon(lastHeadingRef.current),
      zIndexOffset: 999,
    }).addTo(map);

    // Draw destination marker
    if (dest) {
      if (destMarkerRef.current) destMarkerRef.current.remove();
      destMarkerRef.current = L.marker([dest.lat, dest.lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      }).addTo(mapInstanceRef.current);

      if (isTrackingRef.current) {
        mapInstanceRef.current.setView([origin.lat, origin.lng], 19);
      }

      // Load directions immediately
      const waypoints = getWaypoints();
      if (waypoints.length > 0) {
        routing.requestDirectionsWithWaypoints(origin, waypoints, dest, selectedMode);
      } else {
        routing.requestDirections(origin, dest, selectedMode);
      }
    }

    // Set up real-time GPS tracking
    if (navigator.geolocation) {
      if (navWatchIdRef.current != null) {
        navigator.geolocation.clearWatch(navWatchIdRef.current);
      }

      navWatchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          
          let newHeading = lastHeadingRef.current;
          if (pos.coords.heading !== null && !isNaN(pos.coords.heading)) {
            newHeading = pos.coords.heading;
          } else if (userLocationRef.current) {
            const dist = haversineDistance(userLocationRef.current.lat, userLocationRef.current.lng, loc.lat, loc.lng);
            if (dist > 1.5) {
              newHeading = calculateBearing(userLocationRef.current.lat, userLocationRef.current.lng, loc.lat, loc.lng);
            }
          }
          lastHeadingRef.current = newHeading;
          userLocationRef.current = loc;

          if (originMarkerRef.current) {
            originMarkerRef.current.setLatLng(loc);
            originMarkerRef.current.setIcon(getNavigationArrowIcon(newHeading));
          }
          if (mapInstanceRef.current && isTrackingRef.current) {
            mapInstanceRef.current.setView(loc, 19, { animate: true });
          }

          updateNavigation(loc);
          safetyAlerts.findNearestHospital(loc);

          // If directions weren't loaded yet, request them now with precise GPS
          if (!routing.directionsResultRef.current && dest) {
            routing.requestDirections(loc, dest, selectedMode);
          }
        },
        (err) => {
          console.warn('[NavigationPage] Geolocation watch warning:', err.message);
        },
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      );
    }
    const mapInstance = mapInstanceRef.current;

    return () => {
      if (mapInstance) {
        mapInstance.off('dragstart', handleDragStart);
      }
      if (navWatchIdRef.current != null) {
        navigator.geolocation.clearWatch(navWatchIdRef.current);
        navWatchIdRef.current = null;
      }
      if (destMarkerRef.current) {
        destMarkerRef.current.remove();
        destMarkerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, selectedMode]);

  // Update safety overlays when route changes
  useEffect(() => {
    if (routing.routes?.[routing.selectedIdx] && mapInstanceRef.current) {
      const overviewPath = routing.routes[routing.selectedIdx]?.overview_path;
      if (overviewPath) {
        const destName = searchedPlace?.displayName || searchedPlace?.name || 'Destination';
        const destinationCoords = getDestinationCoords();
        safetyAlerts.checkAndDrawFloodLabel(overviewPath, destName);
        safetyAlerts.checkAndDrawWeatherLabels(overviewPath, destName, destinationCoords);
        safetyAlerts.checkAndDrawCrimeLabels(overviewPath);
        safetyAlerts.checkAndDrawRoadblockLabels(overviewPath);
        const { floodPollRef } = safetyAlerts;
        if (floodPollRef.current) clearInterval(floodPollRef.current);
        floodPollRef.current = setInterval(() => safetyAlerts.checkAndDrawFloodLabel(overviewPath, destName), 5 * 60 * 1000);
      }
    }
    return () => safetyAlerts.clearAllSafetyOverlays();
  }, [routing.routes, routing.selectedIdx, safetyAlerts, searchedPlace, getDestinationCoords]);

  const handleSafetyAlertClick = () => {
    const routePath = routing.directionsResultRef.current?.routes?.[routing.selectedIdx]?.overview_path || [];
    const selectedLeg = routing.directionsResultRef.current?.routes?.[routing.selectedIdx]?.legs?.[0];
    const freeMins = selectedLeg?.duration?.value ? Math.round(selectedLeg.duration.value / 60) : 0;
    const trafficMins = selectedLeg?.duration_in_traffic?.value ? Math.round(selectedLeg.duration_in_traffic.value / 60) : freeMins;
    const ratio = freeMins > 0 ? trafficMins / freeMins : 1;
    const trafficLevel = ratio >= 1.4 ? 'Heavy traffic' : ratio >= 1.15 ? 'Moderate traffic' : 'Light traffic';
    const delayMinutes = trafficMins > freeMins ? trafficMins - freeMins : 0;

    if (typeof setSafetyData === 'function') {
      setSafetyData({
        origin: userLocationRef.current || null,
        destination: searchedPlace?.displayName || searchedPlace?.name || 'Destination',
        destinationCoords: getDestinationCoords(),
        mode: selectedMode,
        routePath: routePath.map((point) => ({
          lat: typeof point.lat === 'function' ? point.lat() : point.lat,
          lng: typeof point.lng === 'function' ? point.lng() : point.lng,
        })),
        trafficInfo: {
          traffic: routing.routes[routing.selectedIdx]?.traffic || trafficLevel,
          durationMinutes: trafficMins,
          freeDurationMinutes: freeMins,
          delayMinutes,
          distance: routing.routes[routing.selectedIdx]?.distance || selectedLeg?.distance?.text || '--',
          summary: routing.routes[routing.selectedIdx]?.summary || routing.directionsResultRef.current?.routes?.[routing.selectedIdx]?.summary || '',
        },
      });
    }
    appNavigate('safety');
  };

  // Resolve active maneuver step from route data
  const getActiveManeuverStep = useCallback(() => {
    const selectedRoute = routing.routes?.[routing.selectedIdx];
    const steps = selectedRoute?.legs?.[currentLegIndex]?.steps || selectedRoute?.steps || [];
    if (!steps.length) return null;

    const safeIndex = Math.min(navStepIndex, steps.length - 1);
    const step = steps[safeIndex];
    if (!step) return null;

    const label = step.maneuver?.instruction || step.instructions || (step.name ? `Continue on ${step.name}` : 'Continue on route');
    let distText = step.distance?.text || '';

    // Calculate live distance if current GPS is known
    if (userLocation && step.start_location) {
      const d = haversineDistance(
        userLocation.lat,
        userLocation.lng,
        step.start_location.lat,
        step.start_location.lng
      );
      if (d > 0 && d < 100000) {
        distText = formatDistance(d);
      }
    }

    return {
      label,
      distance: distText,
      stepIndex: safeIndex,
      totalSteps: steps.length,
      isNext: safeIndex < steps.length - 1,
    };
  }, [routing.routes, routing.selectedIdx, currentLegIndex, navStepIndex, userLocation]);

  const activeManeuver = getActiveManeuverStep();
  const currentTurnInstruction = activeManeuver?.label || '';
  const currentTurnDistance = activeManeuver?.distance || '';
  const bannerTitle = routing.loadingRoutes
    ? 'Calculating route...'
    : (routing.error ? routing.error : (currentTurnInstruction || 'Follow route to destination'));

  return (
    <div className="relative w-full overflow-hidden bg-[#edf7ff]" style={{ minHeight: '100vh' }}>
      <div className="relative z-10 w-full">
        <div className="relative w-full" style={{ height: 'calc(100vh + 80px)' }}>
          <div ref={mapContainerRef} className="h-full w-full shadow-[0_18px_50px_rgba(18,46,99,0.12)]" />
          
          <TurnBanner
            navArrived={navArrived}
            currentTurnInstruction={currentTurnInstruction}
            bannerTitle={bannerTitle}
            navDistance={currentTurnDistance}
            stepIndex={activeManeuver ? activeManeuver.stepIndex + 1 : 1}
            totalSteps={activeManeuver?.totalSteps || 0}
            onPrevStep={() => setNavStepIndex((i) => Math.max(0, i - 1))}
            onNextStep={() => setNavStepIndex((i) => Math.min((activeManeuver?.totalSteps || 1) - 1, i + 1))}
            legLabel={
              getWaypoints().length > 0
                ? (currentLegIndex < getWaypoints().length
                  ? `Heading to Stop ${currentLegIndex + 1}`
                  : 'Heading to Destination')
                : null
            }
          />
          
          {!isTracking && (
            <div className="absolute z-[1000] bottom-[220px] right-4 pointer-events-none">
              <button
                type="button"
                onClick={() => {
                  setTrackingStatus(true);
                  if (userLocationRef.current && mapInstanceRef.current) {
                    mapInstanceRef.current.setView(userLocationRef.current, 19, { animate: true });
                  }
                }}
                style={{ pointerEvents: 'auto', width: '50px', height: '50px', borderRadius: '25px', border: 'none', background: '#1A73E8', boxShadow: '0 4px 12px rgba(26,115,232,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                aria-label="Re-center"
              >
                <LocateFixed size={24} color="#fff" />
              </button>
            </div>
          )}
        </div>
        
        <NavigationControls
          onCancel={() => appNavigate('direction')}
          onSafetyAlert={handleSafetyAlertClick}
        />
      </div>
    </div>
  );
}
