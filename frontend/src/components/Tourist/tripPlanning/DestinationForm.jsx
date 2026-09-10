import React, { useState, useEffect } from "react";
import { Sparkles, CalendarDays } from "lucide-react";

const ALL_PREFERENCES = [
  "Cultural",
  "Nature",
  "Adventure",
  "Food",
  "Beach",
  "History",
  "Wildlife",
  "Relaxation",
];

export default function DestinationForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetLKR, setBudgetLKR] = useState("");
  const [selected, setSelected] = useState([]);

  // Load initial data from localStorage (saved during profile creation)
  useEffect(() => {
    const tripInfo = JSON.parse(localStorage.getItem("tripInfo") || "{}");
    if (tripInfo.startDate) setStartDate(tripInfo.startDate);
    if (tripInfo.endDate) setEndDate(tripInfo.endDate);
    if (tripInfo.budgetLKR) setBudgetLKR(tripInfo.budgetLKR);
    if (tripInfo.preferences) setSelected(tripInfo.preferences);
  }, []);

  // Update localStorage and notify other components
  const updateLocalStorage = (key, value) => {
    const tripInfo = JSON.parse(localStorage.getItem("tripInfo") || "{}");
    tripInfo[key] = value;
    localStorage.setItem("tripInfo", JSON.stringify(tripInfo));
    // Dispatch event so BudgetOverview / BudgetPanel can react
    window.dispatchEvent(new CustomEvent("tripInfoUpdated", { detail: tripInfo }));
  };

  const handleStartDateChange = (e) => {
    const val = e.target.value;
    setStartDate(val);
    updateLocalStorage("startDate", val);
  };

  const handleEndDateChange = (e) => {
    const val = e.target.value;
    setEndDate(val);
    updateLocalStorage("endDate", val);
  };

  const handleBudgetChange = (e) => {
    const val = e.target.value;
    setBudgetLKR(val);
    updateLocalStorage("budgetLKR", val);
  };

  const togglePreference = (item) => {
    setSelected((prev) => {
      const newSelected = prev.includes(item)
        ? prev.filter((p) => p !== item)
        : [...prev, item];
      updateLocalStorage("preferences", newSelected);
      return newSelected;
    });
  };


  return (
    <div className="w-full max-w-7xl rounded-3xl bg-white p-8 shadow-md">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center">
          <Sparkles className="text-blue-600 w-6 h-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold">Destination Details</h2>
          <p className="text-gray-500 mt-1">
            Review or update the details you provided during registration
          </p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Destination */}
        <div>
          <label className="text-gray-500 text-sm mb-2 block">
            Destination
          </label>
          <input
            type="text"
            value="Sri Lanka"
            disabled
            className="w-full rounded-xl bg-slate-100 px-5 py-4 text-1xl outline-none text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="text-gray-500 text-sm mb-2 block">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full rounded-xl bg-slate-100 px-5 py-4 text-xl outline-none"
            />
            <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="text-gray-500 text-sm mb-2 block">End Date</label>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="w-full rounded-xl bg-slate-100 px-5 py-4 text-xl outline-none"
            />
            <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="text-gray-500 text-sm mb-2 block">
            Budget (LKR)
          </label>
          <input
            type="number"
            value={budgetLKR}
            onChange={handleBudgetChange}
            className="w-full rounded-xl bg-slate-100 px-5 py-4 text-2xl outline-none"
          />
        </div>
      </div>

      {/* Travel Preferences */}
      <div className="mt-8">
        <label className="text-gray-500 text-sm block mb-4">
          Travel Preferences
        </label>
        <div className="flex flex-wrap gap-4">
          {ALL_PREFERENCES.map((item) => (
            <button
              key={item}
              onClick={() => togglePreference(item)}
              className={`
                px-6 py-2 rounded-full transition-all duration-300
                ${
                  selected.includes(item)
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 bg-slate-100 hover:bg-slate-200"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}