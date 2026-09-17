import express from 'express';
const router = express.Router();
import * as bookingController from '../controllers/bookingController.js';

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getBookings);
router.post('/type/:serviceType', bookingController.createBooking);
router.get('/type/:serviceType', bookingController.getBookings);
router.get('/:id', bookingController.getBookingById);

export default router;
