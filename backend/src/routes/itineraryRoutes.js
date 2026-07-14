const express = require('express');
const router = express.Router();
const { getItineraryById } = require('../controllers/itineraryController');
const { getPlacesVisitedCount } = require('../controllers/itineraryController');


router.get('/:touristId/:tripId', getItineraryById);
router.get('/visited-count/:touristId/:tripId', getPlacesVisitedCount);

module.exports = router;