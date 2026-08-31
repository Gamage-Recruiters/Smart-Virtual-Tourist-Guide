import express from 'express';
import { createBooking, updateBooking, cancelBooking, getBookingsByHotel } from '../../controllers/HotelOwner/tempHotBook.controller.js';

const router = express.Router();

router.post('/', createBooking);
router.put('/:id', updateBooking);
router.put('/:id/cancel', cancelBooking);
router.get('/hotel/:hotelId', getBookingsByHotel);

export default router;
