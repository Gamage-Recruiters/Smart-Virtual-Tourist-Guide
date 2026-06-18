import { FiGrid, FiList, FiPlus, FiCalendar, FiBookmark, FiStar } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const items = [
  { key: 'dashboard', label: 'Dashboard', icon: <FiGrid className="w-5 h-5" />, to: '/activityprovider/dashboard', exact: true },
  { key: 'activities', label: 'My Activities', icon: <FiList className="w-5 h-5" />, to: '/activityprovider/activities', exact: true },
  { key: 'add', label: 'Add Activity', icon: <FiPlus className="w-5 h-5" />, to: '/activityprovider/activities/new', exact: true },
  { key: 'calendar', label: 'Calendar', icon: <FiCalendar className="w-5 h-5" />, to: '/activityprovider/calendar', exact: true },
  { key: 'bookings', label: 'Bookings', icon: <FiBookmark className="w-5 h-5" />, to: '/activityprovider/bookings', exact: true },
  { key: 'ratings', label: 'Ratings & Reviews', icon: <FiStar className="w-5 h-5" />, to: '/activityprovider/viewratings', exact: true },
];

const ActivityProviderSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="w-56 bg-white border-r border-gray-100 min-h-screen p-4 hidden md:block">
      <nav className="flex flex-col gap-2">
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);

          return (
            <button
              key={it.key}
              onClick={() => navigate(it.to)}
              className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition ${
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
    </aside>
  );
};

export default ActivityProviderSidebar;
