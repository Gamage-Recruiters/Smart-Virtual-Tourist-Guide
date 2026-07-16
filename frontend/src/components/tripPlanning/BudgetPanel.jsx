import React, { useState, useEffect } from "react";
import { Info, Car, Home, Utensils, MapPin } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

const USD_RATE = 320; // Assuming 320 LKR per USD to match backend logic

function formatUSD(val) {
  if (val === undefined || val === null) return "$0";
  const usdValue = Math.round(Number(val) / USD_RATE);
  return `$${usdValue.toLocaleString("en-US")}`;
}

// ─────────────────────────────────────────────────────────────
// Budget Recalculation Display (Matches User Image)
// ─────────────────────────────────────────────────────────────
function BudgetRecalculationDisplay({ alloc, loading }) {
  // Default dummy values just like the image if loading/missing
  const totalUSD = alloc ? alloc.totalBudgetLKR / USD_RATE : 2000;
  const estimatedUSD = alloc ? alloc.tripTotalLKR / USD_RATE : 1750;
  const remainingUSD = alloc ? alloc.remainingLKR / USD_RATE : 250;
  
  const pct = Math.min(100, Math.round((estimatedUSD / totalUSD) * 100)) || 88;
  
  const daily = alloc?.totalAllocation || {};
  const transport = daily.transport ? (daily.transport / USD_RATE) : 450;
  const accommodation = daily.accommodation ? (daily.accommodation / USD_RATE) : 600;
  const food = daily.food ? (daily.food / USD_RATE) : 400;
  const activities = daily.activities ? (daily.activities / USD_RATE) : 300;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Budget<br/>Recalculation</h3>

      {/* Budget Usage Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-800">Budget Usage</span>
          <span className="text-sm font-semibold text-blue-600">{pct} %</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-blue-600 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        <div>
          <p className="text-[11px] text-gray-500 font-medium mb-1 leading-tight">Total<br/>Budget</p>
          <p className="text-[17px] font-bold text-gray-900">${Math.round(totalUSD)}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-500 font-medium mb-1 leading-tight"><br/>Estimated</p>
          <p className="text-[17px] font-bold text-[#2A528A]">${Math.round(estimatedUSD)}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-500 font-medium mb-1 leading-tight"><br/>Remaining</p>
          <p className="text-[17px] font-bold text-[#4CAF50]">${Math.round(remainingUSD)}</p>
        </div>
      </div>

      {/* Breakdown */}
      <h4 className="text-sm font-bold text-gray-900 mb-4">Breakdown</h4>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Car size={18} className="text-[#3A4A5A]" />
            <span className="text-sm text-gray-800 font-medium">Transport</span>
          </div>
          <span className="text-sm font-bold text-gray-900">${Math.round(transport)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home size={18} className="text-[#3A4A5A]" />
            <span className="text-sm text-gray-800 font-medium">Accommodation</span>
          </div>
          <span className="text-sm font-bold text-gray-900">${Math.round(accommodation)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Utensils size={18} className="text-[#3A4A5A]" />
            <span className="text-sm text-gray-800 font-medium">Food</span>
          </div>
          <span className="text-sm font-bold text-gray-900">${Math.round(food)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-[#3A4A5A]" />
            <span className="text-sm text-gray-800 font-medium">Activities</span>
          </div>
          <span className="text-sm font-bold text-gray-900">${Math.round(activities)}</span>
        </div>
      </div>

      {/* Alert Box */}
      <div className="flex gap-3 bg-[#F4F7FB] rounded-xl p-4">
        <Info size={18} className="text-[#3A4A5A] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-700 font-medium leading-relaxed">
          Updates automatically when you rearrange activities.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Export (Sidebar)
// ─────────────────────────────────────────────────────────────
export default function BudgetPanel() {
  const [alloc, setAlloc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?._id || user?.id || "dummy_tourist_123";
        const res = await fetch(`${BACKEND_URL}/api/budget/allocation/${userId}`);
        if (res.ok) {
          const json = await res.json();
          setAlloc(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const numDays = alloc ? alloc.numDays : 5;
  const tripStyle = alloc ? alloc.tripStyle : "Balanced";

  return (
    <div className="flex flex-col gap-4 w-72 flex-shrink-0">

      {/* ── Budget Recalculation Display ── */}
      <BudgetRecalculationDisplay alloc={alloc} loading={loading} />

      {/* ── Trip Summary ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Trip Summary</h3>

        {/* Route */}
        <div className="flex items-center gap-1 flex-wrap mb-1">
          {["Colombo", "Kandy", "Ella"].map((city, i, arr) => (
            <span key={city} className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-700">{city}</span>
              {i < arr.length - 1 && <span className="text-gray-300 text-xs">→</span>}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mb-1">+ Galle</p>

        <div className="flex items-center gap-4 mt-3 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{loading ? "..." : `${numDays} days`}</span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100 capitalize">
            {loading ? "..." : tripStyle}
          </span>
        </div>

        {/* Weather Preview */}
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-3 mb-3">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Weather Preview</p>
          <div className="flex justify-between">
            {[
              { day: "Mon", icon: "☀️", temp: "32°C" },
              { day: "Tue", icon: "⛅", temp: "30°C" },
              { day: "Wed", icon: "🌤️", temp: "38°C" },
            ].map(({ day, icon, temp }) => (
              <div key={day} className="text-center">
                <p className="text-[10px] text-gray-400">{day}</p>
                <span className="text-lg">{icon}</span>
                <p className="text-[11px] font-semibold text-gray-700">{temp}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full py-1.5 rounded-xl border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          View Safety Alerts
        </button>
      </div>

      {/* ── Save & Export ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Save & Export</h3>
        <button className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors mb-2 shadow-sm shadow-blue-200">
          💾 Save Itinerary
        </button>
        <button className="w-full py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium transition-colors mb-2">
          📄 Export PDF
        </button>
        <button className="w-full py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium transition-colors">
          🔗 Share Link
        </button>
      </div>

    </div>
  );
}
