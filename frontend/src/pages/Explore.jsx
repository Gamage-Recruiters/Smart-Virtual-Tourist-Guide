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
import styles from './Explore.module.css';

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
        <div className={styles.savedPlacesMessage}>
          Loading saved places...
        </div>
      );
    }

    if (recentPlacesError) {
      return (
        <div className={styles.savedPlacesError}>
          {recentPlacesError}
        </div>
      );
    }

    if (recentPlaces.length === 0) {
      return (
        <div className={styles.savedPlacesMessage}>
          No saved places found in {selectedSavedPlaceTab}.
        </div>
      );
    }

    return (
      <div className={styles.savedPlacesGrid}>
        {recentPlaces.map((place) => {
          const placeName = place?.name || 'Unknown place';

          return (
            <div
              key={place._id}
              onClick={() => handleSelectSavedPlace(place)}
              className={styles.savedPlaceCard}
            >
              <div className={styles.savedPlaceNameWrapper}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={styles.savedPlacePinIcon}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <span
                  className={styles.savedPlaceNameText}
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
                className={styles.removePlaceBtn}
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
    <div className={`relative w-full h-full py-12 ${styles.exploreContainer}`}>
      {actionMessage && (
        <div className={actionMessage.type === 'error' ? styles.toastError : styles.toastMessage}>
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
      <div
        className={styles.mapWrapper}
        style={{ marginBottom: searched ? '0' : '80px', marginTop: showUserPopup ? '-80px' : 0 }}
      >
        <div className={`relative ${styles.mapInner}`}>
          <div
            ref={mapRef}
            className={`w-full block shadow-lg ${styles.mapCanvas}`}
          ></div>
          <button
            type="button"
            onClick={requestUserLocation}
            aria-label="Show my current location"
            title="Show my current location"
            className={styles.locationBtn}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
          </button>
          <div
            ref={zoomOverlayRef}
            className={styles.zoomOverlay}
          >
            Use Ctrl + scroll to zoom the map
          </div>
          <img
            src={directionIcon}
            alt="Direction"
            onClick={() => setActivePage('directionOne')}
            className={styles.directionBtn}
          />
        </div>
      </div>

      {/* explore2 image - shown directly under map when searched, else show icon buttons */}
      {searched ? (
        <>
        <div
          className={styles.detailsPanel}
          style={{ minHeight: detailsPanelCollapsed ? '80px' : '700px' }}
        >
          {searchedPlace && !detailsPanelCollapsed && (
            <div
              className={`${styles.topActionsGroup} ${showUserPopup ? 'hidden' : 'flex'}`}
            >
              <button onClick={handleSaveDestinationToFavorites} className={styles.roundActionBtn} aria-label="Save">
                <svg className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <button onClick={handleShareLocation} className={styles.roundActionBtn} aria-label="Share">
                <svg className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          )}
          <button
            onClick={() => setDetailsPanelCollapsed(!detailsPanelCollapsed)}
            className={`${styles.collapseToggleBtn} ${showUserPopup ? 'hidden' : 'flex'}`}
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
              className={`${styles.collapseSvg} ${detailsPanelCollapsed ? styles.collapseSvgRotate : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <img
            src={explore2}
            alt="Explore"
            className={`${styles.exploreBgImg} ${detailsPanelCollapsed ? 'hidden' : 'block'}`}
          />
          {/* Rectangle box top left on explore2 image */}
          <div
            className={styles.detailsContentBox}
            style={{
              minHeight: detailsPanelCollapsed ? '80px' : '500px',
              overflow: detailsPanelCollapsed ? 'hidden' : 'visible',
            }}
          >
            {searchedPlace && (
              <>
                <span
                  className={styles.placeTitle}
                  style={{ marginBottom: detailsPanelCollapsed ? '0px' : '100px' }}
                >
                  {searchedPlace.displayName || searchedPlace.formatted_address?.split(',')[0]}
                </span>
                {!detailsPanelCollapsed && (
                <>
                <div className={styles.actionBtnsRow}>
                  {[
                    { 
                      label: 'Direction', 
                      iconSvg: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                      className={styles.actionPillBtn}
                    >
                      {iconSvg}
                      {label}
                    </button>
                  ))}
                </div>
                {/* Dynamic photos layout */}
                {placePhotos.length > 0 && placePhotos.length < 5 && (
                  <div className={styles.threePhotosGrid}>
                    {/* Large photo on the left */}
                    <img
                      src={placePhotos[0]}
                      alt="Place 1"
                      className={styles.mainPhoto}
                    />
                    {/* 2 smaller photos stacked on the right */}
                    <div className={styles.sidePhotosCol}>
                      {placePhotos[1] && (
                        <img
                          src={placePhotos[1]}
                          alt="Place 2"
                          className={styles.sidePhoto}
                        />
                      )}
                      {placePhotos[2] && (
                        <img
                          src={placePhotos[2]}
                          alt="Place 3"
                          className={styles.sidePhoto}
                        />
                      )}
                    </div>
                  </div>
                )}
                {placePhotos.length >= 5 && (
                  <div className={styles.sevenPhotosGrid}>
                    {/* Left 5-photo block */}
                    <div
                      className={styles.photosSubGrid}
                      style={{ flex: placePhotos.length > 5 ? '0 0 55%' : '1' }}
                    >
                      <img src={placePhotos[0]} alt="Place 1" className="w-full h-full object-cover col-start-1 row-start-1 row-end-3" />
                      <img src={placePhotos[1]} alt="Place 2" className="w-full h-full object-cover col-start-1 row-start-3 row-end-4" />
                      <img src={placePhotos[2]} alt="Place 3" className="w-full h-full object-cover col-start-2 row-start-1 row-end-2" />
                      <img src={placePhotos[3]} alt="Place 4" className="w-full h-full object-cover col-start-2 row-start-2 row-end-3" />
                      <img src={placePhotos[4]} alt="Place 5" className="w-full h-full object-cover col-start-2 row-start-3 row-end-4" />
                    </div>
                    
                    {/* Right photos block */}
                    {placePhotos.length > 5 && (
                      <div className={styles.photosTallCol}>
                        <div className="flex-[4] overflow-hidden rounded-2xl">
                          <img src={placePhotos[5]} alt="Place 6" className="w-full h-full object-cover" />
                        </div>
                        {placePhotos[6] && (
                          <div className="flex-[6] overflow-hidden rounded-2xl">
                            <img src={placePhotos[6]} alt="Place 7" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {nearbyHotels.length > 0 && (
                  <div className={styles.hotelsSectionHeader}>
                    <span className={styles.hotelsSectionTitle}>
                      Hotel Nearby
                    </span>
                    {/* Hotels horizontal list */}
                    {nearbyHotels.length > 0 && (
                      <div className={`hide-scrollbar ${styles.hotelsScrollRow}`}>
                        {hotelGroups.map((rooms, groupIdx) => {
                          const base = rooms[0];
                          const extraRooms = rooms.slice(1);
                          const isExpanded = !!expandedHotels[base.name];
                          return (
                            <div key={groupIdx} className={styles.hotelCard}>
                              {/* Left: photo + base room info */}
                              <div className={styles.hotelBaseCol}>
                                {/* +/- toggle */}
                                {extraRooms.length > 0 && (
                                  <button
                                    onClick={() => setExpandedHotels(prev => ({ ...prev, [base.name]: !prev[base.name] }))}
                                    className={styles.expandRoomsBtn}
                                    aria-label={isExpanded ? 'Collapse rooms' : 'Expand rooms'}
                                  >
                                    {isExpanded ? '−' : '+'}
                                  </button>
                                )}
                                {base.photo && (
                                  <img src={base.photo} alt={base.name} className={styles.hotelPhoto}
                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/1a73e8/ffffff?text=${encodeURIComponent(base.name || 'Hotel')}`; }}
                                  />
                                )}
                                <div className={styles.hotelInfoTop}>
                                  <div className={styles.hotelName}>{base.name}</div>
                                </div>
                                <div className={styles.hotelInfoBottom}>
                                  <div className={styles.roomName}>{base.roomName}</div>
                                  {base.roomType && <div className={styles.roomType}>{base.roomType}{base.capacity ? ` · ${base.capacity.adults} adults` : ''}</div>}
                                  <span className={styles.roomPrice}>{base.price}</span>
                                  {base.location && (
                                    <div className="font-inter text-xs text-[#1A73E8] mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                      {base.location}{base.distanceKm != null ? ` · ${base.distanceKm} km away` : ''}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* Right: extra rooms panel, shown only when expanded */}
                              {extraRooms.length > 0 && isExpanded && (
                                <div className={styles.otherRoomsCol}>
                                  <div className={styles.otherRoomsHeader}>
                                    <span className={styles.otherRoomsTitle}>Other Rooms</span>
                                  </div>
                                  <div className={styles.otherRoomsList}>
                                    {extraRooms.map((room, rIdx) => (
                                      <div key={rIdx} className={`p-2 ${rIdx < extraRooms.length - 1 ? 'border-b border-[#F3F4F6]' : ''}`}>
                                        <div className={styles.roomName}>{room.roomName}</div>
                                        {room.roomType && <div className={styles.roomType}>{room.roomType}{room.capacity ? ` · ${room.capacity.adults} adults` : ''}</div>}
                                        <span className={styles.roomPrice}>{room.price}</span>
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
          <div className={styles.userIconsBottomRow}>
            <img
              src={exploreIcon}
              alt="Explore"
              className={styles.exploreBottomIcon}
              onClick={() => setShowUserPopup(false)}
            />
            {showUserPopup && (
              <div className={styles.userPopupModal}>
                <div className={styles.userInfoRow}>
                  <div className={styles.userAvatarCircle}>
                    <img src={user} alt="User" className={styles.userAvatarImg} />
                  </div>
                  <div className={styles.userNameCol}>
                    <div className={styles.userNameTitle}>
                      You
                    </div>
                    <div className={styles.userNameSubtitle}>
                      {userDisplayName}
                    </div>
                  </div>
                </div>
                <div className={styles.savedPlacesBlock}>
                  <div className={styles.savedPlacesTitle}>
                    Save Places
                  </div>
                  <div className={styles.savedTabsPill}>
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
                          className={`${styles.savedTabBtn} ${selected ? styles.savedTabBtnActive : hovered ? styles.savedTabBtnHover : ''}`}
                        >
                          {tab.icon && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M3 10.5 12 3l9 7.5" />
                              <path d="M5 10v10h14V10" />
                              <path d="M9 20v-7h6v7" />
                            </svg>
                          )}
                          <span className={`${styles.savedTabBtnText} ${selected ? styles.savedTabBtnTextActive : hovered ? styles.savedTabBtnTextHover : ''}`}>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className={styles.savedTabSectionTitle}>
                    {selectedSavedPlaceTab === 'home' ? 'Your Home Places' : selectedSavedPlaceTab === 'work' ? 'Your Work Places' : 'Your Favorite Places'}
                  </div>
                  <div className={styles.savedTabContentList}>
                    {renderSavedPlacesContent()}
                  </div>
                </div>
              </div>
            )}
            <img
              src={userIcon}
              alt="User"
              className={styles.exploreBottomIcon}
              onClick={() => setShowUserPopup((value) => !value)}
            />
          </div>
        )}
        </>
      ) : (
        <div className={styles.userIconsBottomRow}>
          <img
            src={exploreIcon}
            alt="Explore"
            className={styles.exploreBottomIcon}
            onClick={() => setShowUserPopup(false)}
          />
          {showUserPopup && (
            <div className={styles.userPopupModal}>
              <div className={styles.userInfoRow}>
                <div className={styles.userAvatarCircle}>
                  <img src={user} alt="User" className={styles.userAvatarImg} />
                </div>
                <div className={styles.userNameCol}>
                  <div className={styles.userNameTitle}>
                    You
                  </div>
                  <div className={styles.userNameSubtitle}>
                    {userDisplayName}
                  </div>
                </div>
              </div>
              <div className={styles.savedPlacesBlock}>
                <div className={styles.savedPlacesTitle}>
                  Save Places
                </div>
                <div className={styles.savedTabsPill}>
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
                        className={`${styles.savedTabBtn} ${selected ? styles.savedTabBtnActive : hovered ? styles.savedTabBtnHover : ''}`}
                      >
                        {tab.icon && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 10.5 12 3l9 7.5" />
                            <path d="M5 10v10h14V10" />
                            <path d="M9 20v-7h6v7" />
                          </svg>
                        )}
                        <span className={`${styles.savedTabBtnText} ${selected ? styles.savedTabBtnTextActive : hovered ? styles.savedTabBtnTextHover : ''}`}>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className={styles.savedTabSectionTitle}>
                  {selectedSavedPlaceTab === 'home' ? 'Your Home Places' : selectedSavedPlaceTab === 'work' ? 'Your Work Places' : 'Your Favorite Places'}
                </div>
                <div className={styles.savedTabContentList}>
                  {renderSavedPlacesContent()}
                </div>
              </div>
            </div>
          )}
          <img
            src={userIcon}
            alt="User"
            className={styles.exploreBottomIcon}
            onClick={() => setShowUserPopup((value) => !value)}
          />
        </div>
      )}
    </div>
  );
};
//new
export default Explore;
