const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getDashboardSummary } = require("../controllers/dashboardController");

/**
 * GET /api/dashboard/summary
 * Returns a single aggregated payload for the tourist dashboard:
 *  - Tourist profile info
 *  - Budget status (total, spent, remaining, %)
 *  - Trip itinerary snapshot
 *  - Next 3 upcoming bookings
 *  - Unread notification count
 */
router.get("/summary", authMiddleware, getDashboardSummary);

module.exports = router;
