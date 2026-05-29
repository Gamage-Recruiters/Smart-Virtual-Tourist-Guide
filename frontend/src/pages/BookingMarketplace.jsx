import DriversPage from '../components/bookingMarketplace/Driver'
import VehiclesPage from '../components/bookingMarketplace/Vehicle'
import SimplePage from '../components/bookingMarketplace/SimplePage'
import { useState } from "react";
import {
  Car,
  Bus,
  MapPinned,
  Hotel,
  Utensils,
  Activity,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState("drivers");

  const tabs = [
    { id: "drivers", label: "Drivers", icon: Car },
    { id: "vehicles", label: "Vehicles", icon: Bus },
    { id: "guides", label: "Guides", icon: MapPinned },
    { id: "hotels", label: "Hotels", icon: Hotel },
    { id: "restaurants", label: "Restaurants", icon: Utensils },
    { id: "activities", label: "Activities", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#eef3ff] p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-5 mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-[#0b132b]">
              BOOKING MARKETPLACE
            </h1>

            <p className="text-gray-500 mt-2">
              Find and book the best verified travel services in Sri Lanka.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white rounded-xl px-4 py-3 flex items-center gap-2 w-[260px] shadow-sm">
              <Search size={18} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search services..."
                className="outline-none w-full text-sm"
              />
            </div>

            <button className="bg-[#2563eb] hover:bg-[#1d4ed8] transition text-white px-6 rounded-xl font-semibold shadow-lg">
              POST CUSTOM REQUEST
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition ${
                  activeTab === tab.id
                    ? "bg-white text-[#2563eb] shadow-md"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* PAGE CONTENT */}
        {activeTab === "drivers" && <DriversPage />}
        {activeTab === "vehicles" && <VehiclesPage />}
        {activeTab === "guides" && <SimplePage title="Guides Page" />}
        {activeTab === "hotels" && <SimplePage title="Hotels Page" />}
        {activeTab === "restaurants" && (
          <SimplePage title="Restaurants Page" />
        )}
        {activeTab === "activities" && (
          <SimplePage title="Activities Page" />
        )}
      </div>
    </div>
  );
}

