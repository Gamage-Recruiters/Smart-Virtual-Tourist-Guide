import { useEffect, useMemo, useState } from 'react';
import { FiSearch, FiCalendar, FiClock, FiUser, FiMapPin, FiMail, FiPhone, FiCheck, FiX } from 'react-icons/fi';
import ActivityProviderSidebar from '../../components/ActivityProvider/ActivityProviderSidebar';
import heroBanner from '../../assets/LandingPage/safari.png';
import { activityAPI } from '../../services/ActivityProvider/activityAPI';

const getBookingDisplay = (booking) => {
  const customerName = [booking.customer?.firstName, booking.customer?.lastName].filter(Boolean).join(' ').trim() || 'Guest';
  const customerEmail = booking.customer?.email || '';
  const customerPhone = booking.customer?.phone || '';
  const activityTitle = booking.service?.name || 'Activity Booking';
  const location = booking.service?.location || '';
  const date = booking.activityDate || (booking.createdAt ? booking.createdAt.slice(0, 10) : 'TBD');
  const timeSlot = booking.timeSlot || 'Full Day';
  const participants = booking.participants || 1;
  const currency = booking.pricing?.currency || 'LKR';
  const price = booking.pricing?.total || 0;
  const bookingRef = booking._id ? booking._id.slice(-6).toUpperCase() : 'N/A';
  const paymentMethod = booking.payment?.method
    ? `${booking.payment.method.toUpperCase()}${booking.payment.last4 ? ` (**** ${booking.payment.last4})` : ''}`
    : 'Card';
  const bookingDetails = Array.isArray(booking.bookingDetails) ? booking.bookingDetails : [];

  return {
    _id: booking._id,
    customerName,
    customerEmail,
    customerPhone,
    activityTitle,
    location,
    date,
    timeSlot,
    participants,
    currency,
    price,
    bookingRef,
    paymentMethod,
    bookingDetails,
    pricingItems: booking.pricing?.items || [],
    status: booking.status || 'pending',
    raw: booking,
  };
};

