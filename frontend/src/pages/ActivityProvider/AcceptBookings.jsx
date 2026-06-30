import { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import ActivityProviderSidebar from '../../components/ActivityProviderSidebar';
import heroBanner from '../../assets/safari.png';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
  {
    _id: 'b1',
    touristName: 'John Doe',
    touristCountry: 'USA',
    date: '12 Mar 2026',
    service: 'Yala National Park Safari',
    pickup: 'Colombo Hotel',
    specialRequest: 'Extra child seat',
    serviceType: 'Hiking & Adventure',
    dropoff: 'Yala National Park',
    price: 8500,
    status: 'pending',
    scheduledPickup: '06:00 AM',
    activityTitle: 'Yala National Park Safari',
    timeSlot: '06:00 AM – 12:00 PM',
    guests: '2 Adults',
    bookingRef: 'IE-YALA-123456',
    subtotal: 17000,
    addon: 'Private Guide (LKR 2,500)',
    tax: 1950,
    total: 21450,
  },
  {
    _id: 'b2',
    touristName: 'Emma Wilson',
    touristCountry: 'UK',
    date: '15 Mar 2026',
    service: 'Sigiriya Rock Fortress Tour',
    pickup: 'Dambulla Hotel',
    specialRequest: 'Wheelchair accessible route',
    serviceType: 'Sightseeing',
    dropoff: 'Sigiriya',
    price: 7500,
    status: 'pending',
    scheduledPickup: '07:30 AM',
    activityTitle: 'Sigiriya Rock Fortress Tour',
    timeSlot: '07:30 AM – 11:30 AM',
    guests: '3 Adults',
    bookingRef: 'IE-SIG-789012',
    subtotal: 22500,
    addon: 'None',
    tax: 2250,
    total: 24750,
  },
  {
    _id: 'b3',
    touristName: 'Hans Müller',
    touristCountry: 'Germany',
    date: '18 Mar 2026',
    service: 'Ella Hiking Adventure',
    pickup: 'Ella Train Station',
    specialRequest: 'Extra luggage storage needed',
    serviceType: 'Hiking & Adventure',
    dropoff: 'Little Adams Peak',
    price: 6500,
    status: 'pending',
    scheduledPickup: '05:30 AM',
    activityTitle: 'Ella Hiking Adventure',
    timeSlot: '05:30 AM – 10:00 AM',
    guests: '2 Adults, 1 Child',
    bookingRef: 'IE-ELLA-345678',
    subtotal: 19500,
    addon: 'Gear Rental (LKR 1,500)',
    tax: 2100,
    total: 23100,
  },
  {
    _id: 'b4',
    touristName: 'Sophie Martin',
    touristCountry: 'France',
    date: '20 Mar 2026',
    service: 'Weligama Beach Surf Lessons',
    pickup: 'Weligama Beach Hotel',
    specialRequest: 'None',
    serviceType: 'Water Sports',
    dropoff: 'Weligama Beach',
    price: 4500,
    status: 'pending',
    scheduledPickup: '08:00 AM',
    activityTitle: 'Weligama Beach Surf Lessons',
    timeSlot: '08:00 AM – 11:00 AM',
    guests: '1 Adult',
    bookingRef: 'IE-SURF-901234',
    subtotal: 4500,
    addon: 'None',
    tax: 450,
    total: 4950,
  },
  {
    _id: 'b6',
    touristName: 'Carlos Mendez',
    touristCountry: 'Brazil',
    date: '25 Mar 2026',
    service: 'Mirissa Whale Watching',
    pickup: 'Mirissa Beach',
    specialRequest: 'Sea sickness medication needed',
    serviceType: 'Water Sports',
    dropoff: 'Mirissa Harbour',
    price: 5500,
    status: 'pending',
    scheduledPickup: '06:30 AM',
    activityTitle: 'Mirissa Whale Watching',
    timeSlot: '06:30 AM – 11:00 AM',
    guests: '2 Adults',
    bookingRef: 'IE-WHALE-112233',
    subtotal: 11000,
    addon: 'Breakfast Pack (LKR 1,200)',
    tax: 1220,
    total: 13420,
  }
];

// eslint-disable-next-line no-unused-vars
const CATEGORY_COLORS = {
  'Hiking & Adventure': 'bg-green-100 text-green-700',
  'Safari':             'bg-yellow-100 text-yellow-700',
  'Water Sports':       'bg-blue-100 text-blue-700',
  'Cultural':           'bg-purple-100 text-purple-700',
  'Wellness':           'bg-pink-100 text-pink-700',
  'Food & Cuisine':     'bg-orange-100 text-orange-700',
  'Sightseeing':        'bg-indigo-100 text-indigo-700',
};

