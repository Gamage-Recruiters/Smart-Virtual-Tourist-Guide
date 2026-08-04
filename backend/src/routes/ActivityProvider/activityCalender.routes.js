import express from 'express';
import calendarController from '../../controllers/ActivityProvider/activityCalender.controller.js';

const router = express.Router({ mergeParams: true });

// All routes are scoped under /api/calendar/:activityId
router.get('/month',              calendarController.getMonthCalendar);    // ?year=2025&month=6
router.get('/summary',            calendarController.getSummary);
router.get('/date/:date',         calendarController.getDateDetail);
router.post('/date/:date',        calendarController.saveCalendarDate);
router.patch('/date/:date/unavailable', calendarController.markUnavailable);

export default router;
