import React from 'react';

const RateExperiencePDF = () => {
  return (

    <section className="bg-white w-full max-w-[794px] mx-auto p-10 md:p-14 border-x border-b border-gray-100 rounded-t-none rounded-b-[32px] sm:rounded-b-[48px] shadow-none">
      
      {/* ────────────────────────────────────────────────────────
            1. TOP HEADER (Final Trip Report | Page 6 of 6)
         ──────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-10">
        <span>Final Trip Report</span>
        <span>Page 6 of 6</span>
      </div>

      {/* ────────────────────────────────────────────────────────
            2. TRIP HIGHLIGHTS & PERSONAL NOTES HEADER BAR
         ──────────────────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl px-6 py-4 mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-[#A2D5FF]/10">
        <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-[#111111] leading-none">
          Trip Highlights & Personal Notes
        </h2>
      </div>

      {/* ────────────────────────────────────────────────────────
            3. HIGHLIGHTS DESCRIPTION PARAGRAPHS
         ──────────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-8 px-2 text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed text-justify">
        <p>
          Your journey through Sri Lanka was an incredible experience filled with cultural discoveries, natural wonders, and memorable moments. From the bustling streets of Colombo to the ancient temples of Kandy and the breathtaking views from Sigiriya Rock, every destination offered unique insights into the rich heritage of this beautiful island nation.
        </p>
        <p>
          The combination of historical sites, natural beauty, and warm hospitality created an unforgettable travel experience. The elephant safari at Minneriya National Park was a highlight, providing close encounters with wildlife in their natural habitat. The cultural performances and temple visits offered deep insights into Sri Lankan traditions and spirituality.
        </p>
      </div>

      {/* ────────────────────────────────────────────────────────
            4. PERSONAL NOTES CONTAINER (Soft Blue Gradient)
         ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF]/50 rounded-[20px] p-6 sm:p-8 border border-[#A2D5FF]/15 mb-10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <h4 className="font-extrabold text-gray-900 text-sm sm:text-base md:text-lg mb-3">
          Personal Notes
        </h4>
        <p className="text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed">
          The elephant safari at Minneriya was absolutely amazing! Would highly recommend arriving early morning for the best experience. The local guide Nimal was incredibly knowledgeable and made the historical sites come alive with fascinating stories. The food throughout the trip was exceptional, especially the traditional rice and curry at The Heritage Restaurant.
        </p>
      </div>

      {/* ────────────────────────────────────────────────────────
            5. RATE YOUR EXPERIENCE SUB-SECTION (5 Gold Stars)
         ──────────────────────────────────────────────────────── */}
      <div className="px-2 mb-12">
        <h4 className="font-extrabold text-gray-900 text-sm sm:text-base md:text-lg mb-3">
          Rate Your Experience
        </h4>
        
        {/* 5 Gold Stars */}
        <div className="flex text-amber-400 text-lg sm:text-xl leading-none gap-0.5 mb-2 select-none">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
        
        {/* Rating text */}
        <p className="text-xs sm:text-sm text-gray-500 font-bold">
          5.0 out of 5 stars - Excellent trip experience
        </p>
      </div>

      {/* ────────────────────────────────────────────────────────
            6. DOCUMENT CLOSING FOOTER (Report Generated Info)
         ──────────────────────────────────────────────────────── */}
      <div className="text-[10px] sm:text-xs text-gray-400 font-bold leading-relaxed pt-6 border-t border-gray-100 mt-14 flex flex-col gap-0.5 px-2 select-none">
        <p>Report generated on March 18, 2024</p>
        <p>Powered by Smart Virtual Tourist Guide</p>
      </div>

    </section>
  );
};

export default RateExperiencePDF;





