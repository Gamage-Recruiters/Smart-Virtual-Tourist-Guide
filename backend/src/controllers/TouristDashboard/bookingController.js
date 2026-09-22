import Booking from "../../models/TouristDashboard/Booking.js";
import { sendNotification } from "../../services/NotificationService.js";
import {
  NOTIFICATION_SCOPES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITIES,
} from "../../constants/notificationConstants.js";

// ─────────────────────────────────────────────────────────────
// GET /api/bookings
// Returns all non-cancelled bookings for the authenticated user,
// sorted by soonest first.
// ─────────────────────────────────────────────────────────────
async function getBookings(req, res) {
  try {
    const userId = req.user.id;

    // Optional query param: ?status=Confirmed
    const filter = { userId };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const bookings = await Booking.find(filter).sort({ dateTime: 1 }).lean();

    return res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    console.error("[bookingController] getBookings error:", err);
    return res.status(500).json({ message: "Failed to fetch bookings." });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/bookings
// Create a new booking for the authenticated user.
//
// Body: { type, title, location, dateTime, displayTime, notes, priceUSD }
// ─────────────────────────────────────────────────────────────
async function createBooking(req, res) {
  try {
    const userId = req.user.id;
    const { type, title, location, dateTime, displayTime, notes, priceUSD, status } = req.body;

    if (!type || !title) {
      return res.status(400).json({ message: "type and title are required." });
    }

    const ALLOWED_TYPES = ["hotel", "driver", "activity", "vehicle", "guide", "food", "package"];
    if (!ALLOWED_TYPES.includes(String(type).toLowerCase())) {
      return res.status(400).json({
        message: `type must be one of: ${ALLOWED_TYPES.join(", ")}`,
      });
    }

    const booking = await Booking.create({
      userId,
      type: String(type).toLowerCase(),
      title: String(title).trim(),
      location: String(location || "").trim(),
      dateTime: String(dateTime || ""),
      displayTime: String(displayTime || ""),
      notes: String(notes || "").trim(),
      priceUSD: Number(priceUSD) || 0,
      status: status || "Pending",
    });

    // --- Notification: UNICAST to the Tourist — booking confirmed ---
    try {
      const io = req.app.get('io');
      await sendNotification(io, {
        scope: NOTIFICATION_SCOPES.UNICAST,
        recipientId: userId,
        title: '✅ Booking Confirmed!',
        message: `Your ${type} booking for "${title}" ${dateTime ? `on ${displayTime || dateTime}` : ''} has been successfully placed.`,
        category: NOTIFICATION_CATEGORIES.BOOKING,
        priority: NOTIFICATION_PRIORITIES.HIGH,
        actionUrl: `/my-bookings/${booking._id}`,
      });
    } catch (notifError) {
      console.error('[Notification Error] createBooking:', notifError.message);
    }

    return res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error("[bookingController] createBooking error:", err);
    return res.status(500).json({ message: "Failed to create booking." });
  }
}

// ─────────────────────────────────────────────────────────────
// PATCH /api/bookings/:id/status
// Update the status of a specific booking.
//
// Body: { status: "Confirmed" | "Pending" | "Cancelled" }
// ─────────────────────────────────────────────────────────────
async function updateBookingStatus(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const ALLOWED_STATUSES = ["Confirmed", "Pending", "Cancelled"];
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: id, userId },
      { $set: { status } },
      { returnDocument: 'after' }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // --- Notification: UNICAST to the Tourist — booking status updated ---
    try {
      const io = req.app.get('io');
      const statusEmoji = status === 'Confirmed' ? '✅' : status === 'Cancelled' ? '❌' : '⏳';
      await sendNotification(io, {
        scope: NOTIFICATION_SCOPES.UNICAST,
        recipientId: userId,
        title: `${statusEmoji} Booking ${status}`,
        message: `Your booking for "${booking.title}" has been updated to "${status}".`,
        category: NOTIFICATION_CATEGORIES.BOOKING,
        priority: status === 'Cancelled' ? NOTIFICATION_PRIORITIES.HIGH : NOTIFICATION_PRIORITIES.MEDIUM,
        actionUrl: `/my-bookings/${booking._id}`,
      });
    } catch (notifError) {
      console.error('[Notification Error] updateBookingStatus:', notifError.message);
    }

    return res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.error("[bookingController] updateBookingStatus error:", err);
    return res.status(500).json({ message: "Failed to update booking status." });
  }
}

// ─────────────────────────────────────────────────────────────
// DELETE /api/bookings/:id
// Delete a booking that belongs to the authenticated user.
// ─────────────────────────────────────────────────────────────
async function deleteBooking(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const booking = await Booking.findOneAndDelete({ _id: id, userId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    return res.status(200).json({ success: true, message: "Booking deleted." });
  } catch (err) {
    console.error("[bookingController] deleteBooking error:", err);
    return res.status(500).json({ message: "Failed to delete booking." });
  }
}

export {
  getBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
};
