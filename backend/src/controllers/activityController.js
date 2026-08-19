import Activity from '../models/activity.js';
import Calendar from '../models/activityCalender.model.js';

// Helper to get or initialize calendar entry for an activity and date
export const getOrInitCalendar = async (activityId, dateStr) => {
  if (!activityId || !dateStr) return null;

  let calendar = await Calendar.findOne({ activityId, date: dateStr });
  if (calendar) {
    return calendar;
  }

  const activity = await Activity.findById(activityId);
  if (!activity) {
    return null;
  }

  let timeSlots = [];
  if (activity.timeSlotTemplates && activity.timeSlotTemplates.length > 0) {
    timeSlots = activity.timeSlotTemplates.map((t) => ({
      label: t.label || `${t.startTime} - ${t.endTime}`,
      startTime: t.startTime || '08:00',
      endTime: t.endTime || '17:00',
      capacity: t.capacity || activity.maxParticipants || 15,
      booked: 0,
      isActive: true,
    }));
  } else {
    // Default single slot if no templates exist on activity
    timeSlots = [
      {
        label: 'General Session (09:00 - 17:00)',
        startTime: '09:00',
        endTime: '17:00',
        capacity: activity.maxParticipants || 15,
        booked: 0,
        isActive: true,
      },
    ];
  }

  calendar = new Calendar({
    activityId,
    date: dateStr,
    timeSlots,
    status: 'available',
  });

  await calendar.save();
  return calendar;
};

// Helper to find slot in calendar timeSlots array
export const findSlotInCalendar = (timeSlots, query) => {
  if (!Array.isArray(timeSlots) || !query) return null;
  const qStr = String(query).trim();

  // 1. Exact match by label or _id
  let match = timeSlots.find(
    (s) => s.label === qStr || String(s._id) === qStr
  );
  if (match) return match;

  // 2. Case-insensitive substring match
  const qLower = qStr.toLowerCase();
  match = timeSlots.find(
    (s) =>
      qLower.includes(s.label.toLowerCase()) ||
      s.label.toLowerCase().includes(qLower) ||
      (s.startTime && qLower.includes(s.startTime))
  );
  return match || null;
};

// Get all activities
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get availability and time slots for an activity on a specific date
const getActivityAvailability = async (req, res) => {
  try {
    const activityId = req.params.id || req.query.activityId;
    let date = req.query.date;

    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }

    const calendar = await getOrInitCalendar(activityId, date);
    if (!calendar) {
      return res.status(404).json({ success: false, message: 'Activity or calendar not found' });
    }

    const timeSlots = (calendar.timeSlots || []).map((slot) => {
      const availableSeats = Math.max(0, (slot.capacity || 0) - (slot.booked || 0));
      return {
        _id: slot._id,
        label: slot.label,
        startTime: slot.startTime,
        endTime: slot.endTime,
        capacity: slot.capacity,
        booked: slot.booked,
        availableSeats,
        isActive: slot.isActive,
        isAvailable: slot.isActive && !calendar.isUnavailable && availableSeats > 0,
      };
    });

    res.status(200).json({
      success: true,
      activityId,
      date: calendar.date,
      status: calendar.status,
      isUnavailable: calendar.isUnavailable,
      timeSlots,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check availability for a specific time slot and capacity
const checkActivityAvailability = async (req, res) => {
  try {
    const activityId = req.params.id || req.body.activityId;
    const { date, timeSlot, participants = 1 } = req.body;

    if (!activityId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        available: false,
        message: 'Activity ID, date, and time slot are required',
      });
    }

    const requestedSeats = Number(participants) || 1;
    const calendar = await getOrInitCalendar(activityId, date);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        available: false,
        message: 'Activity not found',
      });
    }

    if (calendar.isUnavailable || calendar.status === 'unavailable') {
      return res.status(200).json({
        success: false,
        available: false,
        message: 'Activity is unavailable on this date',
      });
    }

    const slot = findSlotInCalendar(calendar.timeSlots, timeSlot);

    if (!slot || !slot.isActive) {
      return res.status(200).json({
        success: false,
        available: false,
        message: 'Selected time slot is inactive or not found',
      });
    }

    const availableCapacity = Math.max(0, (slot.capacity || 0) - (slot.booked || 0));

    if (requestedSeats > availableCapacity) {
      return res.status(200).json({
        success: false,
        available: false,
        availableCapacity,
        message:
          availableCapacity > 0
            ? `Only ${availableCapacity} seat(s) available for this time slot.`
            : 'Selected time slot is fully booked.',
      });
    }

    res.status(200).json({
      success: true,
      available: true,
      availableCapacity,
      timeSlot: slot,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getActivities,
  getActivityAvailability,
  checkActivityAvailability,
};

