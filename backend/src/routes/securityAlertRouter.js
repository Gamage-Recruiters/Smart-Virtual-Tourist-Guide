import express from 'express';
import { getSecurityAlerts, getWeatherAlerts, getCrimeAlerts } from '../controllers/securityAlertController.js';

const router = express.Router();

router.get('/', getSecurityAlerts);
router.get('/weather', getWeatherAlerts);
router.get('/crime', getCrimeAlerts);

export default router;
