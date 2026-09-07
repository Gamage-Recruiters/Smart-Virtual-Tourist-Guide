import React, { useState, useEffect } from 'react';
import { fetchBudgetAllocation, fetchLatestExpenses } from '../services/financialSummery';

const FinancialSummary = ({ touristId }) => {
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const loadBudget = async () => {
            const result = await fetchBudgetAllocation(touristId);
            setBudgetData(result.success ? result.data : null);
            setLoading(false);
        };

        const loadExpenses = async () => {
            if (!touristId) return;
            const res = await fetchLatestExpenses(touristId);
            if (res.success && res.data) {

                const formattedData = res.data.map(item => ({
                    date: item.date || "Mar 15",
                    cat: item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : "Activity",
                    desc: item.name || "N/A",
                    provider: item.location || "Local Provider",
                    amountLkr: item.actual_cost > 0 ? item.actual_cost : item.estimated_cost
                }));
                setTransactions(formattedData);
            }
            setLoading(false);
        };

        if (touristId) {
            loadExpenses();
            loadBudget();
        }

    }, [touristId]);

    const data = budgetData || {
        totalBudgetLKR: 0,
        tripTotalLKR: 0,
        remainingLKR: 0,
        dailyAllocation: {},
        totalAllocation: {},
        weightsUsed: {},
        meta: { usd_to_lkr: 1, budget_usd: 0 }
    };

    const usdRate = data.meta?.usd_to_lkr || 1;
    const totalBudgetUsd = data.meta?.budget_usd || (data.totalBudgetLKR / usdRate);
    const remainingUsd = (data.remainingLKR || 0) / usdRate;

    const diffPercentage = totalBudgetUsd > 0 ? Math.round(Math.abs(remainingUsd / totalBudgetUsd) * 100) : 0;
    const isUnder = remainingUsd >= 0;

    const categories = [
        { label: "Accommodation", key: "accommodation", icon: "🏠" },
        { label: "Transportation", key: "transport", icon: "🚗" },
        { label: "Food & Dining", key: "food", icon: "🍽️" },
        { label: "Activities & Tours", key: "activities", icon: "🎟️" },
        { label: "Shopping", key: "shopping", icon: "🛍️" },
        { label: "Miscellaneous", key: "misc", icon: "..." }
    ].map(cat => ({
        ...cat,
        spent: (data.totalAllocation?.[cat.key] || 0) / usdRate,
        pct: (data.weightsUsed?.[cat.key] || 0) * 100
    }));

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <section className="w-full bg-white pt-6 px-6 pb-0 sm:pt-10 sm:px-10 md:pt-16 md:px-16 lg:pt-20 lg:px-20 mb-0 !mt-0 border-t-0 border-b-0">
            <p className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Financial Summary</p>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-8">
                <span className="text-3xl sm:text-4xl md:text-[44px] font-black text-gray-900 leading-none">
                    ${totalBudgetUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`text-xs sm:text-sm font-bold ${isUnder ? 'text-[#2ECC71]' : 'text-red-500'}`}>
                    {isUnder ? `↑ ${diffPercentage}% Under budget` : `↓ ${diffPercentage}% Over budget`}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12">
                {categories.map((c, idx) => (
                    <div key={idx} className="bg-gradient-to-b from-[#EBF6FF] to-[#BFE4FC] rounded-[24px] p-6 flex flex-col gap-3 shadow-sm border border-[#A2D5FF]/20">
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-white/40 rounded-lg">{c.icon}</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#1C2C3F]/80 uppercase tracking-wide">{c.label}</span>
                        </div>
                        <p className="text-2xl sm:text-[26px] font-black text-[#1C2C3F]">${c.spent.toFixed(2)}</p>
                        <div className="w-full bg-[#A8D3F5] rounded-full h-[7px]">
                            <div className="h-[7px] bg-[#2ECC71] rounded-full" style={{ width: `${c.pct}%` }} />
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#527EA6] font-medium">{c.transactions} transactions</p>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-b from-[#E6F4FF] to-[#BFE4FC] rounded-[28px] p-6 sm:p-8 shadow-sm border border-[#A2D5FF]/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm text-[#1C2C3F] min-w-[650px]">
                        <thead>
                            <tr className="text-[#3A5674] text-xs uppercase font-extrabold border-b border-[#A8D3F5]/30">
                                <th className="px-4 py-4 text-left">Date</th>
                                <th className="px-4 py-4 text-left">Category</th>
                                <th className="px-4 py-4 text-left">Description</th>
                                <th className="px-4 py-4 text-left">Provider</th>
                                <th className="px-4 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#A8D3F5]/20">
                            {transactions.length > 0 ? transactions.map((t, i) => (
                                <tr key={i} className="hover:bg-white/10 transition-colors">
                                    <td className="px-4 py-3.5 text-[#527EA6] font-medium">{t.date}</td>
                                    <td className="px-4 py-3.5 font-bold">{t.cat}</td>
                                    <td className="px-4 py-3.5 text-[#3A5674] font-medium">{t.desc}</td>
                                    <td className="px-4 py-3.5 text-[#527EA6] font-medium">{t.provider}</td>
                                    <td className="px-4 py-3.5 text-right font-black">${((t.amountLkr || 0) / usdRate).toFixed(2)}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="text-center py-4 text-[#527EA6] font-medium">No transactions found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default FinancialSummary;