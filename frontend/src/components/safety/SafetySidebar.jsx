import { NavLink } from 'react-router-dom'
import { FiClipboard, FiAlertTriangle, FiFileText, FiActivity, FiCloud } from 'react-icons/fi'

const navLinks = [
  { to: '/safety', text: 'Public Incident List', icon: <FiClipboard className="text-amber-700" /> },
  { to: '/safety/alerts', text: 'API Security Alerts', icon: <FiAlertTriangle className="text-rose-500" /> },
  { to: '/safety/my-incidents', text: 'Reports', icon: <FiFileText className="text-slate-700" /> },
  { to: '/safety/status-dashboard', text: 'My Status Dashboard', icon: <FiActivity className="text-emerald-600" /> },
  { to: '/safety/weather', text: 'Live Weather', icon: <FiCloud className="text-blue-500" /> },
]

export default function SafetySidebar() {
  return (
    <aside className="sticky top-0 h-screen hidden bg-[#f5fbff] px-8 py-10 shadow-sm md:block overflow-y-auto">
      <button type="button" className="mb-5 text-slate-400" aria-label="Back">
        &larr;
      </button>

      <p className="text-base font-bold text-black">Security Alerts</p>
      <p className="mt-4 text-xs font-bold text-black">Sidebar</p>

      <nav className="mt-3 space-y-2 text-xs font-semibold">
        {navLinks.map(({ to, text, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/safety'} // Use `end` to prevent matching child routes
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 py-1.5 text-black ${isActive ? 'bg-sky-200' : 'hover:bg-sky-100'}`
            }
          >
            {icon}
            {text}
          </NavLink>
        ))}
      </nav>

      <div className="mt-36 text-center text-sm font-semibold text-white">SOS</div>
    </aside>
  )
}