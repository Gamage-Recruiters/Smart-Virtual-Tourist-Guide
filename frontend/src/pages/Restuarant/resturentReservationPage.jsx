import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function ResturentReservationPage() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Availability Check states
  const [checkDate, setCheckDate] = useState(new Date().toISOString().split('T')[0]);
  const [availDetails, setAvailDetails] = useState(null);
  const [checkingAvail, setCheckingAvail] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('restaurantUser') || '{}');
        const token = localStorage.getItem('restaurantToken');
        const headers = { Authorization: `Bearer ${token}` };

        // Get restaurant profile to obtain ID
        const restRes = await fetch(`${API_BASE}/restaurants`, { headers });
        const allRestaurants = await restRes.json();
        const matched = Array.isArray(allRestaurants)
          ? allRestaurants.find(r => r.email === user.email)
          : null;

        if (matched) {
          setRestaurantId(matched._id);
          // Fetch reservations
          const res = await fetch(`${API_BASE}/reservations/restaurant/${matched._id}`, { headers });
          if (res.ok) {
            const data = await res.json();
            setReservations(data);
          }
        }
      } catch (err) {
        console.error("Error loading reservations:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Fetch slot availability for selected date
  useEffect(() => {
    if (restaurantId && checkDate) {
      const fetchAvailability = async () => {
        setCheckingAvail(true);
        try {
          const res = await fetch(`${API_BASE}/reservations/availability?restaurantId=${restaurantId}&date=${checkDate}`);
          if (res.ok) {
            const data = await res.json();
            setAvailDetails(data);
          }
        } catch (err) {
          console.error("Error checking availability:", err);
        } finally {
          setCheckingAvail(false);
        }
      };
      fetchAvailability();
    }
  }, [restaurantId, checkDate]);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
          Reservations
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Manage Reservations
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          View and check table reservations from tourists and local customers.
        </p>
      </header>

      {/* Date Availability Checker Widget */}
      {restaurantId && (
        <div className="mb-8 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Check Seats Availability by Date</h3>
              <p className="text-xs text-slate-500">Verify total booked vs remaining capacity limits.</p>
            </div>
            <input
              type="date"
              value={checkDate}
              onChange={e => setCheckDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-blue-400"
            />
          </div>

          {checkingAvail ? (
            <div className="text-xs text-slate-400">Loading details...</div>
          ) : availDetails ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-3 bg-white border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">{availDetails.ethereal.name}</span>
                  <span className="text-slate-400 text-[10px]">Limit: {availDetails.ethereal.limit} seats</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Booked: <b>{availDetails.ethereal.booked}</b></span>
                  <span className="text-blue-600 font-bold block">Available: {availDetails.ethereal.available}</span>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">{availDetails.obsidian.name}</span>
                  <span className="text-slate-400 text-[10px]">Limit: {availDetails.obsidian.limit} seats</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Booked: <b>{availDetails.obsidian.booked}</b></span>
                  <span className="text-amber-600 font-bold block">Available: {availDetails.obsidian.available}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">Loading reservations...</div>
      ) : reservations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-900">No Reservations Yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            Once customers reserve table seats for dining, they will list here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4 text-center">Guests</th>
                <th className="py-3 px-4 text-right">Cost ($)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((resv) => (
                <tr key={resv._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 block">{resv.userName}</span>
                    <span className="text-[10px] text-slate-400">{resv.userEmail}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{resv.date}</td>
                  <td className="py-3.5 px-4 font-semibold text-blue-600">
                    {resv.tableType === 'ethereal' ? 'Luxury Ethereal' : 'Sunset Obsidian'}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">{resv.guestCount}</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-950">${resv.subtotal.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-green-50 border border-green-200 text-green-700">
                      {resv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ResturentReservationPage;
