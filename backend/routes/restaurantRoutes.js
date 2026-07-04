// src/routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadProfilePhoto, uploadGallery } = require('../middleware/upload');
const restaurantController = require('../controllers/restaurantController');
const csrfProtect = require('../middleware/csrfProtect');

// All routes require authentication and restaurant role
router.use(protect);
router.use(authorize('restaurant'));

// Profile management
router.get('/', restaurantController.getProfile);
router.put('/', csrfProtect, restaurantController.updateProfile);

// Photo management
router.post('/photo', csrfProtect, uploadProfilePhoto.single('profileImage'), restaurantController.uploadPhoto);
router.post('/gallery', csrfProtect, uploadGallery.array('gallery', 10), restaurantController.uploadGallery);
router.delete('/gallery/:imageId', csrfProtect, restaurantController.deleteGalleryImage);

module.exports = router;