const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, updateUserStatus, getAllAds, updateAdStatus, createAdvertisement, deleteAdvertisement, getAdvertisementById, updateAdvertisement, deleteUser } = require('../controllers/adminController');

// 1
const { protectAdmin, authorizeRoles } = require('../middleware/authMiddleware');

// Apply JWT protection to all routes below this line
router.use(protectAdmin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getAllUsers);

// 2
router.put('/users/:id/status', authorizeRoles('Admin'), updateUserStatus);

router.get('/ads', getAllAds);
router.patch('/ads/:id/status', updateAdStatus);

// Add these below your existing advertisement routes
router.get('/ads/:id', getAdvertisementById);
router.put('/ads/:id', updateAdvertisement);
router.post('/ads', createAdvertisement);

// 3
router.delete('/ads/:id', authorizeRoles('Admin'), deleteAdvertisement);

// 4
router.delete('/users/:id', authorizeRoles('Admin'), deleteUser);

module.exports = router;