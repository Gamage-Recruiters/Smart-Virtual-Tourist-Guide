// src/routes/restaurantRoutes.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadProfilePhoto, uploadGallery } from '../middleware/upload.js';
import * as restaurantController from '../controllers/restaurantController.js';
import csrfProtect from '../middleware/csrfProtect.js';

const router = express.Router();

// All routes use default guest/user context
router.use(protect);

// Profile management
router.get('/', restaurantController.getProfile);
router.put('/', csrfProtect, restaurantController.updateProfile);

// Photo management
router.post('/photo', csrfProtect, uploadProfilePhoto.single('profileImage'), restaurantController.uploadPhoto);
router.post('/gallery', csrfProtect, uploadGallery.array('gallery', 10), restaurantController.uploadGallery);
router.delete('/gallery/:imageId', csrfProtect, restaurantController.deleteGalleryImage);

export default router;