import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaCar, FaSuitcaseRolling, FaCompass, FaHotel, FaUtensils, FaRunning } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'drivers', icon: <FaCar />, path: '/drivers' },
    { id: 'vehicles', icon: <FaSuitcaseRolling />, path: '/vehicles' },
    { id: 'guides', icon: <FaCompass />, path: '/guides' },
    { id: 'hotels', icon: <FaHotel />, path: '/hotels' },
    { id: 'restaurants', icon: <FaUtensils />, path: '/restaurants' },
    { id: 'activities', icon: <FaRunning />, path: '/activities' },
  ];

  return (
    <nav className="bg-white flex items-center space-x-1 overflow-x-auto rounded-t-xl">
      {navItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) => `
            flex items-center space-x-2 px-4 py-2.5 rounded-t-lg font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap
            ${isActive 
              ? 'bg-[#EBF1FF] text-[#1E40AF]' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{t(`marketplaceNavbar.${item.id}`)}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;