const COUNTRY_FLAGS = {
  'USA': '🇺🇸', 'UK': '🇬🇧', 'Germany': '🇩🇪', 'France': '🇫🇷',
  'Australia': '🇦🇺', 'Canada': '🇨🇦', 'Japan': '🇯🇵', 'India': '🇮🇳',
  'Brazil': '🇧🇷', 'Sri Lanka': '🇱🇰', 'Singapore': '🇸🇬',
};

const getFlag = (country) => COUNTRY_FLAGS[country] || '🌍';

// ─── Confirmation Modal ───────────────────────────────────────────────────────
const ConfirmationModal = ({ booking, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[slideUp_0.2s_ease]">
      {/* Green header */}
      <div className="flex flex-col items-center pt-8 pb-5 px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4 shadow-lg shadow-green-200">
          <span className="text-white text-3xl">✓</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">
          Booking Accepted &amp; Confirmed!
        </h2>
      </div>

      {/* Details */}
      <div className="px-8 pb-6 border-t border-gray-100">
        <div className="mt-5 space-y-2 text-sm">
          {[
            ['Booking Reference:', booking.bookingRef],
            ['Activity:', booking.activityTitle],
            ['Date:', booking.date],
            ['Guests:', booking.guests],
            ['Private Guide Add-on:', booking.addon !== 'None' ? 'Yes' : 'No'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-slate-500">{label}</span>
              <span className="text-slate-800 font-medium text-right max-w-[60%]">{value}</span>
            </div>
          ))}
        </div>

        {/* Payment summary */}
        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-700 mb-2">Payment Summary</p>
          <ul className="text-sm space-y-1 text-slate-600 list-disc list-inside">
            <li>Subtotal: ${booking.subtotal}.00</li>
            {booking.addon !== 'None' && <li>Add-on: {booking.addon}</li>}
            <li>Tax: ${booking.tax}.00</li>
            <li className="font-semibold text-slate-800">Total Paid: ${booking.total}.00</li>
          </ul>
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          A confirmation email with your digital ticket has been sent to your registered email address.
        </p>

        <button
          onClick={onClose}
          className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-xl transition-colors"
        >
          Back to Activities
        </button>
      </div>
    </div>

    <style>{`
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to   { transform: none; opacity: 1; }
      }
    `}</style>
  </div>
);

// ─── Booking Card ─────────────────────────────────────────────────────────────
const BookingCard = ({ booking, onAccept, onDecline }) => {
  const isConfirmed = booking.status === 'confirmed';
  const isDeclined  = booking.status === 'declined';

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
      isConfirmed ? 'border-green-200' : isDeclined ? 'border-red-100 opacity-60' : 'border-gray-100'
    }`}>
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
            <span className="text-slate-500 text-lg">👤</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {booking.touristName} {getFlag(booking.touristCountry)} {booking.touristCountry}
            </p>
            <p className="text-xs text-slate-400">Date: {booking.date}</p>
          </div>
        </div>

        {/* Status badge */}
        <span className={`text-xs font-semibold px-4 py-1.5 rounded-full ${
          isConfirmed
            ? 'bg-blue-600 text-white'
            : isDeclined
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-500'
        }`}>
          {isConfirmed ? 'Confirmed' : isDeclined ? 'Declined' : 'Pending'}
        </span>
      </div>

      <div className="border-t border-gray-100" />

      {/* Card body */}
      <div className="px-5 py-4">
        {isConfirmed ? (
          /* ── Confirmed expanded view ──────────────────────────────────── */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {/* Left */}
            <div className="space-y-1 text-slate-600">
              <p><span className="font-medium">Service:</span> {booking.service}</p>
              <p><span className="font-medium">Pickup:</span> {booking.pickup}</p>
              <p><span className="font-medium">Request:</span> {booking.specialRequest}</p>
            </div>

            {/* Middle: service summary */}
            <div className="space-y-1 text-slate-600">
              <p className="font-semibold text-slate-700 mb-2">Service Summary</p>
              <p>Service: {booking.serviceType} (Accepted)</p>
              <p>Final Price: LKR {booking.price.toLocaleString()}</p>
            </div>

            {/* Right: detailed itinerary */}
            <div className="text-slate-600">
              <p className="font-semibold text-slate-700 mb-2">Detailed Itinerary:</p>
              <ul className="space-y-1 list-disc list-inside text-xs">
                <li>Date: {booking.date}</li>
                <li>Pickup: {booking.pickup}</li>
                <li>Scheduled Pickup: {booking.scheduledPickup}</li>
                <li>Drop-off: {booking.dropoff}</li>
                {booking.specialRequest !== 'None' && (
                  <li>Additional: {booking.specialRequest} included</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          /* ── Pending view ─────────────────────────────────────────────── */
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left info */}
            <div className="flex items-start gap-3 text-sm text-slate-600">
              <span className="text-slate-400 mt-0.5">👤</span>
              <div className="space-y-0.5">
                <p><span className="font-medium">Service:</span> {booking.service}</p>
                <p><span className="font-medium">Pickup:</span> {booking.pickup}</p>
                <p><span className="font-medium">Request:</span> {booking.specialRequest}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-14 bg-gray-100" />

            {/* Right: price + route + actions */}
            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  <p className="font-medium">Service Type: {booking.serviceType}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Drop-off: {booking.pickup} → {booking.dropoff}
                  </p>
                </div>
                <p className="text-base font-bold text-slate-800 ml-4">
                  LKR {booking.price.toLocaleString()}
                </p>
              </div>

              {!isDeclined && (
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => onAccept(booking._id)}
                    className="flex-1 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onDecline(booking._id)}
                    className="flex-1 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AcceptBookings = () => {
  const [bookings, setBookings]         = useState(MOCK_BOOKINGS);
  const [search, setSearch]             = useState('');
  const [filterService, setFilterService] = useState('All Services');
  // eslint-disable-next-line no-unused-vars
  const [filterDate, setFilterDate]     = useState('All Dates');
  const [sortOrder, setSortOrder]       = useState('Newest');
  const [confirmedBooking, setConfirmedBooking] = useState(null); // for modal
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAccept = (id) => {
    const booking = bookings.find((b) => b._id === id);
    setBookings((prev) =>
      prev.map((b) => b._id === id ? { ...b, status: 'confirmed' } : b)
    );
    setConfirmedBooking(booking);
  };

  const handleDecline = (id) => {
    setBookings((prev) =>
      prev.map((b) => b._id === id ? { ...b, status: 'declined' } : b)
    );
    showToast('Booking declined', 'error');
  };

  const handleModalClose = () => {
    setConfirmedBooking(null);
    showToast('Booking confirmed successfully!');
  };

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...bookings];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.touristName.toLowerCase().includes(q) ||
          b.date.toLowerCase().includes(q) ||
          b.activityTitle.toLowerCase().includes(q)
      );
    }

    if (filterService !== 'All Services') {
      list = list.filter((b) => b.service === filterService);
    }

    if (sortOrder === 'Newest') {
      list = list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === 'Oldest') {
      list = list.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Show confirmed first, then pending, then declined
    list = list.sort((a, b) => {
      const order = { confirmed: 0, pending: 1, declined: 2 };
      return order[a.status] - order[b.status];
    });

    return list;
  }, [bookings, search, filterService, sortOrder]);

  const pendingCount   = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <ActivityProviderSidebar />

      <div className="flex-1 flex flex-col">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg border animate-[slideIn_0.2s_ease] ${
            toast.type === 'success'
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
            <p className="text-slate-200 text-sm mt-1">Manage your booking requests</p>
          </div>
        </div>

        <div className="flex-1 px-6 py-5">

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{bookings.length}</p>
              <p className="text-xs text-slate-400 mt-1">Total Requests</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
              <p className="text-xs text-slate-400 mt-1">Pending</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
              <p className="text-xs text-slate-400 mt-1">Confirmed</p>
            </div>
          </div>

          {/* Search + Filter bar */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 mb-5">
            {/* Search */}
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 mb-4">
              <FiSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by tourist name or date..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder-gray-400"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-1.5 rounded-full transition-colors">
                Filter
              </button>
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2">
              {['All Services', 'Driver', 'Guide'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterService(s)}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${
                    filterService === s
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white border-gray-200 text-slate-600 hover:border-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}

              <button className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${
                filterDate === 'All Dates'
                  ? 'bg-white border-gray-200 text-slate-600'
                  : 'bg-slate-800 text-white border-slate-800'
              }`}>
                All Dates
              </button>

              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none px-4 py-2 rounded-full text-xs font-medium border border-gray-200 bg-white text-slate-600 outline-none cursor-pointer hover:border-gray-400 pr-7"
                >
                  <option value="Newest">Sort by: Newest</option>
                  <option value="Oldest">Sort by: Oldest</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]">▾</span>
              </div>

              <button className="px-4 py-2 rounded-full text-xs font-medium border border-gray-200 bg-white text-slate-600 hover:border-gray-400 transition-colors">
                Filter
              </button>
            </div>
          </div>

          {/* Booking cards */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-3">📋</div>
              <h4 className="text-base font-medium text-slate-700 mb-2">No bookings found</h4>
              <p className="text-sm text-slate-400">
                {search ? 'Try adjusting your search' : 'Booking requests will appear here'}
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