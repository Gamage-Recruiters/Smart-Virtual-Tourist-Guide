import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { FiSearch, FiLoader, FiMapPin } from 'react-icons/fi';
import safetyService from '../../services/safetyService';
import { ALL_LOCATION_NAMES } from '../../constants/sriLankaLocations';

/**
 * Self-contained location search bar with autocomplete dropdown.
 * Extracted from SecurityAlertsPage (~90 lines of inline logic).
 *
 * Features:
 * - Filtered suggestion list with match highlighting
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Click-outside-to-close
 * - Geocoding via OpenWeather API
 *
 * @param {Object} props
 * @param {(coords: {lat,lng}, name: string) => void} props.onLocationSelect - Called when a location is geocoded
 * @param {string} props.placeholder - Input placeholder text
 * @param {string[]} props.suggestions - Suggestion strings (defaults to ALL_LOCATION_NAMES)
 * @param {number} props.maxSuggestions - Max suggestions shown (default 8)
 */
export default function LocationSearchBar({
  onLocationSelect,
  placeholder = 'Search location (e.g. Kandy, Galle)',
  suggestions: suggestionList = ALL_LOCATION_NAMES,
  maxSuggestions = 8,
}) {
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchContainerRef = useRef(null);

  // Filter suggestions based on search input
  const filteredSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return suggestionList
      .filter((loc) => loc.toLowerCase().includes(query))
      .slice(0, maxSuggestions);
  }, [search, suggestionList, maxSuggestions]);

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

  // Perform the actual search (geocode + notify parent)
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) return;

    setSearching(true);
    setShowSuggestions(false);

    const geo = await safetyService.geocodeLocation(query);
    if (geo && onLocationSelect) {
      onLocationSelect({ lat: geo.lat, lng: geo.lng }, geo.name || query);
    }
    setSearching(false);
  }, [onLocationSelect]);

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
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(filteredSuggestions[activeSuggestionIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
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
          placeholder={placeholder}
          className="h-[45px] w-full border border-black rounded-none bg-white px-6 pr-12 text-sm shadow-sm focus:border-[#2E5C88] outline-none transition-all placeholder:text-neutral-400"
          autoComplete="off"
        />
        <button type="submit" className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors">
          {searching ? <FiLoader className="animate-spin" size={18} /> : <FiSearch size={18} />}
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-[9999] top-[46px] left-0 right-0 bg-white border border-slate-200 shadow-lg max-h-[280px] overflow-y-auto">
          {filteredSuggestions.map((name, index) => {
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
  );
}
