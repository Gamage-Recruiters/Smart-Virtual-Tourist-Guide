// backend/src/routes/touristHotelView.js
import express from 'express';
import {
  getHotels,
  getMetaDistricts,
  getMetaCities,
  getLocations,
  searchHotelsByDate,
  checkRoomTypeAvailability,
  getHotelBookings,
  getHotelRooms,
  getCheapestRoom,
  getHotelPackages,
  getHotelById,
} from '../controllers/touristHotelViewController.js';

const router = express.Router();

// Static routes first (must come before /:id)
router.get('/', getHotels);
router.get('/meta/districts', getMetaDistricts);
router.get('/meta/cities', getMetaCities);
router.get('/locations', getLocations);
router.get('/search-by-date', searchHotelsByDate);
router.get('/check-room-type-availability', checkRoomTypeAvailability);

// Nested param routes
router.get('/:hotelId/bookings', getHotelBookings);
router.get('/:hotelId/rooms', getHotelRooms);
router.get('/:hotelId/rooms/cheapest', getCheapestRoom);
router.get('/:hotelId/packages', getHotelPackages);

// Catch-all last
router.get('/:id', getHotelById);

export default router;