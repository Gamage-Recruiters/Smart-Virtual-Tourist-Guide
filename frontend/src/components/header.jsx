import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// IMPORT YOUR FLAG IMAGE HERE
import sriLankaFlag from '../assets/LandingPage/SLFH.jpg';
// IMPORT YOUR LOGO IMAGE HERE
import logoImage from '../assets/LandingPage/logo.png';
// IMPORT YOUR BACKGROUND IMAGE HERE
import bg4Image from '../assets/LandingPage/bg4.png';

import NotificationBell from "../components/notifications/NotificationBell";
import NotificationModal from "../components/notifications/NotificationModal"; 
const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Load user data if logged in
  const userDataRaw = localStorage.getItem("userData");
  const user = userDataRaw ? JSON.parse(userDataRaw) : null;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <>
      <header className="relative z-50 w-full py-2 bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* --- Background Image on Right Side --- */}
          <div
            className="absolute top-0 bottom-0 right-0 hidden w-1/3 pointer-events-none lg:w-1/4 lg:block"
            style={{
              backgroundImage: `url(${bg4Image})`,
              backgroundSize: "cover",
              backgroundPosition: "right center",
              backgroundRepeat: "no-repeat",
              opacity: 1, // Set to 100% opacity
            }}
          ></div>

          {/* --- Left: Logo & Title --- */}
          <div className="relative z-10 flex items-center gap-3">
            {/* Logo Image - Imported from assets (No round shape) */}
            <div className="relative flex-shrink-0 w-12 h-12 md:w-16 md:h-16">
              <img
                src={logoImage}
                alt="Sri Lanka Logo"
                className="object-contain w-full h-full"
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
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  Sri Lanka
                </h1>
              </div>
            </div>
          </div>

          {/* --- Center: Navigation Links (Desktop) --- */}
          <nav className="relative z-10 items-center hidden space-x-6 md:flex lg:space-x-8">
            <Link
              to="/"
              className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/destinations"
              className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors"
            >
              Destinations
            </Link>
            <Link
              to="/how-it-works"
              className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors"
            >
              How it Works
            </Link>
            <Link
              to="/contact"
              className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/restaurants"
              className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors"
            >
              Restaurants
            </Link>
          </nav>

          {/* --- Right: Actions --- */}
          <div className="relative z-10 flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-4">
                  <NotificationBell />

                  {/* //<NotificationModal /> */}
                </div>
              )}

            {/* Sign In Button / User Profile */}
            {user ? (
              <div className="items-center hidden gap-2 sm:flex">
                <div className="px-4 py-1.5 bg-blue-50 border border-blue-200 text-[#0075FF] font-bold rounded-lg text-sm flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {user.fullName ||
                    user.restaurantName ||
                    user.username ||
                    "User"}
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userData");
                    localStorage.removeItem("restaurantUser");
                    window.location.reload();
                  }}
                  className="px-4 py-1.5 border border-slate-200 bg-red-500 hover:bg-red-600 hover:border-red-200 text-white font-bold rounded-lg text-sm transition-all cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-5 rounded-md transition-colors shadow-sm hidden sm:block"
              >
                Sign in
              </button>
            )}

            {/* Language Selector */}
            <div className="flex items-center hidden gap-1 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 sm:flex">
              <span>EN</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#3CB4FF] hover:bg-gray-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* //{user && <NotificationModal />} */}
        
      </header>
      

      {/* --- Mobile Sidebar --- */}
      <div
        className={`fixed inset-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:hidden`}
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
                className="object-contain w-8 h-8"
              />
              <span className="text-sm font-bold text-gray-800">Sri Lanka</span>
            </div>
            <button
              onClick={closeSidebar}
              className="p-1 text-gray-700 transition-colors rounded-md hover:text-red-600 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Sidebar Navigation Links */}
          <nav className="flex flex-col py-2">
            <Link
              to="/"
              className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50"
              onClick={closeSidebar}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50"
              onClick={closeSidebar}
            >
              About Us
            </Link>
            <Link
              to="/destinations"
              className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50"
              onClick={closeSidebar}
            >
              Destinations
            </Link>
            <Link
              to="/how-it-works"
              className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50"
              onClick={closeSidebar}
            >
              How it Works
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50"
              onClick={closeSidebar}
            >
              Contact
            </Link>
            <Link
              to="/restaurants"
              className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50"
              onClick={closeSidebar}
            >
              Restaurants
            </Link>
          </nav>

          {/* Sidebar Actions */}
          <div className="p-4 border-t border-gray-200">
            {user ? (
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#0075FF] font-bold text-sm">
                  {user.fullName ||
                    user.restaurantName ||
                    user.username ||
                    "User"}
                </span>
                <button
                  onClick={() => {
                    closeSidebar();
                    localStorage.removeItem("token");
                    localStorage.removeItem("userData");
                    localStorage.removeItem("restaurantUser");
                    window.location.reload();
                  }}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 rounded-lg text-xs font-semibold"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("/login")}
                className="w-full px-4 py-2 mb-3 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
              >
                Sign in
              </button>
            )}
            <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
              <span>EN</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
