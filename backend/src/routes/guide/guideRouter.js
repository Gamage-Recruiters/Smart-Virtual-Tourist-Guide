import express from 'express';
import asyncHandler from '../../utils/asyncHandler.js';
import {authenticate, optionalAuthenticate, requireRole} from '../../middleware/auth.js';
import * as requestController from '../../controllers/guide/guideRequestController.js';
import * as bidController from '../../controllers/guide/guideBidController.js';
import * as profileController from '../../controllers/guide/guideProfileController.js';
import * as bookingController from '../../controllers/guide/guideBookingController.js';
import * as reviewController from '../../controllers/guide/guideReviewController.js';
import * as notificationController from '../../controllers/guide/guideNotificationController.js';

const router = express.Router();
const tourist = [authenticate, requireRole('tourist_user', 'admin')];
const guide = [authenticate, requireRole('guide_user', 'admin')];

router.get('/', asyncHandler(profileController.listPublic));
router.get('/opportunities', ...guide, asyncHandler(requestController.opportunities));

router.get('/me/profile', ...guide, asyncHandler(profileController.getOwn));
router.post('/me/profile', ...guide, asyncHandler(profileController.createOwn));
router.patch('/me/profile', ...guide, asyncHandler(profileController.updateOwn));
router.get('/me/bids', ...guide, asyncHandler(bidController.listOwn));
router.get('/me/notifications', authenticate, asyncHandler(notificationController.list));
router.patch('/me/notifications/:notificationId/read', authenticate, asyncHandler(notificationController.markRead));

router.get('/bookings/reference/:bookingReference', authenticate, asyncHandler(bookingController.getByReference));
router.post('/bookings', ...tourist, asyncHandler(bookingController.confirm));
router.get('/bookings/:bookingId', authenticate, asyncHandler(bookingController.getById));
router.patch('/bookings/:bookingId/cancel', authenticate, asyncHandler(bookingController.cancel));
router.patch('/bookings/:bookingId/complete', ...guide, asyncHandler(bookingController.complete));
router.post('/bookings/:bookingId/reviews', ...tourist, asyncHandler(reviewController.create));

router.get('/requests', ...tourist, asyncHandler(requestController.list));
router.post('/requests', ...tourist, asyncHandler(requestController.create));
router.get('/requests/:requestId/bids/:bidId/confirmation', ...tourist, asyncHandler(bookingController.preview));
router.get('/requests/:requestId/bids/:bidId', ...tourist, asyncHandler(bidController.getForRequest));
router.get('/requests/:requestId/bids', ...tourist, asyncHandler(bidController.listForRequest));
router.post('/requests/:requestId/bids', ...guide, asyncHandler(bidController.submit));
router.patch('/requests/:requestId/cancel', ...tourist, asyncHandler(requestController.cancel));
router.get('/requests/:requestId', ...tourist, asyncHandler(requestController.get));
router.patch('/requests/:requestId', ...tourist, asyncHandler(requestController.update));

router.patch('/bids/:bidId/withdraw', ...guide, asyncHandler(bidController.withdraw));
router.patch('/bids/:bidId', ...guide, asyncHandler(bidController.update));

router.get('/:guideId', optionalAuthenticate, asyncHandler(profileController.publicProfile));

export default router;
