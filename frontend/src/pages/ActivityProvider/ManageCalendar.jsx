import { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight, FiEdit3 } from 'react-icons/fi';
import calendarAPI from '../../services/ActivityProvider/calendarAPI.js';
import { activityAPI } from '../../services/ActivityProvider/activityAPI.js';
import ActivityProviderSidebar from '../../components/ActivityProvider/ActivityProviderSidebar.jsx';
import EditAvailabilityModal from './EditAvailabilityModal.jsx';
import heroBanner from '../../assets/hotel.png';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const toDateString = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

// Returns true if dateStr is strictly before today (today itself is NOT locked)
const isPastDate = (dateStr) => {
  const now = new Date();
  const todayStr = toDateString(now.getFullYear(), now.getMonth(), now.getDate());
  return dateStr < todayStr;
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  return `${d} ${MONTH_NAMES[m - 1]} ${y} • ${DAY_NAMES_FULL[dow]}`;
};

const slotBadge = (slot) => `(${slot.booked}/${slot.capacity})`;

const STATUS_CONFIG = {
  available: { label: 'Available', badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
  pending: { label: 'Pending', badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200', dot: 'bg-blue-500' },
  fully_booked: { label: 'Fully Booked', badge: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200', dot: 'bg-rose-500' },
  unavailable: { label: 'Unavailable', badge: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200', dot: 'bg-slate-400' },
};

// ─── Hero Banner ──────────────────────────────────────────────────────────────
const HeroBanner = () => (
  <div className="relative overflow-hidden" style={{ height: '280px' }}>
    <img
      src={heroBanner}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 px-7 h-full flex flex-col justify-end pb-6 text-white">
      <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
        Activity Management
      </p>
      <h2 className="text-2xl font-bold tracking-tight">Manage Calendar</h2>
      <p className="text-slate-200 text-sm mt-1">
        Control availability, time slots, and bookings for your activity.
      </p>
    </div>
  </div>
);

const ManageCalendar = () => {
  const today = new Date();

  const [activities, setActivities] = useState([]);
  const [currentActivityId, setCurrentActivityId] = useState('');

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const [monthData, setMonthData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateDetail, setDateDetail] = useState(null);
  const [summary, setSummary] = useState({ todayBookings: 0, monthActiveDays: 0, earnings: 0 });

  const [loadingDate, setLoadingDate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Load provider's activities ───────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await activityAPI.getAll();
        const list = res.data?.data || [];
        if (!mounted) return;
        setActivities(list);
        if (list.length) setCurrentActivityId(list[0]._id);
      } catch (err) {
        console.error('Failed to load activities', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // ── Fetch month dots ─────────────────────────────────────────────────────────
  const fetchMonth = useCallback(async (actId = currentActivityId, yr = viewYear, mo = viewMonth) => {
    if (!actId) return;
    try {
      const res = await calendarAPI.getMonth(actId, yr, mo + 1);
      const map = {};
      (res.data?.data || []).forEach((e) => { map[e.date] = e.status; });
      setMonthData(map);
    } catch (err) {
      console.error('Failed to fetch month data', err);
      setMonthData({});
    }
  }, [currentActivityId, viewYear, viewMonth]);

  // ── Select a date ────────────────────────────────────────────────────────────
  const selectDate = useCallback(async (dateStr, actId = currentActivityId) => {
    if (!actId || !dateStr) return;
    setSelectedDate(dateStr);
    setLoadingDate(true);
    try {
      const res = await calendarAPI.getDate(actId, dateStr);
      setDateDetail(res.data?.data || null);
    } catch {
      showToast('Failed to load date details', 'error');
      setDateDetail(null);
    } finally {
      setLoadingDate(false);
    }
  }, [currentActivityId]);

  // ── Sync calendar details when activity, month, or year changes ──────────────
  useEffect(() => {
    if (!currentActivityId) {
      setMonthData({});
      setDateDetail(null);
      setSummary({ todayBookings: 0, monthActiveDays: 0, earnings: 0 });
      return;
    }

    const now = new Date();
    const todayStr = toDateString(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = selectedDate || todayStr;

    if (!selectedDate) {
      setSelectedDate(todayStr);
    }

    fetchMonth(currentActivityId, viewYear, viewMonth);
    selectDate(targetDate, currentActivityId);

    calendarAPI.getSummary(currentActivityId)
      .then((res) => setSummary(res.data?.data || { todayBookings: 0, monthActiveDays: 0, earnings: 0 }))
      .catch(() => setSummary({ todayBookings: 0, monthActiveDays: 0, earnings: 0 }));

  }, [currentActivityId, viewYear, viewMonth, fetchMonth, selectDate]);

  // ── Toggle slot in right panel ──────────────────────────────────────────────
  const toggleSlot = (slotId) => {
    setDateDetail((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.map((s) =>
        (s._id === slotId || s.label === slotId) ? { ...s, isActive: !s.isActive } : s
      ),
    }));
  };

  // ── Save changes ─────────────────────────────────────────────────────────────
  const handleSaveChanges = async () => {
    if (!selectedDate || !dateDetail || !currentActivityId) return;
    setSaving(true);
    try {
      const res = await calendarAPI.saveDate(currentActivityId, selectedDate, {
        timeSlots: dateDetail.timeSlots,
        isUnavailable: dateDetail.isUnavailable,
        notes: dateDetail.notes,
      });
      setDateDetail(res.data.data);
      fetchMonth(currentActivityId, viewYear, viewMonth);
      showToast('Changes saved!');
    } catch {
      showToast('Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Mark / Toggle unavailable ────────────────────────────────────────────────
  const handleToggleAvailability = async () => {
    if (!selectedDate || !currentActivityId) return;
    setSaving(true);
    const isCurrentlyUnavailable = dateDetail?.isUnavailable || selectedStatus === 'unavailable';
    const targetState = !isCurrentlyUnavailable;
    try {
      const res = await calendarAPI.markUnavailable(currentActivityId, selectedDate, {
        isUnavailable: targetState,
      });
      setDateDetail(res.data.data);
      fetchMonth(currentActivityId, viewYear, viewMonth);
      showToast(targetState ? 'Date marked as unavailable' : 'Date marked as available');
    } catch (err) {
      console.error('Failed to update availability', err);
      showToast(err?.message || 'Failed to update availability', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Modal save ────────────────────────────────────────────────────────────────
  const handleModalSave = async (updatedSlots) => {
    setModalOpen(false);
    if (!currentActivityId || !selectedDate) return;
    setSaving(true);
    try {
      const res = await calendarAPI.saveDate(currentActivityId, selectedDate, {
        timeSlots: updatedSlots,
        isUnavailable: dateDetail?.isUnavailable || false,
        notes: dateDetail?.notes || '',
      });
      setDateDetail(res.data.data);
      fetchMonth(currentActivityId, viewYear, viewMonth);
      showToast('Availability updated!');
    } catch {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Calendar grid math ───────────────────────────────────────────────────────
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr = toDateString(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };
  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    selectDate(todayStr, currentActivityId);
  };

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedStatus = selectedDate ? (monthData[selectedDate] || 'available') : 'available';

  const progressPct = dateDetail
    ? (() => {
      const active = (dateDetail.timeSlots || []).filter((s) => s.isActive);
      const total = active.reduce((s, x) => s + x.capacity, 0);
      const booked = active.reduce((s, x) => s + x.booked, 0);
      return total > 0 ? Math.round((booked / total) * 100) : 0;
    })()
    : 0;

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
        <HeroBanner />

        {/* Body */}
        <div className="flex-1 px-6 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5 items-start">

            {/* ── Left column ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">

              {/* Calendar card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-3">

                  {/* Activity selector */}
                  <div className="mb-4">
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                      Activity
                    </label>
                    <select
                      value={currentActivityId}
                      onChange={(e) => {
                        const newActivityId = e.target.value;
                        setCurrentActivityId(newActivityId);
                        setMonthData({});
                        setDateDetail(null);
                      }}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                    >
                      {activities.length === 0 ? (
                        <option value="">No activities found</option>
                      ) : (
                        activities.map((a) => (
                          <option key={a._id} value={a._id}>{a.title}</option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Month nav */}
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={prevMonth}
                      className="w-8 h-8 rounded-full border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center text-sm font-semibold text-slate-800">
                      {MONTH_NAMES[viewMonth]} {viewYear}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="w-8 h-8 rounded-full border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={goToday}
                      className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Today
                    </button>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-3">
                    {['available', 'pending', 'fully_booked'].map((key) => (
                      <span key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[key].dot}`} />
                        {STATUS_CONFIG[key].label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 px-3 pb-4">
                  {DAYS_OF_WEEK.map((d) => (
                    <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-2 uppercase tracking-wider">
                      {d}
                    </div>
                  ))}
                  {cells.map((day, idx) => {
                    if (!day) return <div key={`e-${idx}`} />;
                    const dateStr = toDateString(viewYear, viewMonth, day);
                    const status = monthData[dateStr];
                    const isToday = dateStr === todayStr;
                    const isPast = isPastDate(dateStr);
                    const isSelected = dateStr === selectedDate;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => !isPast && selectDate(dateStr)}
                        disabled={isPast}
                        className={`relative flex flex-col items-center justify-center py-2 rounded-lg text-[13px] transition-all duration-100 select-none
                          ${isPast
                            ? 'text-slate-300 cursor-not-allowed'
                            : isSelected
                              ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-200'
                              : isToday
                                ? 'font-bold text-blue-600 hover:bg-blue-50'
                                : 'text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        {day}
                        {/* Only show status dots on non-past dates */}
                        {status && !isPast && (
                          <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : STATUS_CONFIG[status]?.dot || 'bg-slate-300'
                            }`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick stats */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                    <span className="text-lg">📅</span>
                    <p className="text-[11px] text-slate-400 mt-2">Today's Bookings</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{summary.todayBookings} bookings</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                    <span className="text-lg">📋</span>
                    <p className="text-[11px] text-slate-400 mt-2">This Month</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{summary.monthActiveDays} days</p>
                  </div>
                  <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                    <span className="text-lg">💰</span>
                    <p className="text-[11px] text-slate-400 mt-2">Monthly Earnings</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      LKR {summary.earnings?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right column: date detail panel ───────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

              {/* Date header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                    Selected Date
                  </p>
                  <p className="text-base font-semibold text-slate-800">
                    {selectedDate ? formatDisplayDate(selectedDate) : '—'}
                  </p>
                </div>
                {selectedDate && isPastDate(selectedDate) ? (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                    🔒 Past Date (Read-only)
                  </span>
                ) : selectedDate && (
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    (dateDetail?.isUnavailable || selectedStatus === 'unavailable')
                      ? STATUS_CONFIG.unavailable.badge
                      : (STATUS_CONFIG[selectedStatus]?.badge || STATUS_CONFIG.available.badge)
                  }`}>
                    {(dateDetail?.isUnavailable || selectedStatus === 'unavailable')
                      ? STATUS_CONFIG.unavailable.label
                      : (STATUS_CONFIG[selectedStatus]?.label || STATUS_CONFIG.available.label)}
                  </span>
                )}
              </div>

              <div className="border-t border-slate-100 my-4" />

              {/* Content */}
              {!currentActivityId ? (
                <div className="py-16 text-center text-sm text-slate-400">
                  Select an activity to manage its calendar
                </div>
              ) : loadingDate ? (
                <div className="py-16 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-400 text-sm mt-3">Loading details…</p>
                </div>
              ) : dateDetail ? (
                <>
                  {selectedDate && isPastDate(selectedDate) ? (
                    /* ── Past date: read-only ──────────────────────────────── */
                    <div className="py-6 text-center">
                      <div className="text-4xl mb-3">🔒</div>
                      <h4 className="text-sm font-semibold text-slate-600 mb-1">Past Date</h4>
                      <p className="text-xs text-slate-400 mb-6">
                        This date has already passed and can no longer be edited.
                      </p>
                      {(dateDetail.timeSlots || []).length > 0 && (
                        <div className="text-left space-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                            Time Slots (read-only)
                          </p>
                          {dateDetail.timeSlots.map((slot) => (
                            <div
                              key={slot._id || slot.label}
                              className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 opacity-60"
                            >
                              <span className="text-sm text-slate-500">{slot.label}</span>
                              <span className="text-xs text-slate-400">{slotBadge(slot)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* ── Today / future date: full edit UI ────────────────── */
                    <>
                      {/* Time Slots */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-slate-700">Time Slots</h4>
                          <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <FiEdit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                        </div>

                        <div className="space-y-1">
                          {(dateDetail.timeSlots || []).map((slot) => (
                            <div
                              key={slot._id || slot.label}
                              className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors"
                            >
                              <div>
                                <span className={`text-sm font-medium ${slot.isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                                  {slot.label}
                                </span>
                                <span className="text-xs text-slate-400 ml-2">{slotBadge(slot)}</span>
                              </div>
                              <button
                                onClick={() => toggleSlot(slot._id || slot.label)}
                                aria-label={slot.isActive ? 'Disable slot' : 'Enable slot'}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${slot.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                                  }`}
                              >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${slot.isActive ? 'translate-x-5' : 'translate-x-0'
                                  }`} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 my-4" />

                      {/* Booked Tourists */}
                      <div className="mb-5">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">
                          Booked Tourists
                          <span className="ml-2 text-xs font-normal text-slate-400">
                            ({(dateDetail?.bookedTourists || []).length})
                          </span>
                        </h4>
                        <div className="space-y-1">
                          {(dateDetail?.bookedTourists || []).length === 0 ? (
                            <p className="text-xs text-slate-400 italic py-2 px-1">
                              No active bookings for this date.
                            </p>
                          ) : (
                            (dateDetail?.bookedTourists || []).map((t, idx) => (
                              <div key={t._id || idx} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm flex-shrink-0">
                                  👤
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-800">{t.name}</p>
                                  <p className="text-xs text-slate-400">
                                    {t.time} • {t.participants} guest{t.participants > 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Capacity progress */}
                      <div className="mb-6">
                        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                          <span>Capacity</span>
                          <span>{progressPct}% filled</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={handleToggleAvailability}
                          disabled={saving}
                          className={`w-full py-3 rounded-xl text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                            (dateDetail?.isUnavailable || selectedStatus === 'unavailable')
                              ? 'bg-emerald-600 hover:bg-emerald-700'
                              : 'bg-rose-600 hover:bg-rose-700'
                          }`}
                        >
                          {saving
                            ? 'Updating…'
                            : (dateDetail?.isUnavailable || selectedStatus === 'unavailable')
                              ? 'Mark Available'
                              : 'Mark Unavailable'
                          }
                        </button>
                        <button
                          onClick={handleSaveChanges}
                          disabled={saving}
                          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm"
                        >
                          {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="py-16 text-center text-sm text-slate-400">
                  Select a date to view details
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Availability Modal — only opens for non-past dates */}
        {modalOpen && dateDetail && selectedDate && !isPastDate(selectedDate) && (
          <EditAvailabilityModal
            date={selectedDate}
            slots={dateDetail.timeSlots}
            onSave={handleModalSave}
            onClose={() => setModalOpen(false)}
          />
        )}

        <style>{`
          @keyframes slideIn {
            from { transform: translateX(20px); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ManageCalendar;