// src/routes/guideRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadProfilePhoto, uploadDocument } = require('../middleware/upload');
const guideController = require('../controllers/guideController');
const csrfProtect = require('../middleware/csrfProtect');

// All routes require authentication and guide role
router.use(protect);
router.use(authorize('guide'));

// Profile management
router.get('/', guideController.getProfile);
router.put('/', csrfProtect, guideController.updateProfile);

// Photo management
router.post('/photo', csrfProtect, uploadProfilePhoto.single('profilePhoto'), guideController.uploadPhoto);

// Document management
router.post('/documents', csrfProtect, uploadDocument.single('document'), guideController.uploadDocument);
router.delete('/documents/:documentId', csrfProtect, guideController.deleteDocument);

// Status
router.get('/status', guideController.getStatus);

module.exports = router;