import { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { fetchAutocompleteSuggestions, fetchNearbyPlacesAlongRoute } from '../utils/geoapifyService';
import { CATEGORY_TYPES } from '../constants/direction';

const routePath = (directionsResultRef, selectedIdx) => (
  directionsResultRef.current?.routes?.[selectedIdx]?.overview_path || []
);

const CATEGORY_COLORS = {
  Restaurant: '#EF4444',
  'Petrol Station': '#2563EB',
  'Coffee Shop': '#D97706',
  Supermarket: '#10B981',
};

const CATEGORY_ICONS = {
  Restaurant: '🍽️',
  'Petrol Station': '⛽',
  'Coffee Shop': '☕',
  Supermarket: '🛒',
};

const createCustomPoiIcon = (category, isAdded = false) => {
  const color = isAdded ? '#059669' : (CATEGORY_COLORS[category] || '#1A73E8');
  const svg = `
    <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="${color}"/>
      <circle cx="17" cy="16" r="8" fill="#FFFFFF"/>
      <circle cx="17" cy="16" r="4.5" fill="${color}"/>
    </svg>
  `;
  return L.divIcon({
    html: `<div style="transform:translate(-17px,-42px);filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));cursor:pointer;">${svg}</div>`,
    className: 'custom-poi-marker',
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -42],
  });
};

