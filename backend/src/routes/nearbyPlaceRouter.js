import express from 'express';
import { getNearbyPlaces, getNearbyPlacesAlongRoute } from '../controllers/nearbyPlaceController.js';

const router = express.Router();

router.get('/', getNearbyPlaces);
router.get('/along-route', getNearbyPlacesAlongRoute);

export default router;
