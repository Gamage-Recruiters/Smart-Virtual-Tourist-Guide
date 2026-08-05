import React from 'react';

/**
 * Reusable Header Layout Component
 * @param {Object} profile - Guide profile details (name, role, avatarInitials)
 * @param {Function} setMobileOpen - Mobile menu open handler
 * @param {boolean} showSearch - Controls rendering of search input bar
 */
export const Header = ({ profile, setMobileOpen, showSearch = true }) => {
  return (
    <header className="bg-white border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setMobileOpen && setMobileOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Optional Search Bar */}
        {showSearch && (
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search bookings, tourists, or routes..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-700"
            />
          </div>
        )}
      </div>

      {/* Right User Bar */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {profile && (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden flex-shrink-0">
              {profile.profilePhoto ? (
                <img
                  src={typeof profile.profilePhoto === 'string' ? profile.profilePhoto : profile.profilePhoto.url}
                  alt={profile.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                profile.avatarInitials || 'GP'
              )}
            </div>
            <div className="hidden sm:block">
              <h4 className="text-xs font-bold text-slate-800">{profile.name}</h4>
              <p className="text-[11px] text-slate-400">{profile.role}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="p-1.5 ml-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Log Out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
