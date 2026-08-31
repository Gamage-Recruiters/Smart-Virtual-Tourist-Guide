import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaFilter, FaCalendarAlt, FaTimes, FaEnvelope } from 'react-icons/fa';
import Header from '../../components/HotelOwner/Header';
import Footer from '../../components/HotelOwner/Footer';
import reservation from "../../assets/HotelOwner/reservation.png";
import apiClient from '../../services/api';

const MENU_OPTIONS = ['checked-in', 'no-show', 'checked-out', 'Cancel','ok'];
const CANCELLATION_REASONS = ['Guest request', 'No-show', 'Emergency (hotel issue)', 'Other'];
const STATUS_CHANGED_STORAGE_KEY = 'hotelReservationStatusChangedIds';
const optionColors = {
  ok: 'text-green-600',
  'checked-in': 'text-blue-600',
  'checked-out': 'text-slate-500',
  'no-show': 'text-orange-500',
  Cancel: 'text-red-600',
};

const STATUS_STYLES = {
  ok:            'text-green-600',
  'checked-in':  'text-blue-600',
  'checked-out': 'text-slate-500',
  cancelled:     'text-rose-500',
  'no-show':     'text-orange-500',
  pending:       'text-yellow-500',
};

const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const getSriLankanDate = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Colombo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

const getBookedTimestamp = (booking) => {
  const timestamp = Date.parse(booking.bookedDate || '');
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
};

