import { FiGrid, FiList, FiPlus, FiCalendar, FiBookmark, FiStar, FiLogOut, FiUser } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const items = [
  { key: 'dashboard', label: 'Dashboard', icon: <FiGrid className="w-5 h-5" />, to: '/activityprovider/dashboard', exact: true },
  { key: 'activities', label: 'My Activities', icon: <FiList className="w-5 h-5" />, to: '/activityprovider/activities', exact: true },
  { key: 'add', label: 'Add Activity', icon: <FiPlus className="w-5 h-5" />, to: '/activityprovider/activities/new', exact: true },
  { key: 'calendar', label: 'Calendar', icon: <FiCalendar className="w-5 h-5" />, to: '/activityprovider/calendar', exact: true },
  { key: 'bookings', label: 'Bookings', icon: <FiBookmark className="w-5 h-5" />, to: '/activityprovider/acceptbookings', exact: true },
  { key: 'ratings', label: 'Ratings & Reviews', icon: <FiStar className="w-5 h-5" />, to: '/activityprovider/viewratings', exact: true },
];

const ActivityProviderSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  let user = null;
  try {
    const raw = localStorage.getItem('userData');
    if (raw) user = JSON.parse(raw);
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen p-4 hidden md:flex md:flex-col justify-between">
      <div>
        <div className="mb-6 px-3 py-2 border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">Provider Portal</h2>
          <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full inline-block mt-1">
            Activity Provider
          </span>
        </div>

        <nav className="flex flex-col gap-1.5">
          {items.map((it) => {
            const active = it.exact
              ? pathname === it.to || (it.key === 'dashboard' && pathname === '/dashboard-ActivityProvider')
              : pathname.startsWith(it.to);

            return (
              <button
                key={it.key}
                onClick={() => navigate(it.to)}
                className={`flex items-center gap-3 text-sm px-3.5 py-2.5 rounded-xl transition ${
                  active ? 'bg-blue-600 text-white shadow-sm font-semibold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className={`p-1 rounded ${active ? 'bg-white/20' : 'bg-transparent'}`}>
                  {it.icon}
                </span>

                <span>{it.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="border-t border-gray-100 pt-4 mt-auto space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : <FiUser />}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-semibold text-gray-900 truncate">
                {user.fullName || user.username || 'Provider'}
              </div>
              <div className="text-[11px] text-gray-500 truncate">
                {user.email || 'Activity Provider'}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:bg-red-50 py-2.5 px-3 rounded-xl transition font-medium border border-red-100"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default ActivityProviderSidebar;

