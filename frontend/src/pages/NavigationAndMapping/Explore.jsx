import { useEffect, useRef, useCallback, useState } from 'react';
import middle from '../../assets/NavigationAndMapping/middle.png';
import exploreIcon from '../../assets/NavigationAndMapping/explore.png';
import explore2 from '../../assets/NavigationAndMapping/explore2.png';
import userIcon from '../../assets/NavigationAndMapping/userIcon.png';
import user from '../../assets/NavigationAndMapping/user.png';
import directionIcon from '../../assets/NavigationAndMapping/directionIcon.png';
import directionImg from '../../assets/NavigationAndMapping/direction.png';
import { usePageTitle } from '../../context/PageTitleContext';
import { ensureMapsScript, formatViewedAgo } from '../../utils/helpers';
import { fetchRecentPlaces, saveRecentPlace, saveFavoritePlace, fetchFavoritePlaces, deleteRecentPlace, deleteFavoritePlace, fetchHotels } from '../../services/api';

const USER_LOCATION = { lat: 7.8731, lng: 80.7718 }; // Sri Lanka center

const Explore = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const lastHandledPlaceKeyRef = useRef('');

  const { setShowSearchBar, setOnNavigate, hasSearched, setHasSearched, searchedPlace, setActivePage, setUserLocation, userLocation } = usePageTitle();
  const [localSearched, setLocalSearched] = useState(false);
  const searched = hasSearched || localSearched;
  const [placePhotos, setPlacePhotos] = useState([]);
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [selectedSavedPlaceTab, setSelectedSavedPlaceTab] = useState('home');
  const [hoveredSavedPlaceTab, setHoveredSavedPlaceTab] = useState(null);
  const [recentPlaces, setRecentPlaces] = useState([]);
  const [recentPlacesLoading, setRecentPlacesLoading] = useState(false);
  const [recentPlacesError, setRecentPlacesError] = useState('');
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [detailsPanelCollapsed, setDetailsPanelCollapsed] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const userDisplayName = (typeof window !== 'undefined' && (window.localStorage.getItem('userName') || window.localStorage.getItem('displayName'))) || 'nethmi';

  const [expandedHotels, setExpandedHotels] = useState({});

  // Group hotels by name, sort rooms by price ascending
  const groupedHotels = nearbyHotels.reduce((acc, hotel) => {
    const key = hotel.name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(hotel);
    return acc;
  }, {});
  const hotelGroups = Object.values(groupedHotels).map((rooms) =>
    rooms.slice().sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0))
  );
  const getPlaceKey = useCallback((place) => {
    const placeId = place?.place_id || place?.placeId || '';
    const name = place?.displayName || place?.name || place?.formatted_address?.split(',')[0] || '';
    const lat = typeof place?.geometry?.location?.lat === 'function' ? place.geometry.location.lat() : place?.geometry?.location?.lat;
    const lng = typeof place?.geometry?.location?.lng === 'function' ? place.geometry.location.lng() : place?.geometry?.location?.lng;
    return placeId || `${name}:${lat ?? ''}:${lng ?? ''}`;
  }, []);

  const handleNavigate = useCallback((place) => {
    const placeKey = getPlaceKey(place);
    if (placeKey && lastHandledPlaceKeyRef.current === placeKey) return;

    if (placeKey) {
      lastHandledPlaceKeyRef.current = placeKey;
    }

    void saveRecentPlace(place, null);

    if (!mapInstanceRef.current || !place.geometry?.location) return;    mapInstanceRef.current.panTo(place.geometry.location);
    mapInstanceRef.current.setZoom(13);
    if (markerRef.current) markerRef.current.setMap(null);
    markerRef.current = new window.google.maps.Marker({
      position: place.geometry.location,
      map: mapInstanceRef.current,
      title: /^[23456789CFGHJMPQRVWX]{4}\+/.test(place.formatted_address || '') ? place.name : (place.formatted_address || place.name),
    });
    setLocalSearched(true);
    setHasSearched(true);

    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);

    // Fetch photos for the most tourist attractive places within a 5km radius
    service.textSearch({
      location: place.geometry.location,
      radius: 5000,
      query: 'top tourist attractions',
    }, (results, status) => {
      let urls = [];
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        // Filter to only places with photos
        const withPhotos = results.filter(r => r.photos && r.photos.length > 0);
        
        // Filter to natural places and top tourist attractions, excluding commercial businesses
        const targetTypes = ['natural_feature', 'park', 'tourist_attraction', 'historical_landmark', 'place_of_worship'];
        const excludedTypes = ['store', 'restaurant', 'cafe', 'shopping_mall', 'supermarket', 'food', 'spa', 'gym', 'bar', 'lodging'];
        
        let filteredResults = withPhotos.filter(r => {
          if (r.types && r.types.some(t => excludedTypes.includes(t))) return false;
          return r.types && r.types.some(t => targetTypes.includes(t));
        });

        // Fallback: If strict filtering yields too few photos, relax to any non-commercial place with photos
        if (filteredResults.length < 5) {
          filteredResults = withPhotos.filter(r => {
            return !(r.types && r.types.some(t => excludedTypes.includes(t)));
          });
        }
        
        // Sort by popularity/rating
        const sorted = filteredResults.sort((a, b) => ((b.rating || 0) * (b.user_ratings_total || 0)) - ((a.rating || 0) * (a.user_ratings_total || 0)));
        
        // Take 1 photo per place
        urls = sorted.slice(0, 7).map(r => r.photos[0].getUrl({ maxWidth: 1600, maxHeight: 1200 }));
      }
      
      // If we don't get enough photos from nearby search, include the place's own photos if available
      if (urls.length < 5 && place.photos && place.photos.length > 0) {
         const ownUrls = place.photos.map(p => p.getUrl({ maxWidth: 1600, maxHeight: 1200 }));
         urls = [...new Set([...urls, ...ownUrls])].slice(0, 7);
      }

      setPlacePhotos(urls);
      if (urls.length > 0) {
        void saveRecentPlace(place, null, undefined, urls.slice(0, 2));
      }
    });

    // Fetch hotels from database within 30km radius
    setHotelsLoading(true);
    const locationName = place.displayName || place.formatted_address?.split(',')[0] || place.name || '';
    const loc = place.geometry.location;
    const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
    const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
    fetchHotels(locationName, lat, lng)
      .then(res => {
        const data = Array.isArray(res?.data) ? res.data : [];
        setNearbyHotels(data);
      })
      .catch(() => setNearbyHotels([]))
      .finally(() => setHotelsLoading(false));
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
      
      if (window.google?.maps?.Geocoder) {
        const geocoder = new window.google.maps.Geocoder();
        const results = await new Promise((resolve) => {
          geocoder.geocode({ location: userLocation }, (res, status) => {
            if (status === 'OK' && res && res.length > 0) resolve(res);
            else resolve(null);
          });
        });
        if (results && results[0]) {
          placeToSave = results[0];
        }
      }

      // Fetch photos for the home location using PlacesService
      let photoUrls = [];
      if (mapInstanceRef.current && window.google?.maps?.places?.PlacesService) {
        const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);

        // If the geocoded place has a place_id, try getDetails for photos first
        if (placeToSave.place_id) {
          photoUrls = await new Promise((resolve) => {
            service.getDetails(
              { placeId: placeToSave.place_id, fields: ['photos'] },
              (detail, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && detail?.photos?.length > 0) {
                  const urls = detail.photos.slice(0, 2).map((p) => {
                    try { return p.getUrl({ maxWidth: 400, maxHeight: 400 }); } catch { return ''; }
                  }).filter(Boolean);
                  resolve(urls);
                } else {
                  resolve([]);
                }
              }
            );
          });
        }

        // Fallback: search for nearby scenic photos if getDetails yielded nothing
        if (photoUrls.length === 0) {
          const locationName = placeToSave.formatted_address
            ? placeToSave.formatted_address.split(',').slice(0, 2).join(',')
            : 'Your Location';
          photoUrls = await new Promise((resolve) => {
            service.textSearch(
              { query: `scenic places near ${locationName}`, location: userLocation, radius: 5000 },
              (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.length > 0) {
                  const withPhotos = results.filter((r) => r.photos && r.photos.length > 0);
                  const urls = withPhotos.slice(0, 2).map((r) => {
                    try { return r.photos[0].getUrl({ maxWidth: 400, maxHeight: 400 }); } catch { return ''; }
                  }).filter(Boolean);
                  resolve(urls);
                } else {
                  resolve([]);
                }
              }
            );
          });
        }
      }
      
      await saveFavoritePlace(placeToSave, category, null, photoUrls);
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
      const photoUrls = [];
      if (searchedPlace.photos && searchedPlace.photos.length > 0) {
        searchedPlace.photos.slice(0, 2).forEach((photo) => {
          try {
            if (typeof photo.getUrl === 'function') {
              photoUrls.push(photo.getUrl({ maxWidth: 400, maxHeight: 400 }));
            }
          } catch (e) { /* ignore */ }
        });
      }
      await saveFavoritePlace(searchedPlace, category, null, photoUrls);
      setActionMessage({ text: 'Saved to favorites!', type: 'success' });
    } catch (error) {
      console.error('Error saving destination to favorites:', error);
      setActionMessage({ text: 'Failed to save to favorites', type: 'error' });
    }
  }, [searchedPlace]);

  const handleShareLocation = useCallback(async () => {
    if (!searchedPlace) return;
    
    let url = '';
    if (searchedPlace?.geometry?.location) {
      const lat = typeof searchedPlace.geometry.location.lat === 'function' ? searchedPlace.geometry.location.lat() : searchedPlace.geometry.location.lat;
      const lng = typeof searchedPlace.geometry.location.lng === 'function' ? searchedPlace.geometry.location.lng() : searchedPlace.geometry.location.lng;
      url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else {
      const name = searchedPlace?.displayName || searchedPlace?.formatted_address?.split(',')[0] || searchedPlace?.name;
      if (name) {
        url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
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

  const getRecentPlaceImages = (place) => {
    const storedImages = Array.isArray(place?.imageUrls) ? place.imageUrls.filter(Boolean).slice(0, 2) : [];

    if (storedImages.length > 0) {
      return storedImages;
    }

    return place?.imageUrl ? [place.imageUrl] : [];
  };

  const renderRecentPlaceMedia = (place) => {
    const images = getRecentPlaceImages(place);

    if (images.length === 0) {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280', textAlign: 'center', padding: '8px' }}>
          No image
        </div>
      );
    }

    if (images.length === 1) {
      return (
        <img
          src={images[0]}
          alt={place?.name || 'Recent place'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      );
    }

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', gap: '0px', background: '#E5E7EB' }}>
        <div style={{ width: '50%', height: '100%', overflow: 'hidden' }}>
          <img
            src={images[0]}
            alt={place?.name || 'Recent place'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <div style={{ width: '50%', height: '100%', overflow: 'hidden' }}>
          <img
            src={images[1]}
            alt={place?.name || 'Recent place'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    setShowSearchBar(true);
    setOnNavigate(handleNavigate);
    if (!searchedPlace) setHasSearched(false);

const initMap = (center, zoom) => {
  mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
    center,
    zoom,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    rotateControl: false,
    gestureHandling: 'cooperative',
    styles: [
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a2daf2' }] },
      { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#d0f0c0' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#9be79b' }] },
      { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#6abf69' }] },
    ],
  });
};

const placeUserMarker = (coords) => {
  if (userMarkerRef.current) userMarkerRef.current.setMap(null);
  userMarkerRef.current = new window.google.maps.Marker({
    position: coords,
    map: mapInstanceRef.current,
    title: 'Your Location',
    icon: {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: '#4285F4',
      fillOpacity: 1,
      strokeColor: '#fff',
      strokeWeight: 2,
    },
  });
};

ensureMapsScript(() => {
  let activeLocation = userLocation;
  if (activeLocation) {
    const isInsideSriLanka = activeLocation.lat >= 5.7 && activeLocation.lat <= 10.0 && activeLocation.lng >= 79.4 && activeLocation.lng <= 82.1;
    if (!isInsideSriLanka) {
      activeLocation = { lat: 6.9271, lng: 79.8612 };
      setUserLocation(activeLocation);
    }
  }

  // If returning with a previously searched place, center map on it
  const hasRestoredPlace = searchedPlace?.geometry?.location;
  let initialCenter;
  let initialZoom;
  if (hasRestoredPlace) {
    const loc = searchedPlace.geometry.location;
    initialCenter = { lat: typeof loc.lat === 'function' ? loc.lat() : loc.lat, lng: typeof loc.lng === 'function' ? loc.lng() : loc.lng };
    initialZoom = 13;
  } else {
    initialCenter = activeLocation || USER_LOCATION;
    initialZoom = activeLocation ? 14 : 8;
  }
  initMap(initialCenter, initialZoom);
  if (activeLocation) placeUserMarker(activeLocation);

  // Restore searched place marker and state
  if (hasRestoredPlace) {
    if (markerRef.current) markerRef.current.setMap(null);
    markerRef.current = new window.google.maps.Marker({
      position: searchedPlace.geometry.location,
      map: mapInstanceRef.current,
      title: searchedPlace.formatted_address || searchedPlace.name || searchedPlace.displayName || '',
    });
    setLocalSearched(true);
    setHasSearched(true);
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const isInsideSriLanka = pos.lat >= 5.7 && pos.lat <= 10.0 && pos.lng >= 79.4 && pos.lng <= 82.1;
        if (!isInsideSriLanka) {
          pos = { lat: 6.9271, lng: 79.8612 }; // Default to Colombo
        }
        setUserLocation(pos);
        placeUserMarker(pos);
      },
      (error) => {
        console.error("Error getting user location:", error);
        if (!activeLocation) {
          const fallbackPos = { lat: 6.9271, lng: 79.8612 };
          setUserLocation(fallbackPos);
          placeUserMarker(fallbackPos);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }
});


    return () => {
      setShowSearchBar(false);
      setOnNavigate(null);
    };
  }, []);

  // Sync userLocation from context to the map whenever it changes
  // This ensures the map shows the user's current location even if
  // it was resolved after mount (e.g. by geolocation or another page)
  useEffect(() => {
    if (!userLocation || !mapInstanceRef.current) return;

    // Only re-center when the user hasn't searched for a place yet
    if (!searched) {
      mapInstanceRef.current.setCenter(userLocation);
      mapInstanceRef.current.setZoom(14);
    }

    // Always keep the blue user-location marker up to date
    if (userMarkerRef.current) userMarkerRef.current.setMap(null);
    userMarkerRef.current = new window.google.maps.Marker({
      position: userLocation,
      map: mapInstanceRef.current,
      title: 'Your Location',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
    });
  }, [userLocation, searched]);

  useEffect(() => {
    if (!searchedPlace?.geometry?.location || !mapInstanceRef.current) return;
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
        <div className="relative" style={{ width: '100%' }}>
          <div
            ref={mapRef}
            className="w-full block shadow-lg"
            style={{ height: '750px', margin: 0, padding: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', overflow: 'hidden', borderRadius: '15px', position: 'relative', zIndex: 5 }}
          ></div>
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
                  {recentPlacesLoading && (
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#374151' }}>
                      Loading recent places...
                    </div>
                  )}

                  {!recentPlacesLoading && recentPlacesError && (
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#B91C1C' }}>
                      {recentPlacesError}
                    </div>
                  )}

                  {!recentPlacesLoading && !recentPlacesError && recentPlaces.length === 0 && (
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#374151' }}>
                      No recent places found.
                    </div>
                  )}

                  {!recentPlacesLoading && !recentPlacesError && recentPlaces.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridAutoRows: 'minmax(102px, auto)', gap: '26px 44px' }}>
                      {recentPlaces.map((place) => {
                        const placeName = place?.name || 'Unknown place';
                        const actionLabel = place?.action || 'Viewed';
                        const viewedLabel = place?.action === 'Got Direction' ? 'Got Direction' : formatViewedAgo(place?.timestamp);

                        return (
                          <div key={place._id} style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                            <div style={{ width: '102px', height: '102px', borderRadius: '16px', overflow: 'hidden', background: '#E5E7EB', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                              {renderRecentPlaceMedia(place)}
                            </div>

                            <div style={{ fontFamily: 'Inter, sans-serif', color: '#111827', lineHeight: 1.2, paddingRight: '28px' }}>
                              <div style={{ fontSize: '16px', fontWeight: 500 }}>{placeName}</div>
                              <div style={{ fontSize: '13px', marginTop: '4px' }}>{viewedLabel}</div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePlace(place._id, true);
                              }}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                right: '0',
                                transform: 'translateY(-50%)',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: '#EF4444',
                                color: '#FFF',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 10,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
                  {recentPlacesLoading && (
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#374151' }}>
                      Loading recent places...
                    </div>
                  )}

                  {!recentPlacesLoading && recentPlacesError && (
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#B91C1C' }}>
                      {recentPlacesError}
                    </div>
                  )}

                  {!recentPlacesLoading && !recentPlacesError && recentPlaces.length === 0 && (
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#374151' }}>
                      No recent places found.
                    </div>
                  )}

                  {!recentPlacesLoading && !recentPlacesError && recentPlaces.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridAutoRows: 'minmax(102px, auto)', gap: '26px 44px' }}>
                      {recentPlaces.map((place) => {
                        const placeName = place?.name || 'Unknown place';
                        const actionLabel = place?.action || 'Viewed';
                        const viewedLabel = place?.action === 'Got Direction' ? 'Got Direction' : formatViewedAgo(place?.timestamp);

                        return (
                          <div key={place._id} style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                            <div style={{ width: '102px', height: '102px', borderRadius: '16px', overflow: 'hidden', background: '#E5E7EB', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                              {renderRecentPlaceMedia(place)}
                            </div>

                            <div style={{ fontFamily: 'Inter, sans-serif', color: '#111827', lineHeight: 1.2, paddingRight: '28px' }}>
                              <div style={{ fontSize: '16px', fontWeight: 500 }}>{placeName}</div>
                              <div style={{ fontSize: '13px', marginTop: '4px' }}>{viewedLabel}</div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePlace(place._id, true);
                              }}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                right: '0',
                                transform: 'translateY(-50%)',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: '#EF4444',
                                color: '#FFF',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 10,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
