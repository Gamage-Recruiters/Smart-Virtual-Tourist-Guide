import Booking from "../models/Booking.js";

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
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
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
