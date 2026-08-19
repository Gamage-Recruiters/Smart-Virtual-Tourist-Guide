import express from 'express';
const router = express.Router();
import {
  getActivities,
  getActivityAvailability,
  checkActivityAvailability,
} from '../controllers/activityController.js';

// Route to get all activities
router.get('/', getActivities);

// Availability checking routes
router.get('/:id/availability', getActivityAvailability);
router.post('/:id/check-availability', checkActivityAvailability);
router.post('/check-availability', checkActivityAvailability);

export default router;

