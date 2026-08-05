import express from 'express';
import { getVaccinations, getIncidentCount, getMedicalInfo } from '../controllers/healthController.js';

const router = express.Router();

router.get('/vaccinations/:touristId', getVaccinations);
router.get('/incidents/count/:touristId', getIncidentCount);
router.get("/medical-info/:touristId", getMedicalInfo);

export default router;