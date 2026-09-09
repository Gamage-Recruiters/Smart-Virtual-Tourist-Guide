import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/Admin/StatCard';
import RevenueChart from '../../components/Admin/RevenueChart';
import BookingChart from '../../components/Admin/BookingChart';
import PackagePerformanceChart from '../../components/Admin/PackagePerformanceChart';
import BookingPieChart from '../../components/Admin/BookingPieChart';
import RecentActivity from '../../components/Admin/RecentActivity';
import { FiUsers, FiBriefcase, FiTruck, FiHome } from 'react-icons/fi';
import HeroBg from "../../assets/Admin/hero-bg.png";
import apiClient from '../../services/Admin/adminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    travelAgencies: 0,
    registeredDrivers: 0,
    hotelPartners: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        // apiClient automatically handles the token and response parsing
        const result = await apiClient.get('/admin/dashboard-stats');

        console.log("Data received from Backend:", result);

        // Fixed: Check 'result' directly instead of the undefined 'response' variable
        if (result && result.success) {
          setStats(result.data);
        } else {
          console.error("Backend returned an error:", result.message);
        }
      } catch (error) {
        console.error('Cannot connect to server. Is backend running?', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const formatCount = (count) => {
    if (loading) return '...';
    return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;
  };

  const dashboardData = [
    { id: 1, title: 'Total Users', count: formatCount(stats.totalUsers), percentage: '12.5', isPositive: true, icon: <FiUsers size={24} /> },
    { id: 2, title: 'Travel Agencies', count: formatCount(stats.travelAgencies), percentage: '4.2', isPositive: true, icon: <FiBriefcase size={24} /> },
    { id: 3, title: 'Registered Drivers', count: formatCount(stats.registeredDrivers), percentage: '1.5', isPositive: false, icon: <FiTruck size={24} /> },
    { id: 4, title: 'Hotel Partners', count: formatCount(stats.hotelPartners), percentage: '8.4', isPositive: true, icon: <FiHome size={24} /> },
  ];

  const [analytics, setAnalytics] = useState({
    revenueChart: [],
    bookingChart: [],
    packagePerformance: [],
    userDistribution: []
});

useEffect(() => {
    const fetchAnalytics = async () => {
        try {
            const analyticsResult = await apiClient.get('/admin/dashboard-analytics');
            if (analyticsResult && analyticsResult.success) {
                setAnalytics(analyticsResult.data);
            }
        } catch (error) {
            console.error("Failed to load analytics", error);
        }
    };
    fetchAnalytics();
}, []);

  return (
    <div className="w-full bg-white">
      <div
        className="relative flex min-h-[360px] w-full items-center bg-cover bg-center sm:min-h-[520px] lg:h-[min(58.4vw,839px)] lg:min-h-[680px]"
        style={{ backgroundImage: `url(${HeroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent" />
        <div className="relative z-10 w-full px-6 sm:px-8 lg:px-[47px]">
          <h1 className="mb-4 max-w-[600px] text-[40px] font-black leading-[1.15] text-[#111111] sm:text-[46px] lg:text-[49px]">
            Welcome To Your <br /> Admin Dashboard
          </h1>
          <p className="max-w-[741px] text-[17px] font-medium leading-snug text-[#111111] sm:text-[20px] lg:text-[24px]">
            Manage your travel platform, track performance, and deliver unforgettable journeys across Sri Lanka.
          </p>
        </div>
      </div>

      <section className="relative overflow-hidden pb-16 pt-10 font-inter sm:pt-14 lg:pb-20">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-fixed bg-center opacity-[0.12]"
          style={{ backgroundImage: `url(${HeroBg})` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#DDF3FF]/80 via-white/60 to-[#DDF3FF]/70" />

        <div className="relative z-10 mx-auto w-full max-w-[1298px] px-6 sm:px-8 lg:px-0">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between lg:px-[67px]">
            <h2 className="text-[30px] font-bold text-[#111111] sm:text-[34px] lg:text-[36px]">Admin Dashboard</h2>
            <span className="pb-1 text-[13px] text-[#111111] sm:text-[14px]">Last updated: Just now</span>
          </div>

          <div className="mb-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-[67px]">
            {dashboardData.map((data) => (
              <StatCard
                key={data.id}
                title={data.title}
                count={data.count}
                percentage={data.percentage}
                isPositive={data.isPositive}
                icon={data.icon}
              />
            ))}
          </div>

          <div className="mb-12 grid grid-cols-1 gap-3 rounded-[10px] bg-white/65 p-3 shadow-sm backdrop-blur-sm md:grid-cols-3 md:gap-8">
            <ManagementLink to="/admin/users">User Management</ManagementLink>
            <ManagementLink to="/admin/listings">Approve Listings</ManagementLink>
            <ManagementLink to="/admin/ads">Manage Ads</ManagementLink>
          </div>

          <div className="mx-auto mb-8 grid max-w-[1016px] grid-cols-1 gap-8 lg:grid-cols-[470px_436px] lg:justify-between lg:gap-20">
            <ChartPanel title="Monthly Revenue Trend"><RevenueChart data={analytics.revenueChart} /></ChartPanel>
            <ChartPanel title="Monthly Booking"><BookingChart data={analytics.bookingChart} /></ChartPanel>
            <ChartPanel title="Package Performance"><PackagePerformanceChart data={analytics.packagePerformance} /></ChartPanel>
            <ChartPanel title="Monthly Booking"><BookingPieChart data={analytics.userDistribution} /></ChartPanel>
          </div>

          <RecentActivity />
        </div>
      </section>
    </div>
  );
};

const ManagementLink = ({ to, children }) => (
  <Link
    to={to}
    className="flex min-h-11 w-full items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-2 text-center text-[14px] font-semibold text-[#111111] shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075FF]"
  >
    {children}
  </Link>
);

const ChartPanel = ({ title, children }) => (
  <div className="flex h-[337px] min-w-0 flex-col rounded-[10px] border border-white/90 bg-white p-5 shadow-[0_8px_26px_rgba(46,92,136,0.08)]">
    <h3 className="mb-4 text-[14px] font-semibold text-[#111111]">{title}</h3>
    <div className="min-h-0 flex-1">{children}</div>
  </div>
);

export default AdminDashboard;
