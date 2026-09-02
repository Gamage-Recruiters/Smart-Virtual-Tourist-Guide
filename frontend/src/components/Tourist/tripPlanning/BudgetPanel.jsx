import React, { useState, useEffect } from "react";
import { Info, Car, Home, Utensils, MapPin, RefreshCw } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

/** Format a LKR value compactly to prevent overflow in tight layouts */
function formatLKR(val) {
  if (val === undefined || val === null) return "LKR 0";
  const n = Math.round(Number(val));
  if (n >= 1_000_000) return `LKR ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `LKR ${(n / 1_000).toFixed(0)}K`;
  return `LKR ${n.toLocaleString("en-US")}`;
}

// ─────────────────────────────────────────────────────────────
// Budget Recalculation Display
// ─────────────────────────────────────────────────────────────
function BudgetRecalculationDisplay({ alloc, loading }) {
  const storedTrip = JSON.parse(localStorage.getItem("tripInfo") || "{}");
  const userBudgetLKR = Number(storedTrip.budgetLKR || storedTrip.budgetUSD) || 0;

  // ── Stale-budget guard ────────────────────────────────────────
  // If MongoDB returned a very different budget from what's in localStorage,
  // it's leftover from a previous session. Fall back to localStorage estimates.
  const allocIsValid =
    alloc &&
    (userBudgetLKR === 0 || Math.abs(alloc.totalBudgetLKR - userBudgetLKR) <= userBudgetLKR * 0.01);

  const totalLKR      = allocIsValid ? alloc.totalBudgetLKR  : userBudgetLKR || 500000;
  const estimatedLKR  = allocIsValid ? alloc.tripTotalLKR    : Math.round(totalLKR * 0.875);
  const remainingLKR2 = allocIsValid ? alloc.remainingLKR    : totalLKR - estimatedLKR;

  const pct = totalLKR > 0 ? Math.min(100, Math.round((estimatedLKR / totalLKR) * 100)) : 0;

  const dailyAlloc    = allocIsValid ? (alloc.totalAllocation || {}) : {};
  const transport     = dailyAlloc.transport     || Math.round(estimatedLKR * 0.25);
  const accommodation = dailyAlloc.accommodation || Math.round(estimatedLKR * 0.34);
  const food          = dailyAlloc.food          || Math.round(estimatedLKR * 0.23);
  const activities    = dailyAlloc.activities    || Math.round(estimatedLKR * 0.18);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-center py-16">
        <RefreshCw size={22} className="animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Budget<br/>Recalculation</h3>

      {/* Budget Usage Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-800">Budget Usage</span>
          <span className="text-sm font-semibold text-blue-600">{pct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: pct >= 90
                ? "linear-gradient(90deg,#f97316,#ef4444)"
                : pct >= 70
                ? "linear-gradient(90deg,#f59e0b,#f97316)"
                : "#2563eb",
            }}
          />
        </div>
      </div>

      {/* Stats — stacked vertically to prevent overflow */}
      <div className="flex flex-col gap-2 mb-6 bg-slate-50 rounded-xl p-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 font-medium">Total Budget</span>
          <span className="text-sm font-bold text-gray-900">{formatLKR(totalLKR)}</span>
        </div>
        <div className="h-px bg-gray-200" />
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 font-medium">Estimated Cost</span>
          <span className="text-sm font-bold text-blue-700">{formatLKR(estimatedLKR)}</span>
        </div>
        <div className="h-px bg-gray-200" />
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 font-medium">Remaining</span>
          <span className="text-sm font-bold text-green-600">{formatLKR(remainingLKR2)}</span>
        </div>
      </div>

      {/* Breakdown */}
      <h4 className="text-sm font-bold text-gray-900 mb-4">Breakdown</h4>
      <div className="flex flex-col gap-3 mb-6">
        {[
          { Icon: Car,      label: "Transport",     val: transport },
          { Icon: Home,     label: "Accommodation", val: accommodation },
          { Icon: Utensils, label: "Food",          val: food },
          { Icon: MapPin,   label: "Activities",    val: activities },
        ].map(({ Icon, label, val }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon size={16} className="text-[#3A4A5A] flex-shrink-0" />
              <span className="text-sm text-gray-800 font-medium">{label}</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{formatLKR(val)}</span>
          </div>
        ))}
      </div>

      {/* Alert Box */}
      <div className="flex gap-3 bg-[#F4F7FB] rounded-xl p-4">
        <Info size={16} className="text-[#3A4A5A] mt-0.5 flex-shrink-0" />
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

  async function loadData() {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?._id || user?.id || "dummy_tourist_123";
      const res = await fetch(`${BACKEND_URL}/api/budget/allocation/${userId}`);
      if (res.ok) {
        const json = await res.json();
        setAlloc(json.data);
      } else {
        setAlloc(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Reload immediately when BudgetOverview finishes generating/recalculating a plan
  useEffect(() => {
    const handlePlanUpdated = () => loadData();
    window.addEventListener("budgetPlanUpdated", handlePlanUpdated);
    return () => window.removeEventListener("budgetPlanUpdated", handlePlanUpdated);
  }, []);

  // Re-load when DestinationForm updates trip info (after BudgetOverview generates a new plan)
  useEffect(() => {
    const handleTripInfoUpdate = () => {
      // Small delay to let BudgetOverview finish generating the new plan first
      setTimeout(() => loadData(), 2500);
    };
    window.addEventListener("tripInfoUpdated", handleTripInfoUpdate);
    return () => window.removeEventListener("tripInfoUpdated", handleTripInfoUpdate);
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
