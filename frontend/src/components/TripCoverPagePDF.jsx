import React from 'react';

const TripCoverPagePDF = () => {

  const summaryItems = [
    "Explored the cultural heritage of Colombo and Kandy",
    "Climbed the historic Sigiriya Rock Fortress",
    "Witnessed incredible wildlife at Minneriya National Park",
    "Stayed under budget with comprehensive travel planning",
    "Experienced traditional Sri Lankan cuisine and hospitality"
  ];

  return (

    <section className="bg-white w-full max-w-[794px] mx-auto p-10 md:p-14 border-x border-gray-100 rounded-none break-after-page">
      
      {/* ────────────────────────────────────────────────────────
            1. TOP HEADER (Final Trip Report | Page 1 of 6)
         ──────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-16">
        <span>Final Trip Report</span>
        <span>Page 1 of 6</span>
      </div>

      {/* ────────────────────────────────────────────────────────
            2. CENTERED COVER TITLE & PIN
         ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center mb-16">
        {/* Minimalist Outline Map Pin SVG */}
        <div className="mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.2" 
            stroke="currentColor" 
            className="w-16 h-16 text-gray-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Final Trip Report
        </h1>
        {/* Date Range */}
        <p className="text-sm sm:text-base font-semibold text-gray-400 mt-2">
          March 15 - March 17, 2025
        </p>
      </div>

      {/* ────────────────────────────────────────────────────────
            3. TRIP AT A GLANCE (Horizontal Gradient Bars)
         ──────────────────────────────────────────────────────── */}
      <div className="mb-14">
        <h3 className="text-base sm:text-lg font-extrabold text-[#111111] mb-5">
          Trip at a Glance
        </h3>
        
        <div className="space-y-3">
          {/* Bar 1: Duration */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <span className="text-xs sm:text-sm font-semibold text-gray-500">Duration</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#1C2C3F]">3 Days / 2 Nights</span>
          </div>

          {/* Bar 2: Cities Visited */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <span className="text-xs sm:text-sm font-semibold text-gray-500">Cities Visited</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#1C2C3F]">4 Cities</span>
          </div>

          {/* Bar 3: Activities Completed */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <span className="text-xs sm:text-sm font-semibold text-gray-500">Activities Completed</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#1C2C3F]">12 Activities</span>
          </div>

          {/* Bar 4: Total Spent (Bolder as highlighted in screenshot) */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <span className="text-xs sm:text-sm font-bold text-gray-800">Total Spent</span>
            <span className="text-xs sm:text-sm font-black text-gray-900">$2,800.00</span>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
            4. TRIP SUMMARY (Checkmark List)
         ──────────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-base sm:text-lg font-extrabold text-[#111111] mb-5">
          Trip Summary
        </h3>
        <ul className="space-y-3.5">
          {summaryItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
              <span className="flex-shrink-0 mt-0.5">✅</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
};

export default TripCoverPagePDF;