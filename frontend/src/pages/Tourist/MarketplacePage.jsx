import React, { useState } from 'react';
import { FaHotel, FaCar, FaCompass, FaSuitcaseRolling, FaUtensils, FaRunning, FaGavel } from 'react-icons/fa';
import Hotels_Card from '../../components/marketplace/Hotels_Card';
import Drivers_Card from '../../components/marketplace/Drivers_Card';
import Guides_Card from '../../components/marketplace/Guides_Card';
import Vehicles_Card from '../../components/marketplace/Vehicles_Card';
import Restaurants_Card from '../../components/marketplace/Restaurants_Card';
import Activities_Card from '../../components/marketplace/Activities_Card';
import Driver_Bids from '../../components/bidding/Driver_Bids';

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('hotels');

  const tabs = [
    { id: 'hotels', label: 'Hotels', icon: <FaHotel /> },
    { id: 'drivers', label: 'Drivers', icon: <FaCar /> },
    { id: 'guides', label: 'Guides', icon: <FaCompass /> },
    { id: 'vehicles', label: 'Vehicles', icon: <FaSuitcaseRolling /> },
    { id: 'restaurants', label: 'Restaurants', icon: <FaUtensils /> },
    { id: 'activities', label: 'Activities', icon: <FaRunning /> },
    { id: 'bidding', label: 'Bidding Engine', icon: <FaGavel /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {/* Top Header & Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 p-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Service Marketplace & Bidding</h1>
            <p className="text-slate-500 text-xs mt-1">Browse hotels, hires, guides, services or submit custom travel bids.</p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="rounded-2xl overflow-hidden">
        {activeTab === 'hotels' && <Hotels_Card />}
        {activeTab === 'drivers' && <Drivers_Card />}
        {activeTab === 'guides' && <Guides_Card />}
        {activeTab === 'vehicles' && <Vehicles_Card />}
        {activeTab === 'restaurants' && <Restaurants_Card />}
        {activeTab === 'activities' && <Activities_Card />}
        {activeTab === 'bidding' && <Driver_Bids />}
      </div>
    </div>
  );
}
