import express from 'express';
import { getItineraryById, getTripStats } from '../controllers/itineraryController.js';

const router = express.Router();


router.get('/:touristId/:tripId', getItineraryById);
router.get('/trip-stats/:touristId/:tripId', getTripStats);

export default router;