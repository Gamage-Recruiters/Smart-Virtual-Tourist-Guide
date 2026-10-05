import express from 'express';
import { getDrivers } from '../controllers/providerPublicController.js';

const router = express.Router();

router.get('/', getDrivers);

export default router;
