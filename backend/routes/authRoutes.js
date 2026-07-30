// src/routes/authRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { uploadProfilePhoto } from '../middleware/upload.js';
import * as authController from '../controllers/authController.js';
import csrfProtect from '../middleware/csrfProtect.js';

const router = express.Router();

router.post('/register', csrfProtect, uploadProfilePhoto.single('profileImage'), authController.register);
router.post('/login', csrfProtect, authController.login);
router.get('/me', protect, authController.getMe);
router.put('/update', csrfProtect, protect, uploadProfilePhoto.single('profileImage'), authController.updateProfile);
router.put('/change-password', csrfProtect, protect, authController.changePassword);

export default router;