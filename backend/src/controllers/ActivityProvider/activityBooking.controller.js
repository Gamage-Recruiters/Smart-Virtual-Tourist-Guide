import mongoose from 'mongoose';
import ActivityBooking from '../../models/ActivityProvider/ActivityBooking.js';
import Availability from '../../models/ActivityProvider/checkavailability.model.js';
import Calendar from '../../models/ActivityProvider/activityCalender.model.js';
import Activity from '../../models/ActivityProvider/activity.model.js';

const normalizeBooking = (booking) => ({
  ...booking.toObject ? booking.toObject() : booking,
  _id: booking._id?.toString?.() || booking._id,
});

export const getBookings = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { 'customer.firstName': { $regex: search, $options: 'i' } },
        { 'customer.lastName': { $regex: search, $options: 'i' } },
        { 'service.name': { $regex: search, $options: 'i' } },
        { activityDate: { $regex: search, $options: 'i' } },
      ];
    }

    const bookings = await ActivityBooking.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings.map(normalizeBooking),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sync accepted or cancelled booking with Management Calendar & Availability Model
const syncBookingWithCalendarAndAvailability = async (booking, status) => {
  try {
    const rawServiceId = booking.service?.serviceId;
    let activityId = null;
    let activity = null;

    if (rawServiceId && mongoose.Types.ObjectId.isValid(rawServiceId)) {
      activityId = rawServiceId;
      activity = await Activity.findById(activityId);
    }

    if (!activity && booking.service?.name) {
      activity = await Activity.findOne({
        title: { $regex: new RegExp(`^${booking.service.name.trim()}$`, 'i') },
      });
      if (activity) {
        activityId = activity._id;
      }
    }

    const bookingDate = booking.activityDate || new Date().toISOString().split('T')[0];
    const timeSlotStr = booking.timeSlot || 'Full Day';
    const participants = booking.participants || 1;
    const customerName = [booking.customer?.firstName, booking.customer?.lastName].filter(Boolean).join(' ').trim() || 'Guest';

    if (status === 'confirmed') {
      // 1. Save / Update in Availability Model
      await Availability.findOneAndUpdate(
        { bookingId: booking._id },
        {
          bookingId: booking._id,
          activityId: activityId || null,
          serviceName: booking.service?.name || 'Activity',
          date: bookingDate,
          timeSlot: timeSlotStr,
          participants,
          customerName,
          customerEmail: booking.customer?.email || '',
          customerPhone: booking.customer?.phone || '',
          status: 'booked',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // 2. Store / Update in Management Calendar
      if (activityId) {
        let calendar = await Calendar.findOne({ activityId, date: bookingDate });

        if (!calendar) {
          let templates = activity?.timeSlotTemplates || [];
          let initialSlots = templates.map((t) => ({
            label: t.label,
            startTime: t.startTime,
            endTime: t.endTime,
            capacity: t.capacity,
            booked: 0,
            isActive: true,
          }));

          if (initialSlots.length === 0) {
            initialSlots = [
              {
                label: timeSlotStr,
                startTime: '08:00',
                endTime: '17:00',
                capacity: activity?.maxParticipants || 15,
                booked: 0,
                isActive: true,
              },
            ];
          }

          calendar = new Calendar({
            activityId,
            date: bookingDate,
            status: 'available',
            timeSlots: initialSlots,
          });
        }

        // Locate or create matching time slot
        let matchedSlot = calendar.timeSlots.find(
          (s) =>
            s.label?.toLowerCase() === timeSlotStr.toLowerCase() ||
            timeSlotStr.toLowerCase().includes(s.label?.toLowerCase()) ||
            s.startTime === timeSlotStr
        );

        if (matchedSlot) {
          matchedSlot.booked = (matchedSlot.booked || 0) + participants;
        } else {
          calendar.timeSlots.push({
            label: timeSlotStr,
            startTime: '08:00',
            endTime: '17:00',
            capacity: activity?.maxParticipants || 15,
            booked: participants,
            isActive: true,
          });
        }

        await calendar.save();
      }
    } else if (status === 'cancelled') {
      // Mark Availability as cancelled
      await Availability.findOneAndUpdate(
        { bookingId: booking._id },
        { status: 'cancelled' }
      );

      // Decrement booked count in Calendar if present
      if (activityId) {
        const calendar = await Calendar.findOne({ activityId, date: bookingDate });
        if (calendar) {
          const matchedSlot = calendar.timeSlots.find(
            (s) =>
              s.label?.toLowerCase() === timeSlotStr.toLowerCase() ||
              timeSlotStr.toLowerCase().includes(s.label?.toLowerCase())
          );
          if (matchedSlot) {
            matchedSlot.booked = Math.max(0, (matchedSlot.booked || 0) - participants);
            await calendar.save();
          }
        }
      }
    }
  } catch (err) {
    console.error('Error syncing booking with calendar/availability:', err);
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    const booking = await ActivityBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Sync with management calendar & Availability model
    await syncBookingWithCalendarAndAvailability(booking, status);

    res.json({
      success: true,
      data: normalizeBooking(booking),
      message: 'Booking status updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getBookings,
  updateBookingStatus,
};
