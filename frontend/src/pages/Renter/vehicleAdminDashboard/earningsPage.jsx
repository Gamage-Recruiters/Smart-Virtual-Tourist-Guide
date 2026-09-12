import {
  Plus,
  TrendingUp,
  ClipboardCheck,
  ShieldCheck,
  Loader2,
  Inbox,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import AddVehicleModal from "./addVehicle/addVehicleModal";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg">
        <p className="text-slate-400 text-[10px] uppercase">{label}</p>
        <p className="text-blue-400 mt-0.5">{`${payload[0].value.toLocaleString()} LKR`}</p>
      </div>
    );
  }
  return null;
};

function EarningsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [earningsData, setEarningsData] = useState({
    stats: {
      totalRevenue: 0,
      pendingPayout: 0,
      successRate: "100%",
      expectedDate: "N/A",
    },
    chartData: [],
    transactions: [],
  });

  const resolveApiUrl = (path = "") => {
    const base = (
      import.meta.env.VITE_BACKEND_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      "http://localhost:5000/api"
    ).replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return base.includes("/api")
      ? `${base}${normalizedPath}`
      : `${base}/api${normalizedPath}`;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchEarnings = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("renterToken") ||
          localStorage.getItem("userToken");

        const res = await axios.get(
          resolveApiUrl("/renter/earnings/rantal-earnings"),
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (isMounted && res.data?.success) {
          setEarningsData({
            stats: res.data.stats || {
              totalRevenue: 0,
              pendingPayout: 0,
              successRate: "100%",
              expectedDate: "N/A",
            },
            chartData: res.data.chartData || [],
            transactions: res.data.transactions || [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch earnings overview:", err.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchEarnings();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* 1. Header Section */}
      <header className="flex flex-row items-center justify-between gap-4 mt-8 lg:mt-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Earnings Overview
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track your performance and manage payouts
          </p>
        </div>
        <div>
          <button
            className="flex items-center gap-2 bg-[#2563EB] text-white px-2.5 lg:px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} strokeWidth={3} />
            <span className="hidden lg:block">ADD NEW VEHICLE</span>
          </button>
        </div>
        <AddVehicleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </header>

      {/* 2. Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/50 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4 text-orange-500">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-[10px] font-extrabold text-slate-400 tracking-widest mb-1 uppercase">
              Total Revenue
            </h3>
            <p className="text-3xl font-extrabold text-slate-900">
              {isLoading ? (
                <span className="animate-pulse text-slate-300 text-lg">Loading...</span>
              ) : (
                <>
                  {earningsData.stats.totalRevenue.toLocaleString()}
                  <span className="text-sm text-slate-400 font-bold ml-1">LKR</span>
                </>
              )}
            </p>
            <p className="text-xs font-bold text-green-500 mt-2 flex items-center gap-1">
              ↑ Active & Completed
            </p>
          </div>
        </div>

        {/* Pending Payout */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/50 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-500">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <h3 className="text-[10px] font-extrabold text-slate-400 tracking-widest mb-1 uppercase">
              Pending Payout
            </h3>
            <p className="text-3xl font-extrabold text-slate-900">
              {isLoading ? (
                <span className="animate-pulse text-slate-300 text-lg">Loading...</span>
              ) : (
                <>
                  {earningsData.stats.pendingPayout.toLocaleString()}
                  <span className="text-sm text-slate-400 font-bold ml-1">LKR</span>
                </>
              )}
            </p>
            <p className="text-xs font-medium text-slate-400 mt-2">
              Expected: {earningsData.stats.expectedDate}
            </p>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/50 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4 text-orange-500">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-[10px] font-extrabold text-slate-400 tracking-widest mb-1 uppercase">
              Success Rate
            </h3>
            <p className="text-3xl font-extrabold text-slate-900 mb-3">
              {isLoading ? "..." : earningsData.stats.successRate}
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: earningsData.stats.successRate }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Monthly Revenue Trends Chart */}
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
                Verified Trips
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            2026
          </button>
        </div>

        <div className="w-full h-64 mt-4 min-w-0">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-slate-400 gap-2">
              <Loader2 className="animate-spin text-blue-600" size={24} />
              <span className="text-xs font-semibold">Loading revenue trends...</span>
            </div>
          ) : (
            <ResponsiveContainer width="99%" height={256}>
              <LineChart
                data={earningsData.chartData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis hide={true} domain={["auto", "auto"]} />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#f1f5f9",
                    strokeWidth: 2,
                    strokeDasharray: "4 4",
                  }}
                />
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
          )}
        </div>
      </div>

      {/* 4. Transaction History (Only Completed Trips) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Transaction History
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Completed bookings eligible for owner payouts
            </p>
          </div>
          {/* <button className="flex items-center gap-1 text-sm font-bold text-orange-500 hover:text-orange-600 hover:underline cursor-pointer">
            Export CSV <Download size={14} />
          </button> */}
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Loader2 className="animate-spin inline mr-2 text-blue-600" size={20} />
                    Loading transaction history...
                  </td>
                </tr>
              ) : earningsData.transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Inbox className="mx-auto mb-2 text-slate-300" size={32} />
                    <p className="text-sm font-semibold text-slate-600">
                      No completed transactions found
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Trips will appear here once marked completed.
                    </p>
                  </td>
                </tr>
              ) : (
                earningsData.transactions.map((trx) => (
                  <tr
                    key={trx.id}
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
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-green-50 text-green-600">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EarningsPage;