import {
  Plus,
  TrendingUp,
  ClipboardCheck,
  ShieldCheck,
  ChevronDown,
  Download,
} from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AddVehicleModal from "./addVehicle/addVehicleModal";

// --- MOCK DATA ---

// 2. Add real data points for your chart
const chartData = [
  { name: "Jan", revenue: 250000 },
  { name: "Feb", revenue: 280000 },
  { name: "Mar", revenue: 260000 },
  { name: "Apr", revenue: 380000 },
  { name: "May", revenue: 310000 },
  { name: "Jun", revenue: 340000 },
  { name: "Jul", revenue: 452000 },
];

const transactionData = [
  {
    id: "TRX-90821",
    date: "Oct 12, 2023",
    description: "Colombo to Galle (Toyota Dolphin)",
    amount: "15,000",
    status: "Completed",
  },
  {
    id: "TRX-90822",
    date: "Oct 14, 2023",
    description: "Airport Drop (Honda Vezel)",
    amount: "8,400",
    status: "Pending",
  },
  {
    id: "TRX-90823",
    date: "Oct 10, 2023",
    description: "Kandy Tour - 2 Days (Mini Van)",
    amount: "35,000",
    status: "Completed",
  },
  {
    id: "TRX-90824",
    date: "Oct 08, 2023",
    description: "Negombo City Trip (Tuk Tuk)",
    amount: "4,500",
    status: "Completed",
  },
  {
    id: "TRX-90825",
    date: "Oct 05, 2023",
    description: "Sigiriya Safari (Land Cruiser)",
    amount: "22,000",
    status: "Cancelled",
  },
];

// Custom Tooltip for the chart so it looks good when you hover over data points
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg">
        <p className="text-slate-300 mb-1">{label}</p>
        <p>{`${payload[0].value.toLocaleString()} LKR`}</p>
      </div>
    );
  }
  return null;
};

function EarningsPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-600";
      case "Pending":
        return "bg-orange-50 text-orange-500";
      case "Cancelled":
        return "bg-red-50 text-red-500";
      default:
        return "bg-slate-50 text-slate-500";
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Earnings Overview
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track your performance and manage payouts
          </p>
        </div>
        <div>
          <button className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} strokeWidth={3} />
            ADD NEW VEHICLE
          </button>
        </div>
        <AddVehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </header>

      {/* 2. Summary Cards Grid (Kept exactly the same) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ... (Keep your existing summary cards code here) ... */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/50 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4 text-orange-500">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-[10px] font-extrabold text-slate-400 tracking-widest mb-1 uppercase">
              Total Revenue
            </h3>
            <p className="text-3xl font-extrabold text-slate-900">
              452,000
              <span className="text-sm text-slate-400 font-bold ml-1">LKR</span>
            </p>
            <p className="text-xs font-bold text-green-500 mt-2 flex items-center gap-1">
              ↑ 12.5% from last month
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/50 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-500">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <h3 className="text-[10px] font-extrabold text-slate-400 tracking-widest mb-1 uppercase">
              Pending Payout
            </h3>
            <p className="text-3xl font-extrabold text-slate-900">
              12,400
              <span className="text-sm text-slate-400 font-bold ml-1">LKR</span>
            </p>
            <p className="text-xs font-medium text-slate-400 mt-2">
              Expected: Oct 15, 2023
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/50 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4 text-orange-500">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-[10px] font-extrabold text-slate-400 tracking-widest mb-1 uppercase">
              Success Rate
            </h3>
            <p className="text-3xl font-extrabold text-slate-900 mb-3">98%</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-orange-500 w-[98%] h-full rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Real Monthly Revenue Trends Chart */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/50">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Monthly Revenue Trends
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-xs text-slate-500 font-medium">
                Yearly performance view
              </span>
              <span className="text-[10px] font-extrabold bg-green-50 text-green-600 px-2 py-1 rounded-md">
                ~ +12.5% vs last month
              </span>
              <span className="text-[10px] font-extrabold bg-orange-50 text-orange-500 px-2 py-1 rounded-md">
                ⭐ Avg. Rating: 4.9 Stars
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            Year 2026 <ChevronDown size={16} className="text-slate-400" />
          </button>
        </div>

        {/* --- RECHARTS IMPLEMENTATION --- */}
        <div className="w-full h-64 mt-4 min-w-0">
          <ResponsiveContainer width="99%" height={256}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              {/* X Axis */}
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                dy={10}
              />
              {/* Y Axis */}
              <YAxis
                hide={true}
                domain={["dataMin - 50000", "dataMax + 50000"]}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#f1f5f9",
                  strokeWidth: 2,
                  strokeDasharray: "4 4",
                }}
              />

              {/* The main line */}
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0f172a"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0f172a", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#2563EB", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Transaction History (Kept exactly the same) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-slate-900">
            Transaction History
          </h2>
          <button className="flex items-center gap-1 text-sm font-bold text-orange-500 hover:text-orange-600 hover:underline">
            Export CSV <Download size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150">
            <thead>
              <tr className="text-sm text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="pb-4 font-bold">Date</th>
                <th className="pb-4 font-bold">ID</th>
                <th className="pb-4 font-bold">Trip Description</th>
                <th className="pb-4 font-bold text-right">Amount (LKR)</th>
                <th className="pb-4 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.map((trx, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4 text-sm font-medium text-slate-500">
                    {trx.date}
                  </td>
                  <td className="py-4 text-sm font-bold text-slate-900">
                    {trx.id}
                  </td>
                  <td className="py-4 text-sm font-bold text-slate-700">
                    {trx.description}
                  </td>
                  <td className="py-4 text-sm font-extrabold text-slate-900 text-right">
                    {trx.amount}
                  </td>
                  <td className="py-4 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getStatusStyle(trx.status)}`}
                    >
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EarningsPage;
