import React from 'react';

const FinancialSummaryPDF = () => {
 
  const categories = [
    { name: "Accommodation", amount: "$ 1250.00" },
    { name: "Transportation", amount: "$ 380.00" },
    { name: "Food & Dining", amount: "$ 420.00" },
    { name: "Activities", amount: "$ 560.00" },
    { name: "Miscellaneous", amount: "$ 190.00" }
  ];

  return (

    <section className="bg-white w-full max-w-[794px] mx-auto p-10 md:p-14 border-x border-gray-100 rounded-none break-after-page">
      
      {/* ────────────────────────────────────────────────────────
            1. TOP HEADER (Final Trip Report | Page 3 of 6)
         ──────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-10">
        <span>Final Trip Report</span>
        <span>Page 3 of 6</span>
      </div>

      {/* ────────────────────────────────────────────────────────
            2. FINANCIAL SUMMARY HEADER BAR
         ──────────────────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl px-6 py-4 mb-10 shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-[#A2D5FF]/10">
        <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-[#111111] leading-none">
          Financial Summary
        </h2>
      </div>

      {/* ────────────────────────────────────────────────────────
            3. CATEGORIES & AMOUNTS LIST
         ──────────────────────────────────────────────────────── */}
      <div className="px-2">
        {/* Table Headers */}
        <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
          <span>Category</span>
          <span>Amount</span>
        </div>

        {/* List Items */}
        <div className="space-y-4">
          {categories.map((c, i) => (
            <div key={i} className="flex justify-between items-center text-xs sm:text-sm text-gray-700 font-semibold">
              <span>{c.name}</span>
              <span className="font-bold text-gray-800">{c.amount}</span>
            </div>
          ))}
        </div>

        {/* Subtle Horizontal Divider Line */}
        <div className="w-full h-[1.5px] bg-gray-200/60 my-6" />
      </div>

      {/* ────────────────────────────────────────────────────────
            4. SUBTOTAL & TOTAL SPENT BARS
         ──────────────────────────────────────────────────────── */}
      <div className="space-y-3 mb-8">
        {/* Subtotal */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <span className="text-xs sm:text-sm font-bold text-gray-800">Subtotal</span>
          <span className="text-xs sm:text-sm font-black text-gray-900">$2800.00</span>
        </div>

        {/* Total Spent */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <span className="text-xs sm:text-sm font-bold text-gray-800">Total Spent</span>
          <span className="text-xs sm:text-sm font-black text-gray-900">$2800.00</span>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
            5. BUDGET USAGE SECTION (Thick Dark Progress Bar)
         ──────────────────────────────────────────────────────── */}
      <div className="px-2">
        {/* Budget Labels */}
        <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-gray-500 mb-2">
          <span>Budget Usage</span>
          <span>93.3%</span>
        </div>

        {/* Thick Dark Slate Progress Bar */}
        <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden shadow-inner mb-3">
          <div 
            className="h-full bg-[#1E50FF] rounded-full transition-all duration-700" 
            style={{ width: '93.3%' }} 
          />
        </div>

        {/* Planned Budget & Under Budget Labels */}
        <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
          <span className="text-gray-400">Planned Budget: $3000.00</span>
          <span className="text-[#0084FF]">Under Budget</span>
        </div>
      </div>

    </section>
  );
};

export default FinancialSummaryPDF;