import Calendar from '../models/activityCalender.model.js';
import Activity from '../models/activity.model.js';
import Availability from '../models/checkavailability.model.js';

// Last-resort fallback if an activity has zero time slot templates defined.
// Gives the activity a single full-day slot sized to its maxParticipants.
const fallbackSlots = (maxParticipants) => [
  {
    label: 'Full Day',
    startTime: '08:00',
    endTime: '17:00',
    capacity: maxParticipants || 15,
    booked: 0,
    isActive: true,
  },
];

// Build a fresh set of calendar time slots from an activity's templates.
const slotsFromTemplates = (activity) => {
  const templates = activity.timeSlotTemplates;

  if (Array.isArray(templates) && templates.length > 0) {
    return templates.map((t) => ({
      label: t.label,
      startTime: t.startTime,
      endTime: t.endTime,
      capacity: t.capacity,
      booked: 0,
      isActive: true,
    }));
  }

  return fallbackSlots(activity.maxParticipants);
};

// Helper to fetch Availability booked tourists for date
const fetchBookedTourists = async (activityId, date) => {
  try {
    const query = { date, status: { $ne: 'cancelled' } };
    if (activityId) query.activityId = activityId;

    const availabilities = await Availability.find(query).sort({ createdAt: -1 });

    return availabilities.map((a) => ({
      _id: a._id,
      name: a.customerName || 'Guest',
      email: a.customerEmail || '',
      phone: a.customerPhone || '',
      time: a.timeSlot || 'Full Day',
      participants: a.participants || 1,
      bookingId: a.bookingId,
      serviceName: a.serviceName,
    }));
  } catch {
    return [];
  }
};

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
const getDateDetail = async (req, res) => {
  try {
    const { activityId, date } = req.params;

    let entry = await Calendar.findOne({ activityId, date });
    const bookedTourists = await fetchBookedTourists(activityId, date);

    if (!entry) {
      const activity = await Activity.findById(activityId).select('timeSlotTemplates maxParticipants');

      if (!activity) {
        return res.status(404).json({ success: false, message: 'Activity not found' });
      }

      return res.json({
        success: true,
        data: {
          activityId,
          date,
          status: 'available',
          isUnavailable: false,
          timeSlots: slotsFromTemplates(activity),
          notes: '',
          isDefault: true,    // signals frontend this hasn't been saved yet
          bookedTourists,
        },
      });
    }

    const data = entry.toObject();
    data.bookedTourists = bookedTourists;

    res.json({ success: true, data });
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

    // Guard: capacity can never be reduced below already-confirmed bookings
    if (Array.isArray(timeSlots)) {
      const invalid = timeSlots.find(
        (s) => typeof s.capacity === 'number' && typeof s.booked === 'number' && s.capacity < s.booked
      );
      if (invalid) {
        return res.status(400).json({
          success: false,
          message: `Capacity for "${invalid.label}" cannot be less than the ${invalid.booked} bookings already made`,
        });
      }
    }

    const entry = await Calendar.findOneAndUpdate(
      { activityId, date },
      { activityId, date, timeSlots, isUnavailable: !!isUnavailable, notes: notes || '' },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    const bookedTourists = await fetchBookedTourists(activityId, date);
    const data = entry.toObject();
    data.bookedTourists = bookedTourists;

    res.json({ success: true, data, message: 'Calendar updated successfully' });
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

    const bookedTourists = await fetchBookedTourists(activityId, date);
    const data = entry.toObject();
    data.bookedTourists = bookedTourists;

    res.json({ success: true, data, message: 'Date marked as unavailable' });
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

    const [todayEntry, monthEntries, activity] = await Promise.all([
      Calendar.findOne({ activityId, date: today }),
      Calendar.find({ activityId, date: { $gte: monthStart, $lte: monthEnd } }),
      Activity.findById(activityId).select('pricePerPerson'),
    ]);

    const todayBookings = todayEntry
      ? todayEntry.timeSlots.reduce((sum, s) => sum + (s.booked || 0), 0)
      : 0;

    const monthBookings = monthEntries.reduce(
      (sum, e) => sum + e.timeSlots.reduce((s2, slot) => s2 + (slot.booked || 0), 0),
      0
    );

    const monthActiveDays = monthEntries.filter((e) => !e.isUnavailable).length;

    const pricePerPerson = activity?.pricePerPerson || 0;

    res.json({
      success: true,
      data: {
        todayBookings,
        monthBookings,
        monthActiveDays,
        earnings: monthBookings * pricePerPerson,
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
