import React, { useState } from 'react';
import { 
  FaSearch, FaChevronLeft, FaChevronRight, FaCalendarAlt, 
  FaBed, FaCheckCircle, FaBan, FaTools 
} from 'react-icons/fa';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function ViewRoomAvailabilityCalendar() {
  const [selectedRoomType, setSelectedRoomType] = useState('Deluxe Double Room');
  const [selectedMonth, setSelectedMonth] = useState('March 2026');

  // Simulated layout calendar statuses for individual days inside rooms matrix
  // 'g' = Available (Green), 'r' = Non-Available/Booked (Red), 'm' = Maintenance (Grey)
  const baseStatusPattern = [
    'g','g','g','g','g','g','g',
    'g','g','g','g','g','g','g',
    'r','r','r','r','g','g','g',
    'g','g','g','g','g','g','g',
    'm','m','m'
  ];

  return (
    <div className="w-full bg-[#EBF7FF] min-h-screen text-slate-800">
      <Header />
      {/* 1. HERO HEADER BANNER (Matches image_a60dfb.jpg) */}
      <section 
        className="relative h-120 w-full flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600')` 
        }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          View Room Availability
        </h1>
        <p className="text-base md:text-lg text-slate-800 font-medium mb-8">
          View Room Availability and Manage Booking Dates Easily.
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

      {/* Section Identifier label */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Calendar</h2>
      </div>

      {/* 2. UPPER INTERACTIVE MATRIX CONTROL CARD */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.04)] p-6 md:p-8 border border-slate-100">
          
          {/* Top Dropdowns Row Controls */}
          <div className="flex flex-wrap gap-4 mb-8">
            <select 
              value={selectedRoomType} 
              onChange={(e) => setSelectedRoomType(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 bg-white focus:outline-none min-w-50 shadow-sm cursor-pointer"
            >
              <option>Deluxe Double Room</option>
              <option>Standard Suite</option>
              <option>Presidential Villa</option>
            </select>

            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 bg-white focus:outline-none min-w-40 shadow-sm cursor-pointer"
            >
              <option>March 2026</option>
              <option>April 2026</option>
              <option>May 2026</option>
            </select>
          </div>

          {/* Section Blueprint Panel layout */}
          <div className="border border-slate-200 rounded-2xl p-6 bg-white">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-6 pb-2 border-b border-slate-100">Room Section</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column Indicators details */}
              <div className="lg:col-span-4 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2">{selectedRoomType}</h4>
                  <div className="inline-flex justify-between items-center bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded w-full max-w-45">
                    <span className="flex items-center gap-1">🔘 Total Rooms</span>
                    <span>25</span>
                  </div>
                </div>

                {/* Capacity Selectors Block view */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl max-w-xs">
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2.5">Room Capacity</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                    <div className="bg-white border rounded p-2 text-center shadow-sm">2 Adults</div>
                    <div className="bg-white border rounded p-2 text-center shadow-sm">1 Child</div>
                  </div>
                </div>

                {/* Legend Switches Configuration states */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-slate-700">Room Availability Statuses</p>
                  <div className="space-y-2.5 pl-0.5">
                    {[
                      { label: 'Available', dot: 'bg-emerald-500' },
                      { label: 'Non Available', dot: 'bg-rose-500' },
                      { label: 'Maintenance', dot: 'bg-slate-400' }
                    ].map((status, index) => (
                      <div key={index} className="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <div className="w-8 h-4.5 bg-slate-800 rounded-full p-0.5 flex items-center">
                          <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
                        </div>
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side Map Grid Viewboard */}
              <div className="lg:col-span-8 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 mb-4">{selectedRoomType} Visual Availability</h4>
                <div className="grid grid-cols-5 gap-3 max-w-md">
                  {[...Array(25)].map((_, i) => (
                    <div key={i} className="aspect-square flex items-center justify-center rounded-lg text-xs font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm">
                      R{i + 1}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* 3. GRID MATRIX MAP CALENDARS LIST (Matches image_a60db8.png) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.04)] p-6 md:p-8 border border-slate-100">
          
          {/* Universal Timeline Bound Row info */}
          <div className="flex flex-wrap gap-4 items-center text-xs font-bold text-slate-700 mb-8 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 border px-3 py-2 rounded-lg">
              <span className="text-slate-400 font-medium">From:</span>
              <span>1 March 2026</span>
              <FaCalendarAlt className="text-slate-400 ml-1" />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border px-3 py-2 rounded-lg">
              <span className="text-slate-400 font-medium">To:</span>
              <span>31 March 2026</span>
              <FaCalendarAlt className="text-slate-400 ml-1" />
            </div>
          </div>

          {/* 25 Repeater Rooms Dynamic Schedule Render */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[...Array(25)].map((_, roomIndex) => {
              const currentRoomNum = roomIndex + 1;
              return (
                <div key={roomIndex} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
                  <p className="text-[11px] font-black text-slate-800 mb-2 tracking-tight flex items-center gap-1.5 border-b border-slate-50 pb-1.5">
                    <FaBed className="text-slate-400" /> R{currentRoomNum} Room's Statues
                  </p>
                  
                  {/* Embedded Custom Calendar view block */}
                  <div className="rounded-lg p-1.5 bg-slate-50/60">
                    <div className="flex justify-between items-center text-[9px] font-black text-slate-700 mb-1.5 px-0.5">
                      <span>March 2026</span>
                      <div className="flex gap-1 text-slate-400 scale-75"><FaChevronLeft /><FaChevronRight /></div>
                    </div>

                    {/* Standard Weeks labels row */}
                    <div className="grid grid-cols-7 text-center text-[7px] font-bold text-slate-400 mb-1">
                      {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
                    </div>

                    {/* Matrix Day Values mapping block */}
                    <div className="grid grid-cols-7 text-center text-[8px] gap-0.5">
                      {[...Array(31)].map((_, dayIndex) => {
                        const numericDay = dayIndex + 1;
                        
                        // Mutate specific status indexes across different cards to resemble simulated occupancy matrix
                        const structuralStatus = baseStatusPattern[(dayIndex + roomIndex) % 31];
                        
                        let assignedCellStyles = "bg-green-100 text-green-700"; // Available state
                        
                        if (structuralStatus === 'r') {
                          assignedCellStyles = "bg-rose-100 text-rose-700 font-bold"; // Booked state
                        } else if (structuralStatus === 'm' || (numericDay >= 25 && currentRoomNum % 3 === 0)) {
                          assignedCellStyles = "bg-slate-200 text-slate-500 font-medium"; // Maintenance state
                        }

                        return (
                          <div key={dayIndex} className={`py-0.5 rounded-xs transition-colors ${assignedCellStyles}`}>
                            {numericDay}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
}