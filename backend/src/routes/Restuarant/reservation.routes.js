import express from "express";
const router = express.Router();
import * as reservationController from "../../controllers/Restuarant/reservation.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

// Availability check (Public)
router.get("/availability", reservationController.getAvailability);

// Book a table (Protected)
router.post("/", protect, reservationController.createReservation);

// Tourist specific route
router.get("/tourist", protect, reservationController.getTouristReservations);

// Restaurant specific routes
router.get("/restaurant/:restaurantId", protect, reservationController.getRestaurantReservations);
router.get("/restaurant/:restaurantId/revenue", protect, reservationController.getRestaurantRevenue);

export default router;
