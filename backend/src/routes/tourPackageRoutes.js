import express from 'express';
import {
  createPackage,
  listPackages,
  getPackageById,
  updatePackage,
  updateStatus,
  deletePackage,
  addRouteStop,
  updateRouteStop,
  removeRouteStop,
  uploadPhotos,
  removePhoto,
} from '../controllers/tourPackageController.js';
import { protect, authorizeRoles, optionalProtect } from '../middleware/authMiddleware.js';

import { uploadTourPhotos } from '../middleware/tourPackageUpload.js';
import { validateDraftPackage } from '../validators/tourPackageValidator.js';

const router = express.Router();

// Root package collection routes
router
  .route('/')
  .get(optionalProtect, listPackages)
  .post(protect, authorizeRoles('guide_user', 'guide', 'admin'), validateDraftPackage, createPackage);


// Individual package CRUD routes
router
  .route('/:id')
  .get(getPackageById)
  .put(protect, authorizeRoles('guide_user', 'guide', 'admin'), updatePackage)
  .delete(protect, authorizeRoles('guide_user', 'guide', 'admin'), deletePackage);

// Status change endpoint (Save as Draft / Publish Package / Archive)
router
  .route('/:id/status')
  .patch(protect, authorizeRoles('guide_user', 'guide', 'admin'), updateStatus);

// Route stops management endpoints
router
  .route('/:id/route-stops')
  .post(protect, authorizeRoles('guide_user', 'guide', 'admin'), addRouteStop);

router
  .route('/:id/route-stops/:stopId')
  .put(protect, authorizeRoles('guide_user', 'guide', 'admin'), updateRouteStop)
  .delete(protect, authorizeRoles('guide_user', 'guide', 'admin'), removeRouteStop);

// Photo upload management endpoints
router
  .route('/:id/photos')
  .post(protect, authorizeRoles('guide_user', 'guide', 'admin'), uploadTourPhotos.array('photos', 10), uploadPhotos);

router
  .route('/:id/photos/:photoId')
  .delete(protect, authorizeRoles('guide_user', 'guide', 'admin'), removePhoto);

export default router;
