import express from 'express';
import { createRecentPlace, getRecentPlaces, deleteRecentPlace } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getRecentPlaces);
router.post('/', protect, createRecentPlace);
router.delete('/:id', protect, deleteRecentPlace);

export default router;
