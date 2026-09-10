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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    navigate('/login')
  }

  return (
    <header
      className="bg-white/95 backdrop-blur-sm shadow-md py-2 h-28 overflow-visible"
      style={{ borderBottom: '1px solid #F5F7FA', position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 1000 }}
    >
      <div className="max-w-11xl mx-auto flex items-center justify-between h-full gap-4 px-4">
        {/* Left side: Logo + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={Logo}
            alt="Sri Lanka Tourism Logo"
            className="h-35 w-auto cursor-pointer"
            style={{ zIndex: 2, transform: 'translateZ(0)' }}
           
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700 tracking-[0.04em]">Smart Virtual Tourist Guide</p>
            <p
              className="mt-1 font-black text-2xl tracking-[0.24em] text-transparent bg-clip-text"
              style={{
                backgroundImage: `url(${sriflag})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                WebkitBackgroundClip: 'text',
              }}
            >
              Sri Lanka
            </p>
          </div>
        </div>

        {/* Right side: Navigation */}
        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-800">
            <button type="button" onClick={(e) => handleNavClick(e, '/view-rooms-packages')} className={`whitespace-nowrap transition ${hasHotel ? 'hover:text-sky-800 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>Add Rooms &amp; Packages</button>
            <button type="button" onClick={(e) => handleNavClick(e, '/view-availability-calendar')} className={`whitespace-nowrap transition ${hasHotel ? 'hover:text-sky-800 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>Calendar</button>
            <button type="button" onClick={(e) => handleNavClick(e, '/manage-availability')} className={`whitespace-nowrap transition ${hasHotel ? 'hover:text-sky-800 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>Manage Availability</button>
            <button type="button" onClick={(e) => handleNavClick(e, '/view-reservations')} className={`whitespace-nowrap transition ${hasHotel ? 'hover:text-sky-800 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>View Booking</button>
            <button type="button" onClick={(e) => handleNavClick(e, '/financial-analysis')} className={`whitespace-nowrap transition ${hasHotel ? 'hover:text-sky-800 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>Revenue Analyze</button>
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
