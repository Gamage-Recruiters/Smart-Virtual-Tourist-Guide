const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile } = require('../controllers/authController');
const { protectAdmin, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes for authentication
router.post('/login', loginAdmin);
router.post('/register', protectAdmin, authorizeRoles('Administrator'), registerAdmin);

// // Route to fetch all users for the management table
// router.get('/users', getAllUsers); 

// router.put('/users/:id/status', toggleUserStatus);
// Example of a protected route (Only logged-in admins can access this)
router.get('/profile', protectAdmin, getAdminProfile);

module.exports = router;
