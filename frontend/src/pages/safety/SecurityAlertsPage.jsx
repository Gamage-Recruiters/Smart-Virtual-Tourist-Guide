import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { FiSearch, FiLoader, FiMapPin } from 'react-icons/fi';
import safetyService from '../../services/safetyService';
import AlertMap from '../../components/safety/AlertMap';
import AlertCard from '../../components/safety/AlertCard';

// Default to Colombo, Sri Lanka
const DEFAULT_COORDS = { lat: 6.9271, lng: 79.8612 };
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// All 25 districts + key tourist spots for autocomplete suggestions
const LOCATION_SUGGESTIONS = [
  // 25 Districts
  'Colombo', 'Gampaha', 'Kalutara',
  'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota',
  'Jaffna', 'Kilinochchi', 'Mullaitivu', 'Mannar', 'Vavuniya',
  'Trincomalee', 'Batticaloa', 'Ampara',
  'Kurunegala', 'Puttalam',
  'Anuradhapura', 'Polonnaruwa',
  'Badulla', 'Monaragala',
  'Ratnapura', 'Kegalle',
  // Popular tourist areas
  'Sigiriya', 'Ella', 'Mirissa', 'Unawatuna', 'Hikkaduwa',
  'Dambulla', 'Negombo', 'Bentota', 'Arugam Bay', 'Tangalle',
  'Horton Plains', 'Yala', 'Udawalawe', 'Wilpattu', 'Pinnawala',
];

export default function SecurityAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [mapCenter, setMapCenter] = useState([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng]);
  const [searchedLocation, setSearchedLocation] = useState('Colombo');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const refreshTimer = useRef(null);
  const searchContainerRef = useRef(null);

  // Filter suggestions based on search input
  const suggestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return LOCATION_SUGGESTIONS.filter((loc) =>
      loc.toLowerCase().includes(query)
    ).slice(0, 8); // Show max 8 suggestions
  }, [search]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all alerts in Sri Lanka
  const fetchAlerts = useCallback(async () => {
    try {
      const data = await safetyService.getSecurityAlerts({});
      setAlerts(data);
    } catch (error) {
      console.error('Failed to load security alerts:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    refreshTimer.current = setInterval(() => {
      fetchAlerts();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(refreshTimer.current);
  }, [fetchAlerts]);

  // Perform the actual search (geocode + center map)
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) return;

    setSearching(true);
    setSelectedAlert(null);
    setShowSuggestions(false);

    const geo = await safetyService.geocodeLocation(query);
    if (geo) {
      setMapCenter([geo.lat, geo.lng]);
      setSearchedLocation(geo.name || query);
    }
    setSearching(false);
  }, []);

  // Handle form submit
  const handleSearch = async (e) => {
    e.preventDefault();
    await performSearch(search);
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (name) => {
    setSearch(name);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    performSearch(name);
  };

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeSuggestionIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Filter by text when no geocode result (fallback)
  const filteredAlerts = useMemo(() => {
    // If we're doing server-side location filtering, show all results
    return alerts;
  }, [alerts]);

  return (
    <main className="min-h-screen bg-[#F6F8FA] px-6 py-7 md:px-9">
      {/* Main Content Area */}
      <div className="mx-auto max-w-[1160px]">

        {/* Search Bar with Autocomplete */}
        <div ref={searchContainerRef} className="relative mx-auto block w-full max-w-[450px] mb-6">
          <form onSubmit={handleSearch}>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
                setActiveSuggestionIndex(-1);
              }}
              onFocus={() => search.trim() && setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search location for safety alerts (e.g. Kandy, Galle)"
              className="h-[45px] w-full border border-black rounded-none bg-white px-6 pr-12 text-sm shadow-sm focus:border-[#2E5C88] outline-none transition-all placeholder:text-neutral-400"
              autoComplete="off"
            />
            <button type="submit" className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors">
              {searching ? <FiLoader className="animate-spin" size={18} /> : <FiSearch size={18} />}
            </button>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-[9999] top-[46px] left-0 right-0 bg-white border border-slate-200 shadow-lg max-h-[280px] overflow-y-auto">
              {suggestions.map((name, index) => {
                const query = search.trim().toLowerCase();
                const matchStart = name.toLowerCase().indexOf(query);
                const before = name.slice(0, matchStart);
                const match = name.slice(matchStart, matchStart + query.length);
                const after = name.slice(matchStart + query.length);

                return (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(name)}
                      onMouseEnter={() => setActiveSuggestionIndex(index)}
                      className={`w-full text-left px-5 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                        index === activeSuggestionIndex
                          ? 'bg-[#EBF5FF] text-[#2E5C88]'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <FiMapPin size={13} className="shrink-0 text-slate-400" />
                      <span>
                        {before}
                        <strong className="text-[#2E5C88] font-bold">{match}</strong>
                        {after}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Current search location indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-4 text-xs text-slate-500">
          <FiMapPin size={12} />
          {searchedLocation ? (
            <span>Map centered near <strong className="text-slate-700">{searchedLocation}</strong> | Showing all active alerts in Sri Lanka</span>
          ) : (
            <span>Showing all active security alerts in Sri Lanka</span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[500px] text-slate-400">
            <FiLoader className="animate-spin mb-2" size={30} />
            <p>Syncing with Security Feed...</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_350px]">

            {/* 3. The Real Leaflet Map */}
            <div className="order-2 xl:order-1">
              <AlertMap
                alerts={filteredAlerts}
                selectedAlert={selectedAlert}
                mapCenter={mapCenter}
                onPopupClose={() => setSelectedAlert(null)}
                onSelectAlert={(alert) => setSelectedAlert({ ...alert, clickTimestamp: Date.now() })}
              />
            </div>

            {/* 4. The Live Feed Sidebar */}
            <div className="order-1 xl:order-2 flex flex-col h-[543px]">
              <div className="mb-4">
                <h2 className="text-lg font-extrabold text-black">Alerts Feed</h2>
                <p className="text-xs text-slate-500">Live Active Alerts</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <AlertCard
                      key={alert._id}
                      alert={alert}
                      isSelected={selectedAlert?._id === alert._id}
                      onSelect={() => setSelectedAlert({ ...alert, clickTimestamp: Date.now() })}
                    />
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm font-medium">No active threats detected<br />in this area.</p>
                  </div>
                )}
              </div>
            </div>

          </section>
        )}
      </div>
    </main>
  );
}
