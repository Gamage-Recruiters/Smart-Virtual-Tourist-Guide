import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import Header from '../../components/Header';
// import Footer from '../../components/Footer';
import Sidebar from '../../components/ActivityProvider/ActivityProviderSidebar';
import { activityAPI } from '../../services/ActivityProvider/activityAPI';
// import apiClient from '../../services/auth/api';
import {
  FiUsers,
  FiMap,
  FiCalendar,
  FiPlus,
  FiList,
  FiBookmark,
  FiStar,
  FiCheckCircle,
  FiEdit3,
  FiClock,
  FiUser
} from 'react-icons/fi';
import heroBanner from '../../assets/fisherman.png';

const StatCard = ({ title, value, subtitle, icon, colorBg, colorText }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between transition hover:shadow-md">
    <div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
    <div className={`p-3.5 rounded-2xl ${colorBg} ${colorText} text-xl shadow-inner`}>
      {icon}
    </div>
  </div>
);

const ActivityProviderDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
  });

  useEffect(() => {
    // 1. Get user data from localStorage or fetch profile from API
    let storedUser = null;
    try {
      const raw = localStorage.getItem('userData');
      if (raw) storedUser = JSON.parse(raw);
    } catch {
      storedUser = null;
    }

    if (storedUser) {
      setUser(storedUser);
    }

    // Attempt fetching fresh profile data from backend
    // apiClient
    //   .get('/auth/me')
    //   .then((res) => {
    //     if (res?.user) {
    //       setUser(res.user);
    //       localStorage.setItem('userData', JSON.stringify(res.user));
    //     }
    //   })
    //   .catch((err) => {
    //     console.log('Failed to fetch user profile, using stored data:', err);
    //   });

    // 2. Fetch live activity statistics
    activityAPI
      .getAll({ page: 1, limit: 10 })
      .then((res) => {
        const fetchedActivities = res.data?.data || [];
        setActivities(fetchedActivities);

        const total = res.data?.pagination?.total || fetchedActivities.length;
        const active = fetchedActivities.filter((a) => a.status === 'active').length;
        const draft = fetchedActivities.filter((a) => a.status === 'draft').length;

        setStats({ total, active, draft });
      })
      .catch((err) => {
        console.error('Failed to load activities:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* <Header /> */}

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 flex flex-col min-w-0">
          {/* Header Hero Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-sky-700 to-indigo-800 text-white p-8">
            <img
              src={heroBanner}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
            />
            <div className="relative z-10 max-w-5xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-white/20 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider text-blue-100 border border-white/20">
                    Authenticated Provider
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-200 px-2.5 py-1 rounded-full border border-green-400/30">
                    <FiCheckCircle className="w-3.5 h-3.5" /> Active Session
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back, {user?.fullName || user?.username || 'Activity Provider'}! 👋
                </h1>
                <p className="text-blue-100 text-sm mt-1 max-w-xl">
                  Manage your tour offerings, availability calendars, and booking requests in one place.
                </p>
              </div>

              {user && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : <FiUser />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold truncate max-w-[180px]">{user.fullName || user.username}</div>
                    <div className="text-xs text-blue-200 truncate max-w-[180px]">{user.email}</div>
                    <div className="text-[10px] text-sky-300 capitalize mt-0.5 font-mono">
                      ID: {user._id?.slice(-8) || 'Provider'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6 max-w-7xl">
            {/* Key Metrics Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Activities"
                value={loading ? '...' : stats.total}
                subtitle="All created tours"
                icon={<FiMap />}
                colorBg="bg-blue-50"
                colorText="text-blue-600"
              />
              <StatCard
                title="Active Listings"
                value={loading ? '...' : stats.active}
                subtitle="Published & bookable"
                icon={<FiCheckCircle />}
                colorBg="bg-emerald-50"
                colorText="text-emerald-600"
              />
              <StatCard
                title="Draft Activities"
                value={loading ? '...' : stats.draft}
                subtitle="In-progress listings"
                icon={<FiClock />}
                colorBg="bg-amber-50"
                colorText="text-amber-600"
              />
              <StatCard
                title="Bookings & Reviews"
                value="Manage"
                subtitle="Upcoming reservations"
                icon={<FiBookmark />}
                colorBg="bg-purple-50"
                colorText="text-purple-600"
              />
            </section>

            {/* Quick Actions Grid */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Management Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <button
                  onClick={() => navigate('/activityprovider/activities/new')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-600 hover:text-white group transition text-center"
                >
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 group-hover:bg-white/20 group-hover:text-white mb-2 transition">
                    <FiPlus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">Add Activity</span>
                </button>

                <button
                  onClick={() => navigate('/activityprovider/activities')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 group transition text-center"
                >
                  <div className="p-3 rounded-full bg-gray-100 text-gray-700 mb-2">
                    <FiList className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">My Activities</span>
                </button>

                <button
                  onClick={() => navigate('/activityprovider/calendar')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 group transition text-center"
                >
                  <div className="p-3 rounded-full bg-gray-100 text-gray-700 mb-2">
                    <FiCalendar className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">Manage Calendar</span>
                </button>

                <button
                  onClick={() => navigate('/activityprovider/acceptbookings')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 group transition text-center"
                >
                  <div className="p-3 rounded-full bg-gray-100 text-gray-700 mb-2">
                    <FiBookmark className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">Bookings</span>
                </button>

                <button
                  onClick={() => navigate('/activityprovider/viewratings')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 group transition text-center"
                >
                  <div className="p-3 rounded-full bg-gray-100 text-gray-700 mb-2">
                    <FiStar className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">Ratings & Reviews</span>
                </button>
              </div>
            </section>

            {/* Recent Activities Section */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activities Overview</h2>
                  <p className="text-xs text-gray-500">Activities registered under your provider account</p>
                </div>
                <button
                  onClick={() => navigate('/activityprovider/activities')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View All ({stats.total}) →
                </button>
              </div>

              {loading ? (
                <div className="py-8 text-center text-sm text-gray-400">Loading activity listings...</div>
              ) : activities.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-xl">
                  <FiMap className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-medium text-gray-700">No activities added yet</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Start publishing your tour packages for tourists</p>
                  <button
                    onClick={() => navigate('/activityprovider/activities/new')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition"
                  >
                    <FiPlus className="w-4 h-4" /> Create First Activity
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity._id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                          <FiMap className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{activity.title}</h4>
                          <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                            <span>{activity.category}</span>
                            <span>•</span>
                            <span>{activity.location}</span>
                            <span>•</span>
                            <span className="font-semibold text-blue-600">LKR {activity.pricePerPerson?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold capitalize ${activity.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : activity.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {activity.status}
                        </span>
                        <button
                          onClick={() => navigate(`/activityprovider/activities/edit/${activity._id}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
                          title="Edit Activity"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default ActivityProviderDashboard;


