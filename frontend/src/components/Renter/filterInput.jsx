export const FilterInput = ({ label, placeholder }) => (
  <div className="flex-1 space-y-1.5">
    <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">{label}</label>
    <div className="relative">
      <input 
        type="text" 
        placeholder={placeholder} 
        className="w-full bg-slate-100/80 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  </div>
);