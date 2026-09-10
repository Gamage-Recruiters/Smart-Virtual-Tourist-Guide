import { ChevronDown } from "lucide-react";

export const BookingCard = ({ price }) => {
  return (
    <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 space-y-6">
      {/* Price Header */}
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-slate-900">${price}</span>
          <span className="text-slate-400 text-xs font-bold uppercase">/day</span>
        </div>
        <p className="text-xs font-semibold text-slate-400 mt-1">Self-drive rate</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Dropdown Select */}
        <div className="relative">
          <select className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-3 px-4 text-sm font-semibold text-slate-700 outline-none appearance-none focus:ring-2 focus:ring-blue-500">
            <option>Colombo - Airport</option>
            <option>Kandy Town</option>
            <option>Galle Fort</option>
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>

        {/* Pick-up Date */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">Pick-up Date</label>
          <input type="date" className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Return Date */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">Return Date</label>
          <input type="date" className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Pick-up Location Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">Pick-up Location</label>
          <input type="text" placeholder="Specific address note..." className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="space-y-3 pt-2 text-sm font-semibold text-slate-600 border-t border-slate-50">
        <div className="flex justify-between">
          <span>3 days rental</span>
          <span className="font-bold text-slate-900">$255</span>
        </div>
        <div className="flex justify-between">
          <span>Insurance</span>
          <span className="font-bold text-emerald-600">Included</span>
        </div>
        <div className="flex justify-between items-baseline pt-2 border-t border-slate-50">
          <span className="text-base font-extrabold text-slate-900">Total</span>
          <span className="text-2xl font-black text-blue-600">$255</span>
        </div>
      </div>

      {/* Primary CTA */}
      <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors">
        Rent Now
      </button>

      <p className="text-[11px] text-center font-medium text-slate-400">
        Free cancellation up to 24 hours before pick-up
      </p>
    </div>
  );
};