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

// Route to fetch all listings and stats (Accessible to Admin, Moderator, and Editor)
router.get('/all', authorizeRoles('Admin', 'Moderator', 'Editor'), getAllListings);

// Route to approve a listing (Restricted to Admin and Moderator only)
router.patch('/:id/approve', authorizeRoles('Admin', 'Moderator'), approveListing);

// Route to reject a listing (Restricted to Admin and Moderator only)
router.patch('/:id/reject', authorizeRoles('Admin', 'Moderator'), rejectListing);

router.get('/:id', authorizeRoles('Admin', 'Moderator', 'Editor'), getListingById);

module.exports = router;