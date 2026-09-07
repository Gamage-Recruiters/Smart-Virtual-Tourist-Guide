import express from 'express';
import { getBookingsByTourist } from '../controllers/bookingController.js'; 

const router = express.Router();

router.get("/my-bookings/:email", getBookingsByTourist);

export default router;