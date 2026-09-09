import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useUIContext } from '../contexts/UIContext';
import { useLocationContext } from '../contexts/LocationContext';
import { useNavigationContext } from '../contexts/NavigationContext';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { useLeafletMap } from '../hooks/useLeafletMap';
import { useRouting } from '../hooks/useRouting';
import { useSafetyAlerts } from '../hooks/useSafetyAlerts';
import { haversineDistance, formatDistance } from '../utils/geo';
import L from 'leaflet';
import TurnBanner from '../components/Direction/TurnBanner';
import NavigationControls from '../components/Direction/NavigationControls';
import { getNavigationMarkerIcon } from '../utils/leafletSetup';

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
  
  const originMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const userLocationRef = useRef(null);
  const navWatchIdRef = useRef(null);

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

  const updateNavigation = useCallback((loc) => {
    if (!loc) return;
    const activeRoute = routing.routes?.[routing.selectedIdx] || routing.directionsResultRef.current?.routes?.[routing.selectedIdx]?.legs?.[0];
    const steps = activeRoute?.steps || [];
    const dest = getDestinationCoords();

    // Check if arrived at destination
    if (dest) {
      const distToDest = haversineDistance(loc.lat, loc.lng, dest.lat, dest.lng);
      if (distToDest <= 35) {
        setNavArrived(true);
        return;
      }
    }

    // Advance to next step if user gets within 30m of the maneuver point
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
  }, [routing.routes, routing.directionsResultRef.current, routing.selectedIdx, getDestinationCoords]);

  // Initialize route, markers and start GPS watching
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const dest = getDestinationCoords();
    const origin = getInitialOrigin();
    userLocationRef.current = origin;

    // Draw origin marker
    if (originMarkerRef.current) originMarkerRef.current.remove();
    originMarkerRef.current = L.marker([origin.lat, origin.lng], {
      icon: getNavigationMarkerIcon(),
      zIndexOffset: 999,
    }).addTo(mapInstanceRef.current);

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

      mapInstanceRef.current.setView([origin.lat, origin.lng], 17);

      // Load directions immediately
      routing.requestDirections(origin, dest, selectedMode);
    }

    // Set up real-time GPS tracking
    if (navigator.geolocation) {
      if (navWatchIdRef.current != null) {
        navigator.geolocation.clearWatch(navWatchIdRef.current);
      }

      navWatchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          userLocationRef.current = loc;

          if (originMarkerRef.current) {
            originMarkerRef.current.setLatLng(loc);
          }
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(loc);
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

    return () => {
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
    if (routing.directionsResultRef.current && mapInstanceRef.current) {
      const overviewPath = routing.directionsResultRef.current.routes[routing.selectedIdx]?.overview_path;
      if (overviewPath) {
        const destName = searchedPlace?.displayName || searchedPlace?.name || 'Destination';
        const destinationCoords = getDestinationCoords();
        safetyAlerts.checkAndDrawFloodLabel(overviewPath, destName);
        safetyAlerts.checkAndDrawWeatherLabels(overviewPath, destName, destinationCoords);
        safetyAlerts.checkAndDrawCrimeLabels(overviewPath);
        safetyAlerts.checkAndDrawRoadblockLabels(overviewPath);
        if (safetyAlerts.floodPollRef.current) clearInterval(safetyAlerts.floodPollRef.current);
        safetyAlerts.floodPollRef.current = setInterval(() => safetyAlerts.checkAndDrawFloodLabel(overviewPath, destName), 5 * 60 * 1000);
      }
    }
    return () => safetyAlerts.clearAllSafetyOverlays();
  }, [routing.directionsResultRef.current, routing.selectedIdx, safetyAlerts, searchedPlace]);

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
    const activeRoute = routing.routes?.[routing.selectedIdx] || routing.directionsResultRef.current?.routes?.[routing.selectedIdx]?.legs?.[0];
    const steps = activeRoute?.steps || [];
    if (!steps.length) return null;

    const safeIndex = Math.min(navStepIndex, steps.length - 1);
    const step = steps[safeIndex];
    if (!step) return null;

    const label = step.maneuver?.instruction || step.instructions || (step.name ? `Continue on ${step.name}` : 'Continue on route');
    let distText = step.distance?.text || '';

    // Calculate live distance if current GPS is known
    if (userLocationRef.current && step.start_location) {
      const d = haversineDistance(
        userLocationRef.current.lat,
        userLocationRef.current.lng,
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
  }, [routing.routes, routing.directionsResultRef.current, routing.selectedIdx, navStepIndex]);

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
          />
        </div>
        
        <NavigationControls
          onCancel={() => appNavigate('direction')}
          onSafetyAlert={handleSafetyAlertClick}
        />
      </div>
    </div>
  );
}
