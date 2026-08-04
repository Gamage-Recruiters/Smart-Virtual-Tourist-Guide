import express from 'express';
import { getAvailability, getAvailabilityByDate } from '../../controllers/ActivityProvider/availability.controller.js';

const router = express.Router();

router.get('/', getAvailability);
router.get('/date/:date', getAvailabilityByDate);

export default router;
