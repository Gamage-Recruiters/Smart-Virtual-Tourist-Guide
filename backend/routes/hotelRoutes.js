// src/routes/hotelRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadProfilePhoto, uploadGallery, uploadDocument } = require('../middleware/upload');
const hotelController = require('../controllers/hotelController');
const csrfProtect = require('../middleware/csrfProtect');

// All routes require authentication and hotel role
router.use(protect);
router.use(authorize('hotel'));

// Profile management
router.get('/', hotelController.getProfile);
router.put('/', csrfProtect, hotelController.updateProfile);

// Image management
router.post('/images', csrfProtect, uploadGallery.array('images', 10), hotelController.uploadImages);
router.delete('/images/:imageId', csrfProtect, hotelController.deleteImage);

// Document management
router.post('/documents', csrfProtect, uploadDocument.single('document'), hotelController.uploadDocument);
router.delete('/documents/:documentId', csrfProtect, hotelController.deleteDocument);

module.exports = router;