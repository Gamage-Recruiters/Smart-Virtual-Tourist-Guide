import { useEffect, useRef, useCallback, useState } from 'react';
import L from 'leaflet';
import middle from '../assets/middle.png';
import exploreIcon from '../assets/explore.png';
import userIcon from '../assets/userIcon.png';
import directionIcon from '../assets/directionIcon.png';
import { usePageTitle } from '../contexts/PageTitleContext';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { reverseGeocode, getPlacePhoto, findNearbyPlaces } from '../utils/mapServices';
import { saveRecentPlace, saveFavoritePlace, fetchHotels } from '../services/api';
import { isInsideSriLanka } from '../utils/geo';
import { createUserLocationIcon } from '../utils/leafletSetup';
import '../utils/leafletSetup'; // ensures default icon fix runs

import ActionToast from '../components/shared/ActionToast';
import UserPopup from '../components/shared/UserPopup';
import PlaceDetailsPanel from '../components/explore/PlaceDetailsPanel';

const USER_LOCATION = { lat: 7.8731, lng: 80.7718 }; // Sri Lanka center

const Explore = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const lastHandledPlaceKeyRef = useRef('');

  const { setShowSearchBar, setOnNavigate, hasSearched, setHasSearched, searchedPlace, setUserLocation, userLocation } = usePageTitle();
  const appNavigate = useAppNavigate();
  const [localSearched, setLocalSearched] = useState(false);
  const searched = hasSearched || localSearched;
  const [placePhotos, setPlacePhotos] = useState([]);
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [detailsPanelCollapsed, setDetailsPanelCollapsed] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const getPlaceKey = useCallback((place) => {
    const placeId = place?.place_id || place?.placeId || '';
    const name = place?.displayName || place?.name || place?.formatted_address?.split(',')[0] || '';
    const lat = typeof place?.geometry?.location?.lat === 'function' ? place.geometry.location.lat() : place?.geometry?.location?.lat;
    const lng = typeof place?.geometry?.location?.lng === 'function' ? place.geometry.location.lng() : place?.geometry?.location?.lng;
    return placeId || `${name}:${lat ?? ''}:${lng ?? ''}`;
  }, []);

  const handleNavigate = useCallback(async (place) => {
    const placeKey = getPlaceKey(place);
    if (placeKey && lastHandledPlaceKeyRef.current === placeKey) return;

    if (placeKey) {
      lastHandledPlaceKeyRef.current = placeKey;
    }

    void saveRecentPlace(place, null);

    if (!mapInstanceRef.current || !place.geometry?.location) return;
    const loc = place.geometry.location;
    const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
    const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;

    mapInstanceRef.current.setView([lat, lng], 13);
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current)
      .bindPopup(place.displayName || place.formatted_address || place.name || '')
      .openPopup();
    setLocalSearched(true);
    setHasSearched(true);

    // Fetch photos using Wikimedia for nearby tourist attractions
    const placeName = place.displayName || place.formatted_address?.split(',')[0] || place.name || '';
    const nearbyPlaces = await findNearbyPlaces(lat, lng, 5000);
    const photoPromises = nearbyPlaces.slice(0, 7).map(p => getPlacePhoto(p.name));
    const photoResults = await Promise.all(photoPromises);
    let urls = photoResults.filter(Boolean);

    // Also try to get a photo for the searched place itself
    if (urls.length < 5 && placeName) {
      const mainPhoto = await getPlacePhoto(placeName);
      if (mainPhoto && !urls.includes(mainPhoto)) {
        urls = [mainPhoto, ...urls].slice(0, 7);
      }
    }

    setPlacePhotos(urls);
    if (urls.length > 0) {
      void saveRecentPlace(place, null, undefined, urls.slice(0, 2));
    }

    // Fetch hotels from database within 30km radius
    setHotelsLoading(true);
    const locationName = place.displayName || place.formatted_address?.split(',')[0] || place.name || '';
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
    appNavigate(targetPage);
  }, [searchedPlace, appNavigate]);

  const handleSavePlace = useCallback(async () => {
    if (!userLocation) {
      setActionMessage({ text: 'Current location not found.', type: 'error' });
      return;
    }
    try {
      const category = 'home';
      let placeToSave = { name: "Your Location", geometry: { location: userLocation } };
      
      try {
        const result = await reverseGeocode(userLocation.lat, userLocation.lng);
        if (result && result.display_name) {
          placeToSave = {
            name: result.display_name.split(',')[0],
            formatted_address: result.display_name,
            geometry: { location: userLocation },
          };
        }
      } catch { /* keep default */ }

      let photoUrls = [];
      const locationName = placeToSave.name || placeToSave.formatted_address?.split(',').slice(0, 2).join(',') || 'Your Location';
      const photo = await getPlacePhoto(locationName);
      if (photo) photoUrls.push(photo);

      if (photoUrls.length === 0) {
        const nearbyPlaces = await findNearbyPlaces(userLocation.lat, userLocation.lng, 5000);
        for (const p of nearbyPlaces.slice(0, 2)) {
          const url = await getPlacePhoto(p.name);
          if (url) photoUrls.push(url);
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
      const placeName = searchedPlace.displayName || searchedPlace.formatted_address?.split(',')[0] || searchedPlace.name || '';
      const photoUrls = [];
      if (placeName) {
        const photo = await getPlacePhoto(placeName);
        if (photo) photoUrls.push(photo);
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
      url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;
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

  const getRecentPlaceImages = (place) => {
    const storedImages = Array.isArray(place?.imageUrls) ? place.imageUrls.filter(Boolean).slice(0, 2) : [];
    if (storedImages.length > 0) return storedImages;
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

    const userLocationIcon = createUserLocationIcon();

    const initMap = (center, zoom) => {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom,
        zoomControl: true,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    };

    const placeUserMarker = (coords) => {
      if (userMarkerRef.current) userMarkerRef.current.remove();
      userMarkerRef.current = L.marker([coords.lat, coords.lng], { icon: userLocationIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('Your Location');
    };

    let activeLocation = userLocation;
    if (activeLocation) {
      if (!isInsideSriLanka(activeLocation.lat, activeLocation.lng)) {
        activeLocation = { lat: 6.9271, lng: 79.8612 };
        setUserLocation(activeLocation);
      }
    }

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

    if (hasRestoredPlace) {
      const loc = searchedPlace.geometry.location;
      const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
      const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current)
        .bindPopup(searchedPlace.formatted_address || searchedPlace.name || searchedPlace.displayName || '');
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
          const insideSL = isInsideSriLanka(pos.lat, pos.lng);
          if (!insideSL) {
            pos = { lat: 6.9271, lng: 79.8612 };
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

    return () => {
      setShowSearchBar(false);
      setOnNavigate(null);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!userLocation || !mapInstanceRef.current) return;
    if (!searched) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 14);
    }
    const userLocationIcon = createUserLocationIcon();
    if (userMarkerRef.current) userMarkerRef.current.remove();
    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userLocationIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup('Your Location');
  }, [userLocation, searched]);

  useEffect(() => {
    if (!searchedPlace?.geometry?.location || !mapInstanceRef.current) return;
    handleNavigate(searchedPlace);
  }, [searchedPlace, handleNavigate]);

  return (
    <div className="relative w-full h-full py-12" style={{ minHeight: '700px' }}>
      <ActionToast message={actionMessage} onDismiss={() => setActionMessage(null)} />

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
            onClick={() => appNavigate('directionOne')}
            style={{ position: 'absolute', bottom: '20px', right: '50px', width: '70px', cursor: 'pointer', zIndex: 40 }}
          />
        </div>
      </div>

      {/* Post-search details panel OR bottom icon buttons */}
      {searched ? (
        <>
          <PlaceDetailsPanel
            searchedPlace={searchedPlace}
            detailsPanelCollapsed={detailsPanelCollapsed}
            setDetailsPanelCollapsed={setDetailsPanelCollapsed}
            showUserPopup={showUserPopup}
            placePhotos={placePhotos}
            nearbyHotels={nearbyHotels}
            handleExploreAction={handleExploreAction}
            handleSavePlace={handleSavePlace}
            handleSaveDestinationToFavorites={handleSaveDestinationToFavorites}
            handleShareLocation={handleShareLocation}
          />
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
                <UserPopup
                  onClose={() => setShowUserPopup(false)}
                  setActionMessage={setActionMessage}
                  renderRecentPlaceMedia={renderRecentPlaceMedia}
                />
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
            <UserPopup
              onClose={() => setShowUserPopup(false)}
              setActionMessage={setActionMessage}
              renderRecentPlaceMedia={renderRecentPlaceMedia}
            />
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
