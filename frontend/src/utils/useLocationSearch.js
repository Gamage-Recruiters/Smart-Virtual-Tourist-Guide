import { useState, useRef, useCallback, useEffect } from 'react';
import { searchPlaces, geocodeAddress } from './mapServices';

export function useLocationSearch(onSelect, initialValue = '') {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  const fetchSuggestions = useCallback((input) => {
    if (!input.trim()) { setSuggestions([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await searchPlaces(input, 5);
      setSuggestions(results);
    }, 300);
  }, []);

  const confirmPlace = useCallback((suggestion) => {
    setSuggestions([]);
    setQuery(suggestion.displayName || suggestion.name);
    onSelect({
      displayName: suggestion.name,
      formatted_address: suggestion.displayName,
      geometry: { location: { lat: suggestion.lat, lng: suggestion.lng } },
      place_id: suggestion.osm_id,
    });
  }, [onSelect]);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIdx(-1);
    fetchSuggestions(val);
  }, [fetchSuggestions]);

  const handleSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) return;
    const result = await geocodeAddress(q);
    if (result) {
      setSuggestions([]);
      onSelect({
        displayName: q,
        formatted_address: result.displayName,
        geometry: { location: { lat: result.lat, lng: result.lng } },
      });
    }
  }, [query, onSelect]);

  const handleKeyDown = useCallback((e) => {
    if (!suggestions.length) { if (e.key === 'Enter') handleSearch(); return; }
    if (e.key === 'ArrowDown') { setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { setActiveIdx(i => Math.max(i - 1, -1)); e.preventDefault(); }
    else if (e.key === 'Enter') {
      if (activeIdx >= 0) confirmPlace(suggestions[activeIdx]);
      else handleSearch();
    }
    else if (e.key === 'Escape') setSuggestions([]);
  }, [suggestions, activeIdx, handleSearch, confirmPlace]);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (!containerRef.current?.contains(e.target)) setSuggestions([]); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return { query, setQuery, suggestions, activeIdx, setActiveIdx, containerRef, handleChange, handleSearch, handleKeyDown, confirmPlace };
}