function MiniCalendar({ onSelect, onClose }) {
  const today = new Date(`${getSriLankanDate()}T00:00:00`);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prev = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const next = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const pick = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    onSelect(`${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`);
    onClose();
  };

  return (
    <div ref={ref} className="absolute z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-3 w-64 top-full mt-1 left-0">
      <div className="flex justify-between items-center mb-2">
        <button onClick={prev} className="text-slate-400 hover:text-slate-700 px-1"><FaChevronLeft /></button>
        <span className="text-xs font-bold text-slate-700">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button onClick={next} className="text-slate-400 hover:text-slate-700 px-1"><FaChevronRight /></button>
      </div>
      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-1">
        {DAYS.map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 text-center text-xs gap-0.5">
        {[...Array(firstDay)].map((_,i) => <div key={i} />)}
        {[...Array(daysInMonth)].map((_,i) => (
          <button key={i+1} onClick={() => pick(i+1)}
            className="py-1 rounded hover:bg-blue-100 hover:text-blue-700 text-slate-700">
            {i+1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ViewRoomReservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateOf, setDateOf] = useState('');
  const [fromDate, setFromDate] = useState(getSriLankanDate);
  const [appliedFilter, setAppliedFilter] = useState(null);
  const [showFromCal, setShowFromCal] = useState(false);
  const [checkedStatuses, setCheckedStatuses] = useState(new Set());
  const [statusChangedIds, setStatusChangedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(STATUS_CHANGED_STORAGE_KEY) || '[]'));
    } catch {
      return new Set();
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [openGuestId, setOpenGuestId] = useState(null);
  const [guestInfoPos, setGuestInfoPos] = useState({ top: 0, left: 0 });
  const [cancellationBooking, setCancellationBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [otherCancellationReason, setOtherCancellationReason] = useState('');
  const [accountablePerson, setAccountablePerson] = useState('');
  const [accountablePersonError, setAccountablePersonError] = useState('');
  const [cancellationReasonError, setCancellationReasonError] = useState('');
  const [refundType, setRefundType] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundError, setRefundError] = useState('');
  const [emailBooking, setEmailBooking] = useState(null);
  const [emailMessage, setEmailMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const toggleStatus = (status) => {
    setCheckedStatuses(prev => prev.has(status) ? new Set() : new Set([status]));
  };

  const handleShow = () => {
    if (!dateOf || !fromDate) return;
    const fieldMap = { 'Check In': 'checkIn', 'Check Out': 'checkOut', 'Booked Date': 'bookedDate' };
    setAppliedFilter({ field: fieldMap[dateOf], day: fromDate });
  };

  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const updateMenuPos = (id) => {
    const btn = document.getElementById(`menu-btn-${id}`);
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setMenuPos({ top: r.bottom + 4, left: r.left });
  };

  const getFullName = (customer) => {
    if (!customer) return 'Guest';
    if (customer.fullName?.trim()) return customer.fullName.trim();
    const first = customer.firstName?.trim() || '';
    const last = customer.lastName?.trim() || '';
    return `${first} ${last}`.trim() || 'Guest';
  };

  const displayedReservations = reservations
    .filter(r => {
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const nameMatch = getFullName(r.customer).toLowerCase().includes(q);
        const bookingMatch = r.bookingNo?.toLowerCase().includes(q);
        return nameMatch || bookingMatch;
      }
      if (r.status === 'pending') return checkedStatuses.has('pending');
      return checkedStatuses.size === 0 || checkedStatuses.has(r.status);
    })
    .filter(r => {
      if (!appliedFilter) return true;
      const val = r[appliedFilter.field];
      if (!val) return false;
      return val.slice(0, 10) === appliedFilter.day;
    })
    .sort((a, b) => getBookedTimestamp(b) - getBookedTimestamp(a));

  useEffect(() => {
    apiClient.get('/users/bookings')
      .then(data => setReservations(data.bookings || []))
      .catch(() => setError('Failed to load reservations.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!openMenuId) return;
    const close = () => setOpenMenuId(null);
    const reposition = () => updateMenuPos(openMenuId);
    window.addEventListener('click', close);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [openMenuId]);

  useEffect(() => {
    if (!openGuestId) return;
    const close = () => setOpenGuestId(null);
    window.addEventListener('click', close);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [openGuestId]);

  const toggleGuestInfo = (event, item) => {
    event.stopPropagation();
    if (openGuestId === item._id) {
      setOpenGuestId(null);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    setGuestInfoPos({ top: bounds.bottom + 8, left: bounds.left });
    setOpenGuestId(item._id);
  };

  const showToast = (message) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(''), 3000);
  };

  const markStatusChanged = (bookingId) => {
    setStatusChangedIds(previousIds => {
      const nextIds = new Set(previousIds).add(bookingId);
      localStorage.setItem(STATUS_CHANGED_STORAGE_KEY, JSON.stringify([...nextIds]));
      return nextIds;
    });
  };

  const handleMenuAction = async (action, item) => {
    setOpenMenuId(null);
    if (item.status === 'cancelled') return;
    if (action !== 'Cancel') {
      try {
        await apiClient.put(`/bookings/${item._id}`, { status: action });
        setReservations(prev => prev.map(reservationItem => (
          reservationItem._id === item._id
            ? { ...reservationItem, status: action }
            : reservationItem
        )));
        markStatusChanged(item._id);
      } catch (requestError) {
        showToast(requestError.message || 'Unable to update booking status');
      }
      return;
    }
    if (action === 'Cancel') {
      setCancellationBooking(item);
      setCancellationReason('');
      setOtherCancellationReason('');
      setAccountablePerson('');
      setAccountablePersonError('');
      setCancellationReasonError('');
      setRefundType(null);
      setRefundAmount('');
      setRefundError('');
      return;
    }
  };

  const closeCancellationModal = () => {
    setCancellationBooking(null);
    setOtherCancellationReason('');
    setAccountablePerson('');
    setAccountablePersonError('');
    setCancellationReason('');
    setCancellationReasonError('');
    setRefundType(null);
    setRefundAmount('');
    setRefundError('');
  };

  const closeEmailModal = () => {
    setEmailBooking(null);
    setEmailMessage('');
  };

  const sendEmail = () => {
    closeEmailModal();
    showToast('Email sent (frontend only)');
  };

  const confirmCancellation = async () => {
    const hasAccountablePerson = Boolean(accountablePerson.trim());
    const hasCancellationReason = Boolean(cancellationReason);
    const resolvedCancellationReason = cancellationReason === 'Other'
      ? otherCancellationReason.trim()
      : cancellationReason;
    setAccountablePersonError(hasAccountablePerson ? '' : 'Please enter the accountable person’s name.');
    setCancellationReasonError(
      hasCancellationReason && resolvedCancellationReason
        ? ''
        : 'Please select a reason for cancellation.'
    );
    if (!hasAccountablePerson || !hasCancellationReason || !resolvedCancellationReason) return;

    const fullAmount = Number(cancellationBooking?.bookingPrice) || 0;
    const selectedAmount = Number(refundAmount);
    if (refundType === 'partial' && (refundAmount === '' || selectedAmount < 0 || selectedAmount > fullAmount)) {
      setRefundError(`Partial refund must be between 0 and ${fullAmount}.`);
      return;
    }
    try {
      await apiClient.put(`/bookings/${cancellationBooking._id}/cancel`, {
        refundType,
        refundAmount: refundType ? selectedAmount : 0,
        refundReason: resolvedCancellationReason,
        accountablePerson: accountablePerson.trim(),
      });
      setReservations(prev => prev.map(item => (
        item._id === cancellationBooking._id ? { ...item, status: 'cancelled' } : item
      )));
      markStatusChanged(cancellationBooking._id);
      closeCancellationModal();
      showToast('Booking cancellation confirmed');
    } catch (requestError) {
      showToast(requestError.message || 'Unable to cancel booking');
    }
  };

  const fullRefundAmount = Number(cancellationBooking?.bookingPrice) || 0;

  const toggleRefundType = (type) => {
    if (refundType === type) {
      setRefundType(null);
      setRefundAmount('');
      setRefundError('');
      return;
    }
    setRefundType(type);
    setRefundAmount(type === 'full' ? String(fullRefundAmount) : '');
    setRefundError('');
  };

  return (
    <div className="w-full bg-[#EBF7FF] min-h-screen text-slate-700">
      <Header />
      {/* 1. SCENIC TROPICAL HERO BANNER SECTION */}
       <section 
                className="relative h-screen w-full flex flex-col items-center justify-center px-4 bg-cover bg-center"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1)), url(${reservation})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 20%'
                }}
              >
      <div className="flex max-w-3xl flex-col items-start gap-9 w-full ml-[200] mb-[50px]">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    View Room Reservations
                  </h1>
      
                  <p className="text-base md:text-2xl text-slate-800 font-medium">
                   View  Room Reservation and Manage Booking Dates Easily. 
                  </p>
      
                  <div className="relative w-full max-w-md shadow-md rounded-full">
                    <input 
                      type="text" 
                      placeholder="Explore Reservation" 
                      className="w-full px-6 py-3.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none pr-12"
                    />
                    <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                  </div>
                </div>
              </section>

      {/* Page Layout Title Label */}
      <div className="max-w-8xl mx-auto px-4 md:px-8 mt-12">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Room's Reservation</h2>
      </div>

      {/* 2. MAIN RESERVATION PANEL WRAPPER */}
      <main className="max-w-8xl mx-auto px-4 md:px-8 mt-6">
        <div className="bg-white rounded shadow-[0_15px_40px_rgba(0,0,0,0.03)] p-6 md:p-8 border border-slate-100">
          
          {/* Top Dates Filter Form Controls Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Date Of</label>
              <select
                value={dateOf}
                onChange={e => setDateOf(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none">
                <option value="" disabled>Select date type</option>
                <option>Check In</option>
                <option>Check Out</option>
                <option>Booked Date</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Day</label>
              <div className="relative">
                <input readOnly value={fromDate} placeholder="e.g. 2026-03-20"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-600 focus:outline-none pr-14 bg-slate-50/50 cursor-pointer"
                  onClick={() => { setShowFromCal(v => !v); }} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {fromDate && <FaTimes onClick={() => setFromDate('')} className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer" />}
                  <FaCalendarAlt onClick={() => { setShowFromCal(v => !v); }} className="text-slate-400 text-xs cursor-pointer" />
                </div>
                {showFromCal && <MiniCalendar onSelect={setFromDate} onClose={() => setShowFromCal(false)} />}
              </div>
            </div>


            <div className="flex items-center gap-2">
              <button onClick={handleShow} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-xs transition-colors h-9 shadow-sm">
                Show
              </button>
              {appliedFilter && (
                <button
                  onClick={() => { setAppliedFilter(null); setFromDate(''); setDateOf(''); }}
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-300 bg-white text-slate-500 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-500 transition-colors shadow-sm"
                  title="Clear filter"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
          </div>

          {/* Configuration Legend Filters Area */}
          <div className="bg-slate-100 border border-slate-100 rounded-none p-8 md:p-10 mb-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Column 1: Reservation Statuses */}
            <div>
              <p className="text-sm font-extrabold text-slate-900 mb-3">Reservation Statues</p>
              <div className="space-y-2 text-xs font-medium text-slate-700">
                {[['ok', 'Ok'], ['cancelled', 'Canceled'], ['no-show', 'No-Show']].map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={checkedStatuses.has(val)} onChange={() => toggleStatus(val)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3 h-3" />
                    {label}
                  </label>
                ))}
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={checkedStatuses.has('pending')} onChange={() => toggleStatus('pending')}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3 h-3" />
                  Pending
                </label>
              </div>
            </div>

            {/* Column 2: Guest Communications */}
            <div>
              <p className="text-sm font-extrabold text-slate-900 mb-3">Guest Communication</p>
              <div className="space-y-2 text-xs font-medium text-slate-700">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3 h-3" /> Pending Guest Request
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3 h-3" /> Invoice Required
                </label>
              </div>
            </div>

            {/* Column 3: Custom Search Input */}
            <div>
              <p className="text-sm font-extrabold text-slate-900 mb-2.5">Guest Name or Booking Number</p>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-sm px-3 py-1.5 text-xs focus:outline-none shadow-sm placeholder-slate-300"
                placeholder="Ex: Daniel Nightingale"
              />
            </div>
          </div>

          {/* 3. DYNAMIC CONTENT RESERVATION DATA TABLE */}
          <div className="w-full overflow-x-auto overflow-y-hidden overflow-visible relative">
            {loading ? (
              <p className="text-sm text-slate-500 py-6 text-center">Loading reservations...</p>
            ) : error ? (
              <p className="text-sm text-rose-500 py-6 text-center">{error}</p>
            ) : (
            <table className="w-full border-collapse text-left text-sm min-w-250" style={{tableLayout:'fixed'}}>
              <thead>
                <tr className="border-b border-slate-200 text-slate-900">
                  <th className="py-3 px-4 text-sm font-extrabold text-slate-900">Guest Name</th>
                  <th className="py-3 px-4 text-sm font-extrabold text-slate-900">Check In</th>
                  <th className="py-3 px-4 text-sm font-extrabold text-slate-900">Check Out</th>
                  <th className="py-3 px-4 text-sm font-extrabold text-slate-900">Rooms</th>
                  <th className="py-3 px-4 text-sm font-extrabold text-slate-900">Booked Date</th>
                  <th className="py-3 px-4 text-sm font-extrabold text-slate-900">Status</th>
                  <th className="py-3 px-4 text-sm font-extrabold text-slate-900">Price</th>
                  <th className="py-3 px-4 text-sm font-extrabold text-slate-900">Booking NO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayedReservations.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors h-[60px]">
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={(event) => toggleGuestInfo(event, item)}
                        className="text-sm font-bold text-blue-600 cursor-pointer hover:underline text-left"
                      >
                        {getFullName(item.customer)}
                      </button>
                      <p className="text-xs text-slate-400 mt-0.5">{item.adultCount} adults, {item.childCount} child</p>
                      {openGuestId === item._id && (
                        <div
                          onClick={(event) => event.stopPropagation()}
                          className="fixed z-50 w-64 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-xl"
                          style={{ top: guestInfoPos.top, left: guestInfoPos.left }}
                        >
                          <div className="space-y-2 text-xs text-slate-600">
                            <p><span className="font-semibold text-slate-900">Country:</span> {item.guestCountry || item.customer?.country || 'Country not provided'}</p>
                            <p><span className="font-semibold text-slate-900">Email:</span> {item.customer?.email || 'Not provided'}</p>
                            <p><span className="font-semibold text-slate-900">Phone:</span> {item.customer?.phone || item.customer?.contactNumber || 'Not provided'}</p>
                            <p><span className="font-semibold text-slate-900">Room number:</span> {item.roomNo || 'Not provided'}</p>

                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-slate-600">{item.checkIn}</td>
                    <td className="py-4 px-4 text-sm font-medium text-slate-600">{item.checkOut}</td>
                    <td className="py-4 px-4 text-sm font-medium text-slate-700">{item.roomName}</td>
                    <td className="py-4 px-4 text-sm font-medium text-slate-600">{item.bookedDate}</td>
                    <td className="py-4 px-4">
                      <div className="relative inline-flex items-center gap-2">
                        <span className={`text-sm font-extrabold ${STATUS_STYLES[item.status] || 'text-slate-600'}`}>
                          {item.status}
                        </span>
                        <button
                          id={`menu-btn-${item._id}`}
                          disabled={item.status === 'cancelled'}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.status === 'cancelled') return;
                            const next = openMenuId === item._id ? null : item._id;
                            setOpenMenuId(next);
                            if (next) updateMenuPos(next);
                          }}
                          className="text-slate-400 hover:text-slate-700 font-bold text-lg leading-none px-1 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-slate-400"
                        >⋮</button>
                        {openMenuId === item._id && (
                          <div
                            className="fixed z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[130px]"
                            style={{ top: menuPos.top, left: menuPos.left }}
                          >
                            {MENU_OPTIONS
                              .filter(() => item.status !== 'cancelled')
                              .filter(option => option !== item.status)
                              .filter(option => !(item.status === 'cancelled' && option === 'Cancel'))
                              .map(option => (
                              <button
                                key={option}
                                onClick={(e) => { e.stopPropagation(); handleMenuAction(option, item); }}
                                className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 ${optionColors[option] || 'text-gray-600'}`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-slate-700">US${item.bookingPrice}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-blue-500 font-medium cursor-pointer hover:underline">
                        {item.bookingNo}
                        </span>
                        {statusChangedIds.has(item._id) && (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setEmailBooking(item);
                              setEmailMessage('');
                            }}
                            className="shrink-0 text-blue-600 hover:text-blue-800"
                            title="Send email"
                            aria-label={`Send email to ${item.customer?.email || 'guest'}`}
                          >
                            <FaEnvelope />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>

        {/* Bottom Footer Table Pagination Bar */}
        <div className="flex items-center justify-start gap-8 border-t border-slate-200 mt-6 pt-6 text-sm font-semibold text-slate-600">
          <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
            <FaChevronLeft className="text-xs" /> Back
          </button>
          <span className="text-slate-500">Page 1</span>
          <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
            Next <FaChevronRight className="text-xs" />
          </button>
        </div>

        {cancellationBooking && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4"
            onClick={closeCancellationModal}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancellation-title"
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 id="cancellation-title" className="text-xl font-extrabold text-slate-900">Confirm Cancellation</h3>
              <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm font-medium leading-5 text-rose-700">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>

              <label htmlFor="cancellation-reason" className="mt-5 block text-sm font-bold text-slate-800">Reason for cancellation</label>
              <select
                id="cancellation-reason"
                value={cancellationReason}
                onChange={(event) => {
                  setCancellationReason(event.target.value);
                  if (event.target.value) setCancellationReasonError('');
                }}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="" disabled>Select a reason</option>
                {CANCELLATION_REASONS.map(reason => <option key={reason}>{reason}</option>)}
              </select>
              {cancellationReasonError && <p className="mt-2 text-xs font-semibold text-rose-600">{cancellationReasonError}</p>}
              {cancellationReason === 'Other' && (
                <input
                  type="text"
                  value={otherCancellationReason}
                  onChange={(event) => setOtherCancellationReason(event.target.value)}
                  placeholder="Enter cancellation reason"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                />
              )}

              <label htmlFor="accountable-person" className="mt-5 block text-sm font-bold text-slate-800">
                Accountable Person <span className="text-rose-600">*</span>
              </label>
              <input
                id="accountable-person"
                type="text"
                value={accountablePerson}
                onChange={(event) => {
                  setAccountablePerson(event.target.value);
                  if (event.target.value.trim()) setAccountablePersonError('');
                }}
                placeholder="Enter staff member name"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
              />
              {accountablePersonError && <p className="mt-2 text-xs font-semibold text-rose-600">{accountablePersonError}</p>}

              <fieldset className="mt-5">
                <legend className="text-sm font-bold text-slate-800">Refund <span className="font-normal text-slate-500">(optional)</span></legend>
                <div className="mt-2 space-y-2 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="refund-type"
                      value="full"
                      checked={refundType === 'full'}
                      onClick={() => toggleRefundType('full')}
                      onChange={() => {}}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    Full Refund
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="refund-type"
                      value="partial"
                      checked={refundType === 'partial'}
                      onClick={() => toggleRefundType('partial')}
                      onChange={() => {}}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    Partial Refund
                  </label>
                </div>
                {refundType && (
                  <>
                    <label htmlFor="refund-amount" className="mt-3 block text-xs font-semibold text-slate-600">Refund amount</label>
                    <input
                      id="refund-amount"
                      type="number"
                      min="0"
                      max={fullRefundAmount}
                      step="0.01"
                      value={refundAmount}
                      readOnly={refundType === 'full'}
                      onChange={(event) => {
                        const value = event.target.value;
                        setRefundAmount(value);
                        const amount = Number(value);
                        setRefundError(amount > fullRefundAmount ? `Refund cannot exceed the full booking amount of ${fullRefundAmount}.` : '');
                      }}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 read-only:bg-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                    <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm italic text-slate-600">
                      Refund: US${refundType === 'full' ? fullRefundAmount : (refundAmount || '0')} will be processed
                    </p>
                    {refundError && <p className="mt-2 text-xs font-semibold text-rose-600">{refundError}</p>}
                  </>
                )}
              </fieldset>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCancellationModal}
                  className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmCancellation}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {emailBooking && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4"
            onClick={closeEmailModal}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="email-title"
              className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 id="email-title" className="text-xl font-extrabold text-slate-900">Inform Status Change</h3>
              <div className="mt-4 space-y-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                <p><span className="font-semibold text-slate-900">Email:</span> {emailBooking.customer?.email || 'Not provided'}</p>
                <p><span className="font-semibold text-slate-900">Phone:</span> {emailBooking.customer?.phone || emailBooking.customer?.contactNumber || 'Not provided'}</p>
              </div>
              <label htmlFor="email-reason" className="mt-5 block text-sm font-bold text-slate-800">Reason message</label>
              <textarea
                id="email-reason"
                value={emailMessage}
                onChange={(event) => setEmailMessage(event.target.value)}
                placeholder="Type the reason message"
                rows="5"
                className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
              />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEmailModal}
                  className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={sendEmail}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[70] rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl" role="status">
            {toastMessage}
          </div>
        )}



        </div>
      </main>
      <Footer />
    </div>
  );
}