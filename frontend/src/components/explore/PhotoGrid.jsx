import React, { useState, useEffect } from 'react';

/**
 * Dynamic photo layout for place details.
 * Fixed height, Hero on left (50%), Thumbnails on right (50%).
 * Always shows 5 skeletons when loading.
 * @param {{ photos: string[], loading: boolean }} props
 */
export default function PhotoGrid({ photos = [], loading = false }) {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [failedImages, setFailedImages] = useState(new Set());

  // Reset state when photos array changes entirely (new search)
  useEffect(() => {
    setLoadedImages(new Set());
    setFailedImages(new Set());
  }, [photos]);

  const handleImageLoad = (url) => {
    setLoadedImages((prev) => new Set(prev).add(url));
  };

  const handleImageError = (url) => {
    setFailedImages((prev) => new Set(prev).add(url));
  };

  // Filter valid photos (not failed)
  const validPhotos = photos.filter((url) => !failedImages.has(url)).slice(0, 5);

  // Render empty state if not loading and no valid photos
  if (!loading && validPhotos.length === 0) {
    return (
      <div style={{
        marginTop: '60px',
        width: '100%',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e5e7eb',
        borderRadius: '16px',
        fontFamily: 'Inter, sans-serif',
        color: '#6b7280',
        fontSize: '16px',
        fontWeight: '500'
      }}>
        No photos available for this place.
      </div>
    );
  }

  // Count items to determine layout
  // When loading, we force the count to 5 to show all skeletons
  const displayCount = loading ? 5 : validPhotos.length;

  // Right side grid layout logic based on number of thumbnails (count - 1)
  const numThumbnails = displayCount - 1;
  let rightGridTemplate = {};

  if (numThumbnails === 1) {
    rightGridTemplate = { gridTemplateColumns: '1fr', gridTemplateRows: '1fr' };
  } else if (numThumbnails === 2) {
    rightGridTemplate = { gridTemplateColumns: '1fr', gridTemplateRows: '1fr 1fr' };
  } else if (numThumbnails === 3) {
    rightGridTemplate = { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
  } else if (numThumbnails === 4) {
    rightGridTemplate = { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
  }

  // Helper to render a photo slot
  const renderSlot = (index) => {
    const isHero = index === 0;
    const url = validPhotos[index];
    const hasPhoto = !!url;
    const isLoaded = loadedImages.has(url);
    // FIX 2: keep the skeleton until the image has actually painted, not just
    // until `loading` flips false — otherwise there's a blank gap between
    // "URL arrived" and "image finished downloading".
    const showSkeleton = !isLoaded && (loading || hasPhoto);

    // Grid item styling for 3 thumbnails (first thumbnail spans full width of right side)
    let extraStyle = {};
    if (!loading && numThumbnails === 3 && index === 1) {
      extraStyle = { gridColumn: '1 / -1' };
    }

    return (
      <div
        key={url || `skeleton-${index}`}
        className={showSkeleton ? "photo-skeleton" : ""}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          background: showSkeleton ? undefined : '#f3f4f6',
          transition: 'opacity 200ms ease-out',
          opacity: (showSkeleton || isLoaded) ? 1 : 0,
          ...extraStyle
        }}
      >
        {hasPhoto && (
          <img
            src={url}
            alt={`Place photo ${index + 1}`}
            onLoad={() => handleImageLoad(url)}
            onError={() => handleImageError(url)}
            className={isLoaded ? "photo-reveal" : ""}
            loading={isHero ? "eager" : "lazy"}
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              // FIX 1: stay in the layout and fade via opacity instead of
              // `display: none` — a display:none image has no box, so the
              // browser's native lazy-loading may never fetch it and
              // onLoad never fires, leaving the thumbnail blank forever.
              opacity: isLoaded ? 1 : 0,
              position: 'absolute',
              inset: 0
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '60px', height: '400px', width: '100%' }}>
      {/* Hero Slot (Left Side) */}
      <div style={{
        flex: displayCount === 1 ? '1' : '0 0 calc(50% - 4px)',
        height: '100%',
        transition: 'flex 0.3s ease'
      }}>
        {renderSlot(0)}
      </div>

      {/* Thumbnails (Right Side) */}
      {displayCount > 1 && (
        <div style={{
          flex: '0 0 calc(50% - 4px)',
          height: '100%',
          display: 'grid',
          gap: '8px',
          ...rightGridTemplate,
          transition: 'all 0.3s ease'
        }}>
          {Array.from({ length: numThumbnails }).map((_, i) => renderSlot(i + 1))}
        </div>
      )}
    </div>
  );
}