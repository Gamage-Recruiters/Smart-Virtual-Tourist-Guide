import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { getMyBookings } from "../../controllers/TouristDashboard/rentVehicleBookingController.js";

const rentVehicleBookingRouter = express.Router();

// GET /api/tourist/rent-vehicle-booking/my-bookings
rentVehicleBookingRouter.get("/my-bookings", protect, getMyBookings);

export default rentVehicleBookingRouter;