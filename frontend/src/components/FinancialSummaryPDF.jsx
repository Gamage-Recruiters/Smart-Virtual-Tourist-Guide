import React, { useState, useEffect } from 'react';
import { fetchBudgetAllocation } from '../services/financialSummery';

const FinancialSummaryPDF = ({ touristId }) => {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBudget = async () => {
      const result = await fetchBudgetAllocation(touristId);
      setBudgetData(result.success ? result.data : null);
      setLoading(false);
    };
    if (touristId) loadBudget();
  }, [touristId]);

  const data = budgetData || {
    totalBudgetLKR: 0,
    tripTotalLKR: 0,
    remainingLKR: 0,
    totalAllocation: {},
    meta: { usd_to_lkr: 1, budget_usd: 0 }
  };

  const usdRate = data.meta?.usd_to_lkr || 1;
  const plannedBudgetUsd = data.meta?.budget_usd || (data.totalBudgetLKR / usdRate);

  // Categories amounts from totalAllocation
  const categories = [
    { name: "Accommodation", amount: ((data.totalAllocation?.accommodation || 0) / usdRate) },
    { name: "Transportation", amount: ((data.totalAllocation?.transport || 0) / usdRate) },
    { name: "Food & Dining", amount: ((data.totalAllocation?.food || 0) / usdRate) },
    { name: "Activities", amount: ((data.totalAllocation?.activities || 0) / usdRate) },
    { name: "Miscellaneous", amount: ((data.totalAllocation?.misc || 0) / usdRate) }
  ];

  // Total spent calculation
  const totalSpentUsd = categories.reduce((acc, curr) => acc + curr.amount, 0);

  // Budget usage percentage
  const usagePercentage = plannedBudgetUsd > 0 ? Math.min(Math.round((totalSpentUsd / plannedBudgetUsd) * 100 * 10) / 10, 100) : 0;

  // Under / Over budget status
  const remainingUsd = plannedBudgetUsd - totalSpentUsd;
  const isUnder = remainingUsd >= 0;

  if (loading) return <div className="p-10 text-center">Loading...</div>;

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
              <span className="font-bold text-gray-800">${c.amount.toFixed(2)}</span>
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
          <span className="text-xs sm:text-sm font-black text-gray-900">${totalSpentUsd.toFixed(2)}</span>
        </div>

        {/* Total Spent */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <span className="text-xs sm:text-sm font-bold text-gray-800">Total Spent</span>
          <span className="text-xs sm:text-sm font-black text-gray-900">${totalSpentUsd.toFixed(2)}</span>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
            5. BUDGET USAGE SECTION (Thick Dark Progress Bar)
         ──────────────────────────────────────────────────────── */}
      <div className="px-2">
        {/* Budget Labels */}
        <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-gray-500 mb-2">
          <span>Budget Usage</span>
          <span>{usagePercentage}%</span>
        </div>

        {/* Thick Dark Slate Progress Bar */}
        <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden shadow-inner mb-3">
          <div
            className="h-full bg-[#1E50FF] rounded-full transition-all duration-700"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>

        {/* Planned Budget & Under/Over Budget Labels */}
        <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
          <span className="text-gray-400">Planned Budget: ${plannedBudgetUsd.toFixed(2)}</span>
          <span className={isUnder ? "text-[#0084FF]" : "text-red-500"}>
            {isUnder ? "Under Budget" : "Over Budget"}
          </span>
        </div>
      </div>

    </section>
  );
};

export default FinancialSummaryPDF;