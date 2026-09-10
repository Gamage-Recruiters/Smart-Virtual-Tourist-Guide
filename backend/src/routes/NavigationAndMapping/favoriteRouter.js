import express from 'express';
import { createFavoritePlace, getFavoritePlaces, deleteFavoritePlace } from '../../controllers/NavigationAndMapping/favoriteController.js';

const router = express.Router();

router.get('/', getFavoritePlaces);
router.post('/', createFavoritePlace);
router.delete('/:id', deleteFavoritePlace);

export default router;
