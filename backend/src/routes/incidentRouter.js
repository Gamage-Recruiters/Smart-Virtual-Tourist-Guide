import express from 'express';
import { getPublicIncidents } from '../controllers/incidentController.js';

const router = express.Router();

router.get('/public', getPublicIncidents);

export default router;
