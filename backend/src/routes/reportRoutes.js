const express = require('express');
const router = express.Router();
const { getTouristArrivalStats } = require('../controllers/reportController');

router.get('/tourist-stats', getTouristArrivalStats);

module.exports = router;