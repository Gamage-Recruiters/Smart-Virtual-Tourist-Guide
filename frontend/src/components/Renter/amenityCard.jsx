import { 
 CheckCircle2 
} from 'lucide-react';

// Amenity Card Item
export const AmenityCard = ({ icon: Icon, label }) => (
  <div className="bg-slate-50/80 p-4 rounded-xl flex items-center gap-4 border border-slate-100">
    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shadow-sm">
      <Icon size={20} />
    </div>
    <span className="font-semibold text-slate-700 text-sm">{label}</span>
  </div>
);

// Insurance Policy Item
export const InsurancePolicyItem = ({ title, description }) => (
  <div className="flex gap-3">
    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
    <div>
      <h5 className="font-bold text-slate-800 text-sm">{title}</h5>
      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
    </div>
  </div>
);