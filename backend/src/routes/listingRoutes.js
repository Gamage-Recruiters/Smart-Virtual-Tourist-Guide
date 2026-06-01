const express = require('express');
const router = express.Router();
const { getAllListings, updateListingStatus } = require('../controllers/listingController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Secure all listing approval routes
router.use(protectAdmin);

router.get('/all', getAllListings);
router.put('/:id/status', updateListingStatus);

module.exports = router;