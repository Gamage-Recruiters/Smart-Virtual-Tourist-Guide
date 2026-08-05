import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from '../Guide/Footer';

/**
 * Reusable PageWrapper Layout Shell
 * @param {string} activeTab - Currently active navigation tab id
 * @param {Function} setActiveTab - Tab change handler
 * @param {Object} profile - Guide profile data
 * @param {boolean} mobileOpen - Mobile drawer toggle state
 * @param {Function} setMobileOpen - Mobile drawer toggle handler
 * @param {boolean} showSearch - Shows top search input bar if true
 * @param {string} containerClassName - Custom max-width/padding class for main content container
 * @param {React.ReactNode} children - Page content
 */
export const PageWrapper = ({
  activeTab,
  setActiveTab,
  profile,
  mobileOpen,
  setMobileOpen,
  showSearch = true,
  containerClassName = 'max-w-5xl',
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      <div className="flex flex-1">
        {/* Fixed / Mobile Sidebar */}
        <Sidebar
          activeTab={activeTab}
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
