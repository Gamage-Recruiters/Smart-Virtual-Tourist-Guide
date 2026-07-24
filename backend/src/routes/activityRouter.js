const express = require('express');
const router = express.Router();
const { getActivities } = require('../controllers/activityController');

// Route to get all activities
router.get('/', getActivities);

module.exports = router;
