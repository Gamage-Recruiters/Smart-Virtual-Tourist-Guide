import { Calendar } from "lucide-react";

function TripInformation({ formData, handleChange, togglePreference }) {
     const preferencesList = [
    "Adventure",
    "Cultural",
    "Relaxation",
    "Food & Dining",
    "Nature",
    "Nightlife",
    "Shopping",
    "Photography",
    "Historical",
    "Beach",
  ];
  
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-sm xl:text-base font-bold text-slate-700 whitespace-nowrap">
          02. Trip Information
        </h2>
        <div className="h-px bg-slate-200 w-full"></div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm p-8 rounded-4xl space-y-8 shadow-sm border border-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative">
            <input
              type="text"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              placeholder="Start Date"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              className="w-full bg-white border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
            />
            <Calendar
              size={16}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              placeholder="End Date"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              className="w-full bg-white border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
            />
            <Calendar
              size={16}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Budget Slider */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-800">
            Budget Range (Rs.)
          </label>
          <div className="pt-2">
            <span className="text-sm font-bold text-blue-600 block mb-3">
              Rs. {Number(formData.budget || 50000).toLocaleString()}
            </span>
            <input
              type="range"
              name="budget"
              min="5000"
              max="500000"
              step="5000"
              value={formData.budget || 50000}
              onChange={handleChange}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2">
              <span>Rs. 5,000</span>
              <span>Rs. 500,000</span>
            </div>
          </div>
        </div>

        {/* Travel Preferences */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-800">
            Travel Preferences
          </label>
          <div className="flex flex-wrap gap-3 pt-3">
            {preferencesList.map((pref) => (
              <button
                type="button"
                key={pref}
                onClick={() => togglePreference(pref)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  formData.preferences.includes(pref)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TripInformation;
