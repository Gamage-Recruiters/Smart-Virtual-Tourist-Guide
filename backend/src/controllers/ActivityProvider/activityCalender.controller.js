import mongoose from 'mongoose';
import Calendar from '../../models/ActivityProvider/activityCalender.model.js';
import Activity from '../../models/ActivityProvider/activity.model.js';
import Availability from '../../models/ActivityProvider/checkavailability.model.js';
import ActivityBooking from '../../models/ActivityProvider/ActivityBooking.js';

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

// Helper to fetch Availability & confirmed ActivityBooking tourists for date
const fetchBookedTourists = async (activityId, date) => {
  try {
    const list = [];
    const seenIds = new Set();

    // 1. Fetch from Availability model
    const availQuery = { date, status: { $ne: 'cancelled' } };
    if (activityId) availQuery.activityId = activityId;

    const availabilities = await Availability.find(availQuery).sort({ createdAt: -1 });

    availabilities.forEach((a) => {
      const bId = a.bookingId?.toString() || a._id.toString();
      seenIds.add(bId);
      list.push({
        _id: a._id,
        name: a.customerName || 'Guest',
        email: a.customerEmail || '',
        phone: a.customerPhone || '',
        time: a.timeSlot || 'Full Day',
        participants: a.participants || 1,
        bookingId: a.bookingId,
        serviceName: a.serviceName,
      });
    });

    // 2. Fetch directly from ActivityBooking collection for confirmed bookings on this date
    const bookingQuery = { status: 'confirmed', activityDate: date };
    if (activityId) {
      bookingQuery['$or'] = [
        { 'service.serviceId': activityId },
        { activityId: activityId }
      ];
    }
    const confirmedBookings = await ActivityBooking.find(bookingQuery);

    for (const b of confirmedBookings) {
      const idStr = b._id.toString();
      if (!seenIds.has(idStr)) {
        seenIds.add(idStr);
        const customerName = [b.customer?.firstName, b.customer?.lastName].filter(Boolean).join(' ').trim() || 'Guest';
        list.push({
          _id: b._id,
          name: customerName,
          email: b.customer?.email || '',
          phone: b.customer?.phone || '',
          time: b.timeSlot || 'Full Day',
          participants: b.participants || 1,
          bookingId: b._id,
          serviceName: b.service?.name || 'Activity',
        });
      }
    }

    return list;
  } catch {
    return [];
  }
};

