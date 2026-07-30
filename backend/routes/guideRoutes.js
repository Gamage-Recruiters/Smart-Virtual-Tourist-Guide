// src/routes/guideRoutes.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadProfilePhoto, uploadDocument } from '../middleware/upload.js';
import * as guideController from '../controllers/guideController.js';
import csrfProtect from '../middleware/csrfProtect.js';

const router = express.Router();

// All routes use default guest/user context
router.use(protect);

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

export default router;