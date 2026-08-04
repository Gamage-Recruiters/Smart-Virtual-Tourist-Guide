import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getItinerary,
  updateItinerary,
  generateFinalReport,
  getRecommendations,
} from "../controllers/itineraryController.js";

// Recommendations don't require auth in the current frontend implementation
router.post("/recommendations", getRecommendations);

// All other itinerary routes require authentication
router.use(authMiddleware);

/**
 * GET /api/itinerary
 * Returns the trip itinerary for the authenticated user.
 * Powers the TripPlan widget and Calendar widget.
 */
router.get("/", getItinerary);

/**
 * PUT /api/itinerary
 * Create or update the trip itinerary (upsert).
 * Body: {
 *   title, imageUrl, currentLocation, nextActivity,
 *   totalDays, currentDay,
 *   weather: { temperatureC, description },
 *   days: [{ dayNumber, date, location, activities, notes }]
 * }
 */
router.put("/", updateItinerary);

/**
 * GET /api/itinerary/report
 * Generates a comprehensive final trip report.
 * Powers the "Final Report" button on the dashboard.
 * Returns: tourist info, trip details, budget summary,
 *          health profile, emergency contact, all bookings,
 *          and all notifications.
 * NOTE: Must be declared before /:id-style routes if added later.
 */
router.get("/report", generateFinalReport);

export default router;
