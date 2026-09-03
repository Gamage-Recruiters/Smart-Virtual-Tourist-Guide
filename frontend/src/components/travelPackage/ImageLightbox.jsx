import { useEffect } from 'react'
import ReactDOM from 'react-dom'

export default function ImageLightbox({ images = [], currentIndex = 0, onClose, onNavigate, autoPlay = false, interval = 3000 }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + images.length) % images.length)
      } else if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % images.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, images.length, onClose, onNavigate])

  useEffect(() => {
    if (!autoPlay || images.length < 2 || currentIndex >= images.length - 1) return undefined

    const slideshowTimer = window.setTimeout(() => {
      onNavigate(currentIndex + 1)
    }, interval)

    return () => window.clearTimeout(slideshowTimer)
  }, [autoPlay, currentIndex, images.length, interval, onNavigate])

  if (!images || images.length === 0) return null

  const activeImage = images[currentIndex] || images[0]

  const lightboxContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.18)',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-in-out',
        pointerEvents: 'auto',
      }}
      onClick={onClose}
    >
      {/* Image Container with Integrated Controls */}
      <div
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '85vw',
          maxHeight: '75vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Active Image */}
        <img
          src={activeImage}
          alt={`View ${currentIndex + 1}`}
          style={{
            maxHeight: '75vh',
            maxWidth: '82vw',
            objectFit: 'contain',
            borderRadius: '14px',
            border: '4px solid #FFFFFF',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.35)',
            userSelect: 'none',
            background: '#FFFFFF',
          }}
        />

        {/* Close Button - Overlaying Top-Right Corner */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Lightbox"
          style={{
            position: 'absolute',
            top: '-16px',
            right: '-16px',
            background: '#111827',
            border: '2px solid #FFFFFF',
            color: '#FFFFFF',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
            zIndex: 100002,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          ✕
        </button>

        {/* Counter Badge - Overlaying Top-Left Corner */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#FFFFFF',
            background: 'rgba(17, 24, 39, 0.85)',
            padding: '5px 12px',
            borderRadius: '20px',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(4px)',
            zIndex: 100002,
            pointerEvents: 'none',
          }}
        >
          {currentIndex + 1} / {images.length}
        </div>

        {/* Left Arrow Button - Outside Mid-Left */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
            aria-label="Previous Image"
            style={{
              position: 'absolute',
              left: '-26px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              color: '#111827',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.2)',
              zIndex: 100002,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F8FAFC'
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF'
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
            }}
          >
            ‹
          </button>
        )}

        {/* Right Arrow Button - Outside Mid-Right */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((currentIndex + 1) % images.length)}
            aria-label="Next Image"
            style={{
              position: 'absolute',
              right: '-26px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              color: '#111827',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.2)',
              zIndex: 100002,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F8FAFC'
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF'
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
            }}
          >
            ›
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            maxWidth: '80vw',
            padding: '8px 14px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
            border: '1px solid rgba(229, 231, 235, 0.8)',
            backdropFilter: 'blur(6px)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              onClick={() => onNavigate(idx)}
              style={{
                width: '60px',
                height: '44px',
                objectFit: 'cover',
                borderRadius: '8px',
                cursor: 'pointer',
                border: idx === currentIndex ? '3px solid #2563EB' : '2px solid transparent',
                opacity: idx === currentIndex ? 1 : 0.65,
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )

  return ReactDOM.createPortal(lightboxContent, document.body)
}
