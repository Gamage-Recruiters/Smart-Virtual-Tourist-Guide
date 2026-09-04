import React, { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  Hotel,
  Utensils,
  Bus,
  Ticket,
  ShoppingBag,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Info,
  Zap,
} from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

const CATEGORY_CONFIG = {
  accommodation: {
    label: "Accommodation",
    Icon: Hotel,
    tailwindBg: "bg-indigo-500",
    hex: "#6366f1",
  },
  food: {
    label: "Food & Dining",
    Icon: Utensils,
    tailwindBg: "bg-orange-500",
    hex: "#f97316",
  },
  transport: {
    label: "Transport",
    Icon: Bus,
    tailwindBg: "bg-sky-500",
    hex: "#0ea5e9",
  },
  activities: {
    label: "Activities",
    Icon: Ticket,
    tailwindBg: "bg-emerald-500",
    hex: "#10b981",
  },
  misc: {
    label: "Miscellaneous",
    Icon: ShoppingBag,
    tailwindBg: "bg-pink-500",
    hex: "#ec4899",
  },
};

function formatLKR(val) {
  if (val === undefined || val === null) return "LKR 0";
  return `LKR ${Math.round(Number(val)).toLocaleString("en-US")}`;
}

function GuardianBadge({ level }) {
  if (!level) return null;
  const map = {
    OK:       { Icon: CheckCircle, text: "On Track",       cls: "bg-green-50 text-green-700 border-green-200" },
    INFO:     { Icon: Info,        text: "50%+ used",      cls: "bg-blue-50 text-blue-700 border-blue-200" },
    WARNING:  { Icon: AlertTriangle, text: "⚠️ 70%+ used", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    CRITICAL: { Icon: XCircle,     text: "🚨 90%+ used",  cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const c = map[level];
  if (!c) return null;
  const { Icon } = c;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.cls}`}>
      <Icon size={12} />
      {c.text}
    </span>
  );
}

// Read trip info directly from localStorage (populated during registration)
function getTripInfoFromStorage() {
  const tripInfo = JSON.parse(localStorage.getItem("tripInfo") || "{}");
  return {
    startDate:   tripInfo.startDate   || "",
    endDate:     tripInfo.endDate     || "",
    budgetLKR:   Number(tripInfo.budgetLKR || tripInfo.budgetUSD) || 0,
    preferences: tripInfo.preferences || [],
  };
}

export default function BudgetOverview() {
  const [data, setData] = useState(null);
  const [guardian, setGuardian] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [recalcLoading, setRecalcLoading] = useState(false);
  const [error, setError] = useState(null);

  // Call ML optimize endpoint and seed MongoDB, then re-fetch
  const generatePlan = useCallback(async () => {
    setGenerating(true);
    setError(null);
    try {
      const user   = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?._id || user?.id || "dummy_tourist_123";
      const trip   = getTripInfoFromStorage();

      if (!trip.startDate || !trip.endDate || trip.budgetLKR <= 0) {
        throw new Error("Trip information is missing. Please complete registration first.");
      }

      const body = {
        userId,
        startDate:   trip.startDate,
        endDate:     trip.endDate,
        budgetLKR:   trip.budgetLKR,
        preferences: trip.preferences,
      };

      const res = await fetch(`${BACKEND_URL}/api/budget/optimize`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Optimize failed: ${res.status}`);

      // Notify BudgetPanel to reload with the freshly generated plan
      window.dispatchEvent(new CustomEvent("budgetPlanUpdated"));
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }, []);


  const fetch_data = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user   = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?._id || user?.id || "dummy_tourist_123";
      const trip   = getTripInfoFromStorage();

      const res = await fetch(`${BACKEND_URL}/api/budget/allocation/${userId}`);

      // No plan yet — auto-generate one from the tourist's stored budget, then re-fetch
      if (res.status === 404) {
        await generatePlan();
        const res2 = await fetch(`${BACKEND_URL}/api/budget/allocation/${userId}`);
        if (res2.ok) {
          const json2 = await res2.json();
          const alloc2 = json2.data;
          setData(alloc2);
          await fetchGuardian(alloc2.totalBudgetLKR);
        } else {
          setData(null);
        }
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error(`Server ${res.status}`);
      const json = await res.json();
      const alloc = json.data;

      // ── Stale-budget check ──────────────────────────────────────────────────
      // If the stored plan was generated with a different budget (e.g. a previous
      // tourist's leftover data), regenerate it now with the correct LKR value.
      const storedBudget = trip.budgetLKR;
      const fetchedBudget = alloc.totalBudgetLKR;
      if (storedBudget > 0 && Math.abs(storedBudget - fetchedBudget) > 1) {
        // Budgets differ — regenerate silently
        await generatePlan();
        const res3 = await fetch(`${BACKEND_URL}/api/budget/allocation/${userId}`);
        if (res3.ok) {
          const json3 = await res3.json();
          const alloc3 = json3.data;
          setData(alloc3);
          await fetchGuardian(alloc3.totalBudgetLKR);
        }
        setLoading(false);
        return;
      }
      // ────────────────────────────────────────────────────────────────────────

      setData(alloc);
      await fetchGuardian(alloc.totalBudgetLKR);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [generatePlan]);


  async function fetchGuardian(totalBudgetLKR) {
    try {
      const gRes = await fetch(`${BACKEND_URL}/api/budget/guardian`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ totalBudgetLKR, spentSoFarLKR: 0 }),
      });
      if (gRes.ok) {
        const gJson = await gRes.json();
        setGuardian(gJson.data);
      }
    } catch (_) {}
  }

  // Trigger a fresh recalculation from the ML model
  const handleRecalculate = async () => {
    setRecalcLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const tripInfo = JSON.parse(localStorage.getItem("tripInfo") || "{}");
      const userId = user?._id || user?.id || "dummy_tourist_123";
      const trip = getTripInfoFromStorage();

      if (!trip.startDate || !trip.endDate || trip.budgetLKR <= 0) {
        throw new Error("Please fill in start date, end date and budget first.");
      }

      // Use recalculate if we already have data, otherwise generate fresh
      if (data) {
        await fetch(`${BACKEND_URL}/api/budget/recalculate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            touristId: userId,
            startDate: tripInfo.startDate,
            endDate: tripInfo.endDate,
            budgetLKR: trip.budgetLKR,
            preferences: tripInfo.preferences || [],
          }),
        });
      } else {
        await generatePlan();
      }
      await fetch_data();
    } catch (e) {
      console.error("Recalculate error:", e);
      setError(e.message);
    } finally {
      setRecalcLoading(false);
    }
  };

  useEffect(() => { fetch_data(); }, [fetch_data]);

  // Re-generate plan whenever DestinationForm updates trip info
  useEffect(() => {
    const handleTripInfoUpdate = () => {
      const trip = getTripInfoFromStorage();
      if (trip.startDate && trip.endDate && trip.budgetLKR > 0) {
        generatePlan().then(() => fetch_data());
      }
    };
    window.addEventListener("tripInfoUpdated", handleTripInfoUpdate);
    return () => window.removeEventListener("tripInfoUpdated", handleTripInfoUpdate);
  }, [generatePlan, fetch_data]);

  // Loading / Generating
  if (loading || generating) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm w-full flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw size={28} className="animate-spin text-indigo-400" />
          <p className="text-sm font-medium">
            {generating ? "Running AI budget optimizer…" : "Loading budget plan…"}
          </p>
          {generating && (
            <p className="text-xs text-indigo-400">PuLP LP model is allocating your budget</p>
          )}
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm w-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <Wallet size={18} className="text-red-400" />
          </div>
          <div>
            <h2 className="font-bold text-xl">Budget Overview</h2>
            <p className="text-sm text-red-400">Could not load — {error}</p>
          </div>
        </div>
        <button onClick={fetch_data} className="text-sm text-indigo-600 hover:underline font-semibold flex items-center gap-1">
          <RefreshCw size={13} /> Retry
        </button>
      </div>
    );
  }

  // No plan (could not auto-generate)
  if (!data) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm w-full">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Wallet size={18} className="text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-xl">Budget Overview</h2>
            <p className="text-sm text-gray-500">AI-powered allocation</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <TrendingUp size={24} className="text-indigo-400" />
          </div>
          <p className="text-slate-600 font-semibold text-sm">Could not generate budget plan</p>
          <p className="text-slate-400 text-xs max-w-56">
            {error || "Make sure the backend and ML server are running."}
          </p>
          <button
            onClick={fetch_data}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    tripStyle,
    totalBudgetLKR,
    numDays,
    dailyBudgetLKR,
    tripTotalLKR,
    remainingLKR,
    dailyAllocation = {},
    totalAllocation = {},
    warnings = [],
  } = data;

  // Compute per-category percentages relative to tripTotalLKR
  const categories = Object.keys(CATEGORY_CONFIG).map((key) => {
    const cfg = CATEGORY_CONFIG[key];
    const totalAmt = totalAllocation[key] ?? 0;
    const dailyAmt = dailyAllocation[key] ?? 0;
    const pct = tripTotalLKR > 0 ? Math.round((totalAmt / tripTotalLKR) * 100) : 0;
    return { key, ...cfg, totalAmt, dailyAmt, pct };
  });

  const styleLabel = tripStyle?.charAt(0).toUpperCase() + tripStyle?.slice(1);
  const spentPct = Math.min(100, Math.round((tripTotalLKR / totalBudgetLKR) * 100));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm w-full">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Wallet size={18} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="font-bold text-xl">Budget Overview</h2>
            <p className="text-sm text-gray-500">
              AI-optimized · {numDays} days · <span className="font-semibold text-indigo-600">{styleLabel}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <GuardianBadge level={guardian?.alert_level} />
          
          <button
            onClick={handleRecalculate}
            disabled={recalcLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold transition-all shadow-sm shadow-indigo-200"
          >
            {recalcLoading ? (
              <><RefreshCw size={12} className="animate-spin" /> Recalculating…</>
            ) : (
              <><Zap size={12} /> Recalculate Plan</>
            )}
          </button>
        </div>
      </div>

      {/* Total Budget Progress */}
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-500">Total Budget</span>
        <span className="font-semibold text-slate-800">{formatLKR(totalBudgetLKR)}</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-1">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${spentPct}%`,
            background: spentPct >= 90
              ? "linear-gradient(90deg,#f97316,#ef4444)"
              : spentPct >= 70
              ? "linear-gradient(90deg,#f59e0b,#f97316)"
              : "linear-gradient(90deg,#6366f1,#818cf8)",
          }}
        />
      </div>
      <div className="flex justify-between text-sm mb-6">
        <span className="text-gray-500">
          Allocated: <span className="font-semibold text-slate-800">{formatLKR(tripTotalLKR)}</span>
        </span>
        <span className="text-green-600 font-semibold">
          {formatLKR(remainingLKR)} unallocated
        </span>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-50 rounded-2xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Daily Budget</p>
          <p className="text-sm font-bold text-slate-800">{formatLKR(dailyBudgetLKR)}</p>
        </div>
        <div className="bg-indigo-50 rounded-2xl p-3 text-center">
          <p className="text-xs text-indigo-400 mb-1">Allocated</p>
          <p className="text-sm font-bold text-indigo-700">{spentPct}%</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <p className="text-xs text-green-500 mb-1">Unallocated</p>
          <p className="text-sm font-bold text-green-700">{formatLKR(remainingLKR)}</p>
        </div>
      </div>

      {/* ML Model Label */}
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
        📊 LP-Optimized Category Breakdown
      </p>

      {/* Category Breakdown */}
      <div className="space-y-4">
        {categories.map(({ key, label, Icon, tailwindBg, hex, totalAmt, dailyAmt, pct }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className={`w-6 h-6 rounded-lg ${tailwindBg} text-white flex items-center justify-center`}>
                  <Icon size={12} />
                </div>
                <span className="font-medium">{label}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-700 text-sm">{formatLKR(totalAmt)}</span>
                <span className="text-xs text-gray-400 ml-1">({pct}%)</span>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: hex }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{formatLKR(dailyAmt)}/day</p>
          </div>
        ))}
      </div>

      {/* LP Optimizer Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="mt-5 bg-amber-50 border border-amber-100 rounded-2xl p-3 flex gap-2">
          <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">{warnings[0]}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
        <div>
          <p className="text-xs text-gray-400">Avg. per day</p>
          <p className="font-bold text-indigo-600 text-sm">{formatLKR(dailyBudgetLKR)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Budget Alerts</p>
          <p className="text-xs font-semibold text-gray-500">⚠️ 70% · 🚨 90%</p>
        </div>
      </div>
    </div>
  );
}
