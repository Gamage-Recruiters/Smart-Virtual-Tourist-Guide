import React from 'react';
import explore2 from '../../assets/explore2.png';
import PhotoGrid from './PhotoGrid';
import HotelList from './HotelList';

/**
 * Post-search info panel: place name, action buttons, photos, hotels, collapse toggle.
 */
export default function PlaceDetailsPanel({
  searchedPlace,
  detailsPanelCollapsed,
  setDetailsPanelCollapsed,
  showUserPopup,
  placePhotos,
  nearbyHotels,
  handleExploreAction,
  handleSavePlace,
  handleSaveDestinationToFavorites,
  handleShareLocation,
}) {
  if (!searchedPlace) return null;

  return (
    <div style={{
      position: 'relative',
      marginLeft: '60px',
      marginRight: '60px',
      marginTop: '16px',
      borderRadius: '10px',
      overflow: 'hidden',
      height: 'auto',
      minHeight: detailsPanelCollapsed ? '80px' : '700px',
      background: '#D7EEFD',
      transition: 'min-height 0.3s ease',
    }}>
      {/* Save & Share buttons (top right) */}
      {!detailsPanelCollapsed && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '80px',
          display: showUserPopup ? 'none' : 'flex',
          gap: '12px',
          zIndex: 100,
        }}>
          <button onClick={handleSaveDestinationToFavorites} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} aria-label="Save">
            <svg className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button onClick={handleShareLocation} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} aria-label="Share">
            <svg className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      )}

      {/* Collapse toggle button */}
      <button
        onClick={() => setDetailsPanelCollapsed(!detailsPanelCollapsed)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '2px solid #1A73E8',
          background: '#fff',
          display: showUserPopup ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
        }}
      >
        <svg
          width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="#1A73E8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: detailsPanelCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Background explore2 image */}
      <img
        src={explore2}
        alt="Explore"
        style={{
          position: 'absolute',
          width: '1443.93px',
          height: '844.18px',
          top: '0px',
          left: '0px',
          transform: 'rotate(0.09deg)',
          objectFit: 'cover',
          objectPosition: 'top',
          display: detailsPanelCollapsed ? 'none' : 'block',
          zIndex: 1,
        }}
      />

      {/* Content area */}
      <div style={{
        position: 'relative',
        top: '0px',
        left: '0px',
        width: '100%',
        height: 'auto',
        minHeight: detailsPanelCollapsed ? '80px' : '500px',
        background: '#D7EEFD',
        zIndex: 2,
        padding: '20px',
        overflow: detailsPanelCollapsed ? 'hidden' : 'visible',
        transition: 'min-height 0.3s ease',
      }}>
        {/* Place name */}
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: '30px',
          lineHeight: '121%',
          letterSpacing: '0%',
          color: '#000000',
          display: 'block',
          marginBottom: detailsPanelCollapsed ? '0px' : '100px',
          transition: 'margin-bottom 0.3s ease',
        }}>
          {searchedPlace.displayName || searchedPlace.formatted_address?.split(',')[0]}
        </span>

        {!detailsPanelCollapsed && (
          <>
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '60px', width: '100%' }}>
              {[
                {
                  label: 'Direction',
                  iconSvg: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 22 12 12 22 2 12 12 2" />
                      <polyline points="9 10 12 7 15 10" />
                      <line x1="12" y1="17" x2="12" y2="7" />
                    </svg>
                  ),
                },
                { label: 'Start', iconSvg: null },
                { label: 'Save', iconSvg: null },
                { label: 'Share', iconSvg: null },
              ].map(({ label, iconSvg }) => (
                <button
                  key={label}
                  onClick={() => {
                    if (label === 'Direction') handleExploreAction('direction');
                    else if (label === 'Start') handleExploreAction('start');
                    else if (label === 'Save') handleSavePlace();
                    else if (label === 'Share') handleShareLocation();
                  }}
                  style={{
                    flex: 1,
                    padding: '14px 0',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#1A73E8',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {iconSvg}
                  {label}
                </button>
              ))}
            </div>

            {/* Photos */}
            <PhotoGrid photos={placePhotos} />

            {/* Hotels */}
            <HotelList hotels={nearbyHotels} />
          </>
        )}
      </div>
    </div>
  );
}
