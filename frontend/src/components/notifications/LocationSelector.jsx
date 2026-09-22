import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { CITIES_LIST } from '../../utils/cities';

/**
 * LocationSelector — Modal component for desktop users to manually set their current city.
 *
 * Shown automatically on first login for non-mobile users. Persists selection to
 * `localStorage` so it does not reappear on subsequent page loads or navigations.
 *
 * On confirmation it:
 *  1. Emits a `update_manual_region` socket event so the server can assign the user
 *     to the correct regional notification rooms and FCM topics.
 *  2. Triggers the browser notification permission prompt and FCM token registration.
 *
 * Renders nothing (`null`) on mobile devices — they use automatic GPS instead.
 *
 * @component
 * @returns {React.ReactElement|null} The location selection modal, or null if not applicable.
 */
const LocationSelector = () => {
  const { isMobileDevice, socket, connectionStatus, requestNotificationPermission } = useSocket();

  const [selectedCity, setSelectedCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Ref attached to the dropdown wrapper to detect clicks outside and close the dropdown.
  const dropdownRef = useRef(null);

  useEffect(() => {
    const isLocationSaved = localStorage.getItem('user_location_set');

    // Open the modal only on desktop and only if the user hasn't set a location before.
    // The 'user_location_set' flag is written to localStorage on successful confirmation.
    if (!isMobileDevice && !isLocationSaved) {
      setIsModalOpen(true);
    }
  }, [isMobileDevice]);

  useEffect(() => {
    // Close the autocomplete dropdown when the user clicks anywhere outside the dropdown wrapper.
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Skip rendering entirely on mobile (GPS handles location) or if already confirmed.
  if (isMobileDevice || !isModalOpen) {
    return null;
  }

  // Filter the city list reactively based on the user's search term.
  const filteredCities = CITIES_LIST.filter((cityObj) =>
    cityObj.division.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Updates component state when a city is selected from the autocomplete list.
   *
   * @param {{ division: string, district: string }} cityObj - The selected city object.
   */
  const handleSelectCity = (cityObj) => {
    setSelectedCity(cityObj);
    setSearchTerm(cityObj.division);
    setShowDropdown(false);
  };

  /**
   * Handles the "Start Exploring" confirmation button.
   * Emits the selected region via socket, requests FCM permission, and
   * persists the selection so this modal does not reappear.
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleConfirmLocation = async () => {
    if (selectedCity) {
      if (socket && connectionStatus === "connected") {
        // Notify the server of the manually selected region so it can:
        // 1. Add this socket to the appropriate geographic rooms.
        // 2. Subscribe this device's FCM token to the correct push topics.
        socket.emit("update_manual_region", {
          division: selectedCity.division,
          district: selectedCity.district
        });
      }

      if (requestNotificationPermission) {
        // Request browser push notification permission after the user has taken
        // a deliberate action, avoiding auto-prompts that users typically reject.
        await requestNotificationPermission();
      }

      // Persist the flag so the modal doesn't reappear on refresh or navigation.
      localStorage.setItem('user_location_set', 'true');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">

      {/* overflow-hidden is intentionally scoped to a non-interactive inner element
          so the autocomplete dropdown can overflow the card boundary visually. */}
      <div className="w-full max-w-md p-8 mx-4 bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,123,255,0.1)] rounded-[2rem] border border-white/50 animate-fade-in-up relative">

        {/* Decorative background blobs — isolated in an absolute container so overflow
            clipping here does not affect the dropdown positioned with z-20 above. */}
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-cyan-400 mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        {/* Header Section */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-5 text-[#00aaff] bg-[#00aaff]/10 rounded-full ring-8 ring-[#00aaff]/5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Discover Sri Lanka</h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Tell us where you are right now to get personalized recommendations and smart alerts.
          </p>
        </div>

        {/* Search Input Section */}
        <div className="relative z-20 mt-8" ref={dropdownRef}>
          <div className="relative group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                // Clear the confirmed selection when the user starts typing again.
                setSelectedCity(null);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search your city..."
              className="w-full px-5 py-4 pl-12 text-sm font-semibold text-slate-700 transition-all border-2 border-slate-100 bg-slate-50/50 rounded-full focus:outline-none focus:border-[#00aaff] focus:bg-white focus:ring-4 focus:ring-[#00aaff]/10 placeholder-slate-400"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-5 h-5 text-slate-400 left-4 top-[18px] transition-colors group-focus-within:text-[#00aaff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {showDropdown && (
            <div className="absolute z-50 w-full mt-2 overflow-y-auto border shadow-xl bg-white/95 backdrop-blur-md border-slate-100 rounded-2xl max-h-48 custom-scrollbar">
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
                <div className="px-5 py-4 text-sm font-medium text-center text-slate-400">
                  No cities found. 🌍
                </div>
              )}
            </div>
          )}

          {/* Confirm Button — disabled until a city is explicitly selected from the list */}
          <button
            onClick={handleConfirmLocation}
            disabled={!selectedCity}
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