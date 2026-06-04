import express from 'express';
import activityController from '../controllers/activity.controller.js';
import {
	uploadActivityImages,
	uploadActivityImagesToCloudinary,
} from '../middleware/uploadActivityImages.js';

const router = express.Router();

// List activities
router.get('/', activityController.getActivities);

// Get single activity
router.get('/:id', activityController.getActivityById);

// Create activity (with optional image upload middleware)
router.post(
	'/',
	uploadActivityImages.array('images', 5),
	uploadActivityImagesToCloudinary,
	activityController.createActivity
);

// Update activity
router.put(
	'/:id',
	uploadActivityImages.array('images', 5),
	uploadActivityImagesToCloudinary,
	activityController.updateActivity
);

// Delete activity
router.delete('/:id', activityController.deleteActivity);

// Publish activity
router.patch('/:id/publish', activityController.publishActivity);

export default router;
