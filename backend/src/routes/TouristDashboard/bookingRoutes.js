import express from "express";
const router = express.Router();
import { protect } from "../../middleware/authMiddleware.js";
import {
  getBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from "../../controllers/TouristDashboard/bookingController.js";

// All booking routes require authentication
router.use(protect);

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

export default router;
