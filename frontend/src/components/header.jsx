import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Mic, Search, X } from 'lucide-react';
import Logo from '../assets/Logo.png';
import { usePageTitle } from '../contexts/PageTitleContext';
import sriflag from '../assets/sriflag.jpg';
import { fetchAutocompleteSuggestions, geocodeAddress } from '../utils/geoapifyService';
import styles from './Header.module.css';

const SRI_LANKA_BOUNDS = { north: 10.0, south: 5.7, east: 82.1, west: 79.4 };

export default function Header() {
  const { title, showSearchBar, navigateToSearch, activePage, setActivePage, searchedPlace, etaData } = usePageTitle();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef(null);

  const fetchSuggestions = useCallback(async (input) => {
    if (!input.trim()) { setSuggestions([]); return; }
    const results = await fetchAutocompleteSuggestions(input);
    setSuggestions(results);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIdx(-1);
    fetchSuggestions(val);
  };

  const selectSuggestion = useCallback((prediction) => {
    const displayName = prediction.displayName || prediction.structured_formatting?.main_text || prediction.name;
    setQuery(displayName);
    setSuggestions([]);
    navigateToSearch(prediction);
  }, [navigateToSearch]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    const displayName = query.trim();
    const result = await geocodeAddress(displayName);
    if (result) {
      setSuggestions([]);
      navigateToSearch(result);
    } else {
      fetchSuggestions(displayName);
    }
  }, [query, navigateToSearch, fetchSuggestions]);

  const handleKeyDown = (e) => {
    if (!suggestions.length) { if (e.key === 'Enter') handleSearch(); return; }
    if (e.key === 'ArrowDown') { setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { setActiveIdx(i => Math.max(i - 1, -1)); e.preventDefault(); }
    else if (e.key === 'Enter') {
      const suggestion = suggestions[activeIdx >= 0 ? activeIdx : 0];
      if (suggestion) selectSuggestion(suggestion);
      else handleSearch();
    }
    else if (e.key === 'Escape') setSuggestions([]);
  };

  useEffect(() => {
    const handler = (e) => { if (!containerRef.current?.contains(e.target)) setSuggestions([]); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (activePage !== 'explore') return;

    const destinationName = searchedPlace?.displayName || searchedPlace?.formatted_address?.split(',')[0] || '';
    setQuery(destinationName);
  }, [activePage, searchedPlace]);

  const startPageDestination = searchedPlace?.displayName || searchedPlace?.formatted_address?.split(',')[0] || '';
  const isStartPage = activePage === 'start';
  const isEtaPage = activePage === 'eta';
  const readOnlySearch = isStartPage || isEtaPage;

  return (
    <header className={`relative z-50 bg-white/90 backdrop-blur-sm shadow-md py-1 h-28 overflow-visible ${styles.header}`}>
      <div className="w-full px-8 flex items-center justify-between h-full">
        {/* Left: logo + text */}
        <div className={`flex items-center gap-1 h-full relative ${styles.logoArea}`}>
          <img src={Logo} alt="Sri Lanka Tourism Logo" className={`h-36 w-auto drop-shadow-md absolute -top-3 left-0 ${styles.logoImg}`} />
          <div className={`flex flex-col items-start ${styles.brandTextWrap}`}>
            <span className={`font-bold leading-tight ${styles.brandTitle}`}>
              Smart Virtual Tourist Guide
            </span>
            <div className="inline-block mt-0.5">
              <span
                className={`font-bold leading-tight whitespace-nowrap ${styles.flagText}`}
                style={{ backgroundImage: `url(${sriflag})` }}
              >
                Sri Lanka
              </span>
            </div>
          </div>
        </div>

        {/* Center title */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${styles.centerTitleWrap}`}>
          <h1 className="font-bold text-black text-3xl">{(activePage === 'eta' || activePage === 'explore') ? '' : title}</h1>
        </div>

        {/* Right: Search Bar */}
        {showSearchBar && activePage !== 'safety' ? (
          <div ref={containerRef} className={styles.searchWrapper}>
            <div className={`flex items-center gap-3 px-6 py-4 ${styles.searchBox}`}>
              <Search size={22} color="#4B5563" strokeWidth={2} className="shrink-0" />
              <input
                type="text"
                value={readOnlySearch ? startPageDestination : query}
                onChange={readOnlySearch ? undefined : handleChange}
                onKeyDown={readOnlySearch ? undefined : handleKeyDown}
                placeholder="Search Here"
                readOnly={readOnlySearch}
                className={`bg-transparent outline-none text-gray-800 placeholder-gray-400 w-full font-medium ${styles.searchInput}`}
              />
              {isEtaPage && (
                <span className={styles.etaDetailsLabel}>ETA Details</span>
              )}
              {isStartPage && etaData && (
                <div className={styles.etaDataWrap}>
                  <span className={styles.etaDuration}>{etaData.duration}</span>
                  <span className={styles.etaDistance}>{etaData.distance}</span>
                  <span className={`${styles.etaTraffic} ${
                    etaData.traffic === 'Heavy traffic'
                      ? styles.etaTrafficHeavy
                      : etaData.traffic === 'Moderate traffic'
                        ? styles.etaTrafficModerate
                        : styles.etaTrafficLight
                  }`}>
                    {etaData.traffic}
                  </span>
                </div>
              )}
              {!readOnlySearch && query.trim() ? (
                <X size={20} color="#333333" strokeWidth={2.2} className={styles.iconBtn} onClick={() => { setQuery(''); setSuggestions([]); }} />
              ) : (
                <Mic size={20} color="#333333" strokeWidth={2.2} className={styles.iconBtn} />
              )}
            </div>

            {!readOnlySearch && suggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {suggestions.map((p, i) => (
                  <li
                    key={p.place_id}
                    onMouseDown={() => selectSuggestion(p)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`${styles.suggestionItem} ${i === activeIdx ? styles.suggestionItemActive : ''}`}
                  >
                    <MapPin size={14} color="#6B7280" />
                    <span>
                      <strong>{p.structured_formatting?.main_text || p.displayName || p.name}</strong>
                      {p.structured_formatting?.secondary_text && (
                        <span className={styles.secondaryText}>{p.structured_formatting.secondary_text}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div id="header-search-portal" className={styles.searchPortalArea}>
            {activePage === 'directionOne' && (
              <div className={styles.portalBackWrap}>
                <button 
                  onClick={() => setActivePage('explore')} 
                  className={styles.portalBackBtn}
                  aria-label="Go Back"
                >
                  <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="20" y1="12" x2="4" y2="12" />
                    <polyline points="10 18 4 12 10 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
