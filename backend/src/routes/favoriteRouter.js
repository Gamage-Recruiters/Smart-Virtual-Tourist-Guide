import express from 'express';
import { createFavoritePlace, getFavoritePlaces, deleteFavoritePlace } from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getFavoritePlaces);
router.post('/', protect, createFavoritePlace);
router.delete('/:id', protect, deleteFavoritePlace);

export default router;
