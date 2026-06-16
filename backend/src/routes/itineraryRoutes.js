const express = require('express');
const router = express.Router();
const { getItineraryById } = require('../controllers/itineraryController');


router.get('/:touristId/:tripId', getItineraryById);

module.exports = router;