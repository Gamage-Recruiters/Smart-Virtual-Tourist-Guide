import 'react';
import { Bell, Plus, Search, Filter, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import AddVehicleModal from './addVehicle/addVehicleModal';

// --- MOCK DATA ---
const fleetData = [
  {
    id: 1,
    name: 'Toyota Land Cruiser', // Note: The mockup image shows a scooter, but text says Land Cruiser!
    plate: 'ABC-1234',
    status: 'Available',
    trips: '42 completed',
    location: 'Colombo',
    img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=400&auto=format&fit=crop' // Scooter placeholder
  },
  {
    id: 2,
    name: 'Bajaj Tuk Tuk',
    plate: 'ABC-1234',
    status: 'Rented',
    trips: '15 completed',
    location: 'On Trip',
    img: 'https://images.unsplash.com/photo-1627998687799-7333a3621da2?q=80&w=400&auto=format&fit=crop' // Tuk Tuk placeholder
  },
  {
    id: 3,
    name: 'Toyota Dolphin',
    plate: 'ABC-1234',
    status: 'Available',
    trips: '10 completed',
    location: 'Colombo',
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop' // Van placeholder
  },
  {
    id: 4,
    name: 'Honda Vezel',
    plate: 'ABC-1234',
    status: 'Available',
    trips: '35 completed',
    location: 'Colombo',
    img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400&auto=format&fit=crop' // SUV placeholder
  },
  {
    id: 5,
    name: 'Mitsubishi Montero',
    plate: 'ABC-1234',
    status: 'Available',
    trips: '23 completed',
    location: 'Colombo',
    img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400&auto=format&fit=crop' // SUV placeholder
  },
  {
    id: 6,
    name: 'Toyota Land Cruiser',
    plate: 'ABC-1234',
    status: 'Available',
    trips: '42 completed',
    location: 'Colombo',
    img: 'https://images.unsplash.com/photo-1503376760367-13eea7dfc914?q=80&w=400&auto=format&fit=crop' // SUV placeholder
  },
];

function MyFleetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Helper to style the status badges dynamically
  const getStatusBadge = (status) => {
    if (status === 'Available') {
      return (
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Available
        </span>
      );
    }
    return (
      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        Rented
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      
      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Fleet</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage and track your {fleetData.length} vehicle assets</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} strokeWidth={3} />
            ADD NEW VEHICLE
          </button>
        </div>
        <AddVehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </header>

      {/* 2. Toolbar (Search & Filters) */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by plate, model or status..." 
            className="w-full bg-white text-sm py-3 pl-11 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 text-slate-700 shadow-sm border border-slate-100/50"
          />
        </div>

        {/* Filter & Sort Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-700 text-sm font-bold">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-700 text-sm font-bold">
            <ArrowUpDown size={16} />
            Sort
          </button>
        </div>
      </div>

      {/* 3. Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-10">
        {fleetData.map((car) => (
          <div key={car.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100/50 flex flex-col hover:shadow-md transition-shadow duration-300">
            
            {/* Image & Status Badge */}
            <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden bg-slate-100">
              <img 
                src={car.img} 
                alt={car.name} 
                className="w-full h-full object-cover"
              />
              {getStatusBadge(car.status)}
            </div>

            {/* Vehicle Info */}
            <div className="px-2">
              <h3 className="text-lg font-extrabold text-slate-900 leading-tight">{car.name}</h3>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 mb-5">
                {car.plate}
              </p>

              {/* Stats Box */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Trips</p>
                  <p className="text-sm font-bold text-slate-800">{car.trips}</p>
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-sm font-bold text-slate-800">{car.location}</p>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-[#2563EB] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 text-sm">
                Edit Info
              </button>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
}

export default MyFleetPage;