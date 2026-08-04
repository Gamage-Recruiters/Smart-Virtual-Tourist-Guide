import express from 'express';
import activityBookingController from '../../controllers/ActivityProvider/activityBooking.controller.js';

const router = express.Router();

router.get('/', activityBookingController.getBookings);
router.patch('/:id/status', activityBookingController.updateBookingStatus);

export default router;
