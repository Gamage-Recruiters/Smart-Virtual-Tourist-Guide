// src/routes/hotelRoutes.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadProfilePhoto, uploadGallery, uploadDocument } from '../middleware/upload.js';
import * as hotelController from '../controllers/hotelController.js';
import csrfProtect from '../middleware/csrfProtect.js';

const router = express.Router();

// All routes use default guest/user context
router.use(protect);

// Profile management
router.get('/', hotelController.getProfile);
router.put('/', csrfProtect, hotelController.updateProfile);

// Image management
router.post('/images', csrfProtect, uploadGallery.array('images', 10), hotelController.uploadImages);
router.delete('/images/:imageId', csrfProtect, hotelController.deleteImage);

// Document management
router.post('/documents', csrfProtect, uploadDocument.single('document'), hotelController.uploadDocument);
router.delete('/documents/:documentId', csrfProtect, hotelController.deleteDocument);

export default router;