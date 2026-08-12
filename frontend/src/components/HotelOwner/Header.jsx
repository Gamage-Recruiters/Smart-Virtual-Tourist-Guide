import React from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/HotelOwner/logo.png'
import sriflag from '../../assets/HotelOwner/sriflag.jpg'

export default function Header({ hasHotel = true }) {
  const navigate = useNavigate()

  const handleNavClick = (e, path) => {
    e.preventDefault()
    if (!hasHotel) return
    navigate(path)
  }

  return (
    <header
      className="bg-white/90 backdrop-blur-sm shadow-md py-1 h-28 overflow-visible"
      style={{ borderBottom: '1px solid #F5F7FA', position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 1000 }}
    >
      <div className="max-w-11xl mx-auto flex items-center justify-between h-full gap-6 px-2">
        {/* Left side: Logo + Title */}
        <div className="flex items-center gap-1 h-full relative flex-1 min-w-0">
          <img
            src={Logo}
            alt="Sri Lanka Tourism Logo"
            className="h-44 w-auto drop-shadow-md absolute -top-4 left-0 cursor-pointer"
            style={{ zIndex: 2, transform: 'translateZ(0)' }}
            onClick={() => navigate('/')}
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
                  }}
                >
                  Sri Lanka
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Language + Navigation */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '16px',
            zIndex: 10,
          }}
        >
          {/* Language icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#122E63', fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#111827" strokeWidth="1.6" />
              <path d="M3 12H21" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M12 3C14.75 6 16.25 8.8 16.25 12 C16.25 15.2 14.75 18 12 21 C9.25 18 7.75 15.2 7.75 12 C7.75 8.8 9.25 6 12 3Z" stroke="#111827" strokeWidth="1.6" />
            </svg>
            <span>EN</span>
          </div>
          {/* Navigation bar */}
          <nav className="flex items-center gap-20 font-bold text-black" style={{ fontSize: '18px' }}>
            <button type="button" onClick={(e) => handleNavClick(e, '/view-rooms-packages')} className={`whitespace-nowrap transition ${hasHotel ? 'hover:text-sky-800 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>Add Rooms &amp; Packages</button>
            <button type="button" onClick={(e) => handleNavClick(e, '/view-availability-calendar')} className={`whitespace-nowrap transition ${hasHotel ? 'hover:text-sky-800 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>Calendar</button>
            <button type="button" onClick={(e) => handleNavClick(e, '/manage-availability')} className={`whitespace-nowrap transition ${hasHotel ? 'hover:text-sky-800 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>Manage Availability</button>
            <button type="button" onClick={(e) => handleNavClick(e, '/view-reservations')} className={`whitespace-nowrap transition ${hasHotel ? 'hover:text-sky-800 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>View Booking</button>
            <button type="button" onClick={(e) => handleNavClick(e, '/financial-analysis')} className={`whitespace-nowrap transition ${hasHotel ? 'hover:text-sky-800 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>Revenue Analyze</button>
          </nav>
        </div>
      </div>
    </header>
  )
}
