import { useState, useRef, useCallback, useEffect } from 'react';
import { fetchAutocompleteSuggestions, geocodeAddress } from './geoapifyService';

export function useLocationSearch(onSelect, initialValue = '') {
  const [query, setQuery] = useState(initialValue); // ← seeded once, never overridden
  const [suggestions, setSuggestions] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef(null);

  const fetchSuggestions = useCallback(async (input) => {
    if (!input.trim()) { setSuggestions([]); return; }
    const results = await fetchAutocompleteSuggestions(input);
    setSuggestions(results);
  }, []);

  const confirmPlace = useCallback((placeId, displayName) => {
    const matched = suggestions.find((s) => s.place_id === placeId) || { displayName, name: displayName };
    setSuggestions([]);
    setQuery(displayName);
    onSelect(matched);
  }, [suggestions, onSelect]);

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
      setQuery(result.displayName || q);
      onSelect(result);
    } else {
      fetchSuggestions(q);
    }
  }, [query, onSelect, fetchSuggestions]);

  const handleKeyDown = useCallback((e) => {
    if (!suggestions.length) { if (e.key === 'Enter') handleSearch(); return; }
    if (e.key === 'ArrowDown') { setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { setActiveIdx(i => Math.max(i - 1, -1)); e.preventDefault(); }
    else if (e.key === 'Enter') {
      if (activeIdx >= 0) {
        const suggestion = suggestions[activeIdx];
        confirmPlace(suggestion.place_id, suggestion.structured_formatting?.main_text || suggestion.displayName || suggestion.name);
      }
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
