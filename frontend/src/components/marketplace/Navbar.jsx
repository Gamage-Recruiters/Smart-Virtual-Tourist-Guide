import React from 'react';
import { FaCar, FaSuitcaseRolling, FaCompass, FaHotel, FaUtensils, FaRunning } from 'react-icons/fa';

const Navbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'drivers', label: 'Drivers', icon: <FaCar />, active: activeTab === 'drivers' },
    { id: 'vehicles', label: 'Vehicles', icon: <FaSuitcaseRolling />, active: activeTab === 'vehicles' },
    { id: 'guides', label: 'Guides', icon: <FaCompass />, active: activeTab === 'guides' },
    { id: 'hotels', label: 'Hotels', icon: <FaHotel />, active: activeTab === 'hotels' },
    { id: 'restaurants', label: 'Restaurants', icon: <FaUtensils />, active: activeTab === 'restaurants' },
    { id: 'activities', label: 'Activities', icon: <FaRunning />, active: activeTab === 'activities' },
  ];

  return (
    <nav className="bg-white flex items-center space-x-1 overflow-x-auto rounded-t-xl">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap ${
            item.active
              ? 'bg-[#EBF1FF] text-[#1E40AF]'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navbar;