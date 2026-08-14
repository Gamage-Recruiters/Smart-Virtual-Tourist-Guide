import express from 'express';
import {
    getMonthlyCalendar,
    getRoomCalendar,
    saveBlockedDates,
    saveMaintenanceDates,
    updateBlockedPeriod,
    updateMaintenancePeriod,
} from '../../controllers/HotelOwner/roomAvailability.controller.js';

const router = express.Router();

// GET  /api/room-availability/calendar?roomType=...&month=...&year=...
router.get('/calendar', getMonthlyCalendar);

// GET  /api/room-availability/room/:roomId?month=...&year=...
router.get('/room/:roomId', getRoomCalendar);

// POST /api/room-availability/blocked      { roomId, periods: [{startDate, endDate}] }
router.post('/blocked', saveBlockedDates);

// POST /api/room-availability/maintenance  { roomId, periods: [{startDate, endDate}] }
router.post('/maintenance', saveMaintenanceDates);

// PATCH /api/room-availability/:roomId/blocked/:periodId
router.patch('/:roomId/blocked/:periodId', updateBlockedPeriod);

// PATCH /api/room-availability/:roomId/maintenance/:periodId
router.patch('/:roomId/maintenance/:periodId', updateMaintenancePeriod);

export default router;
