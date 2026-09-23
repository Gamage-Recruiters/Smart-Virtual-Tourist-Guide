import { useState, useRef, useEffect } from 'react';
import middle from '../assets/middle.png';
import { Bike, Bus, Car, Footprints, Clock, CircleDot, MapPin, ArrowUpDown } from 'lucide-react';
import { useLocationSearch } from '../utils/useLocationSearch';
import { useLocationContext } from '../contexts/LocationContext';
import { useNavigationContext } from '../contexts/NavigationContext';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { geocodeAddress } from '../utils/mapServices';
import { saveRecentPlace, fetchRecentPlaces } from '../services/api';

const LocationRow = ({ icon: Icon, iconColor, search, placeholder, vehicleIcon: VehicleIcon, onSearch }) => {
  return (
    <div ref={search.containerRef} className="relative flex items-center">
      <Icon size={48} color={iconColor} style={{ marginRight: '10px' }} />
      <div
        className="bg-gradient-to-r from-[#FFFFFF] to-[#A0DBFF] shadow text-full text-center font-bold relative"
        style={{ borderRadius: '8px', padding: '16px 24px', width: '700px', display: 'flex', alignItems: 'center' }}
      >
        <input
          type="text"
          value={search.query}
          onChange={search.handleChange}
          onKeyDown={search.handleKeyDown}
          placeholder={placeholder}
          className="border-0 bg-transparent text-center font-bold text-gray-800 outline-none"
          style={{ caretColor: '#1A73E8', flex: 1 }}
          onFocus={e => e.target.style.setProperty('--placeholder-opacity', '0')}
          onBlur={e => e.target.style.setProperty('--placeholder-opacity', '0.45')}
        />
        {VehicleIcon && (
          <svg
            onClick={onSearch}
            width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#1A73E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0, cursor: 'pointer' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
      </div>

      {search.suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: '58px',
            width: '700px',
            background: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            zIndex: 9999,
            listStyle: 'none',
            margin: 0,
            padding: '4px 0',
            maxHeight: '220px',
            overflowY: 'auto',
          }}
        >
          {search.suggestions.map((place, idx) => (
            <li
              key={place.osm_id || idx}
              onMouseDown={() => search.confirmPlace(place)}
              onMouseEnter={() => search.setActiveIdx(idx)}
              style={{
                padding: '9px 14px',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#333',
                background: idx === search.activeIdx ? '#EFF6FF' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: '#6B7280', fontSize: '13px' }}>•</span>
              <span>
                <strong>{place.name}</strong>
                {place.displayName && place.displayName !== place.name && (
                  <span style={{ color: '#6B7280', marginLeft: 4 }}>{place.displayName}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const DirectionOne = () => {
  const { setSearchedPlace, setUserLocation, searchedPlace } = useLocationContext();
  const { setPendingOriginLabel, setPendingVehicle } = useNavigationContext();
  const appNavigate = useAppNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [swapped, setSwapped] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recentPlaces, setRecentPlaces] = useState([]);
  const handlePlaceSelect = async (place) => {
    try {
      await saveRecentPlace(place, null);
      const response = await fetchRecentPlaces(undefined, 50);
      if (Array.isArray(response?.data)) {
        setRecentPlaces(response.data);
      }
    } catch (error) {
      console.error('Failed to save recent place:', error);
    }
  };

  const originSearch = useLocationSearch(handlePlaceSelect, '');
  
  const initialDest = searchedPlace?.displayName || searchedPlace?.name || searchedPlace?.formatted_address?.split(',')[0] || '';
  const destinationSearch = useLocationSearch(handlePlaceSelect, initialDest);

  useEffect(() => {
    let isActive = true;
    fetchRecentPlaces(undefined, 50)
      .then(response => {
        if (isActive && Array.isArray(response?.data)) {
          setRecentPlaces(response.data);
        }
      })
      .catch(console.error);

    return () => { isActive = false; };
  }, []);

  const vehicleIconMap = { bus: Bus, bike: Bike, car: Car, man: Footprints };
  const bothFilled = originSearch.query.trim() && destinationSearch.query.trim();
  const activeVehicleIcon = bothFilled && selectedVehicle ? vehicleIconMap[selectedVehicle] : null;

  const handleSearch = async (vehicleToUse = selectedVehicle) => {
    if (!destinationSearch.query.trim()) return;
    setSearching(true);

    const processDestination = async () => {
      const destResult = await geocodeAddress(destinationSearch.query);
      setSearching(false);
      if (destResult) {
        const destinationPlace = {
          displayName: destinationSearch.query,
          formatted_address: destResult.displayName,
          geometry: { location: { lat: destResult.lat, lng: destResult.lng } },
        };
        setSearchedPlace(destinationPlace);
        void saveRecentPlace(destinationPlace, 'Got Direction');
      }
      if (vehicleToUse) setPendingVehicle(vehicleToUse);
      appNavigate('direction');
    };

    if (originSearch.query.trim()) {
      const originResult = await geocodeAddress(originSearch.query);
      if (originResult) {
        setUserLocation({ lat: originResult.lat, lng: originResult.lng });
        setPendingOriginLabel(originSearch.query);
      }
      await processDestination();
    } else {
      await processDestination();
    }
  };

  const handleSwap = () => {
    const originValue = originSearch.query;
    const destinationValue = destinationSearch.query;

    originSearch.setQuery(destinationValue);
    destinationSearch.setQuery(originValue);
    originSearch.setActiveIdx(-1);
    destinationSearch.setActiveIdx(-1);
    setSwapped((prev) => !prev);
  };

  const vehicles = [
    { key: 'bus',  icon: Bus,        alt: 'Bus',  className: 'w-12 h-12' },
    { key: 'bike', icon: Bike,       alt: 'Bike', className: 'w-12 h-12' },
    { key: 'car',  icon: Car,        alt: 'Car',  className: 'w-12.3 h-9'  },
    { key: 'man',  icon: Footprints, alt: 'Walk', className: 'w-12 h-11.3' },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#e3f3fc] flex flex-col items-center">
      <style>{`
        input::placeholder { opacity: 1; transition: opacity 0.2s; }
        input:focus::placeholder { opacity: 0; }
        .recent-scroll::-webkit-scrollbar { width: 6px; }
        .recent-scroll::-webkit-scrollbar-track { background: transparent; }
        .recent-scroll::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.2); border-radius: 10px; }
      `}</style>
      {/* Background image */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <img 
          src={middle} 
          alt="Ocean background" 
          className="w-full h-full object-cover scale-x-[1.7]" 
        />
      </div>

      {/* Location Inputs - left aligned, adjust marginLeft/marginTop/gap values */}
      <div
        className="relative z-20 flex items-center"
        style={{ marginTop: '20px', marginLeft: '700px', gap: '12px' }}
      >
        {/* Two text box rows */}
        <div className="flex flex-col" style={{ gap: '20px' }}>
          <LocationRow
            icon={CircleDot}
            iconColor="#1A73E8"
            search={originSearch}
            placeholder="Your location"
          />
          <LocationRow
            icon={MapPin}
            iconColor="#EF4444"
            search={destinationSearch}
            placeholder="Choose destination"
            vehicleIcon={activeVehicleIcon}
            onSearch={handleSearch}
          />
        </div>

        {/* Single upDown icon beside both boxes */}
        <ArrowUpDown
          size={40}
          color="#333"
          onClick={handleSwap}
          style={{ marginLeft: '20px', cursor: 'pointer', marginRight: '720px' }}
        />
      </div>

      {/* Transport Icons */}
<div className="relative z-10 flex justify-center gap-32 mt-6 mb-10">
  {vehicles.map(({ key, icon: VehicleIcon, alt, className }) => (
    <div
      key={key}
      className={className}
      onClick={() => {
        setSelectedVehicle(key);
        if (destinationSearch.query.trim()) {
          handleSearch(key);
        }
      }}
      style={{
        cursor: 'pointer',
        borderRadius: '4px',
        padding: '6px',
        transition: 'background 0.2s, box-shadow 0.2s',
        background: selectedVehicle === key ? 'rgba(0,0,0,0.1)' : 'transparent',
        boxShadow: selectedVehicle === key ? '0 0 0 1px #5d5d61' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        if (selectedVehicle !== key) {
          e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (selectedVehicle !== key) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      <VehicleIcon size={36} color="#333" />
    </div>
  ))}
</div>

      {/* Recent Section */}
      <div className="relative z-10 w-full max-w-full mt-12 ">
        {/* Large container box */}
        <div className="bg-[#D7EEFD] rounded-lg px-4 py-6 shadow w-full">
          {/* Recent heading inside box */}
          <div className="text-xl font-bold text-gray-700 mb-12 pl-4">
            recent
          </div>

          {/* Recent places inside same box */}
          <div className="flex flex-col gap-7 overflow-y-auto pr-2 recent-scroll" style={{ maxHeight: '400px' }}>
            {recentPlaces.length === 0 ? (
              <div className="text-sm font-medium text-gray-800 pl-4">No recent places found.</div>
            ) : (
              recentPlaces.map((place) => (
                <div
                  key={place._id}
                  className="flex items-center bg-[#A2D4F2] rounded-lg px-4 py-5 shadow cursor-pointer hover:bg-[#8cc9ec] transition-colors"
                  onClick={async () => {
                    const placeName = place.name || place.displayName;
                    destinationSearch.setQuery(placeName);
                    const result = await geocodeAddress(placeName);
                    if (result) {
                      setSearchedPlace({
                        displayName: placeName,
                        formatted_address: result.displayName,
                        geometry: { location: { lat: result.lat, lng: result.lng } },
                      });
                      appNavigate('explore');
                    }
                  }}
                >
                  <Clock size={28} className="mr-3 opacity-80" />
                  <span className="text-sm font-medium text-gray-800">{place.name || place.displayName}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
    );
};

export default DirectionOne;
