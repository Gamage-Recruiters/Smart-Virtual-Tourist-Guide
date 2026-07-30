import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sriLankaFlag from '../assets/SLFH.jpg'; 
import logoImage from '../assets/logo.png'; 
import bg4Image from '../assets/bg4.png'; 

const Navbar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="w-full bg-white border-b border-gray-100 py-2 relative z-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* --- Background Image on Right Side --- */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-1/3 lg:w-1/4 pointer-events-none hidden lg:block"
            style={{
              backgroundImage: `url(${bg4Image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat',
              opacity: 1,
            }}
          ></div>

          {/* --- Left: Logo & Title --- */}
          <div className="flex items-center gap-3 relative z-10">
            {/* Logo Image - Imported from assets */}
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
              <img 
                src={logoImage} 
                alt="Sri Lanka Logo" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Text Area */}
            <div className="flex flex-col items-start">
              {/* Small Tagline */}
              <span className="text-[8px] md:text-xs font-bold text-gray-700 tracking-wide mb-0.5">
                Smart Virtual Tourism Guide
              </span>
              
              {/* Main Title with Sri Lankan Flag Mask */}
              <div className="relative">
                <h1 
                  className="text-lg md:text-2xl lg:text-3xl font-extrabold tracking-[0.15em] leading-none text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `url(${sriLankaFlag})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                >
                  Sri Lanka
                </h1>
              </div>
            </div>
          </div>

          {/* --- Center: Navigation Links (Desktop) --- */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 relative z-10">
            <a href="#" className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors">
              Add Rooms & Packages
            </a>
            <a href="#" className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors">
              Calendar
            </a>
            <a href="#" className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors">
              Manage Availability
            </a>
            <a href="#" className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors">
              View Bookings
            </a>
            <a href="#" className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors">
              Revenue Analyze
            </a>
          </nav>

          {/* --- Right: Actions --- */}
          <div className="flex items-center gap-3 relative z-10">
            {/* Language Selector */}
            <div className="flex items-center text-gray-700 cursor-pointer hover:text-gray-900 gap-1 text-sm font-medium hidden sm:flex">
              <span>EN</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleSidebar}
              className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#3CB4FF] hover:bg-gray-100 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </header>

      {/* --- Mobile Sidebar --- */}
      <div 
        className={`fixed inset-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={closeSidebar}
        ></div>

        {/* Sidebar Content */}
        <div className="relative w-64 max-w-[80%] h-full bg-white shadow-xl overflow-y-auto">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <img 
                src={logoImage} 
                alt="Sri Lanka Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-gray-800 text-sm">Sri Lanka</span>
            </div>
            <button 
              onClick={closeSidebar}
              className="p-1 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sidebar Navigation Links */}
          <nav className="flex flex-col py-2">
            <a href="#" className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50" onClick={closeSidebar}>
              Add Rooms & Packages
            </a>
            <a href="#" className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50" onClick={closeSidebar}>
              Calendar
            </a>
            <a href="#" className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50" onClick={closeSidebar}>
              Manage Availability
            </a>
            <a href="#" className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50" onClick={closeSidebar}>
              View Bookings
            </a>
            <a href="#" className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50" onClick={closeSidebar}>
              Revenue Analyze
            </a>
          </nav>

          {/* Sidebar Actions */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-center text-gray-700 cursor-pointer hover:text-gray-900 gap-1 text-sm font-medium">
              <span>EN</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-3 w-3" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;