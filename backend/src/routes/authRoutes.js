import express from 'express';
import {
  loginUser,
  registerTourist,
  registerHotelOwner,
  registerGuide,
  registerRestaurant,
  registerRenter,
  registerGovernment,
  registerDriver,
  forgotPassword,
  resetPassword,
  updateTravelInfo,
  addHotelInfo,
  googleAuth,
} from '../controllers/authController.js';
import {
  validateTouristRegister,
  validateHotelOwnerRegister,
  validateGuideRegister,
  validateRestaurantRegister,
  validateRenterRegister,
  validateGovernmentRegister,
  validateDriverRegister,
  validateLogin,
  validateHotelInfo,
} from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Registration routes per role
router.post('/register/tourist', validateTouristRegister, registerTourist);
router.post('/register/hotel-owner', validateHotelOwnerRegister, registerHotelOwner);
router.post('/register/guide', validateGuideRegister, registerGuide);
router.post('/register/restaurant', validateRestaurantRegister, registerRestaurant);
router.post('/register/renter', validateRenterRegister, registerRenter);
router.post('/register/government', validateGovernmentRegister, registerGovernment);
router.post('/register/driver', validateDriverRegister, registerDriver);

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

export default router;
