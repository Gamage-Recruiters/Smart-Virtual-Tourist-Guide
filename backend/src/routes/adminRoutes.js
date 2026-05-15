const express = require('express');
const router = express.Router();
const { 
    getDashboardStats, 
    getAllUsers, 
    getRecentActivities,
    createUser,
    updateUserStatus 
} = require('../controllers/adminController');

// Define API endpoints for the admin dashboard
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/activities', getRecentActivities);
router.post('/users', createUser);

// Route to create a new user (POST request)
router.post('/users', createUser);
router.put('/users/:id/status', updateUserStatus);

module.exports = router;