const ConfirmationModal = ({ booking, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[slideUp_0.2s_ease]">
      {/* Header */}
      <div className="flex flex-col items-center pt-8 pb-5 px-8 text-center bg-emerald-50/50 border-b border-emerald-100">
        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-3 shadow-lg shadow-emerald-200">
          <FiCheck className="text-white text-3xl stroke-[3]" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Booking Accepted &amp; Confirmed!</h2>
        <p className="text-xs text-slate-500 mt-1">This booking is now active and synced with your activity calendar.</p>
      </div>

      {/* Details */}
      <div className="p-6 space-y-4">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2.5 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-xs text-slate-400 font-medium">Booking Ref</span>
            <span className="font-mono font-bold text-slate-700">#{booking.bookingRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Customer Name</span>
            <span className="font-semibold text-slate-800">{booking.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Activity Title</span>
            <span className="font-semibold text-slate-800 text-right max-w-[60%]">{booking.activityTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Date &amp; Time Slot</span>
            <span className="font-medium text-slate-800">{booking.date} • {booking.timeSlot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Guests</span>
            <span className="font-medium text-slate-800">{booking.participants} participant{booking.participants > 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200">
            <span className="font-semibold text-slate-700">Total Amount</span>
            <span className="font-bold text-emerald-600 text-base">{booking.currency} {booking.price.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm"
        >
          Back to Bookings
        </button>
      </div>
    </div>
  </div>
);

const BookingCard = ({ booking, onAccept, onDecline }) => {
  const isConfirmed = booking.status === 'confirmed';
  const isDeclined = booking.status === 'cancelled';

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
        isConfirmed ? 'border-emerald-200 bg-emerald-50/20' : isDeclined ? 'border-slate-200 opacity-60' : 'border-slate-200'
      }`}
    >
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50/80 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
            <FiUser className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">{booking.customerName}</h3>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                #{booking.bookingRef}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-0.5">
              {booking.customerEmail && (
                <span className="flex items-center gap-1">
                  <FiMail className="w-3 h-3" /> {booking.customerEmail}
                </span>
              )}
              {booking.customerPhone && (
                <span className="flex items-center gap-1">
                  <FiPhone className="w-3 h-3" /> {booking.customerPhone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full capitalize ${
            isConfirmed
              ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
              : isDeclined
              ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-300'
              : 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
          }`}
        >
          {booking.status}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {/* Activity Info */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Activity Details</p>
            <p className="font-bold text-slate-800 text-base">{booking.activityTitle}</p>
            {booking.location && (
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <FiMapPin className="w-3.5 h-3.5 text-slate-400" /> {booking.location}
              </p>
            )}
          </div>

          {/* Schedule & Guests */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Schedule &amp; Guests</p>
            <p className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <FiCalendar className="w-3.5 h-3.5 text-blue-500" /> Date: <span className="font-semibold">{booking.date}</span>
            </p>
            <p className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <FiClock className="w-3.5 h-3.5 text-blue-500" /> Slot: <span className="font-semibold">{booking.timeSlot}</span>
            </p>
            <p className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <FiUser className="w-3.5 h-3.5 text-blue-500" /> Guests: <span className="font-semibold">{booking.participants} person{booking.participants > 1 ? 's' : ''}</span>
            </p>
          </div>

          {/* Pricing & Actions */}
          <div className="flex flex-col justify-between space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pricing &amp; Payment</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {booking.currency} {booking.price.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">Payment: {booking.paymentMethod}</p>
            </div>

            {/* Actions if Pending */}
            {booking.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onAccept(booking._id)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <FiCheck className="w-4 h-4" /> Accept
                </button>
                <button
                  onClick={() => onDecline(booking._id)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <FiX className="w-4 h-4" /> Decline
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Booking Details */}
        {booking.bookingDetails && booking.bookingDetails.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Additional Information</p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-600">
              {booking.bookingDetails.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5">
                  <span className="font-semibold text-slate-700">{item.label}: </span>
                  <span className="text-slate-600">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AcceptBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const response = await activityAPI.getBookings();
        const bookingList = response?.data?.data || response?.data || [];
        setBookings(Array.isArray(bookingList) ? bookingList : []);
      } catch (error) {
        showToast(error.message || 'Unable to load bookings', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleAccept = async (id) => {
    try {
      const response = await activityAPI.updateBookingStatus(id, 'confirmed');
      const updatedBooking = response?.data?.data || response?.data || {};
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: updatedBooking?.status || 'confirmed' } : b)));
      setConfirmedBooking(getBookingDisplay(updatedBooking));
      showToast('Booking confirmed successfully!');
    } catch (error) {
      showToast(error.message || 'Unable to confirm booking', 'error');
    }
  };

  const handleDecline = async (id) => {
    try {
      const response = await activityAPI.updateBookingStatus(id, 'cancelled');
      const updatedBooking = response?.data?.data || response?.data || {};
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: updatedBooking?.status || 'cancelled' } : b)));
      showToast('Booking cancelled', 'error');
    } catch (error) {
      showToast(error.message || 'Unable to cancel booking', 'error');
    }
  };

  const handleModalClose = () => {
    setConfirmedBooking(null);
  };

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...bookings].map(getBookingDisplay);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.customerName.toLowerCase().includes(q) ||
          b.date.toLowerCase().includes(q) ||
          b.activityTitle.toLowerCase().includes(q) ||
          b.bookingRef.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== 'All') {
      list = list.filter((b) => b.status === filterStatus.toLowerCase());
    }

    const parseDate = (value) => {
      if (!value) return new Date(0);
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? new Date(0) : date;
    };

    if (sortOrder === 'Newest') {
      list = list.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    } else if (sortOrder === 'Oldest') {
      list = list.sort((a, b) => parseDate(a.date) - parseDate(b.date));
    }

    return list;
  }, [bookings, search, filterStatus, sortOrder]);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <ActivityProviderSidebar />

      <div className="flex-1 flex flex-col">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg border animate-[slideIn_0.2s_ease] ${toast.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
            {toast.msg}
          </div>
        )}

        {/* Hero */}
        <div className="relative overflow-hidden" style={{ height: '280px' }}>
          <img
            src={heroBanner}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 px-7 h-full flex flex-col justify-end pb-6 text-white">
            <h2 className="text-2xl font-bold tracking-tight">Accept Bookings</h2>
            <p className="text-slate-200 text-sm mt-1">Review and manage incoming activity booking requests</p>
          </div>
        </div>

        <div className="flex-1 px-6 py-5">

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 mb-5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{bookings.length}</p>
              <p className="text-xs text-slate-400 mt-1">Total Requests</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-amber-500">{pendingCount}</p>
              <p className="text-xs text-slate-400 mt-1">Pending</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{confirmedCount}</p>
              <p className="text-xs text-slate-400 mt-1">Confirmed</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-rose-500">{cancelledCount}</p>
              <p className="text-xs text-slate-400 mt-1">Cancelled</p>
            </div>
          </div>

          {/* Search + Filter bar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 mb-5">
            {/* Search */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 mb-4">
              <FiSearch className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by customer name, activity, date, or booking ref..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder-slate-400"
              />
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {['All', 'Pending', 'Confirmed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${filterStatus === st
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none px-4 py-2 rounded-full text-xs font-medium border border-slate-200 bg-white text-slate-600 outline-none cursor-pointer hover:border-slate-400 pr-7"
                >
                  <option value="Newest">Sort by: Newest</option>
                  <option value="Oldest">Sort by: Oldest</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▾</span>
              </div>
            </div>
          </div>

          {/* Booking cards */}
          {loading ? (
            <div className="text-center py-20 text-slate-500">Loading bookings…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <div className="text-5xl mb-3">📋</div>
              <h4 className="text-base font-medium text-slate-700 mb-2">No bookings found</h4>
              <p className="text-sm text-slate-400">
                {search ? 'Try adjusting your search or filters' : 'Booking requests will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))}
            </div>
          )}
        </div>

        <style>{`
          @keyframes slideIn {
            from { transform: translateX(20px); opacity: 0; }
            to   { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to   { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>

      {/* Confirmation Modal */}
      {confirmedBooking && (
        <ConfirmationModal
          booking={confirmedBooking}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AcceptBookings;