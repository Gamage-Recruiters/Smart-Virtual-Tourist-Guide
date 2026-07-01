const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/itineraryController');

// Generate full itinerary (Budget Optimizer + Recommendation System)
router.post('/generate',          controller.generateItinerary);

// Detect overspending anomaly (Behaviour Tracking)
router.post('/detect-anomaly',    controller.detectAnomaly);

// Get place recommendations only
router.post('/recommendations',   controller.getRecommendations);

// Health check — Flask server status
router.get('/health',             controller.checkHealth);

// ── ADD THIS LINE ──────────────────────────────────────────────────────────
router.get('/:id',                controller.getItinerary);

// Get itinerary by tourist_id + trip_id
router.get('/tourist/:tourist_id/:trip_id', controller.getItineraryByTouristAndTrip);

module.exports = router;