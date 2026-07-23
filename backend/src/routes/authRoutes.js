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
  getMe,
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

const authRouter = express.Router();

// Registration routes per role
authRouter.post('/register/tourist', validateTouristRegister, registerTourist);
authRouter.post('/register/hotel-owner', validateHotelOwnerRegister, registerHotelOwner);
authRouter.post('/register/guide', validateGuideRegister, registerGuide);
authRouter.post('/register/restaurant', validateRestaurantRegister, registerRestaurant);
authRouter.post('/register/renter', validateRenterRegister, registerRenter);
authRouter.post('/register/government', validateGovernmentRegister, registerGovernment);
authRouter.post('/register/driver', validateDriverRegister, registerDriver);

// Unified login route
authRouter.post('/login', validateLogin, loginUser);

// Google OAuth route (Firebase ID token verification)
authRouter.post('/google', googleAuth);

// Update travel preferences & safety info (protected)
authRouter.put('/update-travel-info', protect, updateTravelInfo);

// Add hotel info (protected - hotelowner_user only)
authRouter.post('/add-hotel-info', protect, validateHotelInfo, addHotelInfo);

// Password recovery routes
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);


// Protected route: returns the authenticated user's profile based on JWT token
// Used for session handling and fetching current user data after login
authRouter.get('/me', protect, getMe);

export default authRouter; 
