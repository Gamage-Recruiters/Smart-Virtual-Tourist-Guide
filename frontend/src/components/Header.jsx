import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Mic, Search, X } from 'lucide-react';
import Logo from '../assets/Logo.png';
import { usePageTitle } from '../contexts/PageTitleContext';
import sriflag from '../assets/sriflag.jpg';
import { ensureMapsScript } from '../utils/helpers';

const SRI_LANKA_BOUNDS = { north: 10.0, south: 5.7, east: 82.1, west: 79.4 };

export default function Header() {
  const { title, showSearchBar, navigateToSearch, activePage, setActivePage, searchedPlace, etaData } = usePageTitle();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const autocompleteRef = useRef(null);
  const geocoderRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    ensureMapsScript(() => {
      autocompleteRef.current = new window.google.maps.places.AutocompleteService();
      geocoderRef.current = new window.google.maps.Geocoder();
    });
  }, []);

  const fetchSuggestions = useCallback((input) => {
    if (!input.trim() || !autocompleteRef.current) { setSuggestions([]); return; }
    autocompleteRef.current.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: 'lk' },
        bounds: new window.google.maps.LatLngBounds(
          { lat: SRI_LANKA_BOUNDS.south, lng: SRI_LANKA_BOUNDS.west },
          { lat: SRI_LANKA_BOUNDS.north, lng: SRI_LANKA_BOUNDS.east }
        ),
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIdx(-1);
    fetchSuggestions(val);
  };

  const selectSuggestion = useCallback((prediction) => {
    const displayName = prediction.structured_formatting.main_text;
    setQuery(displayName);
    setSuggestions([]);
    geocoderRef.current?.geocode({ placeId: prediction.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) navigateToSearch({ ...results[0], displayName });
    });
  }, [navigateToSearch]);

  const handleSearch = useCallback(() => {
    if (!query.trim() || !geocoderRef.current) return;
    const displayName = query.trim();
    geocoderRef.current.geocode(
      { address: displayName, componentRestrictions: { country: 'lk' } },
      (results, status) => {
        if (status === 'OK' && results[0]) {
          setSuggestions([]);
          navigateToSearch({ ...results[0], displayName });
        } else {
          fetchSuggestions(displayName);
        }
      }
    );
  }, [query, navigateToSearch, fetchSuggestions]);

  const handleKeyDown = (e) => {
    if (!suggestions.length) { if (e.key === 'Enter') handleSearch(); return; }
    if (e.key === 'ArrowDown') { setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { setActiveIdx(i => Math.max(i - 1, -1)); e.preventDefault(); }
    else if (e.key === 'Enter') { if (activeIdx >= 0) selectSuggestion(suggestions[activeIdx]); else handleSearch(); }
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
    <header className="relative z-50 shadow-md overflow-visible" style={{ backgroundColor: '#ffffff', height: '80px', borderBottom: '1px solid #F5F7FA', transform: 'translateZ(0)' }}>
      <div className="max-w-11xl mx-auto flex items-center justify-between h-full px-4">
        {/* Left: logo + text */}
        <div className="flex items-center h-full relative">
          <img src={Logo} alt="Sri Lanka Tourism Logo" className="drop-shadow-md absolute" style={{ height: '150px', width: 'auto', top: '-8px', left: '18px', zIndex: 2 }} />
          <div className="flex flex-col items-start" style={{ marginLeft: '160px', marginTop: '4px' }}>
            <span className="font-bold leading-tight" style={{ fontSize: '13px', color: '#122E63', fontFamily: "'Inter', sans-serif", letterSpacing: '0px', fontWeight: '700' }}>
              Smart Virtual Tourism Guide
            </span>
            <div style={{ display: 'inline-block', marginTop: '2px' }}>
              <span
                className="font-bold leading-tight whitespace-nowrap"
                style={{
                  fontSize: '26px',
                  letterSpacing: '4px',
                  fontFamily: "'Inter', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#0F5A29' }}>S</span>
                <span style={{ color: '#0F5A29' }}>r</span>
                <span style={{ color: '#0F5A29', marginRight: '6px' }}>i</span>
                <span style={{ color: '#E76D1F' }}>L</span>
                <span style={{ color: '#E76D1F', marginRight: '6px' }}>a</span>
                <span style={{ color: '#E5B214', marginRight: '6px' }}>n</span>
                <span style={{ color: '#8B1925' }}>k</span>
                <span style={{ color: '#8B1925' }}>a</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <h1 className="font-bold text-black text-2xl">{activePage === 'eta' ? '' : title}</h1>
        </div>

        {/* Right: Search Bar */}
        {showSearchBar && activePage !== 'safety' ? (
          <div ref={containerRef} style={{ position: 'relative', width: '540px', marginRight: '80px' }}>
            <div
              className="flex items-center px-6"
              style={{
                height: '42px',
                background: 'linear-gradient(90deg, #f0f7ff 0%, #bde0ff 100%)',
                borderRadius: '999px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <Search size={18} color="#000000" strokeWidth={2} style={{ flexShrink: 0, marginLeft: '12px' }} />
              <input
                type="text"
                value={readOnlySearch ? startPageDestination : query}
                onChange={readOnlySearch ? undefined : handleChange}
                onKeyDown={readOnlySearch ? undefined : handleKeyDown}
                placeholder="Search Here"
                readOnly={readOnlySearch}
                style={{ flex: 1, textAlign: 'center', border: 'none', outline: 'none', background: 'transparent', padding: '0 12px', fontSize: '14px' }}
                className="text-gray-700 placeholder-gray-600 font-medium"
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
                ? <X size={18} color="#000000" strokeWidth={2} style={{ cursor: 'pointer', flexShrink: 0, marginRight: '12px' }} onClick={() => { setQuery(''); setSuggestions([]); }} />
                : <Mic size={18} color="#000000" strokeWidth={2} style={{ cursor: 'pointer', flexShrink: 0, marginRight: '12px' }} />
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
                      <strong>{p.structured_formatting.main_text}</strong>
                      {p.structured_formatting.secondary_text && (
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
