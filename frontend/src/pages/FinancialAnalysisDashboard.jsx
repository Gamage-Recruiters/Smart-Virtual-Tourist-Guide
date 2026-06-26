import React, { useState } from 'react';
import { 
  FaSearch, FaChartLine, FaArrowUp, FaArrowDown, 
  FaDollarSign, FaHotel, FaCalendarDay, FaExchangeAlt 
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function FinancialAnalysisDashboard() {
  // Mock recent transactions dataset (Matches image_d49a0c.png)
  const [transactions] = useState([
    { id: "TRX-001", date: "17/03/2026", guest: "Rosanna Pawl", room: "Deluxe R16", amount: "$120", status: "Paid" },
    { id: "TRX-002", date: "17/03/2026", guest: "Androsan Solat", room: "Family suite R26", amount: "$45", status: "Paid" },
    { id: "TRX-003", date: "17/03/2026", guest: "Jenny Wins", room: "Deluxe R11", amount: "$230", status: "Refunded" },
    { id: "TRX-004", date: "17/03/2026", guest: "Netal Rose", room: "Deluxe R10", amount: "$120", status: "Paid" },
    { id: "TRX-005", date: "17/03/2026", guest: "Maws Rens", room: "Villa V01", amount: "$46", status: "Paid" },
    { id: "TRX-006", date: "17/03/2026", guest: "Sowrry Bose", room: "Family Suite R16", amount: "$120", status: "Refunded" },
    { id: "TRX-007", date: "17/03/2026", guest: "Winkat Alexander", room: "Deluxe R03", amount: "$128", status: "Paid" },
    { id: "TRX-008", date: "17/03/2026", guest: "Nedol Sanos", room: "Superior Villa SV01", amount: "$420", status: "Paid" }
  ]);

  // Mock analytical performance metrics scorecards data (Matches image_d499cb.png)
  const stats = [
    { label: "Total Revenue", value: "$ 45 , 280", trend: "12.5%", isPositive: true, icon: <FaDollarSign className="text-blue-600" />, iconBg: "bg-blue-50" },
    { label: "Occupancy Rate", value: "78%", trend: "14.2%", isPositive: true, icon: <FaHotel className="text-emerald-600" />, iconBg: "bg-emerald-50" },
    { label: "Avg Daily Rate", value: "$ 1,780", trend: "4.5%", isPositive: false, icon: <FaCalendarDay className="text-rose-600" />, iconBg: "bg-rose-50" },
    { label: "Revenue Per Available Room (Rev PAR)", value: "$ 280", trend: "29.8%", isPositive: true, icon: <FaChartLine className="text-indigo-600" />, iconBg: "bg-indigo-50" },
  ];

  return (
    <div className="w-full bg-[#EBF7FF] min-h-screen text-slate-700">
      <Header />
      {/* 1. FINANCIAL GROWTH HERO ACCENT HEADER BANNER (Matches image_d49972.jpg) */}
      <section 
        className="relative h-120 w-full flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05)), url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1600')` 
        }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Financial Analysis
        </h1>
        <p className="text-base md:text-lg text-slate-800 font-medium mb-8">
          View Financial Statues Of Your Hotel
        </p>
        
        <div className="relative w-full max-w-md shadow-lg rounded-full">
          <input 
            type="text" 
            placeholder="Explore Financial Statues" 
            className="w-full px-6 py-3.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none pr-12"
          />
          <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
        </div>
      </section>

      {/* Sub-Header Text Identifier Segment (Matches image_d499cb.png style) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-14 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Financial Analysis</h2>
        <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Track Your Property Revenue and Performance Metrics.</p>
      </div>

      {/* 2. STATS KPI SCORECARD MATRIX (Matches image_d499cb.png) */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                  {stat.icon}
                </div>
                <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                  stat.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {stat.isPositive ? <FaArrowUp className="scale-75" /> : <FaArrowDown className="scale-75" />}
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 tracking-wide mb-1 uppercase">{stat.label}</p>
                <p className="text-xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 3. VISUALIZATION REPORT CHARTS ROW (Simulated High-Fidelity Dash Panels from image_d499cb.png) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          {/* Left Column Box: Revenue vs Expenses Bar Graph */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-black text-slate-900 mb-6 tracking-wide uppercase">Revenue VS Expenses(Last 6 Months)</h3>
            
            <div className="h-64 w-full flex items-end justify-between gap-3 pt-4 border-b border-l border-slate-200 px-4 relative">
              {/* Grid Horizontal Guidelines */}
              <div className="absolute left-0 right-0 top-1/4 border-t border-slate-100 pointer-events-none" />
              <div className="absolute left-0 right-0 top-2/4 border-t border-slate-100 pointer-events-none" />
              <div className="absolute left-0 right-0 top-3/4 border-t border-slate-100 pointer-events-none" />
              
              {/* Simulated Month Clusters bars */}
              {[
                { m: 'October', rev: 'h-[45%]', exp: 'h-[20%]' },
                { m: 'November', rev: 'h-[35%]', exp: 'h-[10%]' },
                { m: 'December', rev: 'h-[75%]', exp: 'h-[45%]' },
                { m: 'January', rev: 'h-[90%]', exp: 'h-[40%]' },
                { m: 'February', rev: 'h-[50%]', exp: 'h-[25%]' },
                { m: 'March', rev: 'h-[75%]', exp: 'h-[40%]' }
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative z-10">
                  <div className="w-full flex justify-center items-end gap-1 h-full max-w-12.5">
                    <div className={`${bar.rev} w-4 bg-blue-600 rounded-t-xs transition-all group-hover:brightness-110 shadow-sm`} />
                    <div className={`${bar.exp} w-4 bg-sky-300 rounded-t-xs transition-all group-hover:brightness-105 shadow-xs`} />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-2 -rotate-12 origin-top-left">{bar.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Box: Revenue by Room Type Donut Allocation view */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <h3 className="text-xs font-black text-slate-900 mb-4 tracking-wide uppercase">Revenue by Room Type</h3>
            
            {/* Custom High Aesthetic CSS Segment Donut */}
            <div className="flex justify-center items-center my-4">
              <div className="relative w-44 h-44 rounded-full flex items-center justify-center shadow-inner"
                   style={{
                     background: 'conic-gradient(#2563eb 0% 40%, #38bdf8 40% 70%, #cbd5e1 70% 85%, #1e3a8a 85% 100%)'
                   }}>
                {/* Inner mask cutout hole */}
                <div className="w-32 h-32 bg-white rounded-full shadow-md flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metrics</span>
                  <span className="text-base font-extrabold text-slate-800">100% Split</span>
                </div>
              </div>
            </div>

            {/* Custom Interactive Color Indicators legends list matrix mapping */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-blue-600 rounded-xs" /> Deluxe Double Room</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-sky-400 rounded-xs" /> Standard Double Room</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-slate-300 rounded-xs" /> Family Suite Room</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-blue-900 rounded-xs" /> Superior Villas</div>
            </div>
          </div>

        </div>
      </main>

      {/* 4. RECENT TRANSACTIONS DATA TABLE LEDGER (Matches image_d49a0c.png) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        <div className="bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.02)] p-6 md:p-8 border border-slate-100">
          
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FaExchangeAlt className="text-xs" /></div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Recent Transactions</h3>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs min-w-225">
              <thead>
                <tr className="bg-blue-50/70 text-slate-800 font-bold border-b border-slate-100">
                  <th className="py-3 px-5 font-black tracking-wide rounded-l-xl">Transaction ID</th>
                  <th className="py-3 px-5 font-black tracking-wide">Transaction Date</th>
                  <th className="py-3 px-5 font-black tracking-wide">Guest Name</th>
                  <th className="py-3 px-5 font-black tracking-wide">Room Type</th>
                  <th className="py-3 px-5 font-black tracking-wide">Amount</th>
                  <th className="py-3 px-5 font-black tracking-wide rounded-r-xl">Statues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                {transactions.map((trx, index) => (
                  <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-800">{trx.id}</td>
                    <td className="py-4 px-5 text-slate-500">{trx.date}</td>
                    <td className="py-4 px-5 font-semibold text-slate-700">{trx.guest}</td>
                    <td className="py-4 px-5 text-slate-500">{trx.room}</td>
                    <td className={`py-4 px-5 font-extrabold ${trx.status === 'Refunded' ? 'text-rose-500' : 'text-slate-800'}`}>
                      {trx.amount}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`text-[11px] font-black tracking-tight ${
                        trx.status === 'Paid' ? 'text-emerald-600' : 'text-rose-500'
                      }`}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
}