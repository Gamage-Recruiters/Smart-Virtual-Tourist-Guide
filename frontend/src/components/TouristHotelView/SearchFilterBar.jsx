// frontend/src/components/TouristHotelView/SearchFilterBar.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Search, Users, Loader2, Minus, Plus, X } from "lucide-react";
import apiClient from "../../services/api.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const DEFAULT_GUESTS = { adults: 0, children: 0 };
const MAX_GUESTS = 10;

// ---------------------------------------------------------------------------
// LocationAutocomplete
// ---------------------------------------------------------------------------
export function LocationAutocomplete({
  value,
  onChange,
  onSelect,
  onClear,
  placeholder = "Colombo, Sri Lanka",
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (q) => {
    if (!q) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiClient.get(
        `/tourist/hotels/locations?q=${encodeURIComponent(q)}`
      );
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = value.trim();
    if (!trimmed) {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(trimmed), 220);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggestions]);

  const handleInputChange = (e) => {
    const v = e.target.value;
    onChange(v);
    setActiveIndex(-1);
    setOpen(!!v.trim());
  };
  const handleFocus = () => {
    if (value.trim() && suggestions.length > 0) setOpen(true);
  };
  const handleSelect = (item) => {
    onChange(item.value);
    onSelect?.(item);
    setOpen(false);
    setActiveIndex(-1);
  };
  const handleClear = () => {
    onChange("");
    onSelect?.(null);
    onClear?.();
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const showClear = value.length > 0;

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="text-sm font-medium mb-2 block">Location</label>
      <div className="h-[48px] border border-gray-300 rounded-lg px-3 flex items-center gap-2 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200 transition">
        <MapPin size={16} className="text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="outline-none text-sm w-full placeholder:text-gray-400 bg-transparent"
          autoComplete="off"
        />
        {loading && (
          <Loader2 size={15} className="text-gray-400 animate-spin shrink-0" />
        )}
        {showClear && !loading && (
          <button
            type="button"
            onClick={handleClear}
            onMouseDown={(e) => e.preventDefault()}
            className="text-gray-400 hover:text-gray-700 transition shrink-0"
            aria-label="Clear location"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {open && value.trim() && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {suggestions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-400 italic">
              No locations found
            </div>
          ) : (
            suggestions.map((s, i) => (
              <button
                key={`${s.type}-${s.value}`}
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => handleSelect(s)}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition ${
                  i === activeIndex
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-50"
                }`}
              >
                <MapPin
                  size={12}
                  className={
                    s.type === "city" ? "text-blue-500" : "text-purple-500"
                  }
                />
                <span className="flex-1 truncate">{s.value}</span>
                <span className="text-[10px] uppercase tracking-wide text-gray-400">
                  {s.type}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GuestsPicker
// ---------------------------------------------------------------------------
export function GuestsPicker({ adults, children, onApply, onClear }) {
  const [open, setOpen] = useState(false);
  const [draftAdults, setDraftAdults] = useState(adults);
  const [draftChildren, setDraftChildren] = useState(children);

  useEffect(() => {
    setDraftAdults(adults);
    setDraftChildren(children);
  }, [adults, children]);

  const handleDone = () => {
    setOpen(false);
    onApply?.({ adults: draftAdults, children: draftChildren });
  };
  const handleClear = (e) => {
    e.stopPropagation();
    setDraftAdults(0);
    setDraftChildren(0);
    setOpen(false);
    onClear?.({ ...DEFAULT_GUESTS });
  };

  const summary =
    adults === 0 && children === 0
      ? "Add guests"
      : `${adults} Adult${adults !== 1 ? "s" : ""}${
          children > 0
            ? `, ${children} Child${children !== 1 ? "ren" : ""}`
            : ""
        }`;

  const isDefault = adults === 0 && children === 0;

  return (
    <div className="relative">
      <label className="text-sm font-medium mb-2 block">Guests</label>
      <div className="h-[48px] border border-gray-300 rounded-lg px-3 flex items-center gap-2 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200 transition">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 flex-1 text-sm text-gray-700 text-left min-w-0"
        >
          <Users size={16} className="text-gray-400 shrink-0" />
          <span className="truncate">{summary}</span>
        </button>
        {!isDefault && (
          <button
            type="button"
            onClick={handleClear}
            onMouseDown={(e) => e.preventDefault()}
            className="text-gray-400 hover:text-gray-700 transition shrink-0"
            aria-label="Clear guests"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute z-30 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">Adults</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDraftAdults(Math.max(0, draftAdults - 1))}
                  disabled={draftAdults <= 0}
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center text-sm font-semibold text-gray-800">
                  {draftAdults}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setDraftAdults(Math.min(MAX_GUESTS, draftAdults + 1))
                  }
                  disabled={draftAdults >= MAX_GUESTS}
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
            <div className="border-t border-gray-100 my-1" />
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">Children</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setDraftChildren(Math.max(0, draftChildren - 1))
                  }
                  disabled={draftChildren <= 0}
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center text-sm font-semibold text-gray-800">
                  {draftChildren}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setDraftChildren(Math.min(MAX_GUESTS, draftChildren + 1))
                  }
                  disabled={draftChildren >= MAX_GUESTS}
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDone}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 transition text-white text-xs font-medium py-2 rounded-lg"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SearchFilterBar (Main Component)
// ---------------------------------------------------------------------------
export default function SearchFilterBar({
  location,
  locationType,
  checkIn,
  checkOut,
  guests,
  onUpdate,
  onSearch,
}) {
  const [draftLocation, setDraftLocation] = useState(location);

  useEffect(() => {
    setDraftLocation(location);
  }, [location]);

  const handleLocationSelect = (item) => {
    if (!item) return;
    onUpdate({ location: item.value, locationType: item.type });
  };
  const handleLocationClear = () => {
    setDraftLocation("");
    onUpdate({ location: "", locationType: null });
  };
  const handleGuestsApply = (next) => onUpdate({ guests: next });
  const handleGuestsClear = (defaults) => onUpdate({ guests: defaults });
  const handleCheckInChange = (v) => onUpdate({ checkIn: v });
  const handleCheckOutChange = (v) => onUpdate({ checkOut: v });

  return (
    <section className="bg-white p-6 rounded-2xl w-full shadow-sm">
      <div className="grid grid-cols-5 gap-4 items-end">
        <LocationAutocomplete
          value={draftLocation}
          onChange={(v) => setDraftLocation(v)}
          onSelect={handleLocationSelect}
          onClear={handleLocationClear}
        />

        <div>
          <label className="text-sm font-medium mb-2 block">Check-in</label>
          <div className="h-[48px] border border-gray-300 rounded-lg px-3 flex items-center gap-2 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200 transition">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="outline-none text-sm w-full bg-transparent"
            />
            {checkIn && (
              <button
                type="button"
                onClick={() => handleCheckInChange("")}
                onMouseDown={(e) => e.preventDefault()}
                className="text-gray-400 hover:text-gray-700 transition shrink-0"
                aria-label="Clear check-in"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Check-out</label>
          <div className="h-[48px] border border-gray-300 rounded-lg px-3 flex items-center gap-2 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200 transition">
            <input
              type="date"
              value={checkOut}
              onChange={(e) => handleCheckOutChange(e.target.value)}
              min={checkIn || undefined}
              className="outline-none text-sm w-full bg-transparent"
            />
            {checkOut && (
              <button
                type="button"
                onClick={() => handleCheckOutChange("")}
                onMouseDown={(e) => e.preventDefault()}
                className="text-gray-400 hover:text-gray-700 transition shrink-0"
                aria-label="Clear check-out"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <GuestsPicker
          adults={guests.adults}
          children={guests.children}
          onApply={handleGuestsApply}
          onClear={handleGuestsClear}
        />

        <button
          onClick={onSearch}
          className="h-[48px] bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
        >
          <Search size={16} />
          Search
        </button>
      </div>
    </section>
  );
}