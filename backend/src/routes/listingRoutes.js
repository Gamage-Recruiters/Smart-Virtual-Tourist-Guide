const express = require('express');
const router = express.Router();
const { 
    getAllListings, 
    approveListing, 
    rejectListing,
    getListingById 
} = require('../controllers/listingController');
const { protectAdmin, authorizeRoles } = require('../middleware/authMiddleware');

// Secure all listing routes with basic authentication first
router.use(protectAdmin);

// Route to fetch all listings and stats (Accessible to Administrator, Moderator, and Editor)
router.get('/all', authorizeRoles('Administrator', 'Moderator', 'Editor'), getAllListings);

// Route to approve a listing (Restricted to Administrator and Moderator only)
router.patch('/:id/approve', authorizeRoles('Administrator', 'Moderator'), approveListing);

// Route to reject a listing (Restricted to Administrator and Moderator only)
router.patch('/:id/reject', authorizeRoles('Administrator', 'Moderator'), rejectListing);

router.get('/:id', authorizeRoles('Administrator', 'Moderator', 'Editor'), getListingById);
module.exports = router;