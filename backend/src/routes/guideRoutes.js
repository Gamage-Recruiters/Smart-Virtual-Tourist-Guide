import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import {
  cancelGuideRequest,
  createBooking,
  createGuidePackage,
  createGuideRequest,
  createGuideReview,
  getBooking,
  getBookingConfirmation,
  getGuideDashboard,
  getGuideEarnings,
  getGuidePackage,
  getGuideRequest,
  getMyGuideProfile,
  getProviderBooking,
  getPublicGuide,
  listGuidePackages,
  listMyBids,
  listMyGuideRequests,
  listOpportunities,
  listProviderBookings,
  listPublicGuides,
  listRequestBids,
  submitBid,
  updateBid,
  updateGuidePackage,
  updateGuideRequest,
  updateMyGuideProfile,
  updateProviderBookingStatus,
  withdrawBid,
} from '../controllers/guideController.js';

const router = express.Router();
const touristOnly = [protect, authorizeRoles('tourist_user')];
const guideOnly = [protect, authorizeRoles('guide_user')];

// Public guide marketplace.
router.get('/', listPublicGuides);

// Tourist request and booking workflow.
router.post('/requests', ...touristOnly, createGuideRequest);
router.get('/requests', ...touristOnly, listMyGuideRequests);
router.get('/requests/:requestId', ...touristOnly, getGuideRequest);
router.patch('/requests/:requestId', ...touristOnly, updateGuideRequest);
router.patch('/requests/:requestId/cancel', ...touristOnly, cancelGuideRequest);
router.get('/requests/:requestId/bids', ...touristOnly, listRequestBids);
router.get('/requests/:requestId/bids/:bidId/confirmation', ...touristOnly, getBookingConfirmation);
router.post('/bookings', ...touristOnly, createBooking);
router.get('/bookings/:bookingId', protect, getBooking);
router.post('/bookings/:bookingId/reviews', ...touristOnly, createGuideReview);

// Guide/provider workflow.
router.get('/opportunities', ...guideOnly, listOpportunities);
router.post('/requests/:requestId/bids', ...guideOnly, submitBid);
router.get('/bids/me', ...guideOnly, listMyBids);
router.patch('/bids/:bidId', ...guideOnly, updateBid);
router.patch('/bids/:bidId/withdraw', ...guideOnly, withdrawBid);
router.get('/dashboard', ...guideOnly, getGuideDashboard);
router.get('/provider/bookings', ...guideOnly, listProviderBookings);
router.get('/provider/bookings/:bookingId', ...guideOnly, getProviderBooking);
router.patch('/provider/bookings/:bookingId/status', ...guideOnly, updateProviderBookingStatus);
router.get('/packages', ...guideOnly, listGuidePackages);
router.post('/packages', ...guideOnly, createGuidePackage);
router.get('/packages/:packageId', ...guideOnly, getGuidePackage);
router.patch('/packages/:packageId', ...guideOnly, updateGuidePackage);
router.get('/earnings', ...guideOnly, getGuideEarnings);
router.get('/me/profile', ...guideOnly, getMyGuideProfile);
router.patch('/me/profile', ...guideOnly, updateMyGuideProfile);

// Keep the dynamic public guide route last to avoid shadowing named endpoints.
router.get('/:guideId', getPublicGuide);

export default router;
