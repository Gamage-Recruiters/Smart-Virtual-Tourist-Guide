import { Bell, Plus, Banknote, Truck, Star, CreditCard } from 'lucide-react';
import AddVehicleModal from './addVehicle/addVehicleModal';
import { useState } from 'react';

// --- MOCK DATA ---
const statsData = [
  { title: 'TOTAL EARNINGS', value: '452,000', suffix: ' LKR', icon: Banknote, color: 'text-blue-600', bg: 'bg-blue-50', badge: '+12% ↑', badgeColor: 'text-green-500' },
  { title: 'ACTIVE RENTALS', value: '04', icon: Truck, color: 'text-cyan-600', bg: 'bg-cyan-50', badge: 'Live', badgeColor: 'text-slate-400' },
  { title: 'AVG. RATING', value: '4.9', suffix: ' / 5.0', icon: Star, color: 'text-orange-500', bg: 'bg-orange-50' },
  { title: 'AVAILABLE PAYOUT', value: '84,500', suffix: ' LKR', icon: CreditCard, color: 'text-red-500', bg: 'bg-red-50' },
];

const requestsData = [
  { id: 1, name: 'Marcus Berg', country: 'Germany 🇩🇪', type: 'SUV LUXURY', typeColor: 'text-blue-600 bg-blue-50', route: 'Colombo ➔ Ella', duration: '4 Days (Apr 12 - 16)' },
  { id: 2, name: 'Elena Petrova', country: 'Russia 🇷🇺', type: 'MINI VAN', typeColor: 'text-yellow-600 bg-yellow-50', route: 'Kandy ➔ Sigiriya', duration: '2 Days (Apr 14 - 15)' },
  { id: 3, name: 'Sarah Jenkins', country: 'UK 🇬🇧', type: 'SEDAN', typeColor: 'text-green-600 bg-green-50', route: 'Galle Coast', duration: '1 Day (Tomorrow)' },
];

const fleetData = [
  { id: 1, name: 'Toyota Dolphin', plate: 'WP CAD-5042', status: 'AVAILABLE', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop' },
  { id: 2, name: 'Honda Vezel', plate: 'WP CAD-5042', status: 'AVAILABLE', img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=200&auto=format&fit=crop' },
  { id: 3, name: 'M Montero', plate: 'WP CAD-5042', status: 'AVAILABLE', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=200&auto=format&fit=crop' },
];

function Dashboard() {
  const [isModdalOpen, setIsModdalOpen] = useState(false);
  return (
    <div className="flex flex-col gap-8">
      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">DASHBOARD</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Welcome back, Vehicles Rentals of SVTG</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors" onClick={() => setIsModdalOpen(true)}>
            <Plus size={18} strokeWidth={3} />
            ADD NEW VEHICLE
          </button>
        </div>
          <AddVehicleModal isOpen={isModdalOpen} onClose={() => setIsModdalOpen(false)} />
      </header>

      {/* 2. Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/50 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              {stat.badge && (
                <span className={`text-xs font-bold ${stat.badgeColor}`}>
                  {stat.badge}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-[10px] font-extrabold text-slate-400 tracking-widest mb-1">{stat.title}</h3>
              <p className="text-2xl font-extrabold text-slate-900">
                {stat.value}
                <span className="text-sm text-slate-400 font-bold">{stat.suffix}</span>
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Main Content (Requests & Fleet) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Latest Tourist Requests (Takes up 2 fractions of the grid) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-extrabold text-slate-900">LATEST TOURIST REQUESTS</h2>
            <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-4 font-bold">Tourist</th>
                  <th className="pb-4 font-bold">Vehicle Type</th>
                  <th className="pb-4 font-bold">Route / Duration</th>
                  <th className="pb-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {requestsData.map((req) => (
                  <tr key={req.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{req.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{req.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full ${req.typeColor}`}>
                        {req.type}
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-bold text-slate-900">{req.route}</p>
                      <p className="text-xs text-slate-500 font-medium">{req.duration}</p>
                    </td>
                    <td className="py-4 text-right">
                      <button className="bg-[#2563EB] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-100">
                        Submit Bid
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Fleet Status */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col h-full">
          <h2 className="text-lg font-extrabold text-slate-900 mb-6">FLEET STATUS</h2>
          
          <div className="flex flex-col gap-4 flex-1">
            {fleetData.map((car) => (
              <div key={car.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <img src={car.img} alt={car.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-slate-900 leading-none">{car.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{car.plate}</p>
                  <div>
                    <span className="inline-block text-[9px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {car.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 w-full py-3.5 rounded-2xl border-2 border-dashed border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors">
            Manage Fleet
          </button>
        </div>

      </section>
    </div>
  );
}

export default Dashboard;