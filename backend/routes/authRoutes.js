// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadProfilePhoto } = require('../middleware/upload');
const authController = require('../controllers/authController');
const csrfProtect = require('../middleware/csrfProtect');

router.post('/register', csrfProtect, uploadProfilePhoto.single('profileImage'), authController.register);
router.post('/login', csrfProtect, authController.login);
router.get('/me', protect, authController.getMe);
router.put('/update', csrfProtect, protect, uploadProfilePhoto.single('profileImage'), authController.updateProfile);
router.put('/change-password', csrfProtect, protect, authController.changePassword);

module.exports = router;