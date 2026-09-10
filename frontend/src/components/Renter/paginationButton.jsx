
export const PaginationButton = ({ label, icon, active = false }) => (
  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
    active ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
  }`}>
    {label || icon}
  </div>
);