import { useState } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import { useLocationSearch } from '../utils/useLocationSearch';
import { geocodeAddress } from '../utils/geoapifyService';
import styles from './LocationInput.module.css';

const HISTORY_KEY = 'locationSearchHistory';

const getHistory = () => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
};

const saveToHistory = (name) => {
  if (!name?.trim()) return;
  const prev = getHistory().filter(h => h !== name);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([name, ...prev].slice(0, 5)));
};

export default function LocationInput({
  icon,
  placeholder,
  initialValue = '',
  onSelect,
  showGps = false,
  onGpsSelect,
  gpsDisplayValue = '[Your Location]',
  readOnly = false,
  staticValue,
  showDropdown = true,
}) {
  const {
    query, setQuery, suggestions, activeIdx, setActiveIdx,
    containerRef, handleChange, handleSearch, handleKeyDown, confirmPlace,
  } = useLocationSearch((place) => {
    saveToHistory(place.displayName);
    onSelect(place);
  }, initialValue);

  const [focused, setFocused] = useState(false);
  const history = getHistory();

  const inputValue = staticValue != null ? staticValue : query;
  const allowDropdown = showDropdown && !readOnly && staticValue == null;

  // Show pre-focus dropdown: history only (only when query is empty and focused)
  const showPrefocus = allowDropdown && focused && !query.trim() && history.length > 0;
  // Show API suggestions while typing
  const showSuggestions = allowDropdown && suggestions.length > 0;

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <div className={styles.row}>
        {icon}
        <div className={styles.inputWrap}>
          <input
            type="text"
            value={inputValue}
            readOnly={readOnly || staticValue != null}
            onChange={readOnly || staticValue != null ? undefined : handleChange}
            onKeyDown={readOnly || staticValue != null ? undefined : handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={placeholder}
            className={`bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 ${styles.textInput}`}
          />
          {!readOnly && staticValue == null && query.trim() && (
            <Search
              size={14}
              color="#6B7280"
              strokeWidth={2}
              className={styles.searchIcon}
              onClick={handleSearch}
            />
          )}
        </div>
      </div>

      {/* Pre-focus dropdown: history only */}
      {showPrefocus && !showSuggestions && (
        <ul className={styles.historyDropdown}>
          {history.map((h, i) => (
            <li
              key={i}
              onMouseDown={() => {
                setFocused(false);
                void geocodeAddress(h).then((place) => {
                  if (place) onSelect({ ...place, displayName: h });
                });
              }}
              className={styles.historyItem}
            >
              <Clock size={30} color="#6B7280" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}

      {/* API suggestions while typing */}
      {showSuggestions && (
        <ul className={styles.suggestionsDropdown}>
          {suggestions.map((p, i) => (
            <li
              key={p.place_id}
              onMouseDown={() => confirmPlace(p.place_id, p.structured_formatting?.main_text || p.displayName || p.name)}
              onMouseEnter={() => setActiveIdx(i)}
              className={`${styles.suggestionItem} ${i === activeIdx ? styles.suggestionItemActive : ''}`}
            >
              <MapPin size={13} color="#6B7280" />
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
  );
}
