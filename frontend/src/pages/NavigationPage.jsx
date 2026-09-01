import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useUIContext } from '../contexts/UIContext';
import { useLocationContext } from '../contexts/LocationContext';
import { useNavigationContext } from '../contexts/NavigationContext';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { useLeafletMap } from '../hooks/useLeafletMap';
import { useRouting } from '../hooks/useRouting';
import { useSafetyAlerts } from '../hooks/useSafetyAlerts';
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
  const userLocationRef = useRef(null);
  const navWatchIdRef = useRef(null);

  const mapContainerRef = useRef(null);
  const { mapInstanceRef, mapReady } = useLeafletMap(mapContainerRef, { zoom: 18 });

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

  const updateNavigation = useCallback((loc, forceStep = null) => {
    if (!routing.routes || !routing.routes[routing.selectedIdx]) return;
    if (forceStep !== null) setNavStepIndex(forceStep);
  }, [routing.routes, routing.selectedIdx]);

  useEffect(() => {
    if (!mapReady || !navigator.geolocation) return;

    if (navWatchIdRef.current != null) {
      navigator.geolocation.clearWatch(navWatchIdRef.current);
    }

    navWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        userLocationRef.current = loc;

        if (originMarkerRef.current) {
          originMarkerRef.current.setLatLng(loc);
        } else if (mapInstanceRef.current) {
          originMarkerRef.current = L.marker(loc, {
            icon: getNavigationMarkerIcon(),
            zIndexOffset: 999
          }).addTo(mapInstanceRef.current);
        }
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(loc);
        }
        
        updateNavigation(loc);
        safetyAlerts.findNearestHospital(loc);
        safetyAlerts.updateNearestCrimeLabel(loc);
        safetyAlerts.updateNearestRoadblockLabel(loc);
        
        if (!routing.directionsResultRef.current) {
          const destLoc = searchedPlace?.geometry?.location || searchedPlace?.location;
          if (destLoc) {
            routing.requestDirections(loc, destLoc, selectedMode);
          }
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => {
      if (navWatchIdRef.current != null) {
        navigator.geolocation.clearWatch(navWatchIdRef.current);
        navWatchIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, searchedPlace, selectedMode, updateNavigation]);

  useEffect(() => {
    if (routing.directionsResultRef.current && mapInstanceRef.current) {
      const overviewPath = routing.directionsResultRef.current.routes[routing.selectedIdx]?.overview_path;
      if (overviewPath) {
        const destName = searchedPlace?.displayName || searchedPlace?.name || '';
        safetyAlerts.checkAndDrawFloodLabel(overviewPath, destName);
        safetyAlerts.checkAndDrawCrimeLabels(overviewPath);
        safetyAlerts.checkAndDrawRoadblockLabels(overviewPath);
        if (safetyAlerts.floodPollRef.current) clearInterval(safetyAlerts.floodPollRef.current);
        safetyAlerts.floodPollRef.current = setInterval(() => safetyAlerts.checkAndDrawFloodLabel(overviewPath, destName), 5 * 60 * 1000);
      }
    }
    return () => safetyAlerts.clearAllSafetyOverlays();
  }, [routing.directionsResultRef.current, routing.selectedIdx, safetyAlerts]);

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
        destination: searchedPlace?.displayName || searchedPlace?.name || '',
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

  const getActiveManeuverStep = useCallback(() => {
    if (!routing.routes || !routing.routes[routing.selectedIdx] || !routing.routes[routing.selectedIdx].steps) return null;
    const steps = routing.routes[routing.selectedIdx].steps;
    if (navStepIndex >= steps.length) return null;
    const step = steps[navStepIndex];
    return {
      label: step.maneuver?.instruction || step.name || 'Continue',
      html: step.maneuver?.instruction || '',
      isNext: true,
      lat: step.maneuver?.location?.[1],
      lng: step.maneuver?.location?.[0]
    };
  }, [routing.routes, routing.selectedIdx, navStepIndex]);

  const activeManeuver = getActiveManeuverStep();
  const currentTurnInstruction = activeManeuver?.label || '';
  const bannerTitle = currentTurnInstruction ? `${currentTurnInstruction}` : 'Calculating route...';

  return (
    <div className="relative w-full overflow-hidden bg-[#edf7ff]" style={{ minHeight: '100vh' }}>
      <div className="relative z-10 w-full">
        <div className="relative w-full" style={{ height: 'calc(100vh + 80px)' }}>
          <div ref={mapContainerRef} className="h-full w-full shadow-[0_18px_50px_rgba(18,46,99,0.12)]" />
          
          <TurnBanner
            navArrived={navArrived}
            currentTurnInstruction={currentTurnInstruction}
            bannerTitle={bannerTitle}
            navDistance=""
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
