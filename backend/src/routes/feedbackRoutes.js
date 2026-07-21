import express from 'express';
import { createFeedback, getFeedbackById } from '../controllers/feedbackController.js';

const feedbackRoutes = express.Router();

feedbackRoutes.post('/save', createFeedback);
feedbackRoutes.get('/:touristId/:tripId', getFeedbackById);

export default feedbackRoutes;