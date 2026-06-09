const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, updateUserStatus } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Apply JWT protection to all routes below this line
router.use(protectAdmin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);

module.exports = router;