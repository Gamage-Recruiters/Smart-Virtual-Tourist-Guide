import React from 'react';
import { Globe, Bell } from 'lucide-react';

export default function Bheader() {
  return (
    <header className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between border-b border-gray-100">
      
      {/* Left Side: Logo & Brand Name */}
      <div className="flex items-center space-x-4">
        {/* Logo Image */}
        <div className="w-16 h-16 flex-shrink-0">
          <img 
            src="/path-to-your-logo.png" 
            alt="Sri Lanka Tourism Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Brand Text */}
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
            Smart Virtual Tourism Guide
          </span>
          <h1 className="text-3xl font-extrabold tracking-widest mt-0.5 select-none">
            <span className="text-[#1E4D2B]">S</span>
            <span className="text-[#1E4D2B]">r</span>
            <span className="text-[#1E4D2B]">i</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 ml-2">L</span>
            <span className="text-orange-500">a</span>
            <span className="text-amber-500">n</span>
            <span className="text-purple-900">k</span>
            <span className="text-red-700">a</span>
          </h1>
        </div>
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search destinations, bookings, or activities..."
            className="w-full bg-slate-50 border border-slate-100 text-sm text-slate-600 placeholder-slate-400 rounded-lg px-4 py-2.5 outline-none focus:bg-white focus:border-slate-200 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Side: Navigation & Profile */}
      <div className="flex items-center space-x-6">
        
        {/* Language Selector */}
        <button className="flex items-center space-x-1.5 text-slate-700 hover:text-slate-900 font-medium transition-colors">
          <Globe className="w-5 h-5 text-slate-800" strokeWidth={1.5} />
          <span className="text-sm uppercase tracking-wider">en</span>
        </button>

        {/* Notifications */}
        <button className="relative p-1 text-slate-700 hover:text-slate-900 transition-colors">
          <Bell className="w-5 h-5 text-slate-800" strokeWidth={1.5} />
          {/* Red Notification Dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 bg-[#2E5A88] text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-inner">
            D
          </div>
          <span className="text-sm font-semibold text-slate-800 tracking-wide">
            Dasuni
          </span>
        </div>

      </div>
    </header>
  );
}