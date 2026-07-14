import express from 'express';
import upload from '../middleware/upload.middleware.js';
import {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    updateRoomStatus,
    bulkUpdateRoomStatuses,
    deleteRoom
} from '../controllers/room.controller.js';

const router = express.Router();

router.route('/')
    .post(upload.array('images', 4), createRoom)
    .get(getAllRooms);

router.patch('/bulk-status', bulkUpdateRoomStatuses);

router.route('/:id')
    .get(getRoomById)
    .put(upload.array('images', 4), updateRoom)
    .delete(deleteRoom);

router.patch('/:id/status', updateRoomStatus);

export default router;