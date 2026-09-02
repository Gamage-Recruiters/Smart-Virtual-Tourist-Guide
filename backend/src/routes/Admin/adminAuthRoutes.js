import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} from '../../controllers/Admin/adminAuthController.js';
import {
  protectAdmin,
  authorizeRoles,
} from '../../middleware/Admin/adminAuthMiddleware.js';
import loginRateLimiter from '../../middleware/Admin/loginRateLimiter.js';

const router = express.Router();

router.post('/login', loginRateLimiter, loginAdmin);
router.post(
  '/register',
  protectAdmin,
  authorizeRoles('Administrator'),
  registerAdmin
);
router.get('/profile', protectAdmin, getAdminProfile);

export default router;