import express from 'express';
import { createRecentPlace, getRecentPlaces, deleteRecentPlace } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getRecentPlaces);
router.post('/', createRecentPlace);
router.delete('/:id', deleteRecentPlace);

export default router;
