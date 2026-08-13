import express from 'express';
const router = express.Router();
import { getActivities } from '../controllers/activityController.js';

// Route to get all activities
router.get('/', getActivities);

export default router;
