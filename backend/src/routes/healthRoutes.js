import express from 'express';
import { getVaccinations, getIncidentCount } from '../controllers/healthController.js';

const router = express.Router();

router.get('/vaccinations/:touristId', getVaccinations);
router.get('/incidents/count/:touristId', getIncidentCount);

export default router;