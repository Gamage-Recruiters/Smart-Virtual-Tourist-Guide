import { useEffect, useState } from 'react';
import {
  FaSearch, FaDollarSign, FaBed, FaChartLine, FaMoneyBillWave, FaArrowLeft, FaArrowRight,
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import Header from '../../components/HotelOwner/Header';
import Footer from '../../components/HotelOwner/Footer';
import financialanalysis from '../../assets/HotelOwner/financial-page-image.png';
import { hotelOwnerAPI } from '../../services/api';

// ---- Static demo data -------------------------------------------------

const METRIC_CARDS = [
  {
    icon: FaDollarSign,
    label: 'Total Revenue',
  },
  {
    icon: FaBed,
    label: 'Occupancy Rate',
  },
  {
    icon: FaChartLine,
    label: 'Avg Daily Rate',
  },
  {
    icon: FaMoneyBillWave,
    label: 'Revenue Per Available Room (RevPAR)',
  },
];

const ROOM_TYPE_COLORS = ['#3B82F6', '#93C5FD', '#1D4ED8', '#DBEAFE', '#60A5FA'];

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB');
};

const formatAmount = (amount) => `$${(Number(amount) || 0).toFixed(2)}`;

const formatMetricAmount = (amount) => `$${(Number(amount) || 0).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

const getPaymentStatus = (payment, bookingAmount) => {
  const refundAmount = Number(payment.refundAmount) || 0;
  const hasRefund = refundAmount > 0
    || payment.refundReason
    || payment.refundDate
    || payment.paymentStatus?.includes('refunded');

  if (!hasRefund) return payment.paymentStatus || 'pending';
  if (!payment.refundTransactionId) return 'pending-refunded';
  return refundAmount >= (Number(bookingAmount) || 0) ? 'full-refunded' : 'partial-refunded';
};

const getMinutesSince = (value) => {
  if (!value) return null;
  const updatedAt = new Date(value).getTime();
  if (Number.isNaN(updatedAt)) return null;
  return Math.max(0, Math.floor((Date.now() - updatedAt) / 60000));
};

const toSummaryData = (summaries, monthOffset = 0) => {
  const sortedSummaries = [...summaries].sort((a, b) => a.month.localeCompare(b.month));
  
  if (sortedSummaries.length === 0) {
    return {
      metrics: {},
      revenueByMonth: [],
      revenueByRoomType: [],
      updatedAt: null,
      monthOffset: 0,
      totalMonths: 0,
      allSummaries: sortedSummaries,
    };
  }

  // Calculate the start index for the 6 month window
  const totalMonths = sortedSummaries.length;
  const maxOffset = Math.max(0, totalMonths - 6);
  const validOffset = Math.min(Math.max(0, monthOffset), maxOffset);
  
  // Get the 6 month window
  const startIndex = totalMonths - 6 - validOffset;
  const windowSummaries = sortedSummaries.slice(startIndex, startIndex + 6);
  
  const latestSummary = sortedSummaries[sortedSummaries.length - 1];
  const roomTotals = new Map();

  sortedSummaries.forEach((summary) => {
    (summary.revenueByRoomType || []).forEach(({ roomType, total }) => {
      roomTotals.set(roomType, (roomTotals.get(roomType) || 0) + (Number(total) || 0));
    });
  });

  return {
    metrics: latestSummary?.metrics || {},
    revenueByMonth: windowSummaries.map((summary) => ({
      month: new Date(`${summary.month}-01T00:00:00`).toLocaleDateString('en-US', { month: 'short' }),
      revenue: summary.revenue?.revenue || 0,
    })),
    revenueByRoomType: [...roomTotals].map(([name, value], index) => ({
      name,
      value,
      color: ROOM_TYPE_COLORS[index % ROOM_TYPE_COLORS.length],
    })),
    updatedAt: summaries.reduce((latest, summary) => (
      !latest || new Date(summary.updatedAt) > new Date(latest) ? summary.updatedAt : latest
    ), null),
    monthOffset: validOffset,
    totalMonths,
    allSummaries: sortedSummaries,
  };
};

const toTransactions = (bookings) => bookings.flatMap((booking) => {
  const payment = booking.payment || {};
  if (!payment.payherePaymentId) return [];

  const guest = [booking.customer?.firstName, booking.customer?.lastName]
    .filter(Boolean)
    .join(' ') || 'Unknown guest';
  const room = booking.roomType || booking.roomName || booking.roomNo || '-';
  const bookingAmount = booking.bookingPrice ?? booking.pricing?.total;
  const hasRefund = Number(payment.refundAmount) > 0
    || payment.refundReason
    || payment.refundDate
    || payment.paymentStatus?.includes('refunded');
  const transactions = [{
    id: payment.payherePaymentId,
    date: formatDate(payment.paidAt || booking.bookedDate),
    guest,
    room,
    amount: formatAmount(bookingAmount),
    status: 'paid',
  }];

  if (hasRefund) {
    transactions.push({
      id: payment.refundTransactionId || 'Pending refund',
      date: formatDate(payment.refundDate),
      guest,
      room,
      amount: formatAmount(payment.refundAmount),
      status: getPaymentStatus(payment, bookingAmount),
    });
  }

  return transactions;
});

// ---- Main page -----------------------------------------------------------

export default function FinancialAnalysis() {
  const [transactions, setTransactions] = useState([]);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [revenueByRoomType, setRevenueByRoomType] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [updatedAt, setUpdatedAt] = useState(null);
  const [minutesSinceUpdate, setMinutesSinceUpdate] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [transactionsError, setTransactionsError] = useState('');
  const [monthOffset, setMonthOffset] = useState(0);
  const [totalMonths, setTotalMonths] = useState(0);
  const [allSummaries, setAllSummaries] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const hotelId = userData.hotels?.[0]?._id;
    if (!hotelId) return;

    const applySummaries = (summaries) => {
      const summaryData = toSummaryData(summaries, monthOffset);
      setMetrics(summaryData.metrics);
      setRevenueByMonth(summaryData.revenueByMonth);
      setRevenueByRoomType(summaryData.revenueByRoomType);
      setUpdatedAt(summaryData.updatedAt);
      setMinutesSinceUpdate(getMinutesSince(summaryData.updatedAt));
      setTotalMonths(summaryData.totalMonths);
      setAllSummaries(summaryData.allSummaries);
    };

    Promise.all([
      hotelOwnerAPI.getBookingsByHotel(hotelId),
      hotelOwnerAPI.getRevenueSummariesByHotel(hotelId),
    ])
      .then(([bookingsResponse, summariesResponse]) => {
        setTransactions(toTransactions(bookingsResponse.bookings || []));
        applySummaries(summariesResponse.summaries || []);
      })
      .catch(() => setTransactionsError('Unable to load transactions.'));
  }, []);

  useEffect(() => {
    if (!updatedAt) return undefined;
    const timer = setInterval(() => setMinutesSinceUpdate(getMinutesSince(updatedAt)), 60000);
    return () => clearInterval(timer);
  }, [updatedAt]);

  const handleSync = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const hotelId = userData.hotels?.[0]?._id;
    if (!hotelId || isSyncing) return;

    setIsSyncing(true);
    hotelOwnerAPI.syncRevenueSummariesByHotel(hotelId)
      .then((response) => {
        const summaryData = toSummaryData(response.summaries || [], monthOffset);
        setMetrics(summaryData.metrics);
        setRevenueByMonth(summaryData.revenueByMonth);
        setRevenueByRoomType(summaryData.revenueByRoomType);
        setUpdatedAt(summaryData.updatedAt);
        setMinutesSinceUpdate(getMinutesSince(summaryData.updatedAt));
        setTotalMonths(summaryData.totalMonths);
        setAllSummaries(summaryData.allSummaries);
      })
      .catch(() => setTransactionsError('Unable to synchronize financial data.'))
      .finally(() => setIsSyncing(false));
  };

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
          <div className="flex flex-col items-center gap-3 text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">Financial Analysis</h3>
            <p className="text-sm md:text-base text-slate-500 mt-2">
              Track Your Property Revenue and Performance Metrics.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs text-slate-500">
                {minutesSinceUpdate === null
                  ? 'Summary not updated yet'
                  : `Updated ${minutesSinceUpdate} minute${minutesSinceUpdate === 1 ? '' : 's'} ago`}
              </span>
              <button
                type="button"
                onClick={handleSync}
                disabled={isSyncing}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {METRIC_CARDS.map(({ icon: Icon, label }) => {
              const metricValue = label === 'Total Revenue' ? formatMetricAmount(metrics.totalRevenue)
                : label === 'Occupancy Rate' ? `${(Number(metrics.occupancyRate) || 0).toFixed(2)}%`
                  : label === 'Avg Daily Rate' ? formatMetricAmount(metrics.avgDailyRate)
                    : formatMetricAmount(metrics.revPAR);
              return (
              <div
                key={label}
                className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Icon className="text-sm" />
                  </span>
                  <span className="text-xs font-bold text-slate-400">Live</span>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
                <p className="text-2xl font-extrabold text-slate-900">{metricValue}</p>
              </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Bar Chart */}
            <div className="border border-slate-200 rounded-2xl p-5">
              <p className="text-sm font-bold text-slate-800 mb-4">Revenue (Last 6 Months)</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByMonth} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F6" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F1F5F9' }} />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-4 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const newOffset = monthOffset + 1;
                    setMonthOffset(newOffset);
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    const hotelId = userData.hotels?.[0]?._id;
                    if (hotelId) {
                      hotelOwnerAPI.getRevenueSummariesByHotel(hotelId).then((response) => {
                        const summaryData = toSummaryData(response.summaries || [], newOffset);
                        setRevenueByMonth(summaryData.revenueByMonth);
                        setTotalMonths(summaryData.totalMonths);
                      });
                    }
                  }}
                  disabled={monthOffset >= totalMonths - 6}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaArrowLeft className="text-xs" />
                  <span>Back</span>
                </button>
                <span className="text-sm font-bold text-slate-700">
                  {allSummaries.length > 0 && (
                    <>
                      {allSummaries[Math.max(0, allSummaries.length - 6 - monthOffset)]?.month || '-'}
                      {' to '}
                      {allSummaries[Math.min(allSummaries.length - 1, allSummaries.length - 1 - monthOffset)]?.month || '-'}
                    </>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newOffset = Math.max(0, monthOffset - 1);
                    setMonthOffset(newOffset);
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    const hotelId = userData.hotels?.[0]?._id;
                    if (hotelId) {
                      hotelOwnerAPI.getRevenueSummariesByHotel(hotelId).then((response) => {
                        const summaryData = toSummaryData(response.summaries || [], newOffset);
                        setRevenueByMonth(summaryData.revenueByMonth);
                        setTotalMonths(summaryData.totalMonths);
                      });
                    }
                  }}
                  disabled={monthOffset === 0}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Forward</span>
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>

            {/* Revenue by Room Type Donut Chart */}
            <div className="border border-slate-200 rounded-2xl p-5">
              <p className="text-sm font-bold text-slate-800 mb-4">Revenue by Room Type</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByRoomType}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {revenueByRoomType.map((entry) => (
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
                {transactions.map((t) => (
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
                          t.status === 'paid' ? 'text-emerald-600' : ['full-refunded', 'partial-refunded'].includes(t.status) ? 'text-red-600' : t.status.includes('refunded') ? 'text-amber-600' : 'text-rose-600'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!transactions.length && (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-500">
                      {transactionsError || 'No completed transactions found.'}
                    </td>
                  </tr>
                )}
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
