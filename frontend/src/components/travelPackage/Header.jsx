import React from 'react'
import Logo from '../../assets/travelPackage/Logo.png'
import sriflag from '../../assets/travelPackage/sriflag.jpg'

export default function Header() {
  return (
    <header
      className="relative z-10 bg-white/90 backdrop-blur-sm shadow-md py-1 h-28 overflow-visible"
      style={{ borderBottom: '1px solid #F5F7FA', width: '100%' }}
    >
      <div className="max-w-11xl mx-auto flex items-center justify-between h-full gap-6 px-2">
        <div className="flex items-center gap-1 h-full relative flex-1 min-w-0">
          <img
            src={Logo}
            alt="Sri Lanka Tourism Logo"
            className="h-44 w-auto drop-shadow-md absolute -top-4 left-0"
            style={{ zIndex: 2, transform: 'translateZ(0)' }}
          />
          <div className="flex flex-col items-start ml-24">
            <span
              className="font-bold leading-tight"
              style={{
                fontSize: 17,
                color: '#122E63',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                letterSpacing: '1px',
                paddingLeft: '8px',
              }}
            >
              Smart Virtual Tourist Guide
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 5 }}>
              <div style={{ background: '#fff', display: 'inline-block', padding: '0 8px', borderRadius: '6px' }}>
                <span
                  className="font-bold leading-tight whitespace-nowrap"
                  style={{
                    fontSize: 'clamp(2rem, 2.6rem, 3rem)',
                    letterSpacing: '8px',
                    fontFamily: "'Inter', sans-serif",
                    display: 'inline-block',
                    fontWeight: 700,
                    backgroundImage: `url(${sriflag})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    transform: 'translateZ(0)',
                    willChange: 'transform',
                  }}
                >
                  Sri Lanka
                </span>
              </div>
              <div
                className="flex items-center justify-end min-w-0"
                style={{
                  width: '100%',
                  maxWidth: '600px',
                  minWidth: '580px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(18, 46, 99, 0.08)',
                  boxShadow: '0 8px 24px rgba(18, 46, 99, 0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="7" stroke="#94A3B8" strokeWidth="1.8" />
                  <path d="M16.5 16.5L21 21" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search destinations, bookings, or activities..."
                  aria-label="Search destinations, bookings, or activities"
                  style={{
                    width: '100%',
                    border: 0,
                    outline: 'none',
                    background: 'transparent',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '16px',
                    color: '#111827',
                    minWidth: 0,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginLeft: '30px',
            marginRight: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '18px',
            minWidth: '320px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#122E63', fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 600 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="#111827" strokeWidth="1.6" />
                <path d="M3 12H21" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M12 3C14.75 6 16.25 8.8 16.25 12C16.25 15.2 14.75 18 12 21C9.25 18 7.75 15.2 7.75 12C7.75 8.8 9.25 6 12 3Z" stroke="#111827" strokeWidth="1.6" />
              </svg>
              <span>EN</span>
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6.5 9.5C6.5 6.46 8.96 4 12 4C15.04 4 17.5 6.46 17.5 9.5C17.5 13.13 19 14.5 19 14.5H5C5 14.5 6.5 13.13 6.5 9.5Z" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 19C10.32 19.88 11.09 20.5 12 20.5C12.91 20.5 13.68 19.88 14 19" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span
                style={{
                  position: 'absolute',
                  top: '1px',
                  right: '-1px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '999px',
                  background: '#EF4444',
                  border: '2px solid #FFFFFF',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '999px',
                  background: '#2F5E90',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '28px',
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                D
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 500, color: '#111827' }}>
                Dasuni
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

