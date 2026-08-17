import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import { FaChevronDown, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

export default function Driver_Earnings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F8FF] font-sans flex flex-col relative overflow-hidden">
      <Header />

      {/* Hero Section (Half height) */}
      <div className="relative w-full h-[400px] mt-[80px]">
        <img 
          src="https://images.unsplash.com/photo-1588096344392-4114d59a7213?auto=format&fit=crop&q=80&w=2000" 
          alt="Ambuluwawa Tower" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full py-16 px-4 flex-1 flex justify-center -mt-[100px] z-10">
        
        {/* Background Decorative Tracks and Cars */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
           {/* Left Track & Car */}
           <svg className="absolute left-10 top-40 w-64 h-64 opacity-50" viewBox="0 0 200 200">
             <path d="M 0,100 Q 50,50 100,100 T 200,150" fill="transparent" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" />
           </svg>
           <div className="absolute left-[15%] top-[280px] transform -rotate-45">
             <div className="w-8 h-4 bg-yellow-400 rounded-sm shadow-md border border-yellow-500 relative">
                <div className="absolute inset-x-1 top-0.5 bottom-0.5 bg-black/80 rounded-sm"></div>
             </div>
           </div>

           {/* Right Track & Car */}
           <svg className="absolute right-10 top-20 w-64 h-64 opacity-50" viewBox="0 0 200 200">
             <path d="M 200,50 Q 150,150 100,100 T 0,150" fill="transparent" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" />
           </svg>
           <div className="absolute right-[20%] top-[220px] transform rotate-45">
             <div className="w-8 h-4 bg-yellow-400 rounded-sm shadow-md border border-yellow-500 relative">
                <div className="absolute inset-x-1 top-0.5 bottom-0.5 bg-black/80 rounded-sm"></div>
             </div>
           </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-white w-full max-w-xl rounded-[30px] shadow-2xl p-8 relative z-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Earnings</h2>

          {/* Blue Block */}
          <div className="bg-[#3478F6] rounded-2xl p-6 text-white mb-6 flex items-center justify-between shadow-lg shadow-blue-200">
            <div>
              <p className="text-sm font-medium mb-1 opacity-90">My Earnings</p>
              <h3 className="text-3xl font-extrabold tracking-wide">5,725.55 LKR</h3>
            </div>
            <button 
              className="bg-white text-slate-800 px-6 py-2.5 rounded-full font-bold text-sm shadow flex items-center gap-2 hover:bg-slate-50 transition-colors"
              onClick={() => toast.success("Transfer initiated")}
            >
              ↗ Transfer
            </button>
          </div>

          {/* Date Filter */}
          <div className="mb-6">
            <button className="bg-[#3478F6] text-white px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-md hover:bg-blue-600 transition-colors">
              27 Feb <FaChevronDown />
            </button>
          </div>

          {/* Summary Stats */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span className="flex items-center gap-2"><span className="text-blue-500 text-[10px]">↘</span> Net Earnings :</span>
              <span>LKR 5725.55</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span className="flex items-center gap-2"><span className="text-blue-500 text-[10px]">↘</span> Total Trips :</span>
              <span>20</span>
            </div>
          </div>

          {/* All Filter */}
          <div className="mb-6">
            <button className="bg-[#3478F6] text-white px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-md hover:bg-blue-600 transition-colors">
              All <FaChevronDown />
            </button>
          </div>

          {/* Trips List */}
          <div className="space-y-4 mb-8">
            <div className="bg-[#F8FBFF] border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <HiOutlineLocationMarker className="text-slate-400" />
                <span className="text-xs text-slate-500">Target complete - ID: 2548312</span>
              </div>
              <span className="text-xs font-medium text-slate-500">LKR405.54</span>
            </div>
            <div className="bg-[#F8FBFF] border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <HiOutlineLocationMarker className="text-slate-400" />
                <span className="text-xs text-slate-500">Target complete - ID: 7895024</span>
              </div>
              <span className="text-xs font-medium text-slate-500">LKR285.74</span>
            </div>
            <div className="bg-[#F8FBFF] border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <HiOutlineLocationMarker className="text-slate-400" />
                <span className="text-xs text-slate-500">Target complete - ID: 1567535</span>
              </div>
              <span className="text-xs font-medium text-slate-500">LKR156.12</span>
            </div>
          </div>

          {/* Back Button */}
          <button 
            className="w-full bg-[#3478F6] hover:bg-blue-600 text-white rounded-full py-3.5 font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
            onClick={() => navigate('/driver-dashboard')}
          >
            Back
            <FaArrowRight className="text-xs" />
          </button>

        </div>
      </div>

      <Footer />
    </div>
  );
}
