import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tourist dashboard route (protected & restricted to 'tourist_user')
router.get(
  '/tourist',
  protect,
  authorizeRoles('tourist_user'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to the Tourist Dashboard',
      user: req.user,
    });
  }
);

// Hotel Owner dashboard route (protected & restricted to 'hotelowner_user')
router.get(
  '/hotel-owner',
  protect,
  authorizeRoles('hotelowner_user'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to the Hotel Owner Dashboard',
      user: req.user,
    });
  }
);

// Guide dashboard route (protected & restricted to 'guide_user')
router.get(
  '/guide',
  protect,
  authorizeRoles('guide_user'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to the Guide Dashboard',
      user: req.user,
    });
  }
);

// Restaurant dashboard route (protected & restricted to 'restaurant_user')
router.get(
  '/restaurant',
  protect,
  authorizeRoles('restaurant_user'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to the Restaurant Dashboard',
      user: req.user,
    });
  }
);

// Renter dashboard route (protected & restricted to 'renter_user')
router.get(
  '/renter',
  protect,
  authorizeRoles('renter_user'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to the Renter Dashboard',
      user: req.user,
    });
  }
);

// Government dashboard route (protected & restricted to 'government_user')
router.get(
  '/government',
  protect,
  authorizeRoles('government_user'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to the Government Dashboard',
      user: req.user,
    });
  }
);

export default router;
