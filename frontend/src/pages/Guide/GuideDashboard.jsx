import React, { useState, useEffect } from 'react';
import { Wallet, Flag, Star, Landmark, Plus } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/dashboard/StatCard';
import TourRequestsTable from '../../components/dashboard/TourRequestsTable';
import TourStatusList from '../../components/dashboard/TourStatusList';

// Re-export named components for backwards compatibility with any existing imports
export { Badge, Button, Sidebar, Header, StatCard, TourRequestsTable, TourStatusList };

const GuideDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Profile State
  const [profile, setProfile] = useState({
    name: 'Rohan Perera',
    role: 'Senior Tour Guide',
    avatarInitials: 'RP',
  });

  // REST API Ready States
  const [stats, setStats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    // 1. Fetch user data from localStorage
    try {
      const rawUser = localStorage.getItem('userData');
      if (rawUser) {
        const user = JSON.parse(rawUser);
        const name = user.fullName || user.name || 'Rohan Perera';
        const parts = name.trim().split(/\s+/);
        const initials =
          parts.length > 1
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : name.substring(0, 2).toUpperCase();

        setProfile({
          name,
          role: user.role ? user.role.replace(/_/g, ' ') : 'Senior Tour Guide',
          avatarInitials: initials,
        });
      }
    } catch (e) {
      console.error('Failed to parse user session data', e);
    }

    // 2. Simulated MERN Stack REST API Fetch
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        setStats([
          {
            id: 1,
            icon: <Wallet className="w-5 h-5 text-slate-600" />,
            label: 'Total Earnings',
            value: 'LKR 125,000',
            badge: '+12%',
            iconBg: 'bg-slate-100/80',
          },
          {
            id: 2,
            icon: <Flag className="w-5 h-5 text-slate-600" />,
            label: 'Active Tours',
            value: '8',
            iconBg: 'bg-slate-100/80',
          },
          {
            id: 3,
            icon: <Star className="w-5 h-5 text-amber-500" />,
            label: 'Average Rating',
            value: '4.9/5.0',
            badge: '+2%',
            iconBg: 'bg-amber-50',
          },
          {
            id: 4,
            icon: <Landmark className="w-5 h-5 text-slate-600" />,
            label: 'Available Payout',
            value: 'LKR 45,000',
            iconBg: 'bg-slate-100/80',
          },
        ]);

        setRequests([
          {
            id: 'req-1',
            tourist: 'Sarah Jenkins',
            country: 'United Kingdom',
            avatarInitials: 'SJ',
            type: 'Cultural',
            route: 'Sigiriya - Kandy',
            duration: '3 Days',
            action: 'Submit Quote',
          },
          {
            id: 'req-2',
            tourist: 'David Miller',
            country: 'Australia',
            avatarInitials: 'DM',
            type: 'Adventure',
            route: 'Ella Rock - Ravana Falls',
            duration: '1 Day',
            action: 'Accept Request',
          },
          {
            id: 'req-3',
            tourist: 'Emma Watson',
            country: 'Canada',
            avatarInitials: 'EW',
            type: 'Wildlife',
            route: 'Yala Safari Tour',
            duration: '2 Days',
            action: 'Submit Quote',
          },
        ]);

        setTours([
          {
            id: 'tour-1',
            name: 'Nuwara Eliya Tea Trails',
            status: 'ACTIVE',
            dates: 'Sep 14 – 18',
            emoji: '🌿',
          },
          {
            id: 'tour-2',
            name: 'Ancient Cities Explorer',
            status: 'DRAFT',
            lastEdited: 'Last edited 2h ago',
            emoji: '🏛️',
          },
          {
            id: 'tour-3',
            name: 'Southern Coast Escapade',
            status: 'UPCOMING',
            dates: 'Oct 02 – 05',
            emoji: '🏖️',
          },
        ]);
      } catch (err) {
        console.error('Dashboard API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <PageWrapper
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      profile={profile}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      showSearch={true}
      containerClassName="max-w-7xl"
    >
      {/* Page Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">DASHBOARD</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
            Welcome back, your tours are looking great today.
          </p>
        </div>
        <button
          type="button"
          onClick={() => (window.location.href = '/guide-add-package')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all uppercase tracking-wider active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>ADD NEW TOUR</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      {loading ? (
        <div className="py-8 text-center text-slate-400 text-sm">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              badge={stat.badge}
              iconBg={stat.iconBg}
            />
          ))}
        </div>
      )}

      {/* Two-column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <TourRequestsTable requests={requests} />
        </div>
        <div className="lg:col-span-1">
          <TourStatusList tours={tours} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default GuideDashboard;
