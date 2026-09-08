import React from 'react';
import {
  FaSearch, FaDollarSign, FaBed, FaChartLine, FaMoneyBillWave,
  FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import Header from '../../components/HotelOwner/Header';
import Footer from '../../components/HotelOwner/Footer';
import financialanalysis from '../../assets/HotelOwner/financial-page-image.png';

// ---- Static demo data -------------------------------------------------

const METRIC_CARDS = [
  {
    icon: FaDollarSign,
    label: 'Total Revenue',
    value: '$ 45,200',
    change: '+10.2%',
    positive: true,
  },
  {
    icon: FaBed,
    label: 'Occupancy Rate',
    value: '78%',
    change: '+8.2%',
    positive: true,
  },
  {
    icon: FaChartLine,
    label: 'Avg Daily Rate',
    value: '$ 1,780',
    change: '-8.0%',
    positive: false,
  },
  {
    icon: FaMoneyBillWave,
    label: 'Revenue Per Available Room (RevPAR)',
    value: '$ 280',
    change: '+23.0%',
    positive: true,
  },
];

const REVENUE_VS_EXPENSES = [
  { month: 'Jan', revenue: 18000, expenses: 6000 },
  { month: 'Feb', revenue: 21000, expenses: 7200 },
  { month: 'Mar', revenue: 24500, expenses: 8000 },
  { month: 'Apr', revenue: 20500, expenses: 6800 },
  { month: 'May', revenue: 26000, expenses: 8600 },
  { month: 'Jun', revenue: 25200, expenses: 8100 },
];

const REVENUE_BY_ROOM_TYPE = [
  { name: 'Deluxe Double Room', value: 38, color: '#3B82F6' },
  { name: 'Standard Double Room', value: 27, color: '#93C5FD' },
  { name: 'Family Suite Room', value: 20, color: '#1D4ED8' },
  { name: 'Superior Villa', value: 15, color: '#DBEAFE' },
];

const RECENT_TRANSACTIONS = [
  { id: 'TRX-001', date: '17/03/2026', guest: 'Kasunika Perel', room: 'Deluxe R16', amount: '$120', status: 'Paid' },
  { id: 'TRX-002', date: '17/03/2026', guest: 'Andrean Selal', room: 'Family Suite R28', amount: '$45', status: 'Paid' },
  { id: 'TRX-003', date: '17/03/2026', guest: 'Jeremy Wins', room: 'Deluxe R11', amount: '$230', status: 'Refunded' },
  { id: 'TRX-004', date: '17/03/2026', guest: 'Nadal Rose', room: 'Deluxe R10', amount: '$120', status: 'Paid', highlighted: true },
  { id: 'TRX-005', date: '17/03/2026', guest: 'Mavis Rens', room: 'Villa V21', amount: '$46', status: 'Paid' },
  { id: 'TRX-006', date: '17/03/2026', guest: 'Sawwy Bose', room: 'Family Suite R16', amount: '$720', status: 'Refunded' },
  { id: 'TRX-007', date: '17/03/2026', guest: 'Winlex Alexander', room: 'Deluxe R03', amount: '$108', status: 'Paid' },
  { id: 'TRX-008', date: '17/03/2026', guest: 'Nadal Sanca', room: 'Superior Villa SV01', amount: '$420', status: 'Paid' },
];

// ---- Main page -----------------------------------------------------------

export default function FinancialAnalysis() {
  return (
    <div className="w-full bg-[#EBF7FF] min-h-screen text-slate-800">
      <Header />

      {/* 1. HERO BANNER SECTION */}
      <section
        className="relative h-screen w-full flex flex-col items-center justify-center px-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1)), url(${financialanalysis})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex max-w-3xl flex-col items-center gap-6 w-full text-center mb-[150px]">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Financial Analysis
          </h1>

          <p className="text-base md:text-xl text-slate-800 font-medium">
            View Financial Statues Of Your Hotel
          </p>

          <div className="relative w-full max-w-md shadow-md rounded-full">
            <input
              type="text"
              placeholder="Explore Financial Statues"
              className="w-full px-6 py-3.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none pr-12"
            />
            <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Section Identifier label */}
      <div className="max-w-8xl mx-auto px-4 md:px-8 mt-12">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Financial Analysis
        </h2>
      </div>

      <main className="max-w-8xl mx-auto px-4 md:px-8 mt-6 space-y-8">
        {/* Overview Card */}
        <div className="bg-white rounded shadow-md p-6 md:p-10 border border-slate-100">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">Financial Analysis</h3>
            <p className="text-sm md:text-base text-slate-500 mt-2">
              Track Your Property Revenue and Performance Metrics.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {METRIC_CARDS.map(({ icon: Icon, label, value, change, positive }) => (
              <div
                key={label}
                className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Icon className="text-sm" />
                  </span>
                  <span
                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {positive ? <FaArrowUp className="text-[9px]" /> : <FaArrowDown className="text-[9px]" />}
                    {change}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
                <p className="text-2xl font-extrabold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue vs Expenses Bar Chart */}
            <div className="border border-slate-200 rounded-2xl p-5">
              <p className="text-sm font-bold text-slate-800 mb-4">Revenue VS Expenses (Last 6 Months)</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_VS_EXPENSES} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F6" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F1F5F9' }} />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Revenue" />
                    <Bar dataKey="expenses" fill="#BFDBFE" radius={[4, 4, 0, 0]} name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue by Room Type Donut Chart */}
            <div className="border border-slate-200 rounded-2xl p-5">
              <p className="text-sm font-bold text-slate-800 mb-4">Revenue by Room Type</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={REVENUE_BY_ROOM_TYPE}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {REVENUE_BY_ROOM_TYPE.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout="vertical"
                      align="left"
                      verticalAlign="middle"
                      iconType="circle"
                      wrapperStyle={{ fontSize: 11, color: '#475569' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded shadow-md p-6 md:p-8 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold text-slate-400 border-b border-slate-100">
                  <th className="py-3 pr-4">Transaction ID</th>
                  <th className="py-3 pr-4">Transaction Date</th>
                  <th className="py-3 pr-4">Guest Name</th>
                  <th className="py-3 pr-4">RoomType</th>
                  <th className="py-3 pr-4">Amount</th>
                  <th className="py-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_TRANSACTIONS.map((t) => (
                  <tr
                    key={t.id}
                    className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${
                      t.highlighted ? 'ring-2 ring-blue-400 ring-inset bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="py-3 pr-4 text-slate-700">{t.id}</td>
                    <td className="py-3 pr-4 text-slate-700">{t.date}</td>
                    <td className="py-3 pr-4 text-slate-700">{t.guest}</td>
                    <td className="py-3 pr-4 text-slate-700">{t.room}</td>
                    <td className="py-3 pr-4 text-slate-700">{t.amount}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-xs font-bold ${
                          t.status === 'Paid' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <div className="mb-16" />
      <Footer />
    </div>
  );
}
