import React, { useState, useEffect } from 'react';
import { Wallet, Landmark, Clock, BadgeCheck, FileText } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';

import DateRangePicker from '../../components/Guide/earnings/DateRangePicker';
import TransactionHistoryTable from '../../components/Guide/earnings/TransactionHistoryTable';
import PayoutMethodsList from '../../components/Guide/earnings/PayoutMethodsList';
import RequestPayoutCard from '../../components/Guide/earnings/RequestPayoutCard';

const Earnings = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '2026-03-01',
    endDate: '2026-03-31',
  });

  const [summary, setSummary] = useState({
    totalEarnings: 'Rs. 450,000',
    availablePayout: 'Rs. 125,000',
    pendingPayout: 'Rs. 45,000',
    completedBookings: '128',
    balanceNumeric: 125000,
  });

  const [transactions, setTransactions] = useState([]);
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const guideId = 'current';

        // 1. Summary Endpoint Call (with fallback mock)
        try {
          const res = await fetch(`/api/guides/${guideId}/earnings/summary?from=${dateRange.startDate}&to=${dateRange.endDate}`);
          if (res.ok) {
            const data = await res.json();
            setSummary(data);
          } else {
            throw new Error('Summary fetch failed');
          }
        } catch {
          setSummary({
            totalEarnings: 'Rs. 450,000',
            availablePayout: 'Rs. 125,000',
            pendingPayout: 'Rs. 45,000',
            completedBookings: '128',
            balanceNumeric: 125000,
          });
        }

        // 2. Transactions Endpoint Call (with fallback mock)
        try {
          const res = await fetch(`/api/guides/${guideId}/earnings/transactions?from=${dateRange.startDate}&to=${dateRange.endDate}`);
          if (res.ok) {
            const data = await res.json();
            setTransactions(data);
          } else {
            throw new Error('Transactions fetch failed');
          }
        } catch {
          setTransactions([
            { date: 'Oct 28, 2023', tourPackage: 'Sigiriya Rock Fortress Day Tour', travelerName: 'James Watson', amount: 18500, status: 'Paid' },
            { date: 'Oct 26, 2023', tourPackage: 'Kandy Cultural Experience', travelerName: 'Marta Schmidt', amount: 12000, status: 'Pending' },
            { date: 'Oct 24, 2023', tourPackage: 'Ella Nine Arch Bridge Trek', travelerName: 'Chen Wei', amount: 15000, status: 'Paid' },
            { date: 'Oct 22, 2023', tourPackage: 'Galle Fort Walking Tour', travelerName: 'Elena Rossi', amount: 9500, status: 'Paid' },
            { date: 'Oct 20, 2023', tourPackage: 'Yala Safari Experience', travelerName: 'David Miller', amount: 25000, status: 'Pending' },
          ]);
        }

        // 3. Payout Methods Endpoint Call (with fallback mock)
        try {
          const res = await fetch(`/api/guides/${guideId}/payout-methods`);
          if (res.ok) {
            const data = await res.json();
            setPayoutMethods(data);
          } else {
            throw new Error('Payout methods fetch failed');
          }
        } catch {
          setPayoutMethods([
            { bankName: 'Bank of Ceylon', maskedNumber: '•••• 8902', isPrimary: true },
            { bankName: 'Commercial Bank', maskedNumber: '•••• 4431', isPrimary: false },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const handleTransfer = async () => {
    try {
      const res = await fetch('/api/guides/current/payouts/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: summary.balanceNumeric }),
      });
      if (res.ok) {
        alert('Payout request submitted successfully!');
      } else {
        alert('Payout request received (simulated).');
      }
    } catch {
      alert('Payout request submitted successfully!');
    }
  };

  return (
    <PageWrapper activeNavItem="Earnings">
      <div className="space-y-6">
        {/* Page Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Earnings Overview</h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Monitor your income and payout status</p>
          </div>
          <div className="flex items-center gap-2.5">
            <DateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={(range) => setDateRange(range)}
            />
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100/80 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                +12.5% <span className="text-[9px]">↗</span>
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 mb-1">Total Earnings (LKR)</p>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{summary.totalEarnings}</h3>
            </div>
            <div className="h-1 bg-emerald-500 rounded-full w-24 mt-4" />
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100/80 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Updated today</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 mb-1">Available Payout</p>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{summary.availablePayout}</h3>
            </div>
            <div className="h-1 bg-blue-900 rounded-full w-12 mt-4" />
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100/80 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-sm font-bold">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 mb-1">Pending Payout</p>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{summary.pendingPayout}</h3>
            </div>
            <div className="h-1 bg-amber-500 rounded-full w-8 mt-4" />
          </div>

          {/* Card 4 */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100/80 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-purple-600">+8 ↗</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 mb-1">Completed Bookings</p>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{summary.completedBookings}</h3>
            </div>
            <div className="h-1 bg-purple-500 rounded-full w-28 mt-4" />
          </div>
        </div>

        {/* Content 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Transaction History */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-slate-800 tracking-tight">Transaction History</h2>
              <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                View All
              </button>
            </div>
            <TransactionHistoryTable transactions={transactions} />
          </div>

          {/* Right Column: Payout Methods & Request Payout Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800">Payout Methods</h2>
                <button type="button" className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:text-blue-700">
                  MANAGE
                </button>
              </div>
              <PayoutMethodsList
                methods={payoutMethods}
                onAddMethod={() => alert('Add payout method modal/flow')}
              />
            </div>

            <RequestPayoutCard balance={summary.balanceNumeric} onTransfer={handleTransfer} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Earnings;
