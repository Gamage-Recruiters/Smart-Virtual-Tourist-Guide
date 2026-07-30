import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function ResturentRevenuePage() {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    thisMonthRevenue: 0,
    todayRevenue: 0,
    reservationsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('restaurantUser') || '{}');
        const token = localStorage.getItem('restaurantToken');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch restaurants to get restaurant ID
        const restRes = await fetch(`${API_BASE}/restaurants`, { headers });
        const allRestaurants = await restRes.json();
        const matched = Array.isArray(allRestaurants)
          ? allRestaurants.find(r => r.email === user.email)
          : null;

        if (matched) {
          const revRes = await fetch(`${API_BASE}/reservations/restaurant/${matched._id}/revenue`, { headers });
          if (revRes.ok) {
            const data = await revRes.json();
            setRevenueData(data);
          }
        }
      } catch (err) {
        console.error("Error loading revenue data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
          Revenue
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Revenue Analytics
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Track your restaurant earnings, top-performing experiences, and reservations count.
        </p>
      </header>

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">Loading analytics...</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Total Revenue</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">${revenueData.totalRevenue.toFixed(2)}</p>
              <p className="mt-1 text-xs text-slate-400">Lifetime earnings</p>
            </div>
            
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">This Month</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">${revenueData.thisMonthRevenue.toFixed(2)}</p>
              <p className="mt-1 text-xs text-slate-400">Current calendar month</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Today</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">${revenueData.todayRevenue.toFixed(2)}</p>
              <p className="mt-1 text-xs text-slate-400">Real-time daily earnings</p>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50/50 border border-blue-100 p-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Total Reservations Completed</h3>
              <p className="text-xs text-slate-500 mt-0.5">Summary of total diner bookings processed to date.</p>
            </div>
            <div className="text-3xl font-extrabold text-blue-600">
              {revenueData.reservationsCount}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default ResturentRevenuePage;
