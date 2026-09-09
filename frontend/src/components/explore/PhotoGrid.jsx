import React from 'react';

/**
 * Dynamic photo layout for place details.
 * Handles 1-4 photos (large + stacked) and 5+ photos (grid) layouts.
 * @param {{ photos: string[] }} props
 */
export default function PhotoGrid({ photos }) {
  if (!photos || photos.length === 0) return null;

  // Layout for 1–4 photos: large left + stacked right
  if (photos.length < 5) {
    return (
      <div style={{ display: 'flex', gap: '8px', marginTop: '130px', height: '620px', width: '100%' }}>
        <img
          src={photos[0]}
          alt="Place 1"
          style={{ width: '60%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '40%' }}>
          {photos[1] && (
            <img
              src={photos[1]}
              alt="Place 2"
              style={{ width: '100%', height: '50%', objectFit: 'cover', borderRadius: '8px' }}
            />
          )}
          {photos[2] && (
            <img
              src={photos[2]}
              alt="Place 3"
              style={{ width: '100%', height: '50%', objectFit: 'cover', borderRadius: '8px' }}
            />
          )}
        </div>
      </div>
    );
  }

  // Layout for 5+ photos: grid with optional right column
  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '130px', height: '620px', width: '100%' }}>
      <div style={{
        flex: photos.length > 5 ? '0 0 55%' : '1',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '8px',
        borderRadius: '16px',
        overflow: 'hidden',
        height: '100%',
      }}>
        <img src={photos[0]} alt="Place 1" style={{ width: '100%', height: '100%', objectFit: 'cover', gridColumn: '1', gridRow: '1 / 3' }} />
        <img src={photos[1]} alt="Place 2" style={{ width: '100%', height: '100%', objectFit: 'cover', gridColumn: '1', gridRow: '3 / 4' }} />
        <img src={photos[2]} alt="Place 3" style={{ width: '100%', height: '100%', objectFit: 'cover', gridColumn: '2', gridRow: '1 / 2' }} />
        <img src={photos[3]} alt="Place 4" style={{ width: '100%', height: '100%', objectFit: 'cover', gridColumn: '2', gridRow: '2 / 3' }} />
        <img src={photos[4]} alt="Place 5" style={{ width: '100%', height: '100%', objectFit: 'cover', gridColumn: '2', gridRow: '3 / 4' }} />
      </div>

      {photos.length > 5 && (
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflow: 'hidden' }}>
          <div style={{ flex: '4', overflow: 'hidden', borderRadius: '16px' }}>
            <img src={photos[5]} alt="Place 6" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {photos[6] && (
            <div style={{ flex: '6', overflow: 'hidden', borderRadius: '16px' }}>
              <img src={photos[6]} alt="Place 7" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
