import { NavLink, Outlet } from 'react-router-dom'
import { FiGrid, FiList, FiCalendar, FiTag, FiMessageSquare, FiCreditCard, FiUser } from 'react-icons/fi'

const navigationItems = [
  { label: 'Dashboard', to: '/resturent/dashboard', icon: FiGrid, end: true },
  { label: 'Menu', to: '/resturent/dashboard/menu', icon: FiList },
  { label: 'Reservation', to: '/resturent/dashboard/reservation', icon: FiCalendar },
  { label: 'Offers', to: '/resturent/dashboard/offers', icon: FiTag },
  { label: 'Reviews', to: '/resturent/dashboard/reviews', icon: FiMessageSquare },
  { label: 'Revenue', to: '/resturent/dashboard/revenue', icon: FiCreditCard },
  { label: 'Profile', to: '/resturent/dashboard/profile', icon: FiUser }
]

function ResturentSidebar() {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="w-full bg-white border-b border-slate-200 md:w-72 md:min-h-screen md:border-b-0 md:border-r md:border-slate-200">
        <div className="px-6 py-6 border-b border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Resturent Panel
          </p>
          <h1>Resturent Name</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your restaurant workspace.
          </p>
        </div>

        <nav className="p-3">
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
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default ResturentSidebar
