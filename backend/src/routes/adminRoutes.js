const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, updateUserStatus, getAllAds, updateAdStatus, createAdvertisement, deleteAdvertisement, getAdvertisementById, updateAdvertisement } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Apply JWT protection to all routes below this line
router.use(protectAdmin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/ads', getAllAds);
router.patch('/ads/:id/status', updateAdStatus);

// Add these below your existing advertisement routes
router.get('/ads/:id', getAdvertisementById);
router.put('/ads/:id', updateAdvertisement);
router.post('/ads', createAdvertisement);
router.delete('/ads/:id', deleteAdvertisement);

module.exports = router;