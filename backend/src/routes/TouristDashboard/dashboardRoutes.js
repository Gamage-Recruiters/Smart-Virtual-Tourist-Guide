import express from "express";
const router = express.Router();
import { protect } from "../../middleware/authMiddleware.js";
import { getDashboardSummary } from "../../controllers/TouristDashboard/dashboardController.js";

/**
 * GET /api/dashboard/summary
 * Returns a single aggregated payload for the tourist dashboard:
 *  - Tourist profile info
 *  - Budget status (total, spent, remaining, %)
 *  - Trip itinerary snapshot
 *  - Next 3 upcoming bookings
 *  - Unread notification count
 */
router.get("/summary", protect, getDashboardSummary);

export default router;
