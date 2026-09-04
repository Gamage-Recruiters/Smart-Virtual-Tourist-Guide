import { useEffect, useRef, useCallback, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import middle from '../assets/middle.png';
import exploreIcon from '../assets/explore.png';
import explore2 from '../assets/explore2.png';
import userIcon from '../assets/userIcon.png';
import user from '../assets/user.png';
import directionIcon from '../assets/directionIcon.png';
import { usePageTitle } from '../contexts/PageTitleContext';
import { formatViewedAgo } from '../utils/helpers';
import { fetchPhotosForPlace, reverseGeocode, geocodeAddress } from '../utils/geoapifyService';
import { saveRecentPlace, saveFavoritePlace, fetchFavoritePlaces, deleteRecentPlace, deleteFavoritePlace, fetchHotels } from '../services/api';

const USER_LOCATION = { lat: 7.8731, lng: 80.7718 }; // Sri Lanka center
const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const Explore = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const lastHandledPlaceKeyRef = useRef('');
  const zoomOverlayRef = useRef(null);
  const zoomOverlayTimeoutRef = useRef(null);

  const { setShowSearchBar, setOnNavigate, hasSearched, setHasSearched, searchedPlace, setActivePage, setUserLocation, userLocation } = usePageTitle();
  const [localSearched, setLocalSearched] = useState(false);
  const searched = hasSearched || localSearched;
  const [placePhotos, setPlacePhotos] = useState([]);
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [selectedSavedPlaceTab, setSelectedSavedPlaceTab] = useState('home');
  const [hoveredSavedPlaceTab, setHoveredSavedPlaceTab] = useState(null);
  const [recentPlaces, setRecentPlaces] = useState([]);
  const [recentPlacesLoading, setRecentPlacesLoading] = useState(false);
  const [recentPlacesError, setRecentPlacesError] = useState('');
  const [detailsPanelCollapsed, setDetailsPanelCollapsed] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const userDisplayName = (typeof window !== 'undefined' && (window.localStorage.getItem('userName') || window.localStorage.getItem('displayName'))) || 'nethmi';

  const [expandedHotels, setExpandedHotels] = useState({});

  // Group hotels by name, sort rooms by price ascending
  const hotelGroups = Object.values(
    nearbyHotels.reduce((acc, hotel) => {
      const key = hotel.name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(hotel);
      return acc;
    }, {})
  ).map((rooms) => rooms.slice().sort((a, b) => {
    const priceA = parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0;
    const priceB = parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0;
    return priceA - priceB;
  }));

  const getPlaceKey = useCallback((place) => {
    const placeId = place?.place_id || place?.placeId || '';
    const name = place?.displayName || place?.name || place?.formatted_address?.split(',')[0] || '';
    const lat = typeof place?.geometry?.location?.lat === 'function' ? place.geometry.location.lat() : (place?.geometry?.location?.lat ?? place?.lat);
    const lng = typeof place?.geometry?.location?.lng === 'function' ? place.geometry.location.lng() : (place?.geometry?.location?.lng ?? place?.lng ?? place?.lon);
    return placeId || `${name}:${lat ?? ''}:${lng ?? ''}`;
  }, []);

  const handleNavigate = useCallback((place) => {
    const placeKey = getPlaceKey(place);
    const isRepeatedPlace = placeKey && lastHandledPlaceKeyRef.current === placeKey;

    if (placeKey) {
      lastHandledPlaceKeyRef.current = placeKey;
    }

    if (!isRepeatedPlace) void saveRecentPlace(place, null);

    const loc = place.geometry?.location;
    const lat = typeof loc?.lat === 'function' ? loc.lat() : (loc?.lat ?? place.lat);
    const lng = typeof loc?.lng === 'function' ? loc.lng() : (loc?.lng ?? place.lng ?? place.lon);

    if (!mapInstanceRef.current || lat == null || lng == null) return;

    mapInstanceRef.current.setView([lat, lng], 13);

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const destIcon = L.divIcon({
      className: 'custom-dest-pin',
      html: `<div style="background-color:#EA4335;width:26px;height:26px;border-radius:50%;border:3px solid #FFFFFF;box-shadow:0 3px 8px rgba(0,0,0,0.4);cursor:pointer;"></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    markerRef.current = L.marker([lat, lng], { icon: destIcon }).addTo(mapInstanceRef.current);
    markerRef.current.bindPopup(`<b>${place.displayName || place.name || 'Searched Location'}</b><br/>${place.formatted_address || ''}`);

    setLocalSearched(true);
    setHasSearched(true);

    const locationName = place.displayName || place.formatted_address?.split(',')[0] || place.name || '';
    if (!isRepeatedPlace) {
      fetchPhotosForPlace(locationName, lat, lng).then((urls) => {
        setPlacePhotos(urls);
        if (urls.length > 0) {
          void saveRecentPlace(place, null, undefined, urls.slice(0, 2));
        }
      });
    }

    // Fetch hotels from database within radius - ALWAYS fetch for every location
    fetchHotels(locationName, lat, lng)
      .then((res) => {
        const data = Array.isArray(res?.data) ? res.data : [];
        if (data && data.length > 0) {
          setNearbyHotels(data);
        } else {
          setNearbyHotels([]);
        }
      })
      .catch((error) => {
        console.error('Hotel fetch error:', error);
        setNearbyHotels([]);
      });
  }, [getPlaceKey, setHasSearched]);

  const handleExploreAction = useCallback((targetPage = 'direction') => {
    if (!searchedPlace) return;
    void saveRecentPlace(searchedPlace, 'Got Direction');
    setActivePage(targetPage);
  }, [searchedPlace, setActivePage]);

  const handleSavePlace = useCallback(async () => {
    if (!userLocation) {
      setActionMessage({ text: 'Current location not found.', type: 'error' });
      return;
    }
    try {
      const category = 'home';
      let placeToSave = { name: "Your Location", geometry: { location: userLocation } };
      
      const geoResult = await reverseGeocode(userLocation.lat, userLocation.lng);
      if (geoResult) {
        placeToSave = geoResult;
      }

      await saveFavoritePlace(placeToSave, category);
      setActionMessage({ text: 'Saved to home!', type: 'success' });
    } catch (error) {
      console.error('Error saving place:', error);
      setActionMessage({ text: 'Failed to save place', type: 'error' });
    }
  }, [userLocation]);

  const handleSaveDestinationToFavorites = useCallback(async () => {
    if (!searchedPlace) {
      setActionMessage({ text: 'No destination to save.', type: 'error' });
      return;
    }
    try {
      const category = 'favorite';
      await saveFavoritePlace(searchedPlace, category);
      setActionMessage({ text: 'Saved to favorites!', type: 'success' });
    } catch (error) {
      console.error('Error saving destination to favorites:', error);
      setActionMessage({ text: 'Failed to save to favorites', type: 'error' });
    }
  }, [searchedPlace]);

  const handleShareLocation = useCallback(async () => {
    if (!searchedPlace) return;
    
    let url = '';
    const loc = searchedPlace?.geometry?.location;
    const lat = typeof loc?.lat === 'function' ? loc.lat() : (loc?.lat ?? searchedPlace.lat);
    const lng = typeof loc?.lng === 'function' ? loc.lng() : (loc?.lng ?? searchedPlace.lng);

    if (lat != null && lng != null) {
      url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
    } else {
      const name = searchedPlace?.displayName || searchedPlace?.formatted_address?.split(',')[0] || searchedPlace?.name;
      if (name) {
        url = `https://www.openstreetmap.org/search?query=${encodeURIComponent(name)}`;
      }
    }

    const name = searchedPlace?.displayName || searchedPlace?.formatted_address?.split(',')[0] || searchedPlace?.name || 'Location';
    const shareText = `Check out this location: ${name}`;
    const fullText = url ? `${shareText}\n${url}` : shareText;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Shared Location',
          text: shareText,
          url: url || undefined,
        });
        setActionMessage({ text: 'Location shared!', type: 'success' });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullText);
        setActionMessage({ text: 'Location copied to clipboard!', type: 'success' });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = fullText;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          setActionMessage({ text: 'Location copied to clipboard!', type: 'success' });
        } catch (err) {
          console.error('Fallback copy failed', err);
          setActionMessage({ text: 'Failed to share location.', type: 'error' });
        }
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if (error.name !== 'AbortError') {
        setActionMessage({ text: 'Failed to share location.', type: 'error' });
      }
    }
  }, [searchedPlace]);


  const handleRemovePlace = useCallback(async (placeId, isFavoriteTab) => {
    try {
      if (isFavoriteTab) {
        await deleteFavoritePlace(placeId);
      } else {
        await deleteRecentPlace(placeId);
      }
      setRecentPlaces((prev) => prev.filter((p) => p._id !== placeId));
      setActionMessage({ text: 'Place removed!', type: 'success' });
    } catch (error) {
      console.error('Error removing place:', error);
      setActionMessage({ text: 'Failed to remove place.', type: 'error' });
    }
  }, []);

  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  useEffect(() => {
    if (!showUserPopup) return;

    let isActive = true;

    const loadPlaces = async () => {
      setRecentPlacesLoading(true);
      setRecentPlacesError('');

      try {
        let items = [];
        if (selectedSavedPlaceTab === 'home') {
          const response = await fetchFavoritePlaces(undefined, 'home');
          if (!isActive) return;
          items = Array.isArray(response?.data) ? response.data : [];
        } else if (selectedSavedPlaceTab === 'work') {
          const response = await fetchFavoritePlaces(undefined, 'work');
          if (!isActive) return;
          items = Array.isArray(response?.data) ? response.data : [];
        } else if (selectedSavedPlaceTab === 'favorite') {
          const response = await fetchFavoritePlaces(undefined, 'favorite');
          if (!isActive) return;
          items = Array.isArray(response?.data) ? response.data : [];
        }
        setRecentPlaces(items);
      } catch (error) {
        if (!isActive) return;
        setRecentPlacesError('Failed to load places');
        setRecentPlaces([]);
      } finally {
        if (isActive) setRecentPlacesLoading(false);
      }
    };

    loadPlaces();

    return () => {
      isActive = false;
    };
  }, [showUserPopup, selectedSavedPlaceTab]);

  const handleSelectSavedPlace = useCallback((place) => {
    const pName = place?.name || place?.displayName;
    if (!pName) return;
    setShowUserPopup(false);
    if (place.geometry?.location || (place.lat != null && place.lng != null)) {
      handleNavigate(place);
    } else {
      void geocodeAddress(pName).then((result) => {
        if (result) {
          handleNavigate(result);
        }
      });
    }
  }, [handleNavigate]);

  const renderSavedPlacesContent = () => {
    if (recentPlacesLoading) {
      return (
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#374151', padding: '12px 0' }}>
          Loading saved places...
        </div>
      );
    }

    if (recentPlacesError) {
      return (
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#B91C1C', padding: '12px 0' }}>
          {recentPlacesError}
        </div>
      );
    }

    if (recentPlaces.length === 0) {
      return (
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#374151', padding: '12px 0' }}>
          No saved places found in {selectedSavedPlaceTab}.
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px 18px' }}>
        {recentPlaces.map((place) => {
          const placeName = place?.name || 'Unknown place';

          return (
            <div
              key={place._id}
              onClick={() => handleSelectSavedPlace(place)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(26, 115, 232, 0.14)';
                e.currentTarget.style.borderColor = '#93C5FD';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1, marginRight: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#1E293B',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={placeName}
                >
                  {placeName}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePlace(place._id, true);
                }}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  color: '#EF4444',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EF4444';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FEE2E2';
                  e.currentTarget.style.color = '#EF4444';
                }}
                title="Remove place"
                aria-label="Remove place"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const placeUserMarker = useCallback((coords) => {
    if (!mapInstanceRef.current || !coords) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }
    userMarkerRef.current = L.circleMarker([coords.lat, coords.lng], {
      radius: 10,
      fillColor: '#4285F4',
      fillOpacity: 1,
      color: '#FFFFFF',
      weight: 3,
    }).addTo(mapInstanceRef.current);
    userMarkerRef.current.bindPopup('<b>Your Location</b>');
  }, []);

  const requestUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setActionMessage({ text: 'Location is not supported by this browser.', type: 'error' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(nextLocation);
        placeUserMarker(nextLocation);
        mapInstanceRef.current?.setView([nextLocation.lat, nextLocation.lng], 15);
        setActionMessage({ text: 'Your live location is shown on the map.', type: 'success' });
      },
      (error) => {
        const message = error.code === 1
          ? 'Location permission is blocked. Allow location access and try again.'
          : 'Unable to read your current location. Try again.';
        setActionMessage({ text: message, type: 'error' });
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
    );
  }, [placeUserMarker, setUserLocation]);

  useEffect(() => {
    setShowSearchBar(true);
    setOnNavigate(handleNavigate);
    if (!searchedPlace) setHasSearched(false);

    const activeLocation = userLocation;

    const hasRestoredPlace = searchedPlace?.geometry?.location || searchedPlace?.lat;
    let initialCenter;
    let initialZoom;
    if (hasRestoredPlace) {
      const loc = searchedPlace.geometry?.location;
      const lat = typeof loc?.lat === 'function' ? loc.lat() : (loc?.lat ?? searchedPlace.lat);
      const lng = typeof loc?.lng === 'function' ? loc.lng() : (loc?.lng ?? searchedPlace.lng ?? searchedPlace.lon);
      initialCenter = { lat, lng };
      initialZoom = 13;
    } else {
      initialCenter = activeLocation || USER_LOCATION;
      initialZoom = activeLocation ? 14 : 8;
    }

    if (!mapInstanceRef.current && mapRef.current) {
      const map = L.map(mapRef.current, {
        center: [initialCenter.lat, initialCenter.lng],
        zoom: initialZoom,
        zoomControl: true,
        scrollWheelZoom: false, // Default to false, handled manually
      });

      L.tileLayer(OSM_TILE_URL, {
        attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        maxZoom: 20,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Handle Ctrl + Scroll to zoom
      mapRef.current.addEventListener('wheel', (e) => {
        if (!e.ctrlKey && !e.metaKey) {
          if (map.scrollWheelZoom.enabled()) {
            map.scrollWheelZoom.disable();
          }
          if (zoomOverlayRef.current) {
            zoomOverlayRef.current.style.opacity = '1';
            clearTimeout(zoomOverlayTimeoutRef.current);
            zoomOverlayTimeoutRef.current = setTimeout(() => {
              if (zoomOverlayRef.current) {
                zoomOverlayRef.current.style.opacity = '0';
              }
            }, 1200);
          }
        } else {
          if (!map.scrollWheelZoom.enabled()) {
            map.scrollWheelZoom.enable();
          }
          if (zoomOverlayRef.current) {
            zoomOverlayRef.current.style.opacity = '0';
          }
        }
      }, { capture: true });
    }

    if (activeLocation) placeUserMarker(activeLocation);

    if (hasRestoredPlace && mapInstanceRef.current) {
      const loc = searchedPlace.geometry?.location;
      const lat = typeof loc?.lat === 'function' ? loc.lat() : (loc?.lat ?? searchedPlace.lat);
      const lng = typeof loc?.lng === 'function' ? loc.lng() : (loc?.lng ?? searchedPlace.lng ?? searchedPlace.lon);
      
      if (markerRef.current) markerRef.current.remove();
      const destIcon = L.divIcon({
        className: 'custom-dest-pin',
        html: `<div style="background-color:#EA4335;width:26px;height:26px;border-radius:50%;border:3px solid #FFFFFF;box-shadow:0 3px 8px rgba(0,0,0,0.4);cursor:pointer;"></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });
      markerRef.current = L.marker([lat, lng], { icon: destIcon }).addTo(mapInstanceRef.current);
      mapInstanceRef.current.setView([lat, lng], 13);
      setLocalSearched(true);
      setHasSearched(true);
    }

    requestUserLocation();
  }, [handleNavigate, placeUserMarker, requestUserLocation, setHasSearched, setOnNavigate, setShowSearchBar, searchedPlace]);

  useEffect(() => {
    setShowSearchBar(true);
    return () => {
      setShowSearchBar(false);
      setOnNavigate(null);
    };
  }, [setShowSearchBar, setOnNavigate]);

  useEffect(() => {
    if (!userLocation || !mapInstanceRef.current) return;

    if (!searched && !hasSearched) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 14);
    }

    placeUserMarker(userLocation);
  }, [userLocation, searched, hasSearched, placeUserMarker]);

  useEffect(() => {
    if (!navigator.geolocation) return undefined;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        const nextLocation = { lat, lng };
        setUserLocation(nextLocation);
        placeUserMarker(nextLocation);
        if (!searched && mapInstanceRef.current) {
          const zoom = mapInstanceRef.current.getZoom();
          mapInstanceRef.current.setView([lat, lng], zoom < 14 ? 14 : zoom);
        }
      },
      (error) => {
        console.warn('Live location unavailable:', error.message);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [placeUserMarker, searched, setUserLocation]);

  useEffect(() => {
    if ((!searchedPlace?.geometry?.location && !searchedPlace?.lat) || !mapInstanceRef.current) return;
    handleNavigate(searchedPlace);
  }, [searchedPlace, handleNavigate]);

  return (
    <div className="relative w-full h-full py-12" style={{ minHeight: '700px' }}>
      {actionMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: actionMessage.type === 'error' ? '#EF4444' : '#1A73E8',
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
          {actionMessage.type === 'error' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
          {actionMessage.text}
        </div>
      )}
      {/* Background image */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src={middle}
          alt="Ocean background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Map area */}
      <div style={{ marginBottom: searched ? '0' : '80px', marginLeft: '60px', marginRight: '60px', marginTop: showUserPopup ? '-80px' : 0 }}>
        <div className="relative" style={{ width: '100%', borderRadius: '15px', overflow: 'hidden' }}>
          <div
            ref={mapRef}
            className="w-full block shadow-lg"
            style={{ height: '750px', margin: 0, padding: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', overflow: 'hidden', borderRadius: '15px', position: 'relative', zIndex: 5 }}
          ></div>
          <button
            type="button"
            onClick={requestUserLocation}
            aria-label="Show my current location"
            title="Show my current location"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '44px',
              height: '44px',
              border: 'none',
              borderRadius: '50%',
              background: '#fff',
              color: '#1A73E8',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              zIndex: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
          </button>
          <div
            ref={zoomOverlayRef}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
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
              borderRadius: '15px',
            }}
          >
            Use Ctrl + scroll to zoom the map
          </div>
          <img
            src={directionIcon}
            alt="Direction"
            onClick={() => setActivePage('directionOne')}
            style={{ position: 'absolute', bottom: '20px', right: '50px', width: '70px', cursor: 'pointer', zIndex: 40 }}
          />
        </div>
      </div>

      {/* explore2 image - shown directly under map when searched, else show icon buttons */}
      {searched ? (
        <>
        <div style={{
          position: 'relative',
          marginLeft: '60px',
          marginRight: '60px',
          marginTop: '16px',
          borderRadius: '10px',
          overflow: 'hidden',
          height: 'auto',
          minHeight: detailsPanelCollapsed ? '80px' : '700px',
          background: '#D7EEFD',
          transition: 'min-height 0.3s ease',
        }}>
          {searchedPlace && !detailsPanelCollapsed && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '80px',
              display: showUserPopup ? 'none' : 'flex',
              gap: '12px',
              zIndex: 100,
            }}>
              <button onClick={handleSaveDestinationToFavorites} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} aria-label="Save">
                <svg className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <button onClick={handleShareLocation} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} aria-label="Share">
                <svg className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>

            </div>
          )}
          <button
            onClick={() => setDetailsPanelCollapsed(!detailsPanelCollapsed)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '2px solid #1A73E8',
              background: '#fff',
              display: showUserPopup ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 100,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A73E8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: detailsPanelCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <img
            src={explore2}
            alt="Explore"
            style={{
              position: 'absolute',
              width: '1443.93px',
              height: '844.18px',
              top: '0px',
              left: '0px',
              transform: 'rotate(0.09deg)',
              objectFit: 'cover',
              objectPosition: 'top',
              display: detailsPanelCollapsed ? 'none' : 'block',
              zIndex: 1,
            }}
          />
          {/* Rectangle box top left on explore2 image */}
          <div style={{
            position: 'relative',
            top: '0px',
            left: '0px',
            width: '100%',
            height: 'auto',
            minHeight: detailsPanelCollapsed ? '80px' : '500px',
            background: '#D7EEFD',
            zIndex: 2,
            padding: '20px',
            overflow: detailsPanelCollapsed ? 'hidden' : 'visible',
            transition: 'min-height 0.3s ease',
          }}>
            {searchedPlace && (
              <>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '30px',
                  lineHeight: '121%',
                  letterSpacing: '0%',
                  color: '#000000',
                  display: 'block',
                  marginBottom: detailsPanelCollapsed ? '0px' : '100px',
                  transition: 'margin-bottom 0.3s ease',
                }}>
                  {searchedPlace.displayName || searchedPlace.formatted_address?.split(',')[0]}
                </span>
                {!detailsPanelCollapsed && (
                <>
                <div style={{ display: 'flex', gap: '16px', marginTop: '60px', width: '100%' }}>
                  {[
                    { 
                      label: 'Direction', 
                      iconSvg: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 22 12 12 22 2 12 12 2" />
                          <polyline points="9 10 12 7 15 10" />
                          <line x1="12" y1="17" x2="12" y2="7" />
                        </svg>
                      ) 
                    }, 
                    { label: 'Start', iconSvg: null }, 
                    { label: 'Save', iconSvg: null }, 
                    { label: 'Share', iconSvg: null }
                  ].map(({ label, iconSvg }) => (
                    <button
                      key={label}
                      onClick={() => {
                        if (label === 'Direction') {
                          handleExploreAction('direction');
                        } else if (label === 'Start') {
                          handleExploreAction('start');
                        } else if (label === 'Save') {
                          handleSavePlace();
                        } else if (label === 'Share') {
                          handleShareLocation();
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '14px 0',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#1A73E8',
                        color: '#fff',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      {iconSvg}
                      {label}
                    </button>
                  ))}
                </div>
                {/* Dynamic photos layout */}
                {placePhotos.length > 0 && placePhotos.length < 5 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '130px', height: '620px', width: '100%' }}>
                    {/* Large photo on the left */}
                    <img
                      src={placePhotos[0]}
                      alt="Place 1"
                      style={{ width: '60%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    {/* 2 smaller photos stacked on the right */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '40%' }}>
                      {placePhotos[1] && (
                        <img
                          src={placePhotos[1]}
                          alt="Place 2"
                          style={{ width: '100%', height: '50%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      )}
                      {placePhotos[2] && (
                        <img
                          src={placePhotos[2]}
                          alt="Place 3"
                          style={{ width: '100%', height: '50%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      )}
                    </div>
                  </div>
                )}
                {placePhotos.length >= 5 && (
                  <div style={{ display: 'flex', gap: '20px', marginTop: '130px', height: '620px', width: '100%' }}>
                    {/* Left 5-photo block */}
                    <div style={{ 
                      flex: placePhotos.length > 5 ? '0 0 55%' : '1', 
                      display: 'grid', 
                      gridTemplateColumns: '2fr 1fr', 
                      gridTemplateRows: 'repeat(3, 1fr)', 
                      gap: '8px', 
                      borderRadius: '16px', 
                      overflow: 'hidden',
                      height: '100%'
                    }}>
                      <img src={placePhotos[0]} alt="Place 1" style={{ width: '100%', height: '100%', objectFit: 'cover', gridColumn: '1', gridRow: '1 / 3' }} />
                      <img src={placePhotos[1]} alt="Place 2" style={{ width: '100%', height: '100%', objectFit: 'cover', gridColumn: '1', gridRow: '3 / 4' }} />
                      <img src={placePhotos[2]} alt="Place 3" style={{ width: '100%', height: '100%', objectFit: 'cover', gridColumn: '2', gridRow: '1 / 2' }} />
                      <img src={placePhotos[3]} alt="Place 4" style={{ width: '100%', height: '100%', objectFit: 'cover', gridColumn: '2', gridRow: '2 / 3' }} />
                      <img src={placePhotos[4]} alt="Place 5" style={{ width: '100%', height: '100%', objectFit: 'cover', gridColumn: '2', gridRow: '3 / 4' }} />
                    </div>
                    
                    {/* Right photos block */}
                    {placePhotos.length > 5 && (
                      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflow: 'hidden' }}>
                        <div style={{ flex: '4', overflow: 'hidden', borderRadius: '16px' }}>
                          <img src={placePhotos[5]} alt="Place 6" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        {placePhotos[6] && (
                          <div style={{ flex: '6', overflow: 'hidden', borderRadius: '16px' }}>
                            <img src={placePhotos[6]} alt="Place 7" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {nearbyHotels.length > 0 && (
                  <div style={{ marginTop: '60px', textAlign: 'left' }}>
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '24px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#000000',
                    }}>
                      Hotel Nearby
                    </span>
                    {/* Hotels horizontal list */}
                    {nearbyHotels.length > 0 && (
                      <div className="hide-scrollbar" style={{ display: 'flex', gap: '16px', marginTop: '20px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none', msOverflowStyle: 'none', width: '100%' }}>
                        {hotelGroups.map((rooms, groupIdx) => {
                          const base = rooms[0];
                          const extraRooms = rooms.slice(1);
                          const isExpanded = !!expandedHotels[base.name];
                          return (
                            <div key={groupIdx} style={{ minWidth: '280px', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', overflow: 'hidden', flexShrink: 0, display: 'flex', flexDirection: 'row', transition: 'min-width 0.3s ease' }}>
                              {/* Left: photo + base room info */}
                              <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                {/* +/- toggle */}
                                {extraRooms.length > 0 && (
                                  <button
                                    onClick={() => setExpandedHotels(prev => ({ ...prev, [base.name]: !prev[base.name] }))}
                                    style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '50%', background: '#1A73E8', color: '#fff', border: 'none', fontSize: '20px', lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
                                    aria-label={isExpanded ? 'Collapse rooms' : 'Expand rooms'}
                                  >
                                    {isExpanded ? '−' : '+'}
                                  </button>
                                )}
                                {base.photo && (
                                  <img src={base.photo} alt={base.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/1a73e8/ffffff?text=${encodeURIComponent(base.name || 'Hotel')}`; }}
                                  />
                                )}
                                <div style={{ padding: '10px 10px 0' }}>
                                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '15px', color: '#000', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{base.name}</div>
                                </div>
                                <div style={{ padding: '0 10px 10px' }}>
                                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#555', marginBottom: '2px' }}>{base.roomName}</div>
                                  {base.roomType && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>{base.roomType}{base.capacity ? ` · ${base.capacity.adults} adults` : ''}</div>}
                                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1A73E8' }}>{base.price}</span>
                                  {base.location && (
                                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#1A73E8', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {base.location}{base.distanceKm != null ? ` · ${base.distanceKm} km away` : ''}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* Right: extra rooms panel, shown only when expanded */}
                              {extraRooms.length > 0 && isExpanded && (
                                <div style={{ width: '200px', borderLeft: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
                                  <div style={{ padding: '8px 10px', borderBottom: '1px solid #E5E7EB' }}>
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Other Rooms</span>
                                  </div>
                                  <div style={{ overflowY: 'auto', flex: 1 }}>
                                    {extraRooms.map((room, rIdx) => (
                                      <div key={rIdx} style={{ padding: '8px 10px', borderBottom: rIdx < extraRooms.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#555', marginBottom: '2px' }}>{room.roomName}</div>
                                        {room.roomType && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>{room.roomType}{room.capacity ? ` · ${room.capacity.adults} adults` : ''}</div>}
                                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1A73E8' }}>{room.price}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                </>
                )}
              </>
            )}
          </div>
        </div>
        {detailsPanelCollapsed && (
          <div
            className="relative z-10 flex justify-center items-center gap-[30rem]"
            style={{ marginTop: '120px', marginBottom: '8px', paddingLeft: '16px', paddingRight: '16px', zIndex: 40 }}
          >
            <img
              src={exploreIcon}
              alt="Explore"
              style={{ width: '140px', cursor: 'pointer', position: 'relative', zIndex: 40 }}
              onClick={() => setShowUserPopup(false)}
            />
            {showUserPopup && (
            <div
              style={{
                position: 'absolute',
                left: '60px',
                right: '60px',
                top: '-750px',
                height: '890px',
                borderRadius: '12px',
                background: '#D7EEFD',
                boxShadow: '0 4px 18px rgba(26,115,232,0.12)',
                padding: '18px 22px',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px',marginLeft: '25px' }}>
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '999px',
                    background: '#E5E7EB',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center', 
                  }}
                >
                  <img src={user} alt="User" style={{ width: '40%', height: '40%', objectFit: 'cover', }} />
                </div>
                <div style={{ lineHeight: 1.05 }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1F2937' }}>
                    You
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#374151', marginTop: '4px' }}>
                    {userDisplayName}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '72px'}}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 500, color: '#1F2937', marginBottom: '18px',marginLeft: '65px' }}>
                  Save Places
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                    gap: '10px',
                    background: '#8CC9F3',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    marginLeft: '120px',
                    marginRight: '120px',
                    boxShadow: '0 2px 6px rgba(26,115,232,0.10) inset',
                  }}
                >
                  {[
                    { key: 'home', label: 'home', icon: true },
                    { key: 'work', label: 'work', icon: false },
                    { key: 'favorite', label: 'Favorite', icon: false },
                  ].map((tab) => {
                    const selected = selectedSavedPlaceTab === tab.key;
                    const hovered = hoveredSavedPlaceTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setSelectedSavedPlaceTab(tab.key)}
                        onMouseEnter={() => setHoveredSavedPlaceTab(tab.key)}
                        onMouseLeave={() => setHoveredSavedPlaceTab(null)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          minHeight: '40px',
                          border: 'none',
                          borderRadius: '4px',
                          background: selected ? 'rgba(31,41,55,0.10)' : hovered ? 'rgba(160,219,255,0.55)' : 'transparent',
                          boxShadow: selected ? 'inset 0 0 0 1px rgba(31,41,55,0.12)' : 'none',
                          color: '#1F2937',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease, box-shadow 0.15s ease',
                        }}
                      >
                        {tab.icon && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 10.5 12 3l9 7.5" />
                            <path d="M5 10v10h14V10" />
                            <path d="M9 20v-7h6v7" />
                          </svg>
                        )}
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: selected ? 700 : 500, color: selected || hovered ? '#111827' : '#1F2937' }}>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: '40px',marginLeft: '65px', fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 500, color: '#1F2937' }}>
                  {selectedSavedPlaceTab === 'home' ? 'Your Home Places' : selectedSavedPlaceTab === 'work' ? 'Your Work Places' : 'Your Favorite Places'}
                </div>
                <div style={{ marginTop: '20px', marginLeft: '40px', marginRight: '40px', maxHeight: '390px', overflowY: 'auto', paddingRight: '8px' }}>
                  {renderSavedPlacesContent()}
                </div>
              </div>
            </div>
          )}
            <img
              src={userIcon}
              alt="User"
              style={{ width: '140px', cursor: 'pointer', position: 'relative', zIndex: 40 }}
              onClick={() => setShowUserPopup((value) => !value)}
            />
          </div>
        )}
        </>
      ) : (
        <div
          className="relative z-10 flex justify-center items-center gap-[30rem]"
          style={{ marginTop: '120px', marginBottom: '8px', paddingLeft: '16px', paddingRight: '16px', zIndex: 40 }}
        >
          <img
            src={exploreIcon}
            alt="Explore"
            style={{ width: '140px', cursor: 'pointer', position: 'relative', zIndex: 40 }}
            onClick={() => setShowUserPopup(false)}
          />
          {showUserPopup && (
            <div
              style={{
                position: 'absolute',
                left: '60px',
                right: '60px',
                top: '-750px',
                height: '890px',
                borderRadius: '12px',
                background: '#D7EEFD',
                boxShadow: '0 4px 18px rgba(26,115,232,0.12)',
                padding: '18px 22px',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px',marginLeft: '25px' }}>
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '999px',
                    background: '#E5E7EB',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',              // enable flexbox
                    justifyContent: 'center',     // center horizontally
                    alignItems: 'center', 
                  }}
                >
                  <img src={user} alt="User" style={{ width: '40%', height: '40%', objectFit: 'cover', }} />
                </div>
                <div style={{ lineHeight: 1.05 }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1F2937' }}>
                    You
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#374151', marginTop: '4px' }}>
                    {userDisplayName}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '72px'}}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 500, color: '#1F2937', marginBottom: '18px',marginLeft: '65px' }}>
                  Save Places
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                    gap: '10px',
                    background: '#8CC9F3',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    marginLeft: '120px',
                    marginRight: '120px',
                    boxShadow: '0 2px 6px rgba(26,115,232,0.10) inset',
                  }}
                >
                  {[
                    { key: 'home', label: 'home', icon: true },
                    { key: 'work', label: 'work', icon: false },
                    { key: 'favorite', label: 'Favorite', icon: false },
                  ].map((tab) => {
                    const selected = selectedSavedPlaceTab === tab.key;
                    const hovered = hoveredSavedPlaceTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setSelectedSavedPlaceTab(tab.key)}
                        onMouseEnter={() => setHoveredSavedPlaceTab(tab.key)}
                        onMouseLeave={() => setHoveredSavedPlaceTab(null)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          minHeight: '40px',
                          border: 'none',
                          borderRadius: '4px',
                          background: selected ? 'rgba(31,41,55,0.10)' : hovered ? 'rgba(160,219,255,0.55)' : 'transparent',
                          boxShadow: selected ? 'inset 0 0 0 1px rgba(31,41,55,0.12)' : 'none',
                          color: '#1F2937',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease, box-shadow 0.15s ease',
                        }}
                      >
                        {tab.icon && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 10.5 12 3l9 7.5" />
                            <path d="M5 10v10h14V10" />
                            <path d="M9 20v-7h6v7" />
                          </svg>
                        )}
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: selected ? 700 : 500, color: selected || hovered ? '#111827' : '#1F2937' }}>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: '40px',marginLeft: '65px', fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 500, color: '#1F2937' }}>
                  {selectedSavedPlaceTab === 'home' ? 'Your Home Places' : selectedSavedPlaceTab === 'work' ? 'Your Work Places' : 'Your Favorite Places'}
                </div>
                <div style={{ marginTop: '20px', marginLeft: '40px', marginRight: '40px', maxHeight: '390px', overflowY: 'auto', paddingRight: '8px' }}>
                  {renderSavedPlacesContent()}
                </div>
              </div>
            </div>
          )}
          <img
            src={userIcon}
            alt="User"
            style={{ width: '140px', cursor: 'pointer', position: 'relative', zIndex: 40 }}
            onClick={() => setShowUserPopup((value) => !value)}
          />
        </div>
      )}
    </div>
  );
};
//new
export default Explore;
