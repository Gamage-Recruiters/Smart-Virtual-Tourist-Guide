import { Info, Minus, Plus, SlidersVertical, List } from 'lucide-react';

function TechSpecsStep({ formData, setFormData }) {
  // Handlers for standard inputs (like the dropdown)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handlers for custom toggle buttons
  const handleToggle = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handlers for increment/decrement counters
  const handleIncrement = (field) => {
    setFormData({ ...formData, [field]: formData[field] + 1 });
  };

  const handleDecrement = (field) => {
    setFormData({ ...formData, [field]: Math.max(1, formData[field] - 1) }); // Prevents going below 1
  };
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-extrabold text-slate-900">Step 2: Technical Specifications</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* Transmission System */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">
            Transmission System
          </label>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleToggle('transmission', 'Automatic')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                formData.transmission === 'Automatic'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <SlidersVertical size={16} />
              Automatic
            </button>
            <button
              type="button"
              onClick={() => handleToggle('transmission', 'Manual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                formData.transmission === 'Manual'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List size={16} />
              Manual
            </button>
          </div>
        </div>

        {/* Seating Capacity */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">
            Seating Capacity
          </label>
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => handleDecrement('passengers')}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-blue-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Minus size={18} strokeWidth={3} />
            </button>
            
            <div className="flex flex-col items-center justify-center">
              <span className="text-lg font-extrabold text-slate-900 leading-none">
                {formData.passengers || 5}
              </span>
              <span className="text-[9px] font-bold text-slate-400">
                Passengers
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleIncrement('passengers')}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-blue-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Fuel Type Dropdown */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">
            Fuel Type
          </label>
          <div className="relative">
            <select
              name="fuelType"
              value={formData.fuelType || 'Hybrid'}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
            {/* Custom Dropdown Arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Luggage Capacity */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">
            Luggage Capacity
          </label>
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => handleDecrement('luggage')}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-blue-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Minus size={18} strokeWidth={3} />
            </button>
            
            <div className="flex flex-col items-center justify-center">
              <span className="text-lg font-extrabold text-slate-900 leading-none">
                {formData.luggage || 3}
              </span>
              <span className="text-[9px] font-bold text-slate-400">
                Large Cases
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleIncrement('luggage')}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-blue-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
        </div>

      </div>

      {/* Info Warning Box */}
      <div className="bg-slate-50 rounded-xl p-4 flex gap-3 border border-slate-100 mt-4">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Ensure these specs match the manufacturer's technical manual. Inconsistencies may lead to vehicle registration delays or insurance coverage issues.
        </p>
      </div>
    </div>
  )
}

export default TechSpecsStep