const express = require('express');
const router = express.Router();
const { getItineraryById } = require('../controllers/itineraryController');
const { getTripStats } = require('../controllers/itineraryController');


router.get('/:touristId/:tripId', getItineraryById);
router.get('/trip-stats/:touristId/:tripId', getTripStats);

module.exports = router;