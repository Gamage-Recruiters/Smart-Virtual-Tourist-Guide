import React from 'react';
import { 
  FaSearch, FaEye, FaBan, FaTools, FaCheckCircle, 
  FaChevronLeft, FaChevronRight, FaCalendarAlt 
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ManageRoomAvailability() {
  const roomStatusMap = [
    1, 1, 1, 3, 3,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    2, 3, 1, 3, 2,
    2, 2, 2, 2, 3
  ];

  return (
    <div className="w-full bg-white min-h-screen">
      <Header />
      {/* 1. HERO BANNER SECTION */}
      <section 
        className="relative h-120 w-full flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)), url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600')` 
        }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Manage Room Availability
        </h1>
        <p className="text-base md:text-lg text-slate-800 font-medium mb-8">
          Update Room Availability and Manage Booking Dates Easily.
        </p>
        
        <div className="relative w-full max-w-md shadow-lg rounded-full">
          <input 
            type="text" 
            placeholder="Explore Availability" 
            className="w-full px-6 py-3.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none pr-12"
          />
          <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
        </div>
      </section>

      {/* Title Subheader */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-12">
        <h2 className="text-2xl font-bold text-slate-900">Manage Room Availability</h2>
      </div>

      {/* 2. MAIN CONTEXT GRID BOARD */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-6 space-y-12">
        
        {/* UPPER PANEL: ROOM VISUALIZER */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          {/* Inner Search Box */}
          <div className="relative w-full max-w-xs mb-8">
            <input 
              type="text" 
              placeholder="Search Room Type" 
              className="w-full px-4 py-2 border border-slate-300 rounded-md text-xs text-slate-700 focus:outline-none pr-10"
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          </div>

          <h3 className="text-sm font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Room Section</h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Hand Indicator Tools (4 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-3">Deluxe Double Room</h4>
                
                {/* Status Badges List */}
                <div className="space-y-1.5 text-[10px] font-semibold">
                  <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 px-3 py-1 rounded">
                    <span className="flex items-center gap-1.5"><FaCheckCircle /> Total Rooms</span>
                    <span>25</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-50 text-green-700 px-3 py-1 rounded">
                    <span className="flex items-center gap-1.5"><FaEye /> Available Rooms</span>
                    <span>14</span>
                  </div>
                  <div className="flex justify-between items-center bg-rose-50 text-rose-700 px-3 py-1 rounded">
                    <span className="flex items-center gap-1.5"><FaBan /> Blocked Rooms</span>
                    <span>6</span>
                  </div>
                  <div className="flex justify-between items-center bg-blue-50 text-blue-700 px-3 py-1 rounded">
                    <span className="flex items-center gap-1.5"><FaTools /> Maintenance Rooms</span>
                    <span>5</span>
                  </div>
                </div>
              </div>

              {/* Room Capacity Drops */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg">
                <p className="text-[11px] font-bold text-slate-700 mb-2.5">Room Capacity</p>
                <div className="grid grid-cols-2 gap-3">
                  <select className="bg-white border border-slate-200 p-1.5 rounded text-xs text-slate-700 focus:outline-none">
                    <option>2 Adults</option>
                  </select>
                  <select className="bg-white border border-slate-200 p-1.5 rounded text-xs text-slate-700 focus:outline-none">
                    <option>1 Child</option>
                  </select>
                </div>
              </div>

              {/* Status Toggles Simulation */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-700">Room Availability Statuses</p>
                <div className="space-y-1.5 pl-0.5">
                  {[
                    { label: 'Available', state: true },
                    { label: 'Non Available', state: false },
                    { label: 'Maintenance', state: false }
                  ].map((toggle, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-medium text-slate-600">
                      <div className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${toggle.state ? 'bg-slate-800' : 'bg-slate-300'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${toggle.state ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                      <span>{toggle.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Hand Visual Grid Layout (8 Columns) */}
            <div className="lg:col-span-8 bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 mb-4">Deluxe Double Room Visual Availability</h4>
              
              <div className="grid grid-cols-5 gap-3 max-w-md">
                {roomStatusMap.map((status, index) => {
                  const roomNum = index + 1;
                  let bgClasses = "bg-green-100 text-green-700 border border-green-200"; // Available
                  if (status === 2) bgClasses = "bg-rose-100 text-rose-700 border border-rose-200"; // Blocked
                  if (status === 3) bgClasses = "bg-blue-100 text-blue-700 border border-blue-200"; // Maintenance

                  return (
                    <div 
                      key={index} 
                      className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold shadow-sm cursor-pointer hover:opacity-80 transition-opacity ${bgClasses}`}
                    >
                      R{roomNum}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* LOWER PANEL: DATES SCHEDULER BLOCKING (Split Side-by-Side Windows) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* WINDOW 1: BLOCK DATES */}
          <div className="bg-white border-2 border-blue-400 rounded-xl p-6 shadow-sm space-y-6">
            <div className="relative w-full">
              <input type="text" placeholder="Search Number of Deluxe Room for Block(Ex: R1)" className="w-full px-4 py-2 border border-slate-300 rounded-md text-xs text-slate-700 focus:outline-none" />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-4">R10 Room's Block Dates Marking</h4>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center justify-between border border-slate-200 p-2 rounded bg-slate-50">
                  <span>From: <span className="text-slate-500 font-medium ml-1">14 March 2026</span></span>
                  <FaCalendarAlt className="text-slate-400" />
                </div>
                <div className="flex items-center justify-between border border-slate-200 p-2 rounded bg-slate-50">
                  <span>To: <span className="text-slate-500 font-medium ml-1">21 March 2026</span></span>
                  <FaCalendarAlt className="text-slate-400" />
                </div>
              </div>
            </div>

            {/* Render Calendar Block 1 */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4">
              <div className="flex justify-between items-center mb-4 text-xs font-bold text-slate-800">
                <span>March 2026</span>
                <div className="flex gap-3 text-slate-400"><FaChevronLeft /><FaChevronRight /></div>
              </div>
              <div className="grid grid-cols-7 text-center text-[10px] gap-y-2">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d} className="font-bold text-slate-400">{d}</span>)}
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const isBlockedRange = day >= 14 && day <= 20;
                  return (
                    <div key={i} className={`py-1.5 rounded ${isBlockedRange ? 'bg-rose-200 text-rose-800 font-bold' : 'text-slate-600'}`}>
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4 pt-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded text-xs transition-colors shadow">Save</button>
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs transition-colors shadow">Edit</button>
            </div>
          </div>

          {/* WINDOW 2: MAINTENANCE DATES */}
          <div className="bg-white border-2 border-blue-400 rounded-xl p-6 shadow-sm space-y-6">
            <div className="relative w-full">
              <input type="text" placeholder="Search Number of Deluxe Room for Block(Ex: R1)" className="w-full px-4 py-2 border border-slate-300 rounded-md text-xs text-slate-700 focus:outline-none" />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-4">R25 Room's Maintainance Dates Marking</h4>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center justify-between border border-slate-200 p-2 rounded bg-slate-50">
                  <span>From: <span className="text-slate-500 font-medium ml-1">14 March 2026</span></span>
                  <FaCalendarAlt className="text-slate-400" />
                </div>
                <div className="flex items-center justify-between border border-slate-200 p-2 rounded bg-slate-50">
                  <span>To: <span className="text-slate-500 font-medium ml-1">21 March 2026</span></span>
                  <FaCalendarAlt className="text-slate-400" />
                </div>
              </div>
            </div>

            {/* Render Calendar Block 2 */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4">
              <div className="flex justify-between items-center mb-4 text-xs font-bold text-slate-800">
                <span>March 2026</span>
                <div className="flex gap-3 text-slate-400"><FaChevronLeft /><FaChevronRight /></div>
              </div>
              <div className="grid grid-cols-7 text-center text-[10px] gap-y-2">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d} className="font-bold text-slate-400">{d}</span>)}
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const isMaintenanceRange = day >= 12 && day <= 19;
                  return (
                    <div key={i} className={`py-1.5 rounded ${isMaintenanceRange ? 'bg-blue-200 text-blue-800 font-bold' : 'text-slate-600'}`}>
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4 pt-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded text-xs transition-colors shadow">Save</button>
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs transition-colors shadow">Edit</button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}