import React from 'react';
import { LayoutGrid, Ticket, Map, Wallet, Settings, LogOut, CheckCircle2 } from 'lucide-react';

/**
 * Reusable Sidebar Layout Component
 * @param {string} activeTab - Currently active navigation tab id
 * @param {Function} setActiveTab - Tab change handler
 * @param {Object} profile - Guide profile data (name, role, avatarInitials)
 * @param {boolean} mobileOpen - Mobile drawer toggle state
 * @param {Function} setMobileOpen - Mobile drawer toggle handler
 */
export const Sidebar = ({ activeTab, setActiveTab, profile, mobileOpen, setMobileOpen }) => {
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('guideProfileData');
    localStorage.removeItem('guideProfilePhoto');
    window.location.href = '/';
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard-Guide',
      icon: <LayoutGrid className="w-5 h-5" />,
    },
    {
      id: 'bookings',
      label: 'Booking Requests',
      path: '/guide-bookings',
      icon: <Ticket className="w-5 h-5" />,
    },
    {
      id: 'packages',
      label: 'My Tour Packages',
      path: '/guide-add-package',
      icon: <Map className="w-5 h-5" />,
    },
    {
      id: 'earnings',
      label: 'Earnings',
      path: '/guide-earnings',
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/guide-settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[220px] bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        <div>
          {/* Logo Header */}
          <div className="px-2 pt-2 pb-5 mb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-800 tracking-wider uppercase">
                GUIDES
              </h2>
              <p className="text-[11px] font-medium text-slate-400">
                Admin portal
              </p>
            </div>
            <button
              className="lg:hidden text-slate-400 hover:text-slate-600"
              onClick={() => setMobileOpen && setMobileOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (setActiveTab) setActiveTab(item.id);
                    if (setMobileOpen) setMobileOpen(false);
                    if (item.path && window.location.pathname !== item.path) {
                      window.location.href = item.path;
                    }
                  }}
                  className={`
                    group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200
                    ${
                      isActive
                        ? 'bg-blue-50/80 text-blue-600'
                        : 'text-slate-500 hover:bg-blue-50/60 hover:text-blue-600'
                    }
                  `}
                >
                  <span className={isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-500 transition-colors'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Dedicated Logout Nav Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 mt-2"
            >
              <LogOut className="w-5 h-5 text-rose-400 group-hover:text-rose-600 transition-colors" />
              <span>Log Out</span>
            </button>
          </nav>
        </div>

        {/* User Mini Profile Footer with Quick Logout */}
        <div className="pt-4 border-t border-slate-100 px-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden shadow-sm">
              {profile?.profilePhoto ? (
                <img
                  src={typeof profile.profilePhoto === 'string' ? profile.profilePhoto : profile.profilePhoto.url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.avatarInitials || 'RP'
              )}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-800 truncate">
                {profile?.name || 'Rohan Perera'}
              </h4>
              <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                <CheckCircle2 className="w-2.5 h-2.5 text-slate-400" />
                <span>VERIFIED GUIDE</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex-shrink-0"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

