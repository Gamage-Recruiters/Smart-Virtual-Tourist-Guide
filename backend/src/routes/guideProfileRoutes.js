import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  removeProfilePhoto,
  uploadIdentityProof,
  uploadCertifications,
  removeCertification,
} from '../controllers/guideProfileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadPhoto, uploadIdentity, uploadCerts } from '../middleware/upload.js';
import { validateGuideProfile } from '../validators/guideProfileValidator.js';

const router = express.Router();

// Profile CRUD Routes
router
  .route('/:id/profile')
  .get(protect, getProfile)
  .put(protect, validateGuideProfile, updateProfile);

// Profile Photo Routes
router
  .route('/:id/profile/photo')
  .post(protect, uploadPhoto.single('profilePhoto'), uploadProfilePhoto)
  .delete(protect, removeProfilePhoto);

// Document Verification Routes
router
  .route('/:id/profile/documents/identity')
  .post(protect, uploadIdentity.single('identityProof'), uploadIdentityProof);

router
  .route('/:id/profile/documents/certifications')
  .post(protect, uploadCerts.array('certifications', 5), uploadCertifications);

router
  .route('/:id/profile/documents/certifications/:fileId')
  .delete(protect, removeCertification);

export default router;