export default function AddStopPanel({
  isOpen,
  onClose,
  directionsResultRef,
  selectedIdx = 0,
  mapInstanceRef,
  poiMarkersRef,
  onAddStop,
  currentStop = null,
}) {
  const [stopQuery, setStopQuery] = useState('');
  const [stopSuggestions, setStopSuggestions] = useState([]);
  const [stopActiveIdx, setStopActiveIdx] = useState(-1);
  const [activeCategory, setActiveCategory] = useState('Restaurant');
  const [poiResults, setPoiResults] = useState([]);
  const [poiLoading, setPoiLoading] = useState(false);
  const [stopPanelCollapsed, setStopPanelCollapsed] = useState(false);
  const [addedStopId, setAddedStopId] = useState(currentStop?.placeId || currentStop?.place_id || null);
  const stopContainerRef = useRef(null);

  const addPoiMarker = useCallback((place, isWaypoint = false) => {
    const location = place?.location;
    if (!mapInstanceRef?.current || !location) return;
    const placeId = place.placeId || place.place_id;

    const lat = location.lat ?? location[0];
    const lng = location.lng ?? location[1];

    if (!poiMarkersRef.current) poiMarkersRef.current = [];

    // Remove or update existing marker for this place
    const existingIdx = poiMarkersRef.current.findIndex((m) => m.__placeId === placeId);
    if (existingIdx !== -1) {
      const existing = poiMarkersRef.current[existingIdx];
      mapInstanceRef.current.removeLayer(existing);
      poiMarkersRef.current.splice(existingIdx, 1);
    }

    const marker = L.marker([lat, lng], {
      icon: createCustomPoiIcon(activeCategory, isWaypoint),
    }).addTo(mapInstanceRef.current);

    marker.__placeId = placeId;

    const popupHtml = `
      <div style="font-family:Inter,system-ui,sans-serif;font-size:13px;padding:4px 2px;max-width:220px;">
        <div style="font-weight:700;color:#111827;font-size:14px;margin-bottom:4px;">${place.name}</div>
        <div style="color:#4B5563;font-size:12px;margin-bottom:6px;">${place.vicinity || place.formatted_address || ''}</div>
        ${place.distanceFromRouteText ? `<div style="font-size:11px;color:#1A73E8;font-weight:600;margin-bottom:8px;">📍 ${place.distanceFromRouteText}</div>` : ''}
        <button id="add-stop-popup-btn-${placeId}" style="width:100%;padding:6px 12px;background:#1A73E8;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">
          ${isWaypoint ? '✓ Stop Added to Route' : '+ Add as Stop to Route'}
        </button>
      </div>
    `;

    marker.bindPopup(popupHtml);
    poiMarkersRef.current.push(marker);

    marker.on('popupopen', () => {
      setTimeout(() => {
        const btn = document.getElementById(`add-stop-popup-btn-${placeId}`);
        if (btn) {
          btn.onclick = () => {
            if (onAddStop) onAddStop(place);
            setAddedStopId(placeId);
            marker.setIcon(createCustomPoiIcon(activeCategory, true));
            marker.closePopup();
          };
        }
      }, 50);
    });

    mapInstanceRef.current.panTo([lat, lng]);
    mapInstanceRef.current.setZoom(15);
  }, [activeCategory, mapInstanceRef, onAddStop, poiMarkersRef]);

  const searchPlacesAlongRoute = useCallback((categoryOrQuery, isCustom = false) => {
    const path = routePath(directionsResultRef, selectedIdx);
    if (!path.length) {
      setPoiResults([]);
      return;
    }

    const config = CATEGORY_TYPES[categoryOrQuery];
    const categoryKey = isCustom ? categoryOrQuery : (config?.type || categoryOrQuery);
    const searchRadius = categoryKey === 'gas_station' ? 4000 : 3000;

    setPoiLoading(true);
    setPoiResults([]);

    fetchNearbyPlacesAlongRoute(path, categoryKey, searchRadius, 40)
      .then((places) => {
        const seen = new Set();
        const valid = (places || []).filter((place) => {
          const id = place.place_id || place.placeId;
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return place.name && place.name !== 'Unnamed place';
        });
        setPoiResults(valid);
      })
      .catch(() => setPoiResults([]))
      .finally(() => setPoiLoading(false));
  }, [directionsResultRef, selectedIdx]);

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setStopQuery('');
    setStopSuggestions([]);
    searchPlacesAlongRoute(category);
  };

  const handleSearchSubmit = (searchTerm) => {
    const term = (searchTerm || stopQuery).trim();
    if (!term) return;
    setStopSuggestions([]);
    setActiveCategory(null);
    searchPlacesAlongRoute(term, true);
  };

  const fetchStopSuggestions = useCallback(async (input) => {
    if (!input.trim()) return setStopSuggestions([]);
    const suggestions = await fetchAutocompleteSuggestions(input);
    setStopSuggestions(suggestions.slice(0, 5));
  }, []);

  const handleAddStopToRoute = (place, e) => {
    e?.stopPropagation();
    const placeId = place.placeId || place.place_id;
    setAddedStopId(placeId);
    addPoiMarker(place, true);
    if (onAddStop) {
      onAddStop(place);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStopQuery('');
      setStopSuggestions([]);
      setActiveCategory('Restaurant');
      setStopPanelCollapsed(false);
      searchPlacesAlongRoute('Restaurant');
    }
  }, [isOpen, searchPlacesAlongRoute]);

  useEffect(() => {
    if (currentStop) {
      setAddedStopId(currentStop.placeId || currentStop.place_id);
    }
  }, [currentStop]);

  if (!isOpen) return null;

  const categoriesList = ['Restaurant', 'Petrol Station', 'Coffee Shop', 'Supermarket'];

  return (
    <div style={{
      width: '100%',
      background: '#D7EEFD',
      position: 'relative',
      overflow: 'hidden',
      maxHeight: stopPanelCollapsed ? '56px' : '2000px',
      transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      borderBottom: '2px solid #BAE6FD',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    }}>
      {/* Header row: back button + title + collapse handle */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 24px 6px', gap: '12px' }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to direction"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: 'none',
            background: '#ffffff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: '#122E63', flex: 1 }}>
          Add stop to your route
        </span>

        <button
          type="button"
          onClick={() => setStopPanelCollapsed((c) => !c)}
          aria-label="Collapse add stop panel"
          style={{
            border: 'none',
            background: '#ffffff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transform: stopPanelCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <div style={{ padding: '0 24px 20px' }}>
        {/* Search bar */}
        <div ref={stopContainerRef} style={{ position: 'relative', marginTop: '16px', marginBottom: '20px', maxWidth: '480px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#ffffff',
            borderRadius: '999px',
            padding: '10px 18px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={stopQuery}
              onChange={(e) => {
                setStopQuery(e.target.value);
                setStopActiveIdx(-1);
                fetchStopSuggestions(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (stopActiveIdx >= 0 && stopSuggestions[stopActiveIdx]) {
                    const chosen = stopSuggestions[stopActiveIdx];
                    setStopQuery(chosen.structured_formatting?.main_text || chosen.name);
                    handleSearchSubmit(chosen.name || chosen.structured_formatting?.main_text);
                  } else {
                    handleSearchSubmit(stopQuery);
                  }
                } else if (e.key === 'ArrowDown' && stopSuggestions.length > 0) {
                  setStopActiveIdx((i) => Math.min(i + 1, stopSuggestions.length - 1));
                  e.preventDefault();
                } else if (e.key === 'ArrowUp' && stopSuggestions.length > 0) {
                  setStopActiveIdx((i) => Math.max(i - 1, -1));
                  e.preventDefault();
                } else if (e.key === 'Escape') {
                  setStopSuggestions([]);
                }
              }}
              placeholder="Search along route (e.g., KFC, Keells, Shell)"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: '#1F2937',
                background: 'transparent',
              }}
            />
            {stopQuery && (
              <button
                type="button"
                onClick={() => { setStopQuery(''); setStopSuggestions([]); }}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {stopSuggestions.length > 0 && (
            <ul style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              zIndex: 9999,
              listStyle: 'none',
              margin: 0,
              padding: '6px 0',
              maxHeight: '220px',
              overflowY: 'auto',
            }}>
              {stopSuggestions.map((place, index) => (
                <li
                  key={place.place_id || place.placeId || index}
                  onMouseDown={() => {
                    const text = place.structured_formatting?.main_text || place.name;
                    setStopQuery(text);
                    handleSearchSubmit(text);
                  }}
                  onMouseEnter={() => setStopActiveIdx(index)}
                  style={{
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#1F2937',
                    background: index === stopActiveIdx ? '#EFF6FF' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span style={{ color: '#1A73E8' }}>📍</span>
                  <div>
                    <strong>{place.structured_formatting?.main_text || place.name}</strong>
                    {place.structured_formatting?.secondary_text && (
                      <span style={{ color: '#6B7280', marginLeft: '6px', fontSize: '12px' }}>
                        {place.structured_formatting.secondary_text}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {categoriesList.map((category) => {
            const isSelected = activeCategory === category;
            const categoryColor = CATEGORY_COLORS[category] || '#1A73E8';
            return (
              <button
                type="button"
                key={category}
                onClick={() => handleSelectCategory(category)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: isSelected ? `2px solid ${categoryColor}` : '1px solid #93C5FD',
                  background: isSelected ? categoryColor : '#ffffff',
                  color: isSelected ? '#ffffff' : '#122E63',
                  fontWeight: isSelected ? 700 : 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                <span>{category === 'Restaurant' ? '🍽️' : category === 'Petrol Station' ? '⛽' : category === 'Coffee Shop' ? '☕' : '🛒'}</span>
                <span>{category}</span>
              </button>
            );
          })}
        </div>

        {/* Points of Interest title & status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '15px', color: '#122E63' }}>
            {activeCategory ? `${activeCategory}s along route` : 'Search results along route'}
            {!poiLoading && poiResults.length > 0 && (
              <span style={{ fontWeight: 500, fontSize: '13px', color: '#4B5563', marginLeft: '8px' }}>
                ({poiResults.length} found)
              </span>
            )}
          </span>
        </div>

        {poiLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '24px 0', color: '#1A73E8', fontWeight: 600 }}>
            <div style={{ width: '18px', height: '18px', border: '3px solid #BAE6FD', borderTopColor: '#1A73E8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <span>Finding places along your route...</span>
          </div>
        )}

        {!poiLoading && poiResults.length === 0 && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', textAlign: 'center', color: '#4B5563', maxWidth: '440px', marginTop: '8px' }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>🔍</div>
            <div style={{ fontWeight: 600, color: '#1F2937', marginBottom: '4px' }}>
              {activeCategory ? `No ${activeCategory.toLowerCase()}s found within 3 km of this route` : 'No matching places found along this route'}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              Try selecting another category above or search a specific location.
            </div>
          </div>
        )}

        {/* POI results grid */}
        {!poiLoading && poiResults.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
            maxHeight: '440px',
            overflowY: 'auto',
            paddingRight: '4px',
            paddingBottom: '8px',
          }}>
            {poiResults.map((place) => {
              const placeId = place.placeId || place.place_id;
              const isAdded = addedStopId === placeId;
              const categoryColor = CATEGORY_COLORS[activeCategory] || '#1A73E8';
              const categoryIcon = CATEGORY_ICONS[activeCategory] || '📍';

              return (
                <div
                  key={placeId}
                  onClick={() => {
                    addPoiMarker(place, isAdded);
                  }}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: isAdded ? '2px solid #059669' : '1px solid #E5E7EB',
                    boxShadow: isAdded ? '0 4px 14px rgba(5,150,105,0.18)' : '0 2px 8px rgba(0,0,0,0.06)',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isAdded) {
                      e.currentTarget.style.borderColor = categoryColor;
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.10)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAdded) {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                    }
                  }}
                >
                  <div>
                    {/* Top Row: Category Icon + Place Name + Added Badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: `${categoryColor}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          flexShrink: 0,
                        }}>
                          {categoryIcon}
                        </div>
                        <div style={{
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#111827',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {place.name}
                        </div>
                      </div>

                      {isAdded && (
                        <span style={{
                          background: '#ECFDF5',
                          color: '#059669',
                          border: '1px solid #A7F3D0',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          flexShrink: 0,
                        }}>
                          ✓ Added
                        </span>
                      )}
                    </div>

                    {/* Address / Vicinity */}
                    <div style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      marginBottom: '10px',
                      paddingLeft: '46px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {place.vicinity || place.formatted_address || 'Near route'}
                    </div>
                  </div>

                  {/* Bottom Row: Distance badge & Add Button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid #F3F4F6',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {place.distanceFromRouteText && (
                        <span style={{
                          background: '#EFF6FF',
                          color: '#1A73E8',
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}>
                          📍 {place.distanceFromRouteText}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleAddStopToRoute(place, e)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isAdded ? '#059669' : '#1A73E8',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                    >
                      {isAdded ? '✓ Stop Added' : '+ Add to Route'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

