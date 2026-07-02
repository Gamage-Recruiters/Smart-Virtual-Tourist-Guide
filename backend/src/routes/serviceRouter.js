const express = require('express');
const { createRecentPlace, getRecentPlaces, deleteRecentPlace } = require('../controllers/serviceController');

const router = express.Router();

router.get('/', getRecentPlaces);
router.post('/', createRecentPlace);
router.delete('/:id', deleteRecentPlace);

module.exports = router;
