import React from 'react';
import { Send } from 'lucide-react';
import Header from '../Header';
import bImage from '../../assets/B.png';
import Footer from '../Footer';
import { IoCaretBackOutline } from "react-icons/io5";

export default function Submit_Bids() {
  const otherBids = [
    { id: 1, name: "Kamal" },
    { id: 2, name: "Nimal" },
    { id: 3, name: "Sunil" }
  ];

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      
      {/* 1. Background Section */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bImage}
          alt="Sri Lanka View"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-[#E5F3FD]/60 to-[#E5F3FD] backdrop-blur-[3px]"></div>
      </div>

      {/* 2. Main Content */}
      <div className="relative z-10 flex flex-col flex-1">
        
        {/* Header Component */}
        <div className="w-full">
          <Header />
        </div>

        {/* Center Bidding Card */}
        <div className="flex-1 flex items-center justify-center w-full px-4 py-10 mt-80">
          <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-12">
            
            {/* Submit Bid Section */}
            <div className="mb-10">
              <div className="flex items-center space-x-2 mb-4 text-slate-700">
                <Send size={18} className="rotate-12" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Submit bids</h3>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-400 transition-all text-lg font-semibold"
                />
                <button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-10 py-4 rounded-2xl flex items-center justify-center space-x-3 transition-all shadow-lg shadow-blue-200">
                  <Send size={20} />
                  <span className="font-bold">Submit</span>
                </button>
              </div>
            </div>

            {/* Other Driver Bids Section */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-6 text-slate-700">
                <h3 className="font-bold text-sm uppercase tracking-wider">Other driver bids</h3>
              </div>

              <div className="space-y-4">
                {otherBids.map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between gap-4">
                    <span className="text-slate-600 font-bold text-sm min-w-[100px]">{bid.name} :</span>
                    <input 
                      type="text" 
                      disabled
                      placeholder="0.00"
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-slate-400 font-medium cursor-not-allowed"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-10 flex justify-center">
              <button className="w-full max-w-md bg-[#4F46E5] hover:bg-[#2563EB] py-3 text-white rounded-2xl flex items-center justify-center space-x-4 transition-all group shadow-xl">
                  <IoCaretBackOutline size={20} />
                <span className="font-bold tracking-widest uppercase">Back</span>
              </button>
            </div>

          </div>
        </div>

        {/* Footer Component */}
        <div className="w-full mt-auto">
          <Footer />
        </div>

      </div>
    </div>
  );
}