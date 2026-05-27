import React from 'react';
import { 
  FaStar, FaSearch, FaPlus, FaCogs, FaUsers, FaGasPump 
} from 'react-icons/fa';
import tuk from '../../assets/vehiclecard/tuk.png';

const vehiclesData = [
  {
    name: 'Honda Dio',
    type: 'scooter',
    seats: '2 Seats',
    price: '2,500',
    badge: 'SUV',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'TVS NTORQ 125',
    type: 'scooter',
    seats: '2 Seats',
    price: '2,700',
    badge: 'SUV',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Bajaj Tuk Tuk',
    type: 'Manual',
    seats: '3 Seats',
    price: '3,800',
    badge: '4 stroke',
    image: 'https://images.unsplash.com/photo-1566008889980-343be3855b7c?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Honda Vezel',
    type: 'Automatic',
    seats: '5 Seats',
    price: '12,500',
    badge: 'SUV',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Mitsubishi Montero',
    type: 'Automatic',
    seats: '7 Seats',
    price: '25,000',
    badge: 'Luxury SUV',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Toyota Dolphin',
    type: 'Automatic',
    seats: '12 Seats',
    price: '30,000',
    badge: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1516576426665-2bc8d9bf1841?auto=format&fit=crop&q=80&w=400'
  }
];

const Vehicles_Card = () => {
  return (
    <div className="min-h-screen bg-[#EBF1FF] font-sans text-gray-800 p-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6"> 
        
        {/* SIDEBAR */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Budget Guardian Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2 text-[#1E40AF] font-bold text-xs uppercase tracking-wider mb-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944a11.954 11.954 0 007.834 3.056 11.95 11.95 0 01-1.6 5.944 11.95 11.95 0 01-6.234 4.944 11.954 11.954 0 01-6.234-4.944 11.95 11.95 0 01-1.6-5.944zm8.92 4.71a1 1 0 10-1.414-1.414L8 9.586 7.328 8.914a1 1 0 00-1.414 1.414l1.383 1.383a1 1 0 001.414 0l2.374-2.374z" clipRule="evenodd" />
              </svg>
              <span>Budget Guardian</span>
            </div>
            <span className="text-gray-400 text-[10px] block font-bold tracking-wider">AVAILABLE FUNDS</span>
            <div className="flex items-baseline space-x-1 mb-4">
              <span className="text-2xl font-black text-gray-900">145,000</span>
              <span className="text-xs font-bold text-gray-700">LKR</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-500">Trip Progress</span>
                <span className="text-[#1E40AF]">65% Used</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#1E40AF] h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <button className="w-full border-2 border-[#1E40AF] text-[#1E40AF] font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider hover:bg-blue-50 transition-colors">
              Manage Budget
            </button>
          </div>

          {/* Filters Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
              <button className="text-xs font-bold text-blue-600 hover:underline">Reset</button>
            </div>
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Price Range (LKR)</label>
              <div className="h-1 bg-gray-200 rounded-lg relative mb-2 mt-4">
                <div className="absolute h-1 bg-blue-600 rounded-lg left-0 right-0"></div>
                <div className="absolute w-4 h-4 bg-white border-2 border-blue-600 rounded-full -top-1.5 left-0"></div>
                <div className="absolute w-4 h-4 bg-white border-2 border-blue-600 rounded-full -top-1.5 right-0"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-bold">
                <span>5k</span>
                <span>50k+</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Rating</label>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-medium text-gray-600 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 w-4 h-4" />
                    <span className="text-yellow-400 text-sm">★★★★★</span>
                  </div>
                  <span className="text-gray-400">(128)</span>
                </label>
                <label className="flex items-center justify-between text-xs font-medium text-gray-600 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-blue-600 w-4 h-4" />
                    <span className="text-yellow-400 text-sm">★★★★☆</span>
                  </div>
                  <span className="text-gray-400">(84)</span>
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-3 space-y-6">  
          
          {/* Vehicles Hero Banner */}
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl p-6 md:p-8 relative overflow-hidden text-white flex flex-col md:flex-row md:items-center justify-between min-h-[14rem] shadow-sm">
            <div className="max-w-xs sm:max-w-md z-10 pr-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">
                Find Your Ideal Vehicles in Lanka
              </h2>
              <p className="text-blue-100 text-xs leading-relaxed mb-4 md:mb-6 font-normal opacity-90">
                Explore the best car rentals across the island from trusted providers.
              </p>
              <button className="bg-white text-blue-700 font-bold text-xs px-5 py-3 rounded-xl flex items-center space-x-2 shadow-md uppercase tracking-wider hover:bg-blue-50 transition-colors w-fit">
                <span>Search All Vehicles</span>
              </button>
            </div>

            {/* Banner Right Image */}
            <div className="absolute right-15 bottom-0 top-0 w-1/3 md:w-1/2 z-0 flex justify-end items-end">
              <img 
                src={tuk}
                alt="Rental Vehicles Lanka" 
                className="object-contain max-w-full max-h-full opacity-95 pointer-events-none"
              />
            </div>
          </div>

          {/* Vehicle Category Tabs */}
          <div className="flex space-x-2 text-xs font-bold">
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-sm">All</button>
            <button className="bg-white text-gray-500 border border-gray-100 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Luxury Sedan</button>
            <button className="bg-white text-gray-500 border border-gray-100 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Budget</button>
          </div>

          {/* Vehicles Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {vehiclesData.map((vehicle, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                
                {/* Vehicle Image section */}
                <div className="relative h-48 bg-gray-50">
                  <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                  
                  {/* Badge top right (e.g. SUV, Hybrid) */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-gray-800 shadow-xs uppercase">
                    {vehicle.badge}
                  </div>
                </div>

                {/* Vehicle Details Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 text-base mb-2">{vehicle.name}</h4>
                    
                    {/* Specs Row (Type & Seats) */}
                    <div className="flex items-center space-x-4 text-xs text-gray-400 font-medium mb-4">
                      <div className="flex items-center space-x-1">
                        <FaCogs className="text-gray-400" />
                        <span className="capitalize">{vehicle.type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaUsers className="text-gray-400" />
                        <span>{vehicle.seats}</span>
                      </div>
                    </div>

                    {/* Price & Rent Button Row */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider">PER DAY</span>
                        <div className="flex items-baseline space-x-0.5">
                          <span className="text-base font-black text-blue-600">{vehicle.price}</span>
                          <span className="text-xs font-bold text-blue-600"> LKR</span>
                        </div>
                      </div>
                      <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors shadow-xs">
                        Rent Vehicle
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="flex justify-center items-center space-x-2 pt-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-40" disabled>&lt;</button>
            <button className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded-lg bg-white text-gray-500 hover:bg-gray-100 font-bold text-xs flex items-center justify-center border border-gray-200">2</button>
            <button className="w-8 h-8 rounded-lg bg-white text-gray-500 hover:bg-gray-100 font-bold text-xs flex items-center justify-center border border-gray-200">3</button>
            <button className="p-2 text-gray-400 hover:text-gray-600">&gt;</button>
          </div>
          
        </div> 

      </div> 
    </div>
  );
};

export default Vehicles_Card;