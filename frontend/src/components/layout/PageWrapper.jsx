import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from '../Guide/Footer';

/**
 * Reusable PageWrapper Layout Shell
 * Supports activeTab or activeNavItem, auto-manages mobile drawer and profile fallback
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

  // Profile fallback state from localStorage
  const [localProfile, setLocalProfile] = useState({
    name: 'Rohan Perera',
    role: 'Senior Tour Guide',
    avatarInitials: 'RP',
  });

  useEffect(() => {
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

        setLocalProfile({
          name,
          role: user.role ? user.role.replace(/_/g, ' ') : 'Senior Tour Guide',
          avatarInitials: initials,
        });
      }
    } catch (e) {
      console.error('Failed to parse user session data', e);
    }
  }, []);

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
