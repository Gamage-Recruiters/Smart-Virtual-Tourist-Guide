import QuickAction from "./quickAction";
import { useNavigate } from "react-router-dom";
import {
  Hotel,
  Utensils,
  Package,
  Car,
  Map,
  SquareActivity,
} from "lucide-react";

function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h4 className="font-bold text-lg px-2 text-slate-700">Quick Actions</h4>
      <div className="grid grid-cols-2 gap-3">
        <QuickAction icon={<Car size={20} />} label="Book Driver" location="/book-driver" />
        <QuickAction icon={<Map size={20} />} label="Book Guide" />
        <QuickAction icon={<Car size={20} />} label="Rent Vehicle" location="/rent-vehicle"/>
        <QuickAction icon={<Hotel size={20} />} label="Find Hotel" location="/find-hotel" />
        <QuickAction icon={<Utensils size={20} />} label="Food" location="/restaurants"/>
        <button
          className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-blue-50 transition-all group h-30"
          onClick={() => navigate('/packages/user')}
        >
          <div className="text-slate-500 group-hover:text-blue-600"><Package size={20} /></div>
          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-600">Packages</span>
        </button>
        <QuickAction icon={<SquareActivity size={20} />} label="Activities" />
      </div>
    </div>
  );
}

export default QuickActions;
