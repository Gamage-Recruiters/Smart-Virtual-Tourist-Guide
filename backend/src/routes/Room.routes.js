import express from 'express';
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

// Base /api/rooms endpoints
router.route('/')
    .post(createRoom)     // POST: Create a room
    .get(getAllRooms);    // GET: Fetch rooms (supports query params: ?status=Available&roomType=Standard Room)

// Bulk operation endpoint
router.patch('/bulk-status', bulkUpdateRoomStatuses); // PATCH: Update multiple room statuses simultaneously

// Document ID-specific endpoints
router.route('/:id')
    .get(getRoomById)     // GET: Retrieve a single room
    .put(updateRoom)      // PUT: Structurally update full room properties
    .delete(deleteRoom);  // DELETE: Remove room from inventory

// Single status quick-update toggle 
router.patch('/:id/status', updateRoomStatus); // PATCH: Quick updates for single room status changes

export default router;