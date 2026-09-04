import React, { useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Trash2,
  Plus,
  GripVertical,
  Utensils,
  Camera,
  Sun,
  Hotel,
  Car,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// DailyItinerary.jsx — Updated by AI Itinerary Engine
// Connected to POST /api/itinerary/generate via itinerary prop
// UI kept exactly as original (lucide-react icons, styling)
// Props:
//   - itinerary: generated itinerary object from GenerateItineraryButton
// ══════════════════════════════════════════════════════════════════════════════

// ── Activity type to icon mapping ────────────────────────────────────────────
const getActivityIcon = (type) => {
  switch (type) {
    case 'food':
      return <Utensils className="w-4 h-4 text-orange-500" />;
    case 'sightseeing':
      return <Camera className="w-4 h-4 text-purple-500" />;
    case 'activity':
      return <Sun className="w-4 h-4 text-yellow-500" />;
    case 'accommodation':
      return <Hotel className="w-4 h-4 text-green-500" />;
    case 'transport':
      return <Car className="w-4 h-4 text-blue-500" />;
    default:
      return <Sun className="w-4 h-4 text-yellow-500" />;
  }
};

// ── Format LKR cost to USD display ───────────────────────────────────────────
const formatCost = (lkr) => {
  if (!lkr || lkr === 0) return 'Free';
  return `$${Math.round(lkr / 300)}`;
};

// ── Format day total ──────────────────────────────────────────────────────────
const formatDayTotal = (lkr) => {
  if (!lkr) return '$0';
  return `$${Math.round(lkr / 300)}`;
};

export default function DailyItinerary({ itinerary }) {
  const [activeDay, setActiveDay] = useState(1);

  // ── Use API data if available, otherwise show empty state ─────────────────
  const hasData = itinerary && itinerary.daily_plan && itinerary.daily_plan.length > 0;

  // ── Map daily_plan to day tabs ────────────────────────────────────────────
  const days = hasData
    ? itinerary.daily_plan.map((day) => ({
        day:    day.day,
        amount: Math.round((day.total_lkr || 0) / 300),
      }))
    : [
        { day: 1, amount: 190 },
        { day: 2, amount: 71 },
        { day: 3, amount: 21 },
        { day: 4, amount: 26 },
        { day: 5, amount: 36 },
      ];

  // ── Get current day data ──────────────────────────────────────────────────
  const currentDayData = hasData
    ? itinerary.daily_plan.find((d) => d.day === activeDay)
    : null;

  // ── Map activities for current day ────────────────────────────────────────
  const activities = currentDayData?.activities
    ? currentDayData.activities.map((a) => ({
        time:     a.time || '—',
        title:    a.name,
        location: a.location || currentDayData.location || 'Sri Lanka',
        duration: '1h',
        price:    formatCost(a.estimated_cost),
        note:     a.notes || '',
        icon:     getActivityIcon(a.type),
      }))
    : [
        // Fallback hardcoded activities when no API data yet
        { time: "08:00 AM", title: "Breakfast at Cinnamon Grand", location: "Colombo 03", duration: "1h", price: "$25", note: "Try the Sri Lankan breakfast buffet", icon: <Utensils className="w-4 h-4 text-orange-500" /> },
        { time: "10:00 AM", title: "Gangaramaya Temple", location: "Slave Island, Colombo", duration: "2h", price: "$5", note: "Remove shoes before entering", icon: <Camera className="w-4 h-4 text-purple-500" /> },
        { time: "01:00 PM", title: "Lunch at Ministry of Crab", location: "Old Dutch Hospital", duration: "1.5h", price: "$40", note: "Book in advance!", icon: <Utensils className="w-4 h-4 text-orange-500" /> },
        { time: "03:30 PM", title: "Galle Face Green Walk", location: "Galle Face, Colombo", duration: "1.5h", price: "Free", note: "Great sunset views", icon: <Sun className="w-4 h-4 text-yellow-500" /> },
        { time: "07:00 PM", title: "Check-in Cinnamon Red Hotel", location: "Colombo 02", duration: "30m", price: "$120", note: "Confirmation #CR2024", icon: <Hotel className="w-4 h-4 text-green-500" /> },
      ];

  // ── Current day total ─────────────────────────────────────────────────────
  const dayTotal = currentDayData
    ? formatDayTotal(currentDayData.total_lkr)
    : '$190';

  // ── Current day location ──────────────────────────────────────────────────
  const dayLocation = currentDayData?.location || 'Colombo';

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="font-bold text-xl">Daily Itinerary Planner</h2>
          <p className="text-sm text-gray-500 mt-1">
            Drag activities to reorder your schedule
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-sm">
          <CalendarDays size={16} />
          <span>Day Total: <b>{dayTotal}</b></span>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex flex-wrap gap-3 mb-12">
        {days.map((item) => (
          <button
            key={item.day}
            onClick={() => setActiveDay(item.day)}
            className={`px-5 py-3 rounded-xl transition-all ${
              activeDay === item.day
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-gray-600"
            }`}
          >
            <div className="text-sm font-medium">Day {item.day}</div>
            <div className="text-xs opacity-70">${item.amount}</div>
          </button>
        ))}
        <button className="bg-slate-100 rounded-xl px-6 py-3 text-gray-500">
          +Add date
        </button>
      </div>

      {/* Day heading */}
      <div className="flex justify-between mb-8">
        <h3 className="font-semibold text-lg">
          Day {activeDay} – {dayLocation}
        </h3>
        <span className="text-gray-400 text-sm">
          {activities.length} activities
        </span>
      </div>

      {/* Activity List */}
      <div className="space-y-8">
        {activities.map((activity, index) => (
          <div key={index} className="flex justify-between items-start">
            <div className="flex gap-5">
              <GripVertical className="text-gray-300 mt-3" size={18} />
              <div className="bg-slate-100 text-blue-700 text-xs px-3 py-2 rounded-md font-medium h-fit">
                {activity.time}
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                {activity.icon}
              </div>
              <div>
                <h4 className="font-semibold">{activity.title}</h4>
                <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                  <MapPin size={13} />
                  {activity.location}
                </div>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock3 size={14} />
                    {activity.duration}
                  </span>
                  <span className="text-blue-600">{activity.price}</span>
                  <span className="text-yellow-400">★★★★★</span>
                </div>
                {activity.note && (
                  <div className="text-xs text-gray-400 mt-2">
                    💡 {activity.note}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="p-2 rounded-lg bg-blue-50">
                <Pencil size={16} className="text-blue-600" />
              </button>
              <button className="p-2 rounded-lg bg-red-50">
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add activity */}
      <button className="w-full mt-10 border border-dashed border-slate-300 rounded-2xl py-5 flex justify-center items-center gap-2 text-blue-600 font-medium hover:bg-slate-50">
        <Plus size={18} />
        Add Activity
      </button>
    </div>
  );
}