import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { CITIES_LIST } from '../../utils/cities'; 

const LocationSelector = () => {
  const { isMobileDevice, socket, connectionStatus, requestNotificationPermission } = useSocket();
  
  const [selectedCity, setSelectedCity] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isMobileDevice) {
      setIsModalOpen(true);
    }
  }, [isMobileDevice]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isMobileDevice || !isModalOpen) {
    return null;
  }

  const filteredCities = CITIES_LIST.filter((cityObj) =>
    cityObj.division.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCity = (cityObj) => {
    setSelectedCity(cityObj); 
    setSearchTerm(cityObj.division); 
    setShowDropdown(false); 
  };

  const handleConfirmLocation = async () => {
    if (selectedCity) {
      if (socket && connectionStatus === "connected") {
        socket.emit("update_manual_region", { 
          division: selectedCity.division, 
          district: selectedCity.district 
        });
      } 
      
      if (requestNotificationPermission) {
        await requestNotificationPermission(); 
      }
      setIsModalOpen(false); 
    }
  };

  return (
    // 🎨 Added a slight bluish blur to the background to match the theme
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      
      {/* 🎨 Super rounded corners (3xl), soft shadow, and a subtle top border gradient */}
      <div className="w-full max-w-md p-8 mx-4 bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,123,255,0.1)] rounded-[2rem] border border-white/50 animate-fade-in-up relative overflow-hidden">
        
        {/* Decorative background blur inside the modal */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

        {/* Header Section */}
        <div className="relative flex flex-col items-center text-center z-10">
          <div className="flex items-center justify-center w-16 h-16 mb-5 text-[#00aaff] bg-[#00aaff]/10 rounded-full ring-8 ring-[#00aaff]/5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Discover Sri Lanka</h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Tell us where you are right now to get personalized recommendations and smart alerts.
          </p>
        </div>

        {/* Search Input Section */}
        <div className="relative mt-8 z-10" ref={dropdownRef}>
          <div className="relative group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true); 
                setSelectedCity(null);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search your city..."
              // 🎨 Pill-shaped input to match the "Discover Destination" button
              className="w-full px-5 py-4 pl-12 text-sm font-semibold text-slate-700 transition-all border-2 border-slate-100 bg-slate-50/50 rounded-full focus:outline-none focus:border-[#00aaff] focus:bg-white focus:ring-4 focus:ring-[#00aaff]/10 placeholder-slate-400"
            />
            {/* Search Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-5 h-5 text-slate-400 left-4 top-[18px] transition-colors group-focus-within:text-[#00aaff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {showDropdown && (
            <div className="absolute z-20 w-full mt-2 overflow-y-auto bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl rounded-2xl max-h-48 custom-scrollbar">
              {filteredCities.length > 0 ? (
                filteredCities.map((cityObj, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectCity(cityObj)}
                    className="px-5 py-3 text-sm font-semibold text-slate-700 transition-colors cursor-pointer hover:bg-[#00aaff]/10 hover:text-[#00aaff]"
                  >
                    {cityObj.division} <span className="text-[11px] font-medium text-slate-400 ml-1">({cityObj.district})</span>
                  </div>
                ))
              ) : (
                <div className="px-5 py-4 text-sm font-medium text-slate-400 text-center">
                  No cities found. 🌍
                </div>
              )}
            </div>
          )}

          {/* Confirm Button */}
          <button 
            onClick={handleConfirmLocation}
            disabled={!selectedCity}
            // 🎨 Pill-shaped button matching "Start Your Journey" with gradient and shadow
            className={`w-full py-4 mt-8 text-sm font-bold text-white rounded-full transition-all duration-300 transform ${
              selectedCity 
                ? "bg-gradient-to-r from-[#00bfff] to-[#007bff] hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,123,255,0.3)]" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Start Exploring
          </button>
        </div>

      </div>
    </div>
  );
};

export default LocationSelector;