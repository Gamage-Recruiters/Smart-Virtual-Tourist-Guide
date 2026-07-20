const express = require('express');
const router = express.Router();
const { submitBid, getBidsByTrip } = require('../controllers/bidController');


router.post('/', submitBid);

router.get('/:tripId', getBidsByTrip);

module.exports = router;