import express from 'express';
import {
    generateItinerary,
    detectAnomaly,
    getRecommendations,
    checkHealth,
    getItinerary,
    getItineraryByTouristAndTrip,
} from '../controllers/itineraryController.js';

const router = express.Router();

// Generate full itinerary (Budget Optimizer + Recommendation System)
router.post('/generate',          generateItinerary);

// Detect overspending anomaly (Behaviour Tracking)
router.post('/detect-anomaly',    detectAnomaly);

// Get place recommendations only
router.post('/recommendations',   getRecommendations);

// Health check — Flask server status
router.get('/health',             checkHealth);

// Get itinerary by MongoDB _id
router.get('/:id',                getItinerary);

// Get itinerary by tourist_id + trip_id
router.get('/tourist/:tourist_id/:trip_id', getItineraryByTouristAndTrip);

export default router;