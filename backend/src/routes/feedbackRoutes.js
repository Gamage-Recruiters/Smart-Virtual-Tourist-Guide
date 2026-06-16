const express = require('express');
const feedbackRoutes = express.Router();
const { createFeedback } = require('../controllers/feedbackController');

feedbackRoutes.post('/save', createFeedback);

module.exports = feedbackRoutes;