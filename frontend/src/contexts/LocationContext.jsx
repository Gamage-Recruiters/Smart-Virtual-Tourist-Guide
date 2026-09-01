import React, { createContext, useContext, useState, useRef } from 'react';

const LocationContext = createContext();

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [searchedPlace, setSearchedPlace] = useState(null);
  const onNavigateRef = useRef(null);

  const setOnNavigate = (fn) => { onNavigateRef.current = fn; };
  const navigateToSearch = (place) => {
    onNavigateRef.current?.(place);
    setSearchedPlace(place);
  };

  return (
    <LocationContext.Provider value={{
      userLocation, setUserLocation,
      searchedPlace, setSearchedPlace,
      setOnNavigate, navigateToSearch,
    }}>
      {children}
    </LocationContext.Provider>
  );
};
