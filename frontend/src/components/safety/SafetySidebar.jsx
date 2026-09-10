import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { FiClipboard, FiAlertTriangle, FiFileText, FiBarChart2, FiCloud, FiX } from 'react-icons/fi'

const navLinks = [
  { to: '/safety', text: 'Public Incident List', icon: <FiClipboard className="text-amber-700" /> },
  { to: '/safety/alerts', text: 'API Security Alerts', icon: <FiAlertTriangle className="text-rose-500" /> },
  { to: '/safety/my-incidents', text: 'My Incidents', icon: <FiFileText className="text-slate-700" /> },
  { to: '/safety/public-analytics', text: 'Reports', icon: <FiBarChart2 className="text-emerald-600" /> },
  { to: '/safety/weather', text: 'Live Weather', icon: <FiCloud className="text-blue-500" /> },
]

export default function SafetySidebar({ isMobileMenuOpen = false, onCloseMobileMenu = () => {} }) {
  const location = useLocation()
  const navigate = useNavigate()

  // Auto-close mobile menu on route change
  useEffect(() => {
    onCloseMobileMenu()
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const sidebarContent = (
    <>
      <p className="text-base font-bold text-black">Security Alerts</p>
      <p className="mt-4 text-xs font-bold text-black">Sidebar</p>

      <nav className="mt-3 space-y-2 text-xs font-semibold">
        {navLinks.map(({ to, text, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/safety'} // Use `end` to prevent matching child routes
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 py-1.5 text-black rounded-md transition-colors ${isActive ? 'bg-sky-200' : 'hover:bg-sky-100'}`
            }
          >
            {icon}
            {text}
          </NavLink>
        ))}
      </nav>

      <div className="mt-36 text-center text-sm font-semibold text-white">SOS</div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar — unchanged behavior */}
      <aside className="sticky top-0 h-screen hidden bg-[#f5fbff] px-8 py-10 shadow-sm md:block overflow-y-auto">
        <button type="button" onClick={() => navigate(-1)} className="mb-5 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Back">
          &larr;
        </button>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-[9999] md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onCloseMobileMenu}
        />

        {/* Slide-in panel */}
        <aside
          className={`absolute left-0 top-0 h-full w-[260px] bg-[#f5fbff] px-6 py-6 shadow-xl overflow-y-auto transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            type="button"
            onClick={onCloseMobileMenu}
            className="mb-5 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            aria-label="Close navigation menu"
          >
            <FiX size={20} />
          </button>
          {sidebarContent}
        </aside>
      </div>
    </>
  )
}