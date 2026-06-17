import React, { useState } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function ViewRoomReservation() {
  // Mock reservation dataset
  const [reservations] = useState([
    { name: "Daniel Nightingale", guests: "2 adults, 1 child (3)", checkIn: "March 20, 2026", checkOut: "March 21, 2026", room: "Family Room with Bathroom", bookedDate: "March 19, 2026", status: "Ok", price: "US$38.88", bookingNo: "5420687772" },
    { name: "Jennie Beer", guests: "2 adults", checkIn: "March 20, 2026", checkOut: "March 21, 2026", room: "Deluxe Double Room", bookedDate: "March 18, 2026", status: "Ok", price: "US$31.58", bookingNo: "5697454643" },
    { name: "Olivia Robin", guests: "2 adults", checkIn: "March 20, 2026", checkOut: "March 21, 2026", room: "Family Suite", bookedDate: "February 19, 2026", status: "Canceled", price: "US$56.88", bookingNo: "5897924681" },
    { name: "Kathrin Ranegger", guests: "2 adults, 1 child (3)", checkIn: "March 20, 2026", checkOut: "March 21, 2026", room: "Villa with Garden View", bookedDate: "March 19, 2026", status: "Ok", price: "US$238.88", bookingNo: "5420687799" },
    { name: "Erin Stark", guests: "1 adult", checkIn: "March 20, 2026", checkOut: "March 21, 2026", room: "Family Room with Bathroom", bookedDate: "March  9, 2026", status: "Ok", price: "US$25.88", bookingNo: "3420817752" },
    { name: "Turcotte Alexandre", guests: "2 adults, 1 child (3)", checkIn: "March 20, 2026", checkOut: "March 21, 2026", room: "Superior Villa", bookedDate: "March  2, 2026", status: "Ok", price: "US$128.88", bookingNo: "5430687173" },
    { name: "Léo Paran", guests: "2 adults, 1 child (3)", checkIn: "March 20, 2026", checkOut: "March 21, 2026", room: "Family Room with Bathroom", bookedDate: "March  1, 2026", status: "Canceled", price: "US$38.88", bookingNo: "5420687772" },
    { name: "Benjamin Aubert", guests: "2 adults", checkIn: "March 20, 2026", checkOut: "March 21, 2026", room: "Deluxe Double Room", bookedDate: "March 16, 2026", status: "Ok", price: "US$38.88", bookingNo: "5420687772" },
    { name: "Nethil Domis", guests: "2 adults, 1 child (3)", checkIn: "March 20, 2026", checkOut: "March 21, 2026", room: "Family Room with Bathroom", bookedDate: "March 12, 2026", status: "Canceled", price: "US$38.88", bookingNo: "5420687772" }
  ]);

  return (
    <div className="w-full bg-[#EBF7FF] min-h-screen text-slate-700">
      <Header />
      {/* 1. SCENIC TROPICAL HERO BANNER SECTION */}
      <section 
        className="relative h-120 w-full flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600')` 
        }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          View Room Reservation
        </h1>
        <p className="text-base md:text-lg text-slate-800 font-medium mb-8">
          View Room Reservation and Manage Booking Dates Easily.
        </p>
        
        <div className="relative w-full max-w-md shadow-lg rounded-full">
          <input 
            type="text" 
            placeholder="Explore Reservation" 
            className="w-full px-6 py-3.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none pr-12"
          />
          <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
        </div>
      </section>

      {/* Page Layout Title Label */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Room's Reservation</h2>
      </div>

      {/* 2. MAIN RESERVATION PANEL WRAPPER */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.03)] p-6 md:p-8 border border-slate-100">
          
          {/* Top Dates Filter Form Controls Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Date Of</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none">
                <option>Check In</option>
                <option>Check Out</option>
                <option>Booked Date</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">From</label>
              <div className="relative">
                <input type="text" defaultValue="March 20, 2026" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-600 focus:outline-none pr-8 bg-slate-50/50" />
                <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Until</label>
              <div className="relative">
                <input type="text" defaultValue="March 21, 2026" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-600 focus:outline-none pr-8 bg-slate-50/50" />
                <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
              </div>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-xs transition-colors h-9 shadow-sm">
              Show
            </button>
          </div>

          {/* Configuration Legend Filters Area */}
          <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Reservation Statuses */}
            <div>
              <p className="text-xs font-extrabold text-slate-800 tracking-wide mb-3 flex items-center gap-1.5">
                <FaFilter className="text-blue-500 scale-75" /> Reservation Statues
              </p>
              <div className="space-y-2 text-xs font-medium text-slate-600">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5" /> Ok
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5" /> Canceled
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5" /> No-Show
                </label>
              </div>
            </div>

            {/* Column 2: Guest Communications */}
            <div>
              <p className="text-xs font-extrabold text-slate-800 tracking-wide mb-3">Guest Communication</p>
              <div className="space-y-2 text-xs font-medium text-slate-600">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5" /> Pending Guest Request
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5" /> Invoice Required
                </label>
              </div>
            </div>

            {/* Column 3: Custom Search Input */}
            <div>
              <p className="text-xs font-extrabold text-slate-800 tracking-wide mb-2.5">Guest Name or Booking Number</p>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none shadow-sm placeholder-slate-300"
                placeholder="Ex: Daniel Nightingale"
              />
            </div>
          </div>

          {/* 3. DYNAMIC CONTENT RESERVATION DATA TABLE */}
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs min-w-250">
              <thead>
                <tr className="border-b border-slate-200 text-slate-900 font-bold">
                  <th className="py-3 px-4 font-black">Guest Name</th>
                  <th className="py-3 px-4 font-black">Check In</th>
                  <th className="py-3 px-4 font-black">Check Out</th>
                  <th className="py-3 px-4 font-black">Rooms</th>
                  <th className="py-3 px-4 font-black">Booked Date</th>
                  <th className="py-3 px-4 font-black">Status</th>
                  <th className="py-3 px-4 font-black">Price</th>
                  <th className="py-3 px-4 font-black">Booking NO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {reservations.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="text-blue-600 font-bold cursor-pointer hover:underline">{item.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.guests}</p>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-500">{item.checkIn}</td>
                    <td className="py-4 px-4 font-medium text-slate-500">{item.checkOut}</td>
                    <td className="py-4 px-4 font-medium text-slate-700">{item.room}</td>
                    <td className="py-4 px-4 font-medium text-slate-500">{item.bookedDate}</td>
                    <td className="py-4 px-4">
                      <span className={`font-extrabold ${item.status === 'Ok' ? 'text-green-600' : 'text-rose-500'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-700">{item.price}</td>
                    <td className="py-4 px-4">
                      <span className="text-blue-500 font-medium cursor-pointer hover:underline">
                        {item.bookingNo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Footer Table Pagination Bar */}
          <div className="flex items-center justify-start gap-6 border-t border-slate-100 mt-6 pt-6 text-[11px] font-bold text-slate-400">
            <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
              <FaChevronLeft className="text-[9px]" /> Back
            </button>
            <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">Page 1</span>
            <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
              Next <FaChevronRight className="text-[9px]" />
            </button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}