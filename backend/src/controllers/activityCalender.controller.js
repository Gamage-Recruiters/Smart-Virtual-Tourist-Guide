import Calendar from '../models/activityCalender.model.js';

// Default time slots used when creating a new calendar entry
const DEFAULT_SLOTS = [
  { label: '08:00 AM – 12:00 PM', startTime: '08:00', endTime: '12:00', capacity: 15, booked: 0, isActive: true },
  { label: '01:00 PM – 05:00 PM', startTime: '13:00', endTime: '17:00', capacity: 15, booked: 0, isActive: true },
  { label: '06:00 PM – 09:00 PM', startTime: '18:00', endTime: '21:00', capacity: 15, booked: 0, isActive: false },
];

// ─── GET /api/calendar/:activityId/month?year=2025&month=6 ────────────────────
// Returns all calendar entries for a given month (for dot rendering on calendar)
const getMonthCalendar = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { year, month } = req.query;   // month is 1-based

    if (!year || !month) {
      return res.status(400).json({ success: false, message: 'year and month query params required' });
    }

    const y = parseInt(year);
    const m = parseInt(month).toString().padStart(2, '0');
    const start = `${y}-${m}-01`;
    const end   = `${y}-${m}-31`;   // safe upper bound

    const entries = await Calendar.find({
      activityId,
      date: { $gte: start, $lte: end },
    }).select('date status timeSlots isUnavailable');

    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/calendar/:activityId/date/:date ─────────────────────────────────
// Returns full detail for one date including time slots and booked tourist info
const getDateDetail = async (req, res) => {
  try {
    const { activityId, date } = req.params;

    let entry = await Calendar.findOne({ activityId, date });

    // If no entry exists yet, return a default available structure
    if (!entry) {
      return res.json({
        success: true,
        data: {
          activityId,
          date,
          status: 'available',
          isUnavailable: false,
          timeSlots: DEFAULT_SLOTS,
          notes: '',
          isDefault: true,    // signals frontend this hasn't been saved yet
        },
      });
    }

    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/calendar/:activityId/date/:date ────────────────────────────────
// Create or update a calendar entry (upsert)
const saveCalendarDate = async (req, res) => {
  try {
    const { activityId, date } = req.params;
    const { timeSlots, isUnavailable, notes } = req.body;

    const entry = await Calendar.findOneAndUpdate(
      { activityId, date },
      { activityId, date, timeSlots, isUnavailable: !!isUnavailable, notes: notes || '' },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: entry, message: 'Calendar updated successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PATCH /api/calendar/:activityId/date/:date/unavailable ──────────────────
// Toggle mark as unavailable
const markUnavailable = async (req, res) => {
  try {
    const { activityId, date } = req.params;

    const entry = await Calendar.findOneAndUpdate(
      { activityId, date },
      { activityId, date, isUnavailable: true, status: 'unavailable' },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: entry, message: 'Date marked as unavailable' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/calendar/:activityId/summary ───────────────────────────────────
// Quick stats: today's bookings, this-month activities, earnings
const getSummary = async (req, res) => {
  try {
    const { activityId } = req.params;
    const today = new Date().toISOString().split('T')[0];
    const y = new Date().getFullYear();
    const m = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const monthStart = `${y}-${m}-01`;
    const monthEnd   = `${y}-${m}-31`;

    const [todayEntry, monthEntries] = await Promise.all([
      Calendar.findOne({ activityId, date: today }),
      Calendar.find({ activityId, date: { $gte: monthStart, $lte: monthEnd } }),
    ]);

    const todayBookings = todayEntry
      ? todayEntry.timeSlots.reduce((sum, s) => sum + (s.booked || 0), 0)
      : 0;

    const monthBookings = monthEntries.reduce(
      (sum, e) => sum + e.timeSlots.reduce((s2, slot) => s2 + (slot.booked || 0), 0),
      0
    );

    const monthActiveDays = monthEntries.filter((e) => !e.isUnavailable).length;

    res.json({
      success: true,
      data: {
        todayBookings,
        monthBookings,
        monthActiveDays,
        // Earnings placeholder — wire to real booking prices when Booking module is ready
        earnings: monthBookings * 8500,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { getMonthCalendar, getDateDetail, saveCalendarDate, markUnavailable, getSummary };

export default {
  getMonthCalendar,
  getDateDetail,
  saveCalendarDate,
  markUnavailable,
  getSummary,
};
