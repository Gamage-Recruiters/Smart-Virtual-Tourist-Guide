import {Fuel, Settings, Users, Calendar,} from 'lucide-react';
export const VehicleOverview = ({transmission, seats, fuelType, year}) => {
  const specs = [
    { icon: Fuel, label: "Fuel Type", value: fuelType },
    { icon: Settings, label: "Transmission", value: transmission },
    { icon: Users, label: "Seating", value: seats + " People" },
    { icon: Calendar, label: "Year", value: year },
  ];

  return (
    <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
      <h3 className="text-xl font-extrabold text-slate-900 mb-6">Vehicle Overview</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {specs.map((spec, i) => {
          const Icon = spec.icon;
          return (
            <div key={i} className="bg-slate-50/80 p-4 rounded-2xl flex flex-col items-center text-center justify-center border border-slate-100">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-3 shadow-sm">
                <Icon size={20} />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{spec.label}</span>
              <span className="text-sm font-extrabold text-slate-800 mt-1">{spec.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};