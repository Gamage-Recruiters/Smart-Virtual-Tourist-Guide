import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePageTitle } from '../contexts/PageTitleContext';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { useLeafletMap } from '../hooks/useLeafletMap';
import { useRouting } from '../hooks/useRouting';
import { usePOISearch } from '../hooks/usePOISearch';
import L from 'leaflet';
import LocationInputPanel from '../components/Direction/LocationInputPanel';
import ModeSelector from '../components/Direction/ModeSelector';
import RouteCard from '../components/Direction/RouteCard';
import AddStopPanel from '../components/Direction/AddStopPanel';
import { saveFavoritePlace } from '../services/api';
import middle from '../assets/middle.png';
import gpsIcon from '../assets/gpsSearch.png';
import blueLocationIcon from '../assets/directionCircle.png';
import { getBlueMarkerIcon, getNavigationMarkerIcon } from '../utils/leafletSetup';

export default function DirectionPage() {
  const { searchedPlace, userLocation, pendingOriginLabel, pendingVehicle, setPendingOriginLabel, setPendingVehicle, setTitle, setEtaData, setSearchedPlace, setHasSearched, setShowSearchBar } = usePageTitle();
  const appNavigate = useAppNavigate();
  const appNavigateRef = useRef(appNavigate);
  const setTitleRef = useRef(setTitle);
  const setEtaDataRef = useRef(setEtaData);

  useEffect(() => { appNavigateRef.current = appNavigate; }, [appNavigate]);
  useEffect(() => { setTitleRef.current = setTitle; }, [setTitle]);
  useEffect(() => { setEtaDataRef.current = setEtaData; }, [setEtaData]);

  useEffect(() => {
    setTitle('');
    setShowSearchBar(false);
    return () => setShowSearchBar(false);
  }, [setTitle, setShowSearchBar]);

  const [panelOpen, setPanelOpen] = useState(true);
  const [addStopOpen, setAddStopOpen] = useState(false);
  const [stopPanelCollapsed, setStopPanelCollapsed] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  
  const [originLabel, setOriginLabel] = useState('');
  const [destPlace, setDestPlace] = useState(searchedPlace);
  const [swapped, setSwapped] = useState(false);
  const [selectedMode, setSelectedMode] = useState(() => {
    const map = { bus: 'transit', bike: 'bike', car: 'drive', man: 'walk' };
    return (pendingVehicle && map[pendingVehicle]) || 'drive';
  });

  const originMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const userLocationRef = useRef(null);
  const poiMarkersRef = useRef([]);
  const originChosenRef = useRef(false);

  const destination = searchedPlace?.displayName || searchedPlace?.formatted_address?.split(',')[0] || searchedPlace?.name || destPlace?.displayName || destPlace?.formatted_address?.split(',')[0] || destPlace?.name || '';

  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  const mapContainerRef = useRef(null);
  
  const initialDestLoc = (destPlace || searchedPlace)?.location || (destPlace || searchedPlace)?.geometry?.location;
  let initialLat = 7.8731, initialLng = 80.7718;
  if (initialDestLoc) {
    initialLat = typeof initialDestLoc.lat === 'function' ? initialDestLoc.lat() : initialDestLoc.lat;
    initialLng = typeof initialDestLoc.lng === 'function' ? initialDestLoc.lng() : initialDestLoc.lng;
  }
  
  const { mapInstanceRef, mapReady } = useLeafletMap(mapContainerRef, {
    center: [initialLat, initialLng],
    zoom: initialDestLoc ? 12 : 7
  });

  const routing = useRouting(mapInstanceRef, {
    showDetailsPanel: true,
    selectedMode,
    setEtaData,
    appNavigateRef,
    setTitleRef,
    setEtaDataRef
  });

  const poiSearch = usePOISearch(routing.directionsResultRef, routing.selectedIdx);

  const placeOriginMarker = (loc) => {
    if (originMarkerRef.current) {
      originMarkerRef.current.setLatLng(loc);
    } else {
      originMarkerRef.current = L.marker(loc, {
        icon: getBlueMarkerIcon(),
        zIndexOffset: 999
      }).addTo(mapInstanceRef.current);
    }
  };

  const applyOrigin = useCallback((loc, label, fireRoute = true) => {
    userLocationRef.current = loc;
    setOriginLabel(label);
    placeOriginMarker(loc);

    const dest = destPlace || searchedPlace;
    const destLoc = dest?.location || dest?.geometry?.location;
    if (destLoc && mapInstanceRef.current) {
      const dLat = typeof destLoc.lat === 'function' ? destLoc.lat() : destLoc.lat;
      const dLng = typeof destLoc.lng === 'function' ? destLoc.lng() : destLoc.lng;
      mapInstanceRef.current.fitBounds(L.latLngBounds([loc, [dLat, dLng]]), { padding: [40, 40] });
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(loc, 14);
    }

    if (fireRoute && destLoc) {
      originChosenRef.current = true;
      routing.requestDirections(loc, destLoc, selectedMode);
    }
  }, [destPlace, searchedPlace, selectedMode, routing]);

  useEffect(() => {
    if (!mapReady) return;

    if (pendingOriginLabel) setPendingOriginLabel('');
    if (pendingVehicle) setPendingVehicle(null);

    const dest = destPlace || searchedPlace;
    const destLoc = dest?.location || dest?.geometry?.location;
    if (destLoc) {
      const lat = typeof destLoc.lat === 'function' ? destLoc.lat() : destLoc.lat;
      const lng = typeof destLoc.lng === 'function' ? destLoc.lng() : destLoc.lng;
      destMarkerRef.current = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        })
      }).addTo(mapInstanceRef.current);
    }

    if (userLocation) {
      applyOrigin(userLocation, `Your Location (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`, Boolean(destLoc));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          applyOrigin(loc, `Your Location (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`, Boolean(destLoc));
        },
        (err) => {
          setTimeout(() => routing.setError('Location access denied. Please enter your starting location manually.'), 500);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }
    
    return () => {
      poiMarkersRef.current.forEach(m => m.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady]);

  useEffect(() => {
    if (!mapInstanceRef.current || !originChosenRef.current) return;
    const { origin, destination: currentDest } = routing.activeRoutePairRef.current;
    if (!origin || !currentDest) return;
    routing.requestDirections(origin, currentDest, selectedMode);
  }, [selectedMode]);

  useEffect(() => {
    if (searchedPlace) setDestPlace(searchedPlace);
  }, [searchedPlace]);

  useEffect(() => {
    if (!mapInstanceRef.current || originChosenRef.current) return;
    const dest = destPlace || searchedPlace;
    const destLoc = dest?.geometry?.location;
    if (userLocationRef.current && destLoc) {
      originChosenRef.current = true;
      routing.requestDirections(userLocationRef.current, destLoc, selectedMode);
    }
  }, [destPlace, searchedPlace, selectedMode, routing]);

  useEffect(() => {
    if (addStopOpen) poiSearch.loadPOIsForRoute();
  }, [routing.selectedIdx, addStopOpen, poiSearch]);

  const onOriginSelect = useCallback((place) => {
    if (!place?.location) return;
    const loc = { lat: place.location.lat, lng: place.location.lng };
    applyOrigin(loc, place.displayName || place.name);
  }, [applyOrigin]);

  const onDestSelect = useCallback((place) => {
    setDestPlace(place);
    setSearchedPlace(place);
    
    const loc = place?.location || place?.geometry?.location;
    if (!loc) {
      routing.setError('Please select a valid destination from the suggestions.');
      return;
    }

    const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
    const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
    
    if (destMarkerRef.current) {
      destMarkerRef.current.setLatLng([lat, lng]);
    }
    if (userLocationRef.current) {
      routing.requestDirections(userLocationRef.current, { lat, lng }, selectedMode);
    }
  }, [selectedMode, setSearchedPlace, routing]);

  const handleSwap = () => {
    const { origin, destination: currentDestination } = routing.activeRoutePairRef.current;
    if (!origin || !currentDestination || !mapInstanceRef.current) return;

    const nextSwapped = !swapped;
    setSwapped(nextSwapped);
    routing.setError(null);

    routing.requestDirections(
      nextSwapped ? currentDestination : origin,
      nextSwapped ? origin : currentDestination,
      selectedMode
    );
  };

  const handleShare = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    const { origin, destination: currentDest } = routing.activeRoutePairRef.current;
    let url = '';

    if (origin && currentDest) {
      const originLat = typeof origin.lat === 'function' ? origin.lat() : origin.lat;
      const originLng = typeof origin.lng === 'function' ? origin.lng() : origin.lng;
      const destLat = typeof currentDest.lat === 'function' ? currentDest.lat() : currentDest.lat;
      const destLng = typeof currentDest.lng === 'function' ? currentDest.lng() : currentDest.lng;
      
      const modeMap = { drive: 'car', bike: 'bicycle', walk: 'foot', transit: 'car' };
      const mode = modeMap[selectedMode] || 'car';
      url = `https://www.openstreetmap.org/directions?engine=osrm_${mode}&route=${originLat}%2C${originLng}%3B${destLat}%2C${destLng}`;
    } else {
      url = destination ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(destination)}` : '';
    }

    const shareText = `Route to ${destination || 'location'}`;
    const fullText = url ? `${shareText}\n${url}` : shareText;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Direction route', text: shareText, url: url || undefined });
        setActionMessage('Route shared.');
      } else {
        await navigator.clipboard.writeText(fullText);
        setActionMessage('Route copied to clipboard.');
      }
    } catch (err) {
      if (err.name === 'AbortError') setActionMessage('Share cancelled.');
      else setActionMessage('Failed to share.');
    }
  };

  const handleSave = async () => {
    const dest = destPlace || searchedPlace;
    if (dest) {
      try {
        const photoUrls = dest.photo ? [dest.photo] : [];
        await saveFavoritePlace(dest, 'work', null, photoUrls);
        setActionMessage('Saved');
      } catch (error) {
        setActionMessage('Failed to save route to favorites.');
      }
    } else {
      const savedRoute = { destination, origin: userLocationRef.current, mode: selectedMode, updatedAt: new Date().toISOString() };
      window.localStorage.setItem('savedDirectionRoute', JSON.stringify(savedRoute));
      setActionMessage('Saved');
    }
  };

  const handleStart = () => {
    setShowSearchBar(true);
    appNavigate('start');
    setActionMessage('Opening start page.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addPoiMarker = (place) => {
    if (!mapInstanceRef.current || !place?.location) return;

    const lat = typeof place.location.lat === 'function' ? place.location.lat() : place.location.lat;
    const lng = typeof place.location.lng === 'function' ? place.location.lng() : place.location.lng;

    const existingMarker = poiMarkersRef.current.find((marker) => marker.__placeId === place.placeId);
    if (existingMarker) {
      mapInstanceRef.current.setView(existingMarker.getLatLng(), 16);
      existingMarker.openPopup();
      return;
    }

    const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current)
      .bindPopup(`<div style="font-family:Inter,sans-serif;font-size:13px;max-width:160px">
        <strong>${place.name}</strong><br/>
        <span style="background:#1A73E8;color:white;padding:2px 6px;border-radius:4px;font-size:10px;margin-top:4px;margin-bottom:4px;display:inline-block;">📍 Suggested Stop</span><br/>
        <span style="color:#6B7280;font-size:11px">${place.vicinity || place.category}</span>
      </div>`);

    marker.__placeId = place.placeId;
    poiMarkersRef.current.push(marker);
    mapInstanceRef.current.setView([lat, lng], 16);
    marker.openPopup();
  };

  const mapHeight = addStopOpen && !stopPanelCollapsed ? '450px' : '900px';

  return (
    <div className="relative w-full overflow-hidden bg-[#edf7ff]" style={{ minHeight: '100vh' }}>
      {actionMessage && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#1A73E8', color: '#fff', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 999999, fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          {actionMessage}
        </div>
      )}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <img src={middle} alt="Ocean background" className="h-full w-full object-cover scale-x-[1.7]" />
      </div>

      <div className="relative z-10 w-full">
        <div className="relative w-full" style={{ height: mapHeight, transition: 'height 0.35s ease' }}>
          <div ref={mapContainerRef} className="h-full w-full shadow-[0_18px_50px_rgba(18,46,99,0.12)]" />
          <div className="absolute right-4 z-30" style={{ bottom: '200px', pointerEvents: 'none' }}>
            <button
              type="button"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    applyOrigin(loc, `Your Location (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`, true);
                    mapInstanceRef.current?.setView(loc);
                  });
                }
              }}
              style={{ pointerEvents: 'auto', width: '45px', height: '45px', borderRadius: '16px', border: 'none', background: '#1A73E8', boxShadow: '0 10px 24px rgba(26,115,232,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: '0px', bottom: '8px' }}
            >
              <img src={gpsIcon} alt="GPS search" style={{ width: '25px', height: '25px' }} />
            </button>
          </div>
        </div>

        {addStopOpen && (
          <AddStopPanel
            stopPanelCollapsed={stopPanelCollapsed}
            setStopPanelCollapsed={setStopPanelCollapsed}
            setAddStopOpen={setAddStopOpen}
            stopQuery={poiSearch.stopQuery}
            setStopQuery={poiSearch.setStopQuery}
            stopSuggestions={poiSearch.stopSuggestions}
            setStopSuggestions={poiSearch.setStopSuggestions}
            fetchStopSuggestions={poiSearch.fetchStopSuggestions}
            stopActiveIdx={poiSearch.stopActiveIdx}
            setStopActiveIdx={poiSearch.setStopActiveIdx}
            activeCategory={poiSearch.activeCategory}
            setActiveCategory={poiSearch.setActiveCategory}
            poiLoading={poiSearch.poiLoading}
            poiError={poiSearch.poiError}
            filteredPois={poiSearch.filteredPois}
            addPoiMarker={addPoiMarker}
          />
        )}

        {!addStopOpen && (
          <button
            type="button"
            onClick={() => appNavigate('explore')}
            style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 50, width: '40px', height: '40px', borderRadius: '50%', background: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
        )}

        {!addStopOpen && (
          <div style={{ maxWidth: '100%', margin: '0 auto', padding: 0 }}>
            {routing.loadingRoutes && (
              <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '24px 32px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 99999, textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #E8F3FF', borderTop: '4px solid #1A73E8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                <div style={{ color: '#122E63', fontWeight: 600, fontSize: '14px' }}>Finding routes...</div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            {!panelOpen && (
              <div onClick={() => setPanelOpen(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff', borderRadius: '12px 12px 0 0', padding: '6px 24px', boxShadow: '0 -2px 8px rgba(0,0,0,0.08)', width: 'fit-content', margin: '0 auto' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
              </div>
            )}
            <div style={{ overflow: 'hidden', maxHeight: panelOpen ? '1000px' : '0px', transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
              <div className="overflow-hidden rounded-[1px] border border-white/70 bg-white/95 shadow-[0_30px_80px_rgba(18,46,99,0.18)] backdrop-blur-md">
                <div className="px-5 py-4 sm:px-8">
                  <ModeSelector
                    selectedMode={selectedMode}
                    setSelectedMode={setSelectedMode}
                    fallbackMode={routing.fallbackMode}
                    setRoutes={routing.setRoutes}
                    setFallbackMode={routing.setFallbackMode}
                    selectedRoute={routing.routes[routing.selectedIdx] || routing.routes[0]}
                    modeMinutesCache={routing.modeMinutesCache}
                    drivingMinutesRef={routing.drivingMinutesRef}
                    baseModeMinutes={215}
                    handleShare={handleShare}
                    setPanelOpen={setPanelOpen}
                  />
                </div>
                <div className="grid gap-4 px-5 py-5 sm:px-16">
                  <RouteCard
                    selectedRoute={routing.routes[routing.selectedIdx] || routing.routes[0]}
                    selectedIdx={routing.selectedIdx}
                    routes={routing.routes}
                    loadingRoutes={routing.loadingRoutes}
                    handleStart={handleStart}
                    handleAddStop={() => { setAddStopOpen(true); setStopPanelCollapsed(false); }}
                    handleShare={handleShare}
                    handleSave={handleSave}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {routing.error && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', borderRadius: '16px', padding: '24px 36px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', zIndex: 99999, maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ color: '#e53e3e', fontWeight: 600, fontSize: '16px', marginBottom: '16px' }}>⚠️ Route Error</div>
          <div style={{ color: '#4a5568', fontSize: '14px', lineHeight: '1.5' }}>{routing.error}</div>
          <button onClick={() => routing.setError(null)} style={{ marginTop: '20px', padding: '10px 24px', background: '#1A73E8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>OK</button>
        </div>
      )}

      {!addStopOpen && (
        <LocationInputPanel
          swapped={swapped}
          handleSwap={handleSwap}
          originLabel={originLabel}
          pendingOriginLabel={pendingOriginLabel}
          destination={destination}
          destPlace={destPlace}
          searchedPlace={searchedPlace}
          onOriginSelect={onOriginSelect}
          onDestSelect={onDestSelect}
          onGpsSelect={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                applyOrigin(loc, `Your Location (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`, true);
              });
            }
          }}
        />
      )}
    </div>
  );
}
