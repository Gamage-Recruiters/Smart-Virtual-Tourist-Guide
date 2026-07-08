const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");

// All booking routes require authentication
router.use(authMiddleware);

/**
 * GET /api/bookings
 * Returns all bookings for the authenticated user.
 * Optional query: ?status=Confirmed
 */
router.get("/", getBookings);

/**
 * POST /api/bookings
 * Create a new booking.
 * Body: { type, title, location, dateTime, displayTime, notes, priceUSD, status }
 */
router.post("/", createBooking);

/**
 * PATCH /api/bookings/:id/status
 * Update the status of a specific booking.
 * Body: { status: "Confirmed" | "Pending" | "Cancelled" }
 */
router.patch("/:id/status", updateBookingStatus);

/**
 * DELETE /api/bookings/:id
 * Delete a booking belonging to the authenticated user.
 */
router.delete("/:id", deleteBooking);

module.exports = router;
