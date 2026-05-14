// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminController');

// GET request 
router.get('/stats', getAdminStats);

module.exports = router;