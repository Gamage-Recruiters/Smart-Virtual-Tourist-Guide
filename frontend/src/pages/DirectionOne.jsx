import { useState, useEffect } from 'react';
import middle from '../assets/middle.png';
import bikeIcon from '../assets/bikeIcon.png';
import busIcon from '../assets/busIcon.png';
import carIcon from '../assets/carIcon.png';
import clockIcon from '../assets/clockIcon.png';
import directionCircle from '../assets/directionCircle.png';
import locationRed from '../assets/locationRed.png';
import manIcon from '../assets/manIcon.png';
import upDown from '../assets/upDown.png';
import { useLocationSearch } from '../utils/useLocationSearch';
import { usePageTitle } from '../contexts/PageTitleContext';
import { geocodeAddress } from '../utils/geoapifyService';
import { saveRecentPlace, fetchRecentPlaces } from '../services/api';
import styles from './DirectionOne.module.css';

const LocationRow = ({ icon, search, placeholder, vehicleIcon, onSearch }) => {
  return (
    <div ref={search.containerRef} className="relative flex items-center">
      <img src={icon} alt={placeholder} className={styles.rowIcon} />
      <div className={`bg-gradient-to-r from-[#FFFFFF] to-[#A0DBFF] shadow text-full text-center font-bold relative ${styles.inputBox}`}>
        <input
          type="text"
          value={search.query}
          onChange={search.handleChange}
          onKeyDown={search.handleKeyDown}
          placeholder={placeholder}
          className={`border-0 bg-transparent text-center font-bold text-gray-800 outline-none ${styles.inputField}`}
        />
        {vehicleIcon && (
          <svg
            onClick={onSearch}
            width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#1A73E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={styles.searchIconBtn}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
      </div>

      {search.suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {search.suggestions.map((place, idx) => (
            <li
              key={place.place_id}
              onMouseDown={() => search.confirmPlace(place.place_id, place.structured_formatting.main_text)}
              onMouseEnter={() => search.setActiveIdx(idx)}
              className={`${styles.suggestionItem} ${idx === search.activeIdx ? styles.suggestionItemActive : ''}`}
            >
              <span className={styles.bullet}>•</span>
              <span>
                <strong>{place.structured_formatting.main_text}</strong>
                {place.structured_formatting.secondary_text && (
                  <span className={styles.secondaryText}>{place.structured_formatting.secondary_text}</span>
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
  const { setActivePage, setSearchedPlace, setUserLocation, setPendingOriginLabel, setPendingVehicle, searchedPlace } = usePageTitle();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [recentPlaces, setRecentPlaces] = useState([]);
  const originSearch = useLocationSearch(() => {}, '');
  
  const initialDest = searchedPlace?.displayName || searchedPlace?.name || searchedPlace?.formatted_address?.split(',')[0] || '';
  const destinationSearch = useLocationSearch(() => {}, initialDest);

  useEffect(() => {
    let isActive = true;
    fetchRecentPlaces(undefined, 6)
      .then(response => {
        if (isActive && Array.isArray(response?.data)) {
          setRecentPlaces(response.data);
        }
      })
      .catch(console.error);

    return () => { isActive = false; };
  }, []);

  const vehicleIconMap = { bus: busIcon, bike: bikeIcon, car: carIcon, man: manIcon };
  const bothFilled = originSearch.query.trim() && destinationSearch.query.trim();
  const activeVehicleIcon = bothFilled && selectedVehicle ? vehicleIconMap[selectedVehicle] : null;

  const handleSearch = async (vehicleToUse = selectedVehicle) => {
    if (!destinationSearch.query.trim()) return;
    const originPlace = originSearch.query.trim() ? await geocodeAddress(originSearch.query) : null;
    const destinationPlace = await geocodeAddress(destinationSearch.query);
    if (originPlace?.geometry?.location) {
      setUserLocation(originPlace.geometry.location);
      setPendingOriginLabel(originSearch.query);
    }
    if (destinationPlace) {
      setSearchedPlace({ ...destinationPlace, displayName: destinationSearch.query });
      void saveRecentPlace(destinationPlace, 'Got Direction');
    }
    if (vehicleToUse) setPendingVehicle(vehicleToUse);
    setActivePage('direction');
  };

  const handleSwap = () => {
    const originValue = originSearch.query;
    const destinationValue = destinationSearch.query;

    originSearch.setQuery(destinationValue);
    destinationSearch.setQuery(originValue);
    originSearch.setActiveIdx(-1);
    destinationSearch.setActiveIdx(-1);
  };

  const vehicles = [
    { key: 'bus',  src: busIcon,  alt: 'Bus',  className: 'w-12 h-12' },
    { key: 'bike', src: bikeIcon, alt: 'Bike', className: 'w-12 h-12' },
    { key: 'car',  src: carIcon,  alt: 'Car',  className: 'w-12.3 h-9'  },
    { key: 'man',  src: manIcon,  alt: 'Walk', className: 'w-12 h-11.3' },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#e3f3fc] flex flex-col items-center">
      <style>{`
        input::placeholder { opacity: 1; transition: opacity 0.2s; }
        input:focus::placeholder { opacity: 0; }
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
      <div className={`relative z-20 flex items-center ${styles.locationInputsContainer}`}>
        {/* Two text box rows */}
        <div className={`flex flex-col ${styles.rowsColumn}`}>
          <LocationRow
            icon={directionCircle}
            search={originSearch}
            placeholder="Your location"
          />
          <LocationRow
            icon={locationRed}
            search={destinationSearch}
            placeholder="Choose destination"
            vehicleIcon={activeVehicleIcon}
            onSearch={handleSearch}
          />
        </div>

        {/* Single upDown icon beside both boxes */}
        <img
          src={upDown}
          alt="Swap"
          onClick={handleSwap}
          className={styles.swapIcon}
        />
      </div>

      {/* Transport Icons */}
      <div className="relative z-10 flex justify-center gap-32 mt-6 mb-10">
        {vehicles.map(({ key, src, alt, className }) => (
          <img
            key={key}
            src={src}
            alt={alt}
            className={`${className} ${styles.vehicleBtn} ${selectedVehicle === key ? styles.vehicleBtnSelected : ''}`}
            onClick={() => {
              setSelectedVehicle(key);
              if (destinationSearch.query.trim()) {
                handleSearch(key);
              }
            }}
          />
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
          <div className="flex flex-col gap-7">
            {recentPlaces.length === 0 ? (
              <div className="text-sm font-medium text-gray-800 pl-4">No recent places found.</div>
            ) : (
              recentPlaces.map((place) => (
                <div
                  key={place._id}
                  className="flex items-center bg-[#A2D4F2] rounded-lg px-4 py-5 shadow cursor-pointer hover:bg-[#8cc9ec] transition-colors"
                  onClick={() => {
                    const placeName = place.name || place.displayName;
                    destinationSearch.setQuery(placeName);
                    void geocodeAddress(placeName).then((result) => {
                      if (result) {
                        setSearchedPlace({ ...result, displayName: placeName });
                        setActivePage('explore');
                      }
                    });
                  }}
                >
                  <img
                    src={clockIcon}
                    alt="Clock"
                    className="w-7 h-7 mr-3 opacity-80"
                  />
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
