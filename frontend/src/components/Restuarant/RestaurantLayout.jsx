import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

// ─── Nav items ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/resturent/dashboard',
    end: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Menu',
    path: '/resturent/dashboard/menu',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    label: 'Offers',
    path: '/resturent/dashboard/offers',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    label: 'Reservations',
    path: '/resturent/dashboard/reservations',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Reviews',
    path: '/resturent/dashboard/reviews',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    label: 'Revenue',
    path: '/resturent/dashboard/revenue',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    path: '/resturent/dashboard/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, onCollapse }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('restaurantToken')
    localStorage.removeItem('restaurantUser')
    navigate('/resturent/login')
  }

  const user = JSON.parse(localStorage.getItem('restaurantUser') || '{}')
  const initials = user.fullName
    ? user.fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'R'

  return (
    <aside
      className={`
        relative flex flex-col h-full
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        border-r border-white/10
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[68px]' : 'w-[240px]'}
      `}
    >
      {/* ── Brand ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 overflow-hidden">
        {/* Icon mark */}
        <div className="shrink-0 w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400 whitespace-nowrap">SVTG</p>
            <p className="text-sm font-bold text-white whitespace-nowrap">Restaurant Panel</p>
          </div>
        )}
      </div>

      {/* ── Collapse toggle ─────────────────────────────────────────────── */}
      <button
        onClick={() => onCollapse(!collapsed)}
        className="absolute -right-3 top-[52px] z-10 w-6 h-6 rounded-full bg-slate-700 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 transition-colors shadow-md"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg className={`w-3 h-3 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 whitespace-nowrap
              ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'text-slate-400 hover:text-white hover:bg-white/8'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="overflow-hidden">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ── User footer ─────────────────────────────────────────────────── */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {/* Avatar + name */}
        <div className={`flex items-center gap-3 px-1 ${collapsed ? 'justify-center' : ''}`}>
          <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user.fullName || 'Restaurant Owner'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email || ''}</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className={`
            w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold
            text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

// ─── Top bar ────────────────────────────────────────────────────────────────
function TopBar({ onMobileToggle }) {
  const user = JSON.parse(localStorage.getItem('restaurantUser') || '{}')

  // Derive page title from current path
  const path = window.location.pathname
  const currentNav = NAV_ITEMS.find(n => {
    if (n.end) return path === n.path
    return path.startsWith(n.path)
  })
  const pageTitle = currentNav?.label ?? 'Dashboard'

  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b border-slate-200 bg-white shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={onMobileToggle}
        className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 className="text-sm font-bold text-slate-800">{pageTitle}</h1>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-xs text-slate-500 font-medium">
          {user.fullName || 'Restaurant Owner'}
        </span>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
          {user.fullName ? user.fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'R'}
        </div>
      </div>
    </header>
  )
}

// ─── Layout ──────────────────────────────────────────────────────────────────
export default function RestaurantLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* ── Desktop Sidebar ───────────────────────────────────────────── */}
      <div className="hidden md:flex h-full">
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      </div>

      {/* ── Mobile Sidebar Overlay ────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-10 h-full flex">
            <Sidebar collapsed={false} onCollapse={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main area ─────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMobileToggle={() => setMobileOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
