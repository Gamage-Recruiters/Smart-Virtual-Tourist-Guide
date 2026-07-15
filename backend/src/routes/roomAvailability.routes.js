import express from 'express';
import {
    getMonthlyCalendar,
    getRoomCalendar,
    setDayStatus,
    bulkSetStatus,
    resetDayStatus,
} from '../controllers/roomAvailability.controller.js';

const router = express.Router();

// GET  /api/room-availability/calendar?roomType=Deluxe Double Room&month=7&year=2026
router.get('/calendar', getMonthlyCalendar);

// GET  /api/room-availability/room/:roomId?month=7&year=2026
router.get('/room/:roomId', getRoomCalendar);

// PUT  /api/room-availability   { roomId, date, status, note }
router.put('/', setDayStatus);

// POST /api/room-availability/bulk   { roomId, startDate, endDate, status, note }
router.post('/bulk', bulkSetStatus);

// DELETE /api/room-availability   { roomId, date }
router.delete('/', resetDayStatus);

export default router;
