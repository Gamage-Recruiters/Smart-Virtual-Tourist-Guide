import QuickAction from "./quickAction";
import {
  Hotel,
  Utensils,
  Package,
  Car,
  Map,
  SquareActivity,
} from "lucide-react";

function QuickActions() {
  return (
    <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h4 className="font-bold text-lg px-2 text-slate-700">Quick Actions</h4>
      <div className="grid grid-cols-2 gap-3">
        {/* Relative paths → nested inside /dashboard-Tourist/ */}
        <QuickAction icon={<Car size={20} />}           label="Book Driver"  location="book-driver"  />
        <QuickAction icon={<Map size={20} />}           label="Book Guide"                           />
        <QuickAction icon={<Car size={20} />}           label="Rent Vehicle" location="rent-vehicle" />
        <QuickAction icon={<Hotel size={20} />}         label="Find Hotel"   location="find-hotel"   />
        <QuickAction icon={<Utensils size={20} />}      label="Food"         location="restaurants"  />

        <QuickAction icon={<Package size={20} />}       label="Packages"                             />
        <QuickAction icon={<SquareActivity size={20} />} label="Activities"                          />
      </div>
    </div>
  );
}

export default QuickActions;

