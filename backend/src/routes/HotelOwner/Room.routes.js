import express from 'express';
import upload from '../../middleware/HotelOwner/upload.middleware.js';
import {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    updateRoomStatus,
    bulkUpdateRoomStatuses,
    deleteRoom,
    addBookingDate,
    updateBookingDate,
    syncBookings,
} from '../../controllers/HotelOwner/room.controller.js';

const router = express.Router();

router.route('/')
    .post(upload.array('images', 4), createRoom)
    .get(getAllRooms);

router.patch('/bulk-status', bulkUpdateRoomStatuses);
router.post('/sync-bookings', syncBookings);

router.route('/:id')
    .get(getRoomById)
    .put(upload.array('images', 4), updateRoom)
    .delete(deleteRoom);

router.patch('/:id/status', updateRoomStatus);
router.post('/:id/bookings', addBookingDate);
router.patch('/:id/bookings/:bookingId', updateBookingDate);

export default router;