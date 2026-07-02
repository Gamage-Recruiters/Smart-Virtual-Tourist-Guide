const express = require('express');
const { createFavoritePlace, getFavoritePlaces, deleteFavoritePlace } = require('../controllers/favoriteController');

const router = express.Router();

router.get('/', getFavoritePlaces);
router.post('/', createFavoritePlace);
router.delete('/:id', deleteFavoritePlace);

module.exports = router;
