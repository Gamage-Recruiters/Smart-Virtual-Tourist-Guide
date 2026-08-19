import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllAds,
  updateAdStatus,
  createAdvertisement,
  deleteAdvertisement,
  getAdvertisementById,
  updateAdvertisement,
  getDashboardAnalytics,
  getRecentActivities,
  deleteUser,
  getAdminPackages,
  approvePackage,
  rejectPackage,
  getPackageById,
} from '../controllers/adminController.js';
import {
  protectAdmin,
  authorizeRoles,
} from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.use(protectAdmin);

router.get('/dashboard-stats', authorizeRoles('Administrator'), getDashboardStats);
router.get('/users', authorizeRoles('Administrator'), getAllUsers);
router.put('/users/:id/status', authorizeRoles('Administrator'), updateUserStatus);
router.delete('/users/:id', authorizeRoles('Administrator'), deleteUser);

router.get('/dashboard-analytics', authorizeRoles('Administrator'), getDashboardAnalytics);
router.get('/recent-activities', authorizeRoles('Administrator'), getRecentActivities);

router.get('/ads', authorizeRoles('Administrator'), getAllAds);
router.post('/ads', authorizeRoles('Administrator'), createAdvertisement);
router.get('/ads/:id', authorizeRoles('Administrator'), getAdvertisementById);
router.put('/ads/:id', authorizeRoles('Administrator'), updateAdvertisement);
router.patch('/ads/:id/status', authorizeRoles('Administrator'), updateAdStatus);
router.delete('/ads/:id', authorizeRoles('Administrator'), deleteAdvertisement);

router.get(
  '/packages',
  authorizeRoles('Administrator', 'Moderator', 'Editor'),
  getAdminPackages
);
router.get(
  '/packages/:id',
  authorizeRoles('Administrator', 'Moderator', 'Editor'),
  getPackageById
);
router.patch(
  '/packages/:id/approve',
  authorizeRoles('Administrator', 'Moderator'),
  approvePackage
);
router.patch(
  '/packages/:id/reject',
  authorizeRoles('Administrator', 'Moderator'),
  rejectPackage
);

export default router;