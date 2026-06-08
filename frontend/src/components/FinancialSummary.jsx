
const FinancialSummary = () => {

    const transactions = [
        { date: "Mar 15", cat: "Accommodation", desc: "Cinnamon Grand Hotel (2 nights)", provider: "Cinnamon Hotels", amount: "$350.00" },
        { date: "Mar 15", cat: "Transportation", desc: "Airport Transfer", provider: "Quick Cabs", amount: "$25.00" },
        { date: "Mar 15", cat: "Food & Dining", desc: "Dinner at Ministry of Crab", provider: "Ministry of Crab", amount: "$85.00" },
        { date: "Mar 15", cat: "Transportation", desc: "Colombo to Kandy (Private Car)", provider: "Lanka Tours", amount: "$80.00" },
        { date: "Mar 15", cat: "Activities & Tours", desc: "Temple of the Tooth Entry", provider: "Cultural Sites", amount: "$15.00" }
    ];

    const categories = [
        {
            label: "Accommodation",
            spent: 980.00,
            transactions: 7,
            pct: 65,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-[#3582C4]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12" />
                </svg>
            )
        },
        {
            label: "Transportation",
            spent: 645.50,
            transactions: 12,
            pct: 85,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-[#3582C4]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L6 12Zm0 0h7.5" />
                </svg>
            )
        },
        {
            label: "Food & Dining",
            spent: 645.50,
            transactions: 18,
            pct: 95,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-[#3582C4]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.015 9.015 0 0 1 8.716 6.747M12 3a9.015 9.015 0 0 0-8.716 6.747M12 9h.008v.008H12V9Zm6 0h.008v.008H18V9ZM6 9h.008v.008H6V9Z" />
                </svg>
            )
        },
        {
            label: "Activities & Tours",
            spent: 480.00,
            transactions: 8,
            pct: 70,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-[#3582C4]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.61c-.38.19-.622.58-.622 1.006v11.162c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                </svg>
            )
        },
        {
            label: "Shopping",
            spent: 150.00,
            transactions: 6,
            pct: 40,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-[#3582C4]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            )
        },
        {
            label: "Miscellaneous",
            spent: 150.00,
            transactions: 3,
            pct: 25,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-[#3582C4]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
            )
        }
    ];


    return (
        <section className="w-full bg-white rounded-t-none rounded-b-none sm:rounded-b-none pt-6 px-6 pb-0 sm:pt-10 sm:px-10 md:pt-16 md:px-16 lg:pt-20 lg:px-20 mb-0 !mt-0 border-t-0 border-b-0">

            <p className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">
                Financial Summary
            </p>

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-8">
                <span className="text-3xl sm:text-4xl md:text-[44px] font-black text-gray-900 leading-none">
                    $2,847.50
                </span>
                <span className="text-[#2ECC71] text-xs sm:text-sm font-bold flex items-center gap-1">
                    ↑ 8% under budget
                </span>
                <span className="text-gray-400 text-xs sm:text-sm">
                    All amounts in USD
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12">
                {categories.map((c, idx) => (
                    <div
                        key={idx}
                        className="bg-gradient-to-b from-[#EBF6FF] to-[#BFE4FC] rounded-[24px] p-6 flex flex-col gap-3 shadow-sm border border-[#A2D5FF]/20"
                    >
                        {/* Icon and Label */}
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-white/40 rounded-lg">{c.icon}</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#1C2C3F]/80 uppercase tracking-wide">
                                {c.label}
                            </span>
                        </div>

                        <p className="text-2xl sm:text-[26px] font-black text-[#1C2C3F]">
                            ${c.spent.toFixed(2)}
                        </p>

                        <div className="w-full bg-[#A8D3F5] rounded-full h-[7px]">
                            <div
                                className="h-[7px] bg-[#2ECC71] rounded-full transition-all duration-700"
                                style={{ width: `${c.pct}%` }}
                            />
                        </div>

                        <p className="text-[11px] sm:text-xs text-[#527EA6] font-medium">
                            {c.transactions} transactions
                        </p>
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
                            {transactions.map((t, i) => (
                                <tr key={i} className="hover:bg-white/10 transition-colors">
                                    <td className="px-4 py-3.5 text-[#527EA6] font-medium whitespace-nowrap">{t.date}</td>
                                    <td className="px-4 py-3.5 font-bold whitespace-nowrap">{t.cat}</td>
                                    <td className="px-4 py-3.5 text-[#3A5674] font-medium">{t.desc}</td>
                                    <td className="px-4 py-3.5 text-[#527EA6] font-medium whitespace-nowrap">{t.provider}</td>
                                    <td className="px-4 py-3.5 text-right font-black whitespace-nowrap">{t.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </section>
    );
}

export default FinancialSummary;