import React from "react";
import { RotateCcw } from "lucide-react";

export default function DriverFilter({ filters, onFilterChange, onReset }) {
  const handleInputChange = (field, value) => {
    onFilterChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Filter Drivers
        </h2>
        {onReset && (
          <button 
            onClick={onReset}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            title="Reset all filters"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      {/* Trip Date */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Trip Date
        </label>
        <input
          type="date"
          value={filters?.tripDate || ""}
          onChange={(e) => handleInputChange("tripDate", e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
        />
      </div>

      {/* Duration */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Duration (Days)
        </label>
        <input
          type="number"
          min="1"
          placeholder="Enter days"
          value={filters?.duration || ""}
          onChange={(e) => handleInputChange("duration", e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
        />
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-slate-700">
            Max Price (per day)
          </label>
          <span className="text-sm font-bold text-blue-600">${filters?.maxPrice || 300}</span>
        </div>

        <input 
          type="range" 
          min="20" 
          max="300" 
          step="5"
          value={filters?.maxPrice || 300}
          onChange={(e) => handleInputChange("maxPrice", Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />

        <div className="flex justify-between text-xs text-gray-500 mt-1 font-medium">
          <span>$20</span>
          <span>$300</span>
        </div>
      </div>

      {/* Vehicle */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Vehicle Type
        </label>
        <select 
          value={filters?.vehicleType || "All Vehicles"}
          onChange={(e) => handleInputChange("vehicleType", e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm bg-white cursor-pointer"
        >
          <option value="All Vehicles">All Vehicles</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan / Car</option>
          <option value="Van">Van / Hiace</option>
          <option value="Toyota">Toyota</option>
          <option value="Honda">Honda</option>
          <option value="Nissan">Nissan</option>
          <option value="Mercedes">Mercedes</option>
        </select>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Minimum Rating
        </label>

        <div className="space-y-2.5">
          {[
            { label: "All Ratings", val: 0 },
            { label: "4.5 & above", val: 4.5 },
            { label: "4.0 & above", val: 4.0 },
            { label: "3.5 & above", val: 3.5 },
          ].map((item) => (
            <label
              key={item.val}
              className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              <input 
                type="radio" 
                name="rating" 
                checked={(filters?.minRating || 0) === item.val}
                onChange={() => handleInputChange("minRating", item.val)}
                className="w-4 h-4 text-blue-600 accent-blue-600 cursor-pointer"
              />
              {item.val > 0 && <span className="text-amber-400">★</span>}
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      {onReset && (
        <button 
          onClick={onReset}
          className="w-full bg-slate-100 hover:bg-slate-200 transition text-slate-700 py-2.5 rounded-xl font-semibold text-sm cursor-pointer"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}