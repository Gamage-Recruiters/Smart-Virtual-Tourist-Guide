import React from 'react';

export default function AddStopPanel({
  stopPanelCollapsed,
  setStopPanelCollapsed,
  setAddStopOpen,
  stopQuery,
  setStopQuery,
  stopSuggestions,
  setStopSuggestions,
  fetchStopSuggestions,
  stopActiveIdx,
  setStopActiveIdx,
  activeCategory,
  setActiveCategory,
  poiLoading,
  poiError,
  filteredPois,
  addPoiMarker
}) {
  return (
    <div style={{
      width: '100%',
      background: '#D7EEFD',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      maxHeight: stopPanelCollapsed ? '56px' : '2000px',
      transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px 4px', gap: '8px' }}>
        <button
          onClick={() => { setAddStopOpen(false); setStopSuggestions([]); setActiveCategory(null); }}
          aria-label="Back to direction"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#fff', border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '20px', color: '#122E63', flex: 1 }}>
          Add stop to your route
        </span>
        <div
          onClick={() => setStopPanelCollapsed(c => !c)}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <svg
            width="36" height="36" viewBox="0 0 24 24" fill="none"
            stroke="#1A73E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{
              transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
              transform: stopPanelCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              filter: 'drop-shadow(0 1px 2px rgba(26,115,232,0.18))',
            }}
          >
            <circle cx="12" cy="12" r="10" stroke="#1A73E8" strokeWidth="1.5" fill="#EFF6FF" />
            <polyline points="8 11 12 15 16 11" />
          </svg>
        </div>
      </div>
      
      <div style={{ padding: '0 32px 24px' }}>
        <div style={{ position: 'relative', marginTop: '50px', marginLeft: '4%', marginBottom: '35px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #ffffff 0%, #A0DBFF 100%)',
            borderRadius: '999px', padding: '10px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            marginRight: '60%',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={stopQuery}
              onChange={(e) => { setStopQuery(e.target.value); setStopActiveIdx(-1); fetchStopSuggestions(e.target.value); }}
              onKeyDown={(e) => {
                if (!stopSuggestions.length) return;
                if (e.key === 'ArrowDown') { setStopActiveIdx(i => Math.min(i + 1, stopSuggestions.length - 1)); e.preventDefault(); }
                else if (e.key === 'ArrowUp') { setStopActiveIdx(i => Math.max(i - 1, -1)); e.preventDefault(); }
                else if (e.key === 'Escape') setStopSuggestions([]);
                else if (e.key === 'Enter' && stopActiveIdx >= 0) {
                  setStopQuery(stopSuggestions[stopActiveIdx].structured_formatting.main_text);
                  setStopSuggestions([]);
                }
              }}
              placeholder="Search along route"
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#333', background: 'transparent' }}
            />
            {stopQuery && (
              <svg onClick={() => { setStopQuery(''); setStopSuggestions([]); }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', flexShrink: 0 }}>
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
          </div>

          {stopSuggestions.length > 0 && (
            <ul style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
              background: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              zIndex: 9999, listStyle: 'none', margin: 0, padding: '4px 0',
              maxHeight: '220px', overflowY: 'auto',
            }}>
              {stopSuggestions.map((p, i) => (
                <li
                  key={p.place_id}
                  onMouseDown={() => { setStopQuery(p.structured_formatting.main_text); setStopSuggestions([]); }}
                  onMouseEnter={() => setStopActiveIdx(i)}
                  style={{
                    padding: '10px 16px', cursor: 'pointer', fontSize: '14px', color: '#333',
                    background: i === stopActiveIdx ? '#EFF6FF' : 'transparent',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
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

        <div style={{ marginTop: '20px'}}>
          <div style={{ display: 'flex', gap: '25%',marginLeft: '2%' }}>
            {['Restaurant', 'Petrol Station', 'Coffee Shop', 'Supermarket', 'Attraction'].map((item) => (
              <span
                key={item}
                onClick={() => setActiveCategory(item)}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: activeCategory === item ? 700 : 500,
                  color: activeCategory === item ? '#1A73E8' : '#122E63',
                  cursor: 'pointer',
                  paddingBottom: '10px',
                  transition: 'color 0.15s, font-weight 0.15s',
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <div style={{ height: '2px', background: '#1A73E8', borderRadius: '1px' }} />
        </div>

        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          fontWeight: 500,
          color: '#122E63',
          marginTop: '28px',
          marginBottom: '20px',
          display: 'block',
        }}>
          Point of Interest
        </span>

        {poiLoading && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#1A73E8', marginLeft: '2%' }}>
            Searching along route...
          </p>
        )}
        {!poiLoading && poiError && (
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#E53935', marginLeft: '2%' }}>
            Failed to load places. Please try again.
          </div>
        )}
        {!poiLoading && !poiError && filteredPois.length === 0 && (
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280', marginLeft: '2%' }}>
            No places found nearby.
          </div>
        )}
        {!poiLoading && !poiError && filteredPois.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', paddingBottom: '8px', marginLeft: '2%', maxHeight: '520px', overflowY: 'auto' }}>
            {filteredPois.map((place) => {
              const CATEGORY_ICONS = {
                'Restaurant': '🍴',
                'Coffee Shop': '☕',
                'Petrol Station': '⛽',
                'Supermarket': '🛒',
                'Attraction': '📍',
                'other': '📍',
              };
              const icon = CATEGORY_ICONS[place.category] || '📍';
              return (
              <div key={place.osmId}
                onClick={() => {
                  addPoiMarker(place);
                  setStopPanelCollapsed(true);
                }}
                style={{
                  background: '#fff', borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  overflow: 'hidden', cursor: 'pointer',
                  padding: '12px'
                }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '20px', lineHeight: '24px' }}>{icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#111', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.name}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6B7280', margin: '4px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.vicinity}</p>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
