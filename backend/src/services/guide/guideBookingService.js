import crypto from 'crypto';
import mongoose from 'mongoose';
import GuideBid from '../../models/GuideBid.js';
import GuideBooking from '../../models/GuideBooking.js';
import GuideProfile from '../../models/GuideProfile.js';
import GuideRequest from '../../models/GuideRequest.js';
import AppError from '../../utils/AppError.js';
import {bookingDates, checkGuideAvailability} from './guideAvailabilityService.js';
import {createNotification} from './guideNotificationService.js';
import {assertOwner} from './guideRequestService.js';
import {assertTransition} from './guideStateService.js';

const makeReference = () => `GUIDE-${new Date().getUTCFullYear()}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;

const serializeBooking = (booking, guide) => ({
  id: String(booking._id),
  bookingReference: booking.bookingReference,
  requestId: String(booking.requestId),
  bidId: String(booking.bidId),
  guideId: String(booking.guideId),
  tripDetails: booking.tripDetails,
  amount: booking.amount,
  currency: booking.currency,
  bookingStatus: booking.bookingStatus,
  paymentStatus: booking.paymentStatus,
  confirmedAt: booking.confirmedAt,
  cancelledAt: booking.cancelledAt,
  completedAt: booking.completedAt,
  createdAt: booking.createdAt,
  guide: guide ? { id: String(guide._id), name: guide.displayName, image: guide.profileImage } : undefined,
});

const findContext = async ({ user, requestId, bidId, session }) => {
  let requestQuery = GuideRequest.findById(requestId);
  let bidQuery = GuideBid.findOne({ _id: bidId, requestId });
  if (session) {
    requestQuery = requestQuery.session(session);
    bidQuery = bidQuery.session(session);
  }
  const [request, bid] = await Promise.all([requestQuery, bidQuery]);
  if (!request) throw new AppError('Guide request not found.', 404, 'REQUEST_NOT_FOUND');
  assertOwner(request, user);
  if (!bid) throw new AppError('The selected bid does not belong to this guide request.', 400, 'BID_REQUEST_MISMATCH');
  let guideQuery = GuideProfile.findById(bid.guideId).select('+reservedDates');
  if (session) guideQuery = guideQuery.session(session);
  const guide = await guideQuery;
  if (!guide || !guide.active) throw new AppError('Guide profile not found.', 404, 'GUIDE_NOT_FOUND');
  const availability = await checkGuideAvailability({ guide, startDate: request.startDate, endDate: request.endDate, session });
  return { request, bid, guide, availability };
};

const blockingReason = ({ request, bid, availability }) => {
  if (!['Open', 'Guide Selected'].includes(request.status)) return `This request is ${request.status.toLowerCase()} and cannot be confirmed.`;
  if (request.expiresAt <= new Date()) return 'This guide request has expired.';
  if (bid.status !== 'Active') return `This bid is ${bid.status.toLowerCase()} and cannot be confirmed.`;
  if (bid.expiresAt <= new Date()) return 'This bid has expired.';
  if (!availability.available) return availability.reason;
  return null;
};

const getConfirmationPreview = async (user, requestId, bidId) => {
  const context = await findContext({ user, requestId, bidId });
  const existingBooking = await GuideBooking.findOne({ requestId: context.request._id, bidId: context.bid._id });
  if (existingBooking) {
    return {
      request: context.request,
      guide: {
        id: String(context.guide._id), name: context.guide.displayName, image: context.guide.profileImage,
        verified: context.guide.verified, rating: context.guide.averageRating, reviewCount: context.guide.reviewCount,
        languages: context.guide.languages, specialities: context.guide.specialities, availability: context.guide.availability,
      },
      bid: context.bid,
      booking: serializeBooking(existingBooking, context.guide),
      priceSummary: { subtotal: context.bid.amount, total: context.bid.amount, currency: context.bid.currency, fees: 0 },
      availability: { available: false, reason: 'This request is already booked.' },
      canConfirm: false,
      blockingReason: 'This request is already booked.',
    };
  }
  const reason = blockingReason(context);
  return {
    request: context.request,
    guide: {
      id: String(context.guide._id), name: context.guide.displayName, image: context.guide.profileImage,
      verified: context.guide.verified, rating: context.guide.averageRating, reviewCount: context.guide.reviewCount,
      languages: context.guide.languages, specialities: context.guide.specialities, availability: context.guide.availability,
    },
    bid: context.bid,
    priceSummary: { subtotal: context.bid.amount, total: context.bid.amount, currency: context.bid.currency, fees: 0 },
    availability: context.availability,
    canConfirm: !reason,
    blockingReason: reason,
  };
};

const validateBookingPayload = (input) => {
  const allowed = ['requestId', 'bidId', 'acknowledgements'];
  if (!input || typeof input !== 'object' || Object.keys(input).some((field) => !allowed.includes(field))) {
    throw new AppError('Only requestId, bidId and acknowledgements are accepted.', 400, 'UNSAFE_BOOKING_PAYLOAD');
  }
  const acknowledgements = input.acknowledgements;
  if (!acknowledgements?.tripDetailsConfirmed || !acknowledgements?.cancellationPolicyAccepted || !acknowledgements?.termsAccepted) {
    throw new AppError('All required booking acknowledgements must be accepted.', 400, 'ACKNOWLEDGEMENTS_REQUIRED');
  }
};

const bookingDocument = ({ user, request, bid, guide }) => ({
  bookingReference: makeReference(),
  touristId: user._id,
  guideId: guide._id,
  requestId: request._id,
  bidId: bid._id,
  tripDetails: {
    guideName: guide.displayName,
    startLocation: request.startLocation,
    destination: request.destination,
    startDate: request.startDate,
    endDate: request.endDate,
    startTime: request.startTime,
    adults: request.adults,
    children: request.children,
    stops: request.stops,
    pickupLocation: request.pickupLocation,
    dropoffLocation: request.dropoffLocation,
    preferredLanguages: request.languages,
    specialRequirements: request.specialRequirements,
    accessibilityNeeds: request.accessibilityNeeds,
    includedServices: bid.includedServices,
    excludedServices: bid.excludedServices,
    cancellationPolicy: bid.cancellationPolicy,
  },
  amount: bid.amount,
  currency: bid.currency,
  bookingStatus: 'Confirmed',
  paymentStatus: 'Pending',
  confirmedAt: new Date(),
});

const repairBookingState = async (booking) => {
  await Promise.all([
    GuideRequest.updateOne(
      { _id: booking.requestId, status: { $in: ['Open', 'Guide Selected'] } },
      { $set: { status: 'Booked', selectedBidId: booking.bidId, bookingId: booking._id } },
    ),
    GuideBid.updateOne({ _id: booking.bidId, status: 'Active' }, { $set: { status: 'Accepted' } }),
    GuideBid.updateMany({ requestId: booking.requestId, _id: { $ne: booking.bidId }, status: 'Active' }, { $set: { status: 'Rejected' } }),
  ]);
};

const persistBooking = async ({ user, requestId, bidId, session }) => {
  const context = await findContext({ user, requestId, bidId, session });
  const reason = blockingReason(context);
  if (reason) throw new AppError(reason, 409, context.availability.available ? 'BOOKING_BLOCKED' : 'GUIDE_UNAVAILABLE');

  let existingQuery = GuideBooking.findOne({ requestId: context.request._id });
  if (session) existingQuery = existingQuery.session(session);
  const existing = await existingQuery;
  if (existing) {
    if (String(existing.bidId) !== String(context.bid._id)) throw new AppError('This request already has a confirmed booking.', 409, 'DUPLICATE_BOOKING');
    return { booking: existing, guide: context.guide, alreadyConfirmed: true };
  }

  const reservedDates = bookingDates(context.request.startDate, context.request.endDate);
  const reservation = await GuideProfile.updateOne(
    { _id: context.guide._id, active: true, reservedDates: { $nin: reservedDates } },
    { $addToSet: { reservedDates: { $each: reservedDates } } },
    session ? { session } : undefined,
  );
  if (reservation.modifiedCount !== 1) throw new AppError('The guide already has an overlapping booking.', 409, 'GUIDE_UNAVAILABLE');

  let created;
  try {
    created = await GuideBooking.create([bookingDocument({ user, ...context })], session ? { session } : undefined);
  } catch (error) {
    if (!session) await GuideProfile.updateOne({ _id: context.guide._id }, { $pull: { reservedDates: { $in: reservedDates } } });
    throw error;
  }
  const booking = created[0];
  let rejectedBidQuery = GuideBid.find({ requestId: context.request._id, _id: { $ne: context.bid._id }, status: 'Active' }).populate('guideId', 'userId displayName');
  if (session) rejectedBidQuery = rejectedBidQuery.session(session);
  const rejectedBids = await rejectedBidQuery;
  await Promise.all([
    GuideRequest.updateOne(
      { _id: context.request._id, status: { $in: ['Open', 'Guide Selected'] } },
      { $set: { status: 'Booked', selectedBidId: context.bid._id, bookingId: booking._id } },
      session ? { session } : undefined,
    ),
    GuideBid.updateOne({ _id: context.bid._id, status: 'Active' }, { $set: { status: 'Accepted' } }, session ? { session } : undefined),
    GuideBid.updateMany({ requestId: context.request._id, _id: { $ne: context.bid._id }, status: 'Active' }, { $set: { status: 'Rejected' } }, session ? { session } : undefined),
  ]);
  await Promise.all([
    createNotification({
      userId: user._id, type: 'GUIDE_BOOKING_CONFIRMED', title: 'Guide booking confirmed',
      message: `Your guide booking ${booking.bookingReference} is confirmed.`,
      data: { bookingId: booking._id, bookingReference: booking.bookingReference },
      dedupeKey: `guide-booking-confirmed:tourist:${booking._id}`, session,
    }),
    createNotification({
      userId: context.guide.userId, type: 'GUIDE_BID_ACCEPTED', title: 'Your guide bid was accepted',
      message: `Booking ${booking.bookingReference} has been confirmed.`,
      data: { bookingId: booking._id, requestId: context.request._id },
      dedupeKey: `guide-booking-confirmed:guide:${booking._id}`, session,
    }),
    ...rejectedBids.map((rejectedBid) => createNotification({
      userId: rejectedBid.guideId?.userId,
      type: 'GUIDE_BID_REJECTED',
      title: 'Another guide was selected',
      message: `Your bid for ${context.request.startLocation} to ${context.request.destination} was not selected.`,
      data: { requestId: context.request._id, bidId: rejectedBid._id },
      dedupeKey: `guide-bid-rejected:${booking._id}:${rejectedBid._id}`,
      session,
    })),
  ]);
  return { booking, guide: context.guide, alreadyConfirmed: false };
};

// Standalone MongoDB reports code 20, while Azure Cosmos DB's Mongo API reports
// code 117 when transactions are unavailable. Both must use the atomic
// uniqueness/reserved-date fallback below instead of surfacing a server error.
const isTransactionUnsupported = (error) => [20, 117].includes(error?.code)
  || /Transaction numbers are only allowed|only servers in a sharded cluster can start a new transaction|replica set|mongos/i.test(error?.message || '');

const confirmBooking = async (user, input) => {
  validateBookingPayload(input);
  const preExisting = await GuideBooking.findOne({ requestId: input.requestId });
  if (preExisting) {
    if (String(preExisting.touristId) !== String(user._id)) throw new AppError('This booking does not belong to you.', 403, 'FORBIDDEN');
    if (String(preExisting.bidId) !== String(input.bidId)) throw new AppError('This request already has a confirmed booking.', 409, 'DUPLICATE_BOOKING');
    await repairBookingState(preExisting);
    const guide = await GuideProfile.findById(preExisting.guideId);
    return { booking: serializeBooking(preExisting, guide), alreadyConfirmed: true };
  }

  let result;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => { result = await persistBooking({ user, requestId: input.requestId, bidId: input.bidId, session }); });
  } catch (error) {
    if (!isTransactionUnsupported(error)) {
      if (error.code === 11000) result = await recoverDuplicate(user, input);
      else throw error;
    } else {
      try {
        result = await persistBooking({ user, requestId: input.requestId, bidId: input.bidId });
      } catch (fallbackError) {
        if (fallbackError.code === 11000) result = await recoverDuplicate(user, input);
        else throw fallbackError;
      }
    }
  } finally {
    await session.endSession();
  }
  return { booking: serializeBooking(result.booking, result.guide), alreadyConfirmed: result.alreadyConfirmed };
};

const recoverDuplicate = async (user, input) => {
  const booking = await GuideBooking.findOne({ requestId: input.requestId });
  if (!booking || String(booking.touristId) !== String(user._id) || String(booking.bidId) !== String(input.bidId)) {
    throw new AppError('This guide request has already been booked.', 409, 'DUPLICATE_BOOKING');
  }
  await repairBookingState(booking);
  const guide = await GuideProfile.findById(booking.guideId);
  return { booking, guide, alreadyConfirmed: true };
};

const assertBookingAccess = async (booking, user) => {
  if (user.role === 'admin' || String(booking.touristId) === String(user._id)) return;
  if (user.role === 'guide_user') {
    const profile = await GuideProfile.findOne({ userId: user._id }).select('_id');
    if (profile && String(profile._id) === String(booking.guideId)) return;
  }
  throw new AppError('You do not have access to this booking.', 403, 'FORBIDDEN');
};

const getBooking = async (user, criteria) => {
  const booking = await GuideBooking.findOne(criteria);
  if (!booking) throw new AppError('Guide booking not found.', 404, 'BOOKING_NOT_FOUND');
  await assertBookingAccess(booking, user);
  const guide = await GuideProfile.findById(booking.guideId);
  return serializeBooking(booking, guide);
};

const cancelBooking = async (user, bookingId) => {
  const booking = await GuideBooking.findById(bookingId);
  if (!booking) throw new AppError('Guide booking not found.', 404, 'BOOKING_NOT_FOUND');
  await assertBookingAccess(booking, user);
  if (!['Pending', 'Confirmed', 'Pending Payment', 'Paid'].includes(booking.bookingStatus)) throw new AppError('This booking cannot be cancelled.', 409, 'INVALID_BOOKING_STATE');
  assertTransition('booking', booking.bookingStatus, 'Cancelled');
  booking.bookingStatus = 'Cancelled';
  booking.cancelledAt = new Date();
  await booking.save();
  await GuideRequest.updateOne({ _id: booking.requestId, status: 'Booked' }, { $set: { status: 'Cancelled', cancelledAt: new Date() } });
  const datesToRelease = bookingDates(booking.tripDetails.startDate, booking.tripDetails.endDate);
  await GuideProfile.updateOne({ _id: booking.guideId }, { $pull: { reservedDates: { $in: datesToRelease } } });
  const guide = await GuideProfile.findById(booking.guideId).select('userId');
  await Promise.all([
    createNotification({
      userId: booking.touristId, type: 'GUIDE_BOOKING_CANCELLED', title: 'Guide booking cancelled',
      message: `Booking ${booking.bookingReference} was cancelled.`, data: { bookingId: booking._id },
      dedupeKey: `guide-booking-cancelled:tourist:${booking._id}`,
    }),
    createNotification({
      userId: guide?.userId, type: 'GUIDE_BOOKING_CANCELLED', title: 'Guide booking cancelled',
      message: `Booking ${booking.bookingReference} was cancelled.`, data: { bookingId: booking._id },
      dedupeKey: `guide-booking-cancelled:guide:${booking._id}`,
    }),
  ]);
  return booking;
};

const completeBooking = async (user, bookingId) => {
  const booking = await GuideBooking.findById(bookingId);
  if (!booking) throw new AppError('Guide booking not found.', 404, 'BOOKING_NOT_FOUND');
  await assertBookingAccess(booking, user);
  if (!['guide_user', 'admin'].includes(user.role)) throw new AppError('Only the assigned guide or an admin can complete a booking.', 403, 'FORBIDDEN');
  assertTransition('booking', booking.bookingStatus, 'Completed');
  booking.bookingStatus = 'Completed';
  booking.completedAt = new Date();
  await booking.save();
  await Promise.all([
    GuideRequest.updateOne({ _id: booking.requestId, status: 'Booked' }, { $set: { status: 'Completed' } }),
    GuideProfile.updateOne({ _id: booking.guideId }, { $inc: { completedTours: 1 } }),
  ]);
  return booking;
};

export { getConfirmationPreview, confirmBooking, getBooking, cancelBooking, completeBooking, serializeBooking };
