import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FiGrid, FiList, FiCalendar, FiTag, FiMessageSquare, FiCreditCard, FiUser, FiLogOut } from 'react-icons/fi'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const navigationItems = [
  { label: 'Dashboard', to: '/resturent/dashboard', icon: FiGrid, end: true },
  { label: 'Menu', to: '/resturent/dashboard/menu', icon: FiList },
  { label: 'Reservation', to: '/resturent/dashboard/reservation', icon: FiCalendar },
  { label: 'Offers', to: '/resturent/dashboard/offers', icon: FiTag },
  { label: 'Reviews', to: '/resturent/dashboard/reviews', icon: FiMessageSquare },
  { label: 'Revenue', to: '/resturent/dashboard/revenue', icon: FiCreditCard },
  { label: 'Profile', to: '/resturent/dashboard/profile', icon: FiUser },
]

function ResturentSidebar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('restaurantUser') || '{}')
  const [restaurantName, setRestaurantName] = useState('')

  // Fetch this owner's restaurant name on mount
  useEffect(() => {
    const fetchRestaurantName = async () => {
      try {
        const token = localStorage.getItem('restaurantToken')
        const res = await fetch(`${API_BASE}/restaurants`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const all = await res.json()
        const matched = Array.isArray(all)
          ? all.find(r => r.email === user.email)
          : null
        if (matched) setRestaurantName(matched.restaurantName)
      } catch (err) {
        console.error('Failed to fetch restaurant name:', err)
      }
    }
    if (user.email) fetchRestaurantName()
  }, [user.email])

  const displayName = user.fullName || user.email || 'Restaurant'
  const initials = displayName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleLogout = () => {
    localStorage.removeItem('restaurantToken')
    localStorage.removeItem('restaurantUser')
    navigate('/resturent/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="w-full bg-white border-b border-slate-200 md:w-72 md:min-h-screen md:border-b-0 md:border-r md:border-slate-200 flex flex-col">

        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-200">
          {/* Restaurant name as heading */}
          <h1 className="text-base font-bold text-slate-900 truncate">
            {restaurantName || displayName}
          </h1>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 mt-0.5">
            Restaurant Panel
          </p>

          {/* Avatar + Name */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
              <p className="truncate text-xs text-slate-400">{user.email || ''}</p>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Manage your restaurant workspace.
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3">
          <div className="space-y-1">
            {navigationItems.map(({ label, to, icon: Icon, end }) => (
              <NavLink
                key={label}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  ].join(' ')
                }
              >
                <Icon className="text-lg shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="text-lg shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default ResturentSidebar
