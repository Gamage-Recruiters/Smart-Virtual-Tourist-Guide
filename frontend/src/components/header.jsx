import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Mic, Search, X } from 'lucide-react';
import Logo from '../assets/Logo.png';
import { usePageTitle } from '../contexts/PageTitleContext';
import sriflag from '../assets/sriflag.jpg';
import { fetchAutocompleteSuggestions, geocodeAddress } from '../utils/geoapifyService';

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
    <header className="relative z-50 bg-white/90 backdrop-blur-sm shadow-md py-1 h-28 overflow-visible" style={{ borderBottom: '1px solid #F5F7FA', transform: 'translateZ(0)', willChange: 'transform' }}>
      <div className="w-full px-8 flex items-center justify-between h-full">
        {/* Left: logo + text */}
        <div className="flex items-center gap-1 h-full relative" style={{ minWidth: '400px' }}>
          <img src={Logo} alt="Sri Lanka Tourism Logo" className="h-36 w-auto drop-shadow-md absolute -top-3 left-0" style={{ zIndex: 2, transform: 'translateZ(0)' }} />
          <div className="flex flex-col items-start" style={{ marginLeft: '110px' }}>
            <span className="font-bold leading-tight" style={{ fontSize: 18, color: '#122E63', fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: '0.5px' }}>
              Smart Virtual Tourist Guide
            </span>
            <div style={{ display: 'inline-block', marginTop: 2 }}>
              <span
                className="font-bold leading-tight whitespace-nowrap"
                style={{
                  fontSize: '2.8rem',
                  letterSpacing: '6px',
                  fontFamily: "'Inter', sans-serif",
                  display: 'inline-block',
                  fontWeight: 800,
                  backgroundImage: `url(${sriflag})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  transform: 'translateZ(0)',
                  willChange: 'transform',
                }}
              >
                Sri Lanka
              </span>
            </div>
          </div>
        </div>

        {/* Center title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <h1 className="font-bold text-black text-3xl">{(activePage === 'eta' || activePage === 'explore') ? '' : title}</h1>
        </div>

        {/* Right: Search Bar */}
        {showSearchBar && activePage !== 'safety' ? (
          <div ref={containerRef} style={{ position: 'relative', width: '800px', marginRight: '40px', zIndex: 10 }}>
            <div
              className="flex items-center gap-3 px-6 py-4"
              style={{
                background: 'linear-gradient(90deg, #FAFDFF 0%, #D8EFFF 100%)',
                borderRadius: '999px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
              }}
            >
              <Search size={22} color="#4B5563" strokeWidth={2} style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={readOnlySearch ? startPageDestination : query}
                onChange={readOnlySearch ? undefined : handleChange}
                onKeyDown={readOnlySearch ? undefined : handleKeyDown}
                placeholder="Search Here"
                readOnly={readOnlySearch}
                style={{ padding: '4px 0', flex: 1, fontSize: '16px' }}
                className="bg-transparent outline-none text-gray-800 placeholder-gray-400 w-full font-medium"
              />
              {isEtaPage && (
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginRight: '24px' }}>ETA Details</span>
              )}
              {isStartPage && etaData && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginRight: '8px', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A73E8' }}>{etaData.duration}</span>
                  <span style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>{etaData.distance}</span>
                  <span style={{ fontSize: '11px', color: etaData.traffic === 'Heavy traffic' ? '#e53e3e' : etaData.traffic === 'Moderate traffic' ? '#d69e2e' : '#38a169', fontWeight: 600 }}>{etaData.traffic}</span>
                </div>
              )}
              {!readOnlySearch && query.trim()
                ? <X size={20} color="#333333" strokeWidth={2.2} style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => { setQuery(''); setSuggestions([]); }} />
                : <Mic size={20} color="#333333" strokeWidth={2.2} style={{ cursor: 'pointer', flexShrink: 0 }} />
              }
            </div>

            {!readOnlySearch && suggestions.length > 0 && (
              <ul style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                background: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                zIndex: 9999, listStyle: 'none', margin: 0, padding: '4px 0',
                maxHeight: '260px', overflowY: 'auto',
              }}>
                {suggestions.map((p, i) => (
                  <li
                    key={p.place_id}
                    onMouseDown={() => selectSuggestion(p)}
                    onMouseEnter={() => setActiveIdx(i)}
                    style={{
                      padding: '10px 16px', cursor: 'pointer', fontSize: '14px', color: '#333',
                      background: i === activeIdx ? '#EFF6FF' : 'transparent',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                  >
                    <MapPin size={14} color="#6B7280" />
                    <span>
                      <strong>{p.structured_formatting?.main_text || p.displayName || p.name}</strong>
                      {p.structured_formatting?.secondary_text && (
                        <span style={{ color: '#6B7280', marginLeft: 4 }}>{p.structured_formatting.secondary_text}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div id="header-search-portal" style={{ width: '880px', margin: '10px 30px', position: 'relative' }}>
            {activePage === 'directionOne' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%', paddingRight: '20px' }}>
                <button 
                  onClick={() => setActivePage('explore')} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
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
