import express from 'express';
import { getTouristArrivalStats } from '../controllers/reportController.js';

const router = express.Router();

router.get('/tourist-stats', getTouristArrivalStats);

export default router;