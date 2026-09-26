import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  const [title, setTitle] = useState(' ');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  return (
    <UIContext.Provider value={{
      title, setTitle,
      showSearchBar, setShowSearchBar,
      hasSearched, setHasSearched,
    }}>
      {children}
    </UIContext.Provider>
  );
};
