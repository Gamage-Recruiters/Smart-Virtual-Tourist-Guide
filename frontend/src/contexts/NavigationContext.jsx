import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [pendingOriginLabel, setPendingOriginLabel] = useState('');
  const [pendingVehicle, setPendingVehicle] = useState(null);
  const [etaData, setEtaData] = useState(null);
  const [safetyData, setSafetyData] = useState(null);

  return (
    <NavigationContext.Provider value={{
      pendingOriginLabel, setPendingOriginLabel,
      pendingVehicle, setPendingVehicle,
      etaData, setEtaData,
      safetyData, setSafetyData,
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
