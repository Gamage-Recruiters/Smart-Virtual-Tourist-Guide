// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers } = require('../controllers/adminController');

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);

module.exports = router;