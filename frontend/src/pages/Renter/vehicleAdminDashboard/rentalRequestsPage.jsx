import  { useState } from 'react';
import { Search, CarFront } from 'lucide-react';

// --- MOCK DATA ---
const requestsData = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    country: 'UK 🇬🇧',
    route: 'Colombo to Ella',
    duration: '3 Days Trip',
    vehicle: 'Premium SUV',
    status: 'NOT BIDDED',
    isExpired: false,
  },
  {
    id: 2,
    name: 'Marc Dubois',
    country: 'France 🇫🇷',
    route: 'Negombo to Sigiriya',
    duration: '2 Days Trip',
    vehicle: 'Mini Van',
    status: 'BID SENT',
    isExpired: false,
  },
  {
    id: 3,
    name: 'Elena Petrova',
    country: 'Germany 🇩🇪',
    route: 'Kandy to Mirissa',
    duration: '5 Days Trip',
    vehicle: 'Luxury SUV',
    status: 'WON',
    isExpired: false,
  },
  {
    id: 4,
    name: 'David Chen',
    country: 'Australia 🇦🇺',
    route: 'Galle to Jaffna',
    duration: '7 Days Trip',
    vehicle: 'Large Van',
    status: 'EXPIRED',
    isExpired: true,
  },
];

const filterTabs = ['All Requests', 'Pending', 'My Bids', 'Expired'];

function RentalRequestsPage() {
  const [activeTab, setActiveTab] = useState('All Requests');

  // Helper function to determine badge colors based on status
  const getStatusStyles = (status) => {
    switch (status) {
      case 'NOT BIDDED':
        return 'bg-slate-100 text-slate-600';
      case 'BID SENT':
        return 'bg-blue-50 text-blue-500';
      case 'WON':
        return 'bg-green-50 text-green-600';
      case 'EXPIRED':
        return 'bg-red-50 text-red-500';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* 1. Top Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mt-8 lg:mt-0">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Rental Requests
        </h1>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by route, vehicle, or name..." 
              className="w-full bg-slate-100 text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-3 pb-2">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
              activeTab === tab
                ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Requests List */}
      <div className="flex flex-col gap-4 pb-10">
        {requestsData.map((request) => (
          <div 
            key={request.id} 
            className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100/50 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            
            {/* Profile Section */}
            <div className="flex items-center gap-4 min-w-50">
              <div className="w-14 h-14 rounded-full bg-slate-300 shrink-0"></div>
              <div>
                <h3 className={`text-base font-extrabold ${request.isExpired ? 'text-slate-500' : 'text-slate-900'}`}>
                  {request.name}
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-0.5">{request.country}</p>
              </div>
            </div>

            {/* Middle Grid Info */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-4 items-center">
              
              {/* Route & Duration */}
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                  Route & Duration
                </p>
                <p className={`text-sm font-bold ${request.isExpired ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {request.route}
                </p>
                <p className={`text-xs mt-0.5 ${request.isExpired ? 'text-slate-400' : 'text-slate-500'}`}>
                  {request.duration}
                </p>
              </div>

              {/* Vehicle Preference */}
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                  Vehicle Preference
                </p>
                <div className="flex items-center gap-2">
                  <CarFront size={16} className={request.isExpired ? 'text-slate-400' : 'text-orange-500'} />
                  <p className={`text-sm font-bold ${request.isExpired ? 'text-slate-400' : 'text-slate-800'}`}>
                    {request.vehicle}
                  </p>
                </div>
              </div>

              {/* Bid Status */}
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                  Bid Status
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getStatusStyles(request.status)}`}>
                  {request.status}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="shrink-0 mt-4 md:mt-0">
              <button
                disabled={request.isExpired}
                className={`w-full md:w-auto px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                  request.isExpired
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                View Details
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default RentalRequestsPage;