import express from 'express';
import { createDestination, getAllDestinations } from '../controllers/destinationController.js';

const router = express.Router();

router.post('/', createDestination);
router.get('/', getAllDestinations);

export default router;
