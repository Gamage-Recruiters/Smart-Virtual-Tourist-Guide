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
    getDashboardAnalytics,
    deleteUser 
} = require('../controllers/adminController');

// 1
const { protectAdmin, authorizeRoles } = require('../middleware/authMiddleware');

// Apply JWT protection to all routes below this line
router.use(protectAdmin);

// === SECURED ROUTES === //
router.get('/dashboard-stats', authorizeRoles('Admin', 'Administrator'), getDashboardStats);
router.get('/users', authorizeRoles('Admin', 'Administrator'), getAllUsers);

// 2
router.put('/users/:id/status', authorizeRoles('Admin', 'Administrator'), updateUserStatus);
router.get('/dashboard-analytics', authorizeRoles('Admin', 'Administrator'), getDashboardAnalytics);

router.get('/ads', authorizeRoles('Admin', 'Administrator'), getAllAds);
router.patch('/ads/:id/status', authorizeRoles('Admin', 'Administrator'), updateAdStatus);

// Add these below your existing advertisement routes
router.get('/ads/:id', authorizeRoles('Admin', 'Administrator'), getAdvertisementById);
router.put('/ads/:id', authorizeRoles('Admin', 'Administrator'), updateAdvertisement);
router.post('/ads', authorizeRoles('Admin', 'Administrator'), createAdvertisement);

// 3
router.delete('/ads/:id', authorizeRoles('Admin', 'Administrator'), deleteAdvertisement);

// 4
router.delete('/users/:id', authorizeRoles('Admin', 'Administrator'), deleteUser);

module.exports = router;