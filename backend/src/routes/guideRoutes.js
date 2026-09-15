import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import {
  createRequest, listMyRequests, getMyRequest, updateMyRequest, cancelMyRequest, listRequestBids, confirmationPreview,
  createBooking, getTouristBooking, createReview, listOpportunities, createBid, listMyBids, updateMyBid, withdrawMyBid,
  providerBookings, providerBooking, updateProviderBookingStatus, dashboard, listPackages, createPackage, getPackage,
  updatePackage, earnings, getMyProfile, updateMyProfile, listPublicGuides, getPublicGuide,
} from '../controllers/Guide/guideController.js';

const router = express.Router();
const tourist = [protect, authorizeRoles('tourist_user')];
const guide = [protect, authorizeRoles('guide_user')];

router.post('/requests', ...tourist, createRequest);
router.get('/requests', ...tourist, listMyRequests);
router.get('/requests/:requestId', ...tourist, getMyRequest);
router.patch('/requests/:requestId', ...tourist, updateMyRequest);
router.patch('/requests/:requestId/cancel', ...tourist, cancelMyRequest);
router.get('/requests/:requestId/bids', ...tourist, listRequestBids);
router.get('/requests/:requestId/bids/:bidId/confirmation', ...tourist, confirmationPreview);
router.post('/bookings', ...tourist, createBooking);
router.get('/bookings/:bookingId', ...tourist, getTouristBooking);
router.post('/bookings/:bookingId/reviews', ...tourist, createReview);

router.get('/opportunities', ...guide, listOpportunities);
router.post('/requests/:requestId/bids', ...guide, createBid);
router.get('/bids/me', ...guide, listMyBids);
router.patch('/bids/:bidId', ...guide, updateMyBid);
router.patch('/bids/:bidId/withdraw', ...guide, withdrawMyBid);
router.get('/dashboard', ...guide, dashboard);
router.get('/provider/bookings', ...guide, providerBookings);
router.get('/provider/bookings/:bookingId', ...guide, providerBooking);
router.patch('/provider/bookings/:bookingId/status', ...guide, updateProviderBookingStatus);
router.get('/packages', ...guide, listPackages);
router.post('/packages', ...guide, createPackage);
router.get('/packages/:packageId', ...guide, getPackage);
router.patch('/packages/:packageId', ...guide, updatePackage);
router.get('/earnings', ...guide, earnings);
router.get('/me/profile', ...guide, getMyProfile);
router.patch('/me/profile', ...guide, updateMyProfile);

router.get('/', listPublicGuides);
router.get('/:guideId', getPublicGuide);

export default router;
