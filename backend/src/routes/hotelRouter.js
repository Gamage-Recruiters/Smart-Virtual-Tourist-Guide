import express from 'express';
import {
  getHotels,
  getRooms,
  getRoomById,
  getSpecialPackages,
  getUsersHotels,
  getBookingsByHotel,
  getRoomAvailability,
} from '../controllers/hotelController.js';

const router = express.Router();

// Hotel search & listings
router.get('/', getHotels);

// Additional hotel/room endpoints
router.get('/rooms', getRooms);
router.get('/rooms/:id', getRoomById);
router.get('/special-packages', getSpecialPackages);
router.get('/users/hotels', getUsersHotels);
router.get('/bookings/hotel/:hotelId', getBookingsByHotel);
router.get('/room-availability', getRoomAvailability);

export default router;