// ─── GET /api/calendar/:activityId/month?year=2025&month=6 ────────────────────
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
    const end   = `${y}-${m}-31`;

    const entries = await Calendar.find({
      activityId,
      date: { $gte: start, $lte: end },
    }).select('date status timeSlots isUnavailable');

    const resultMap = new Map();
    entries.forEach((e) => {
      const obj = e.toObject ? e.toObject() : e;
      resultMap.set(obj.date, obj);
    });

    // Merge dates with confirmed ActivityBookings in month for this activity
    const bookingQuery = {
      status: 'confirmed',
      activityDate: { $gte: start, $lte: end },
    };
    if (activityId) {
      bookingQuery['$or'] = [
        { 'service.serviceId': activityId },
        { activityId: activityId }
      ];
    }
    const confirmedBookings = await ActivityBooking.find(bookingQuery);

    confirmedBookings.forEach((b) => {
      if (b.activityDate && !resultMap.has(b.activityDate)) {
        resultMap.set(b.activityDate, {
          date: b.activityDate,
          status: 'pending',
          isUnavailable: false,
          timeSlots: [],
        });
      }
    });

    // Merge dates with active Availability entries for this activity
    const availQuery = {
      status: { $ne: 'cancelled' },
      date: { $gte: start, $lte: end },
    };
    if (activityId) {
      availQuery.activityId = activityId;
    }
    const availabilities = await Availability.find(availQuery);

    availabilities.forEach((a) => {
      if (a.date && !resultMap.has(a.date)) {
        resultMap.set(a.date, {
          date: a.date,
          status: 'pending',
          isUnavailable: false,
          timeSlots: [],
        });
      }
    });

    res.json({ success: true, data: Array.from(resultMap.values()) });
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

      const slots = slotsFromTemplates(activity);

      // If bookedTourists exist, update booked counts on matching slots
      if (bookedTourists.length > 0 && slots.length > 0) {
        bookedTourists.forEach((bt) => {
          const matched = slots.find(
            (s) =>
              s.label?.toLowerCase() === bt.time?.toLowerCase() ||
              bt.time?.toLowerCase().includes(s.label?.toLowerCase()) ||
              s.startTime === bt.time
          );
          if (matched) {
            matched.booked = (matched.booked || 0) + (bt.participants || 1);
          } else {
            slots[0].booked = (slots[0].booked || 0) + (bt.participants || 1);
          }
        });
      }

      const totalCap = slots.reduce((s, x) => s + (x.capacity || 0), 0);
      const totalBkd = slots.reduce((s, x) => s + (x.booked || 0), 0);
      const derivedStatus = totalBkd === 0 ? 'available' : totalBkd < totalCap ? 'pending' : 'fully_booked';

      return res.json({
        success: true,
        data: {
          activityId,
          date,
          status: derivedStatus,
          isUnavailable: false,
          timeSlots: slots,
          notes: '',
          isDefault: true,
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
const saveCalendarDate = async (req, res) => {
  try {
    const { activityId, date } = req.params;
    const { timeSlots, isUnavailable, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({ success: false, message: 'Invalid activity ID' });
    }

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

    let entry = await Calendar.findOne({ activityId, date });
    if (!entry) {
      entry = new Calendar({ activityId, date });
    }

    entry.timeSlots = Array.isArray(timeSlots) ? timeSlots : entry.timeSlots;
    entry.isUnavailable = !!isUnavailable;
    entry.notes = notes || '';

    await entry.save();

    const bookedTourists = await fetchBookedTourists(activityId, date);
    const data = entry.toObject();
    data.bookedTourists = bookedTourists;

    res.json({ success: true, data, message: 'Calendar updated successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('saveCalendarDate error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to save calendar date' });
  }
};

// ─── PATCH /api/calendar/:activityId/date/:date/unavailable ──────────────────
const markUnavailable = async (req, res) => {
  try {
    const { activityId, date } = req.params;

    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({ success: false, message: 'Invalid activity ID' });
    }

    const targetState = req.body?.isUnavailable !== undefined ? !!req.body.isUnavailable : true;

    let entry = await Calendar.findOne({ activityId, date });
    const activity = await Activity.findById(activityId).select('timeSlotTemplates maxParticipants');

    if (!entry) {
      if (!activity) {
        return res.status(404).json({ success: false, message: 'Activity not found' });
      }
      entry = new Calendar({
        activityId,
        date,
        timeSlots: slotsFromTemplates(activity),
        isUnavailable: targetState,
      });
    } else {
      entry.isUnavailable = targetState;
      if ((!Array.isArray(entry.timeSlots) || entry.timeSlots.length === 0) && activity) {
        entry.timeSlots = slotsFromTemplates(activity);
      }
    }

    await entry.save();

    const bookedTourists = await fetchBookedTourists(activityId, date);
    const data = entry.toObject();
    data.bookedTourists = bookedTourists;

    const message = entry.isUnavailable
      ? 'Date marked as unavailable'
      : 'Date marked as available';

    res.json({ success: true, data, message });
  } catch (err) {
    console.error('markUnavailable error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to update availability' });
  }
};

// ─── GET /api/calendar/:activityId/summary ───────────────────────────────────
const getSummary = async (req, res) => {
  try {
    const { activityId } = req.params;
    const today = new Date().toISOString().split('T')[0];
    const y = new Date().getFullYear();
    const m = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const monthStart = `${y}-${m}-01`;
    const monthEnd   = `${y}-${m}-31`;

    const bookingTodayQuery = { status: 'confirmed', activityDate: today };
    const bookingMonthQuery = { status: 'confirmed', activityDate: { $gte: monthStart, $lte: monthEnd } };
    if (activityId) {
      bookingTodayQuery['$or'] = [{ 'service.serviceId': activityId }, { activityId: activityId }];
      bookingMonthQuery['$or'] = [{ 'service.serviceId': activityId }, { activityId: activityId }];
    }

    const [todayCalendar, monthCalendar, activity, confirmedBookingsToday, confirmedBookingsMonth] = await Promise.all([
      Calendar.findOne({ activityId, date: today }),
      Calendar.find({ activityId, date: { $gte: monthStart, $lte: monthEnd } }),
      Activity.findById(activityId).select('pricePerPerson'),
      ActivityBooking.find(bookingTodayQuery),
      ActivityBooking.find(bookingMonthQuery),
    ]);

    const calTodayBookings = todayCalendar
      ? todayCalendar.timeSlots.reduce((sum, s) => sum + (s.booked || 0), 0)
      : 0;
    const bkTodayBookings = confirmedBookingsToday.reduce((sum, b) => sum + (b.participants || 1), 0);
    const todayBookings = Math.max(calTodayBookings, bkTodayBookings);

    const calMonthBookings = monthCalendar.reduce(
      (sum, e) => sum + e.timeSlots.reduce((s2, slot) => s2 + (slot.booked || 0), 0),
      0
    );
    const bkMonthBookings = confirmedBookingsMonth.reduce((sum, b) => sum + (b.participants || 1), 0);
    const monthBookings = Math.max(calMonthBookings, bkMonthBookings);

    const monthActiveDays = new Set([
      ...monthCalendar.filter((e) => !e.isUnavailable).map((e) => e.date),
      ...confirmedBookingsMonth.map((b) => b.activityDate).filter(Boolean),
    ]).size;

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
