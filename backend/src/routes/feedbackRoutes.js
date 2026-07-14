const express = require('express');
const feedbackRoutes = express.Router();
const { createFeedback , getFeedbackById } = require('../controllers/feedbackController');

feedbackRoutes.post('/save', createFeedback);
feedbackRoutes.get('/:touristId/:tripId', getFeedbackById);

module.exports = feedbackRoutes;