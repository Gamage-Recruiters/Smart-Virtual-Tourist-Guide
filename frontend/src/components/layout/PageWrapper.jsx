import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from '../Guide/Footer';
import { guideProfileAPI } from '../../services/api';

/**
 * Reusable PageWrapper Layout Shell
 * Fetches the logged-in guide's real profile (name + photo) from the API
 * and passes it to both Sidebar and Header.
 */
export const PageWrapper = ({
  activeTab,
  activeNavItem,
  setActiveTab,
  profile: propProfile,
  mobileOpen: propMobileOpen,
  setMobileOpen: propSetMobileOpen,
  showSearch = true,
  containerClassName = 'max-w-5xl',
  children,
}) => {
  // Mobile drawer state fallback
  const [localMobileOpen, setLocalMobileOpen] = useState(false);
  const mobileOpen = propMobileOpen !== undefined ? propMobileOpen : localMobileOpen;
  const setMobileOpen = propSetMobileOpen || setLocalMobileOpen;

  // Profile state — starts with localStorage fallback, upgraded by API
  const [localProfile, setLocalProfile] = useState(() => {
    try {
      const rawUser = localStorage.getItem('userData');
      if (rawUser) {
        const user = JSON.parse(rawUser);
        const name = user.fullName || user.name || '';
        const parts = name.trim().split(/\s+/);
        const initials =
          parts.length > 1
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : name.substring(0, 2).toUpperCase();
        return {
          name,
          role: user.role ? user.role.replace(/_/g, ' ') : 'Tour Guide',
          avatarInitials: initials || 'GD',
          profilePhoto: null,
        };
      }
    } catch {
      // ignore
    }
    return { name: '', role: 'Tour Guide', avatarInitials: 'GD', profilePhoto: null };
  });

  // Fetch real profile data from API (only if a token exists)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null') return;

    guideProfileAPI
      .getMyProfile()
      .then((json) => {
        if (json.success && json.data) {
          const d = json.data;
          const name = d.fullName || '';
          const parts = name.trim().split(/\s+/);
          const initials =
            parts.length > 1
              ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
              : name.substring(0, 2).toUpperCase();

          setLocalProfile({
            name,
            role: 'Tour Guide',
            avatarInitials: initials || 'GD',
            profilePhoto: d.profilePhoto?.url || null,
          });
        }
      })
      .catch(() => {
        // API failed — keep localStorage fallback; no crash
      });
  }, []);

  // Prop profile takes precedence (allows pages like ProfileSettings to push live updates)
  const profile = propProfile || localProfile;

  // Map activeNavItem string (e.g. "Booking Requests") to tab ID if activeTab not explicitly set
  const resolveActiveTab = () => {
    if (activeTab) return activeTab;
    if (!activeNavItem) return 'dashboard';
    const lower = activeNavItem.toLowerCase();
    if (lower.includes('booking')) return 'bookings';
    if (lower.includes('package')) return 'packages';
    if (lower.includes('earning')) return 'earnings';
    if (lower.includes('setting')) return 'settings';
    if (lower.includes('dashboard')) return 'dashboard';
    return 'dashboard';
  };

  const currentActiveTab = resolveActiveTab();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      <div className="flex flex-1">
        {/* Fixed / Mobile Sidebar */}
        <Sidebar
          activeTab={currentActiveTab}
          setActiveTab={setActiveTab}
          profile={profile}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header profile={profile} setMobileOpen={setMobileOpen} showSearch={showSearch} />

          <main className={`flex-1 p-4 lg:p-8 w-full mx-auto space-y-6 ${containerClassName}`}>
            {children}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PageWrapper;
