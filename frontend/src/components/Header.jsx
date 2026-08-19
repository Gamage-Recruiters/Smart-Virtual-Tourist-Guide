import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react"; 
import logo from "../assets/touristDashboard/Lanka.png";
import textImage from "../assets/touristDashboard/main_text.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Header() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "EN");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { key: "home", defaultLabel: "Home" },
    { key: "menu", defaultLabel: "Menu" },
    { key: "offers", defaultLabel: "Offers" },
    { key: "reservation", defaultLabel: "Reservation" },
    { key: "revenue", defaultLabel: "Revenue" },
    { key: "profile", defaultLabel: "Profile" },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setIsDropdownOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full h-20 bg-white flex items-center justify-between fixed top-0 left-0 z-50">
      {/* Left Section: Logo & Brand Text */}
      <div className="absolute top-0 left-0 h-full">
        <div className="relative w-32 h-20 shrink-0">
          <div className="absolute top-20 left-0 w-24 h-12 bg-white rounded-b-full shadow-sm z-10"></div>

          <div className="absolute top-0 left-0 w-24 h-32 flex items-center justify-center z-10">
            <img
              className="w-24 h-24 object-contain drop-shadow-md"
              src={logo}
              alt="Sri Lanka Logo"
            />
          </div>
          
        </div>
      </div>
      <div className="flex items-center justify-between w-full h-20 shadow-sm pl-20 pr-8">
        <div className="flex items-center">
          {/* Main Text Image */}
          <img
            className="w-56 object-contain ml-1"
            src={textImage}
            alt="Smart Virtual Tourism Guide Sri Lanka"
          />
        </div>

        {/* Right Section: Nav Links, Button, Language */}
        <div className="flex items-center gap-8">
          {/* Navigation Links (Hidden on small screens, visible on large) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ">
            {navLinks.map((item) => (
              <Link
                key={item.key}
                to={`/${item.defaultLabel.toLowerCase()}`}
                className="text-slate-800 font-bold hover:text-blue-600 transition-colors text-lg"
              >
                {t(`header.${item.key}`, item.defaultLabel)}
              </Link>
            ))}
          </nav>

          {/* Call to Action & Language Selector */}
          <div className="flex items-center gap-6 ml-4 border-l border-slate-100 pl-6 relative">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-xl shadow-sm transition-transform active:scale-95">
              {t('header.signIn', 'Sign in')}
            </button>

            {/* Language Selector */}
            <div className="relative" ref={dropdownRef}>
              <div 
                className="flex items-center gap-1 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors"
                onClick={toggleDropdown}
              >
                <span className="font-bold uppercase tracking-wide">
                  {language === "SI" ? "සිං" : language}
                </span>
                <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div 
                    className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                    onClick={() => handleLanguageChange("EN")}
                  >
                    English (EN)
                  </div>
                  <div 
                    className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                    onClick={() => handleLanguageChange("SI")}
                  >
                    සිංහල (සිං)
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
