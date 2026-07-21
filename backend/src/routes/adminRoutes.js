const express = require('express');
const router = express.Router();
const { 
    getDashboardStats, 
    getAllUsers, 
    updateUserStatus, 
    getAllAds, 
    updateAdStatus, 
    createAdvertisement, 
    deleteAdvertisement, 
    getAdvertisementById, 
    updateAdvertisement, 
    deleteUser 
} = require('../controllers/adminController');

// 1
const { protectAdmin, authorizeRoles } = require('../middleware/authMiddleware');

// Apply JWT protection to all routes below this line
router.use(protectAdmin);

// === SECURED ROUTES === //
router.get('/dashboard-stats', authorizeRoles('Admin'), getDashboardStats);
router.get('/users', authorizeRoles('Admin'), getAllUsers);

// 2
router.put('/users/:id/status', authorizeRoles('Admin'), updateUserStatus);

router.get('/ads', authorizeRoles('Admin'), getAllAds);
router.patch('/ads/:id/status', authorizeRoles('Admin'), updateAdStatus);

// Add these below your existing advertisement routes
router.get('/ads/:id', authorizeRoles('Admin'), getAdvertisementById);
router.put('/ads/:id', authorizeRoles('Admin'), updateAdvertisement);
router.post('/ads', authorizeRoles('Admin'), createAdvertisement);

// 3
router.delete('/ads/:id', authorizeRoles('Admin'), deleteAdvertisement);

// 4
router.delete('/users/:id', authorizeRoles('Admin'), deleteUser);

module.exports = router;