import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { completeBookingTrip, createBooking, getRentalRequests, getTouristBookings, updateBookingStatus } from "../../controllers/vehicleRentAdmin/rentalRequestsController.js";

const vehicleBookingRouter = express.Router();

// Create new rental / bid (Protected for tourist)
vehicleBookingRouter.post("/",protect, createBooking);

// Renter view: fetch all incoming requests
vehicleBookingRouter.get("/requests",protect, getRentalRequests);

// Tourist view: fetch personal reservations
vehicleBookingRouter.get("/my-bookings", protect, getTouristBookings);

vehicleBookingRouter.patch("/:id/status",protect, updateBookingStatus);

vehicleBookingRouter.patch("/:id/complete",protect, completeBookingTrip);

export default vehicleBookingRouter;