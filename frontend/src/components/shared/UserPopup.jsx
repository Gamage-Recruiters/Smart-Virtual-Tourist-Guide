import React, { useEffect, useState, useCallback } from 'react';
import user from '../../assets/user.png';
import { formatViewedAgo } from '../../utils/helpers';
import { fetchFavoritePlaces, deleteFavoritePlace, deleteRecentPlace } from '../../services/api';

/**
 * Shared saved-places popup with home/work/favorite tabs.
 * Eliminates ~380 lines of duplication from Explore.jsx.
 *
 * @param {{ onClose: () => void, setActionMessage: (msg: object) => void, renderRecentPlaceMedia: (place: object) => JSX.Element }} props
 */
export default function UserPopup({ onClose, setActionMessage, renderRecentPlaceMedia }) {
  const [selectedTab, setSelectedTab] = useState('home');
  const [hoveredTab, setHoveredTab] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userDisplayName = (typeof window !== 'undefined' && (window.localStorage.getItem('userName') || window.localStorage.getItem('displayName'))) || 'nethmi';

  useEffect(() => {
    let isActive = true;

    const loadPlaces = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetchFavoritePlaces(undefined, selectedTab);
        if (!isActive) return;
        const items = Array.isArray(response?.data) ? response.data : [];
        setPlaces(items);
      } catch (err) {
        if (!isActive) return;
        setError('Failed to load places');
        setPlaces([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadPlaces();
    return () => { isActive = false; };
  }, [selectedTab]);

  const handleRemovePlace = useCallback(async (placeId) => {
    try {
      await deleteFavoritePlace(placeId);
      setPlaces((prev) => prev.filter((p) => p._id !== placeId));
      setActionMessage({ text: 'Place removed!', type: 'success' });
    } catch (err) {
      console.error('Error removing place:', err);
      setActionMessage({ text: 'Failed to remove place.', type: 'error' });
    }
  }, [setActionMessage]);

  return (
    <div className="user-popup-container collapse-transition">
      {/* User profile header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '25px' }}>
        <div className="popup-header-avatar">
          <img src={user} alt="User" style={{ width: '40%', height: '40%', objectFit: 'cover' }} />
        </div>
        <div style={{ lineHeight: 1.05 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1F2937' }}>
            You
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#374151', marginTop: '4px' }}>
            {userDisplayName}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: '72px' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 500, color: '#1F2937', marginBottom: '18px', marginLeft: '65px' }}>
          Save Places
        </div>
        <div className="popup-tab-container">
          {[
            { key: 'home', label: 'home', icon: true },
            { key: 'work', label: 'work', icon: false },
            { key: 'favorite', label: 'Favorite', icon: false },
          ].map((tab) => {
            const selected = selectedTab === tab.key;
            const hovered = hoveredTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedTab(tab.key)}
                onMouseEnter={() => setHoveredTab(tab.key)}
                onMouseLeave={() => setHoveredTab(null)}
                className="popup-tab-btn"
                style={{
                  background: selected ? 'rgba(31,41,55,0.10)' : hovered ? 'rgba(160,219,255,0.55)' : 'transparent',
                  boxShadow: selected ? 'inset 0 0 0 1px rgba(31,41,55,0.12)' : 'none',
                  color: selected || hovered ? 'var(--color-text-main)' : 'var(--color-text-main)',
                }}
              >
                {tab.icon && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 10.5 12 3l9 7.5" />
                    <path d="M5 10v10h14V10" />
                    <path d="M9 20v-7h6v7" />
                  </svg>
                )}
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: selected ? 700 : 500, color: selected || hovered ? '#111827' : '#1F2937' }}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section title */}
        <div style={{ marginTop: '40px', marginLeft: '65px', fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 500, color: '#1F2937' }}>
          {selectedTab === 'home' ? 'Your Home Places' : selectedTab === 'work' ? 'Your Work Places' : 'Your Favorite Places'}
        </div>

        {/* Place list */}
        <div style={{ marginTop: '20px', marginLeft: '40px', marginRight: '40px', maxHeight: '390px', overflowY: 'auto', paddingRight: '8px' }}>
          {loading && (
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#374151' }}>
              Loading recent places...
            </div>
          )}

          {!loading && error && (
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#B91C1C' }}>
              {error}
            </div>
          )}

          {!loading && !error && places.length === 0 && (
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#374151' }}>
              No recent places found.
            </div>
          )}

          {!loading && !error && places.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridAutoRows: 'minmax(102px, auto)', gap: '26px 44px' }}>
              {places.map((place) => {
                const placeName = place?.name || 'Unknown place';
                const viewedLabel = place?.action === 'Got Direction' ? 'Got Direction' : formatViewedAgo(place?.timestamp);

                return (
                  <div key={place._id} className="popup-place-card fade-in">
                    <div className="popup-place-img">
                      {renderRecentPlaceMedia(place)}
                    </div>

                    <div style={{ fontFamily: 'Inter, sans-serif', color: '#111827', lineHeight: 1.2, paddingRight: '28px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 500 }}>{placeName}</div>
                      <div style={{ fontSize: '13px', marginTop: '4px' }}>{viewedLabel}</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePlace(place._id);
                      }}
                      className="popup-remove-btn"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
