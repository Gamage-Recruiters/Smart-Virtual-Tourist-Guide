import express from 'express';

import {
  loginUser,
  registerTourist,
  registerHotelOwner,
  registerGuide,
  registerRestaurant,
  registerRenter,
  registerActivityProvider,
  registerGovernment,
  registerDriver,
  forgotPassword,
  resetPassword,
  updateTravelInfo,
  addHotelInfo,
  googleAuth,
  getMe
} from '../controllers/authController.js';
import {
  validateTouristRegister,
  validateHotelOwnerRegister,
  validateGuideRegister,
  validateRestaurantRegister,
  validateRenterRegister,
  validateActivityProviderRegister,
  validateGovernmentRegister,
  validateDriverRegister,
  validateLogin,
  validateHotelInfo,
} from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadDriverDocs } from '../config/cloudinary.js';

const router = express.Router();

// Registration routes per role
router.post('/register/tourist', validateTouristRegister, registerTourist);
router.post('/register/hotel-owner', validateHotelOwnerRegister, registerHotelOwner);
router.post('/register/guide', validateGuideRegister, registerGuide);
router.post('/register/restaurant', validateRestaurantRegister, registerRestaurant);
router.post('/register/renter', validateRenterRegister, registerRenter);
router.post('/register/activity-provider', validateActivityProviderRegister, registerActivityProvider);
router.post('/register/government', validateGovernmentRegister, registerGovernment);
router.post(
  '/register/driver',
  uploadDriverDocs.fields([
    { name: 'licenseImages', maxCount: 5 },
    { name: 'regBookImages', maxCount: 5 },
    { name: 'vehicleImages', maxCount: 10 }
  ]),
  validateDriverRegister,
  registerDriver
);

// Unified login route
router.post('/login', validateLogin, loginUser);

// Google OAuth route (Firebase ID token verification)
router.post('/google', googleAuth);

// Update travel preferences & safety info (protected)
router.put('/update-travel-info', protect, updateTravelInfo);

// Add hotel info (protected - hotelowner_user only)
router.post('/add-hotel-info', protect, validateHotelInfo, addHotelInfo);

// Password recovery routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected route: returns the authenticated user's profile based on JWT token
// Used for session handling and fetching current user data after login
router.get('/me', protect, getMe);

export default router;
