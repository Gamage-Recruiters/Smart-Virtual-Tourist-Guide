
import React from "react";
import Header from "./Header";
import Decore from "../assets/Decore.png";

export default function Main_Layout() {
  return (
    <div className="relative w-full bg-white overflow-x-hidden">
      
      {/* Background Design */}
      <div className="absolute top-0 right-0 w-full md:w-3/5 lg:w-3/7 pointer-events-none select-none z-0">
        <img 
          src={Decore}
          alt="Design Element"
          className="w-full h-auto object-contain object-right-top"
        />
      </div>

      {/* Main Content */}
        <main className="mt-35 mx-10 border-gray-200 px-6 py-3 flex items-center justify-between">
          {/* Left - Title & Subtitle */}
          <div>
            <h1 className="text-4xl font-extrabold uppercase tracking-wide text-gray-900">
              Booking Marketplace
            </h1>
            <p className="text-lg text-gray-500 mt-0.5">
              Find and book the best verified travel services in Sri Lanka.
            </p>
          </div>

          {/* Right - Search + Button */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 min-w-[200px]">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search services..."
                className="text-sm text-gray-400 outline-none bg-transparent w-full"
              />
            </div>

            {/* Post Custom Request Button */}
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-md px-4 py-2 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                <path strokeLinecap="round" strokeWidth={2} d="M12 8v8M8 12h8" />
              </svg>
              Post Custom Request
            </button>
          </div>
        </main>
    </div>
  );
}