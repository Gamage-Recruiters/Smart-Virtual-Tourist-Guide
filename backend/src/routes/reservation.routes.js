const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservation.controller");
const { protect } = require("../middleware/authMiddleware");

// Availability check (Public)
router.get("/availability", reservationController.getAvailability);

// Book a table (Protected)
router.post("/", protect, reservationController.createReservation);

// Tourist specific route
router.get("/tourist", protect, reservationController.getTouristReservations);

// Restaurant specific routes
router.get("/restaurant/:restaurantId", protect, reservationController.getRestaurantReservations);
router.get("/restaurant/:restaurantId/revenue", protect, reservationController.getRestaurantRevenue);

module.exports = router;
