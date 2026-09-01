import mongoose from 'mongoose';
import GuideProfile from '../models/GuideProfile.js';
import GuideRequest from '../models/GuideRequest.js';
import GuideBid from '../models/GuideBid.js';
import GuideBooking from '../models/GuideBooking.js';
import GuidePackage from '../models/GuidePackage.js';
import GuideReview from '../models/GuideReview.js';
import User from '../models/User.js';

const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed'];
const EDITABLE_REQUEST_STATUSES = ['open', 'receiving_bids'];
const ALLOWED_GUIDE_TYPES = ['Cultural', 'Adventure', 'City', 'Nature', 'Wildlife', 'Culinary'];
const PROFILE_MUTABLE_FIELDS = [
  'professionalTitle', 'avatarUrl', 'coverImageUrl', 'bio', 'experienceYears',
  'languages', 'expertise', 'highlights', 'specialSkills', 'gallery',
  'identityProof', 'certifications',
];

const isValidId = (value) => mongoose.isValidObjectId(value);
const sameId = (left, right) => String(left) === String(right);
const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const failInvalidId = (res, label = 'Resource') => res.status(400).json({
  success: false,
  message: `${label} ID is invalid`,
});

const parseList = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
};

const ensureGuideProfile = async (userId) => GuideProfile.findOneAndUpdate(
  { user: userId },
  { $setOnInsert: { user: userId } },
  { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true },
);

const calculateTotals = (amount) => {
  const bidAmount = roundMoney(amount);
  const serviceFee = roundMoney(bidAmount * 0.05);
  const tax = roundMoney(bidAmount * 0.08);
  return {
    bidAmount,
    serviceFee,
    tax,
    total: roundMoney(bidAmount + serviceFee + tax),
  };
};

const makeBookingReference = () => {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const suffix = new mongoose.Types.ObjectId().toString().slice(-8).toUpperCase();
  return `SVG-${date}-${suffix}`;
};

const isGuideAvailable = async (guideId, startDate, endDate, excludeBookingId = null) => {
  const query = {
    guide: guideId,
    status: { $in: ACTIVE_BOOKING_STATUSES },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };
  return !(await GuideBooking.exists(query));
};

const publicGuide = (user, profile) => ({
  _id: user?._id,
  fullName: user?.fullName,
  guideId: user?.guideId,
  professionalTitle: profile?.professionalTitle || 'Local Tour Guide',
  avatarUrl: profile?.avatarUrl || '',
  coverImageUrl: profile?.coverImageUrl || '',
  bio: profile?.bio || '',
  experienceYears: profile?.experienceYears || 0,
  languages: profile?.languages || [],
  expertise: profile?.expertise || [],
  highlights: profile?.highlights || [],
  specialSkills: profile?.specialSkills || [],
  gallery: profile?.gallery || [],
  verified: Boolean(profile?.verified),
  ratingAverage: profile?.ratingAverage || 0,
  reviewCount: profile?.reviewCount || 0,
});

export const createGuideRequest = async (req, res, next) => {
  try {
    const {
      destination, startDate, endDate, travelers, languagePreference,
      guideTypes, budgetMin = 0, budgetMax, currency = 'LKR',
      specialRequirements = '', meetingLocation = '', preferredGuide,
    } = req.body;

    if (!destination?.trim() || !startDate || !endDate || !languagePreference?.trim()) {
      return res.status(400).json({ success: false, message: 'Destination, dates, and language are required' });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      return res.status(400).json({ success: false, message: 'Please provide a valid travel date range' });
    }
    const travelerCount = Number(travelers);
    const maxBudget = Number(budgetMax);
    if (!Number.isInteger(travelerCount) || travelerCount < 1 || !Number.isFinite(maxBudget) || maxBudget < 0) {
      return res.status(400).json({ success: false, message: 'Travelers and budget must be valid numbers' });
    }
    if (preferredGuide && !isValidId(preferredGuide)) return failInvalidId(res, 'Preferred guide');

    const types = parseList(guideTypes).filter((type) => ALLOWED_GUIDE_TYPES.includes(type));
    const request = await GuideRequest.create({
      tourist: req.user._id,
      destination: destination.trim(),
      startDate: start,
      endDate: end,
      travelers: travelerCount,
      languagePreference: languagePreference.trim(),
      guideTypes: types,
      budgetMin: Number(budgetMin) || 0,
      budgetMax: maxBudget,
      currency,
      specialRequirements,
      meetingLocation: meetingLocation || destination.trim(),
      preferredGuide: preferredGuide || null,
    });

    return res.status(201).json({ success: true, request });
  } catch (error) {
    return next(error);
  }
};

export const listMyGuideRequests = async (req, res, next) => {
  try {
    const requests = await GuideRequest.find({ tourist: req.user._id })
      .populate('selectedBid')
      .sort({ createdAt: -1 });
    return res.json({ success: true, requests });
  } catch (error) {
    return next(error);
  }
};

export const getGuideRequest = async (req, res, next) => {
  try {
    if (!isValidId(req.params.requestId)) return failInvalidId(res, 'Request');
    const request = await GuideRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Guide request not found' });
    if (req.user.role === 'tourist_user' && !sameId(request.tourist, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Permission denied' });
    }
    return res.json({ success: true, request });
  } catch (error) {
    return next(error);
  }
};

export const updateGuideRequest = async (req, res, next) => {
  try {
    if (!isValidId(req.params.requestId)) return failInvalidId(res, 'Request');
    const request = await GuideRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Guide request not found' });
    if (!sameId(request.tourist, req.user._id)) return res.status(403).json({ success: false, message: 'Permission denied' });
    if (!EDITABLE_REQUEST_STATUSES.includes(request.status)) {
      return res.status(409).json({ success: false, message: 'This request can no longer be edited' });
    }
    const allowed = [
      'destination', 'startDate', 'endDate', 'travelers', 'languagePreference',
      'guideTypes', 'budgetMin', 'budgetMax', 'currency', 'specialRequirements',
      'meetingLocation', 'preferredGuide',
    ];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) request[field] = req.body[field];
    });
    await request.save();
    return res.json({ success: true, request });
  } catch (error) {
    return next(error);
  }
};

export const cancelGuideRequest = async (req, res, next) => {
  try {
    if (!isValidId(req.params.requestId)) return failInvalidId(res, 'Request');
    const request = await GuideRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Guide request not found' });
    if (!sameId(request.tourist, req.user._id)) return res.status(403).json({ success: false, message: 'Permission denied' });
    if (['booked', 'completed', 'cancelled'].includes(request.status)) {
      return res.status(409).json({ success: false, message: 'This request cannot be cancelled' });
    }
    request.status = 'cancelled';
    await request.save();
    await GuideBid.updateMany({ request: request._id, status: 'active' }, { status: 'rejected' });
    return res.json({ success: true, request });
  } catch (error) {
    return next(error);
  }
};

export const listRequestBids = async (req, res, next) => {
  try {
    if (!isValidId(req.params.requestId)) return failInvalidId(res, 'Request');
    const request = await GuideRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Guide request not found' });
    if (!sameId(request.tourist, req.user._id)) return res.status(403).json({ success: false, message: 'Permission denied' });

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 20);
    const filter = { request: request._id, status: { $in: ['active', 'accepted'] } };
    const [bids, total] = await Promise.all([
      GuideBid.find(filter).populate('guide', 'fullName guideId').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      GuideBid.countDocuments(filter),
    ]);
    const profiles = await GuideProfile.find({ user: { $in: bids.map((bid) => bid.guide?._id).filter(Boolean) } });
    const profileMap = new Map(profiles.map((profile) => [String(profile.user), profile]));
    const items = bids.map((bid) => ({
      ...bid.toObject(),
      guide: publicGuide(bid.guide, profileMap.get(String(bid.guide?._id))),
    }));
    return res.json({ success: true, request, bids: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return next(error);
  }
};

export const listOpportunities = async (req, res, next) => {
  try {
    const now = new Date();
    const bids = await GuideBid.find({ guide: req.user._id }).select('request');
    const alreadyBid = bids.map((bid) => bid.request);
    const requests = await GuideRequest.find({
      _id: { $nin: alreadyBid },
      status: { $in: ['open', 'receiving_bids'] },
      endDate: { $gte: now },
      $or: [{ preferredGuide: null }, { preferredGuide: req.user._id }],
    }).select('-tourist').sort({ createdAt: -1 });
    return res.json({ success: true, opportunities: requests });
  } catch (error) {
    return next(error);
  }
};

export const submitBid = async (req, res, next) => {
  try {
    if (!isValidId(req.params.requestId)) return failInvalidId(res, 'Request');
    const request = await GuideRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Guide request not found' });
    if (!['open', 'receiving_bids'].includes(request.status)) {
      return res.status(409).json({ success: false, message: 'This request is no longer accepting bids' });
    }
    if (sameId(request.tourist, req.user._id)) {
      return res.status(403).json({ success: false, message: 'You cannot bid on your own request' });
    }
    if (request.preferredGuide && !sameId(request.preferredGuide, req.user._id)) {
      return res.status(403).json({ success: false, message: 'This request is reserved for another guide' });
    }
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0 || !req.body.proposal?.trim()) {
      return res.status(400).json({ success: false, message: 'A positive amount and proposal are required' });
    }
    const existing = await GuideBid.findOne({ request: request._id, guide: req.user._id });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You already submitted a bid for this request' });
    }
    const profile = await ensureGuideProfile(req.user._id);
    if (!profile.active || ['rejected', 'suspended'].includes(profile.approvalStatus)) {
      return res.status(403).json({ success: false, message: 'Your guide profile is not active' });
    }
    const bid = await GuideBid.create({
      request: request._id,
      guide: req.user._id,
      amount,
      currency: request.currency,
      proposal: req.body.proposal,
      includedServices: parseList(req.body.includedServices),
      excludedServices: parseList(req.body.excludedServices),
      cancellationPolicy: req.body.cancellationPolicy || '',
      expiresAt: req.body.expiresAt || null,
    });
    request.status = 'receiving_bids';
    await request.save();
    return res.status(201).json({ success: true, bid });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: 'You already submitted a bid for this request' });
    return next(error);
  }
};

export const listMyBids = async (req, res, next) => {
  try {
    await GuideBid.updateMany(
      { guide: req.user._id, status: 'active', expiresAt: { $ne: null, $lt: new Date() } },
      { status: 'expired' },
    );
    const bids = await GuideBid.find({ guide: req.user._id }).populate('request').sort({ updatedAt: -1 });
    return res.json({ success: true, bids });
  } catch (error) {
    return next(error);
  }
};

export const updateBid = async (req, res, next) => {
  try {
    if (!isValidId(req.params.bidId)) return failInvalidId(res, 'Bid');
    const bid = await GuideBid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ success: false, message: 'Bid not found' });
    if (!sameId(bid.guide, req.user._id)) return res.status(403).json({ success: false, message: 'Permission denied' });
    if (bid.status !== 'active') return res.status(409).json({ success: false, message: 'Only active bids can be edited' });
    if (req.body.amount !== undefined) {
      const amount = Number(req.body.amount);
      if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ success: false, message: 'Amount must be positive' });
      bid.amount = amount;
    }
    ['proposal', 'cancellationPolicy', 'expiresAt'].forEach((field) => {
      if (req.body[field] !== undefined) bid[field] = req.body[field];
    });
    ['includedServices', 'excludedServices'].forEach((field) => {
      if (req.body[field] !== undefined) bid[field] = parseList(req.body[field]);
    });
    await bid.save();
    return res.json({ success: true, bid });
  } catch (error) {
    return next(error);
  }
};

export const withdrawBid = async (req, res, next) => {
  try {
    if (!isValidId(req.params.bidId)) return failInvalidId(res, 'Bid');
    const bid = await GuideBid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ success: false, message: 'Bid not found' });
    if (!sameId(bid.guide, req.user._id)) return res.status(403).json({ success: false, message: 'Permission denied' });
    if (bid.status !== 'active') return res.status(409).json({ success: false, message: 'Only active bids can be withdrawn' });
    bid.status = 'withdrawn';
    await bid.save();
    return res.json({ success: true, bid });
  } catch (error) {
    return next(error);
  }
};

const loadConfirmation = async (requestId, bidId, touristId) => {
  const request = await GuideRequest.findById(requestId);
  if (!request) return { status: 404, message: 'Guide request not found' };
  if (!sameId(request.tourist, touristId)) return { status: 403, message: 'Permission denied' };
  if (['cancelled', 'completed'].includes(request.status)) return { status: 409, message: 'This request cannot be booked' };

  const bid = await GuideBid.findById(bidId).populate('guide', 'fullName guideId');
  if (!bid) return { status: 404, message: 'Bid not found' };
  if (!sameId(bid.request, request._id)) return { status: 400, message: 'Bid does not belong to this request' };
  if (!['active', 'accepted'].includes(bid.status)) return { status: 409, message: 'This bid is no longer active' };
  if (bid.expiresAt && bid.expiresAt < new Date()) return { status: 409, message: 'This bid has expired' };

  const profile = await GuideProfile.findOne({ user: bid.guide._id });
  if (profile && (!profile.active || ['rejected', 'suspended'].includes(profile.approvalStatus))) {
    return { status: 409, message: 'This guide is unavailable' };
  }
  const existingBooking = await GuideBooking.findOne({ request: request._id });
  if (existingBooking) return { status: 409, message: 'A booking already exists for this request', booking: existingBooking };
  if (!(await isGuideAvailable(bid.guide._id, request.startDate, request.endDate))) {
    return { status: 409, message: 'This guide is no longer available for the selected dates' };
  }
  return { request, bid, profile, totals: calculateTotals(bid.amount) };
};

export const getBookingConfirmation = async (req, res, next) => {
  try {
    if (!isValidId(req.params.requestId)) return failInvalidId(res, 'Request');
    if (!isValidId(req.params.bidId)) return failInvalidId(res, 'Bid');
    const result = await loadConfirmation(req.params.requestId, req.params.bidId, req.user._id);
    if (result.status) return res.status(result.status).json({ success: false, message: result.message, bookingId: result.booking?._id });
    const { request, bid, profile, totals } = result;
    return res.json({
      success: true,
      confirmation: {
        request,
        bid: { ...bid.toObject(), guide: publicGuide(bid.guide, profile) },
        ...totals,
        currency: bid.currency,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { requestId, bidId, paymentMethod = 'manual' } = req.body;
    if (!isValidId(requestId)) return failInvalidId(res, 'Request');
    if (!isValidId(bidId)) return failInvalidId(res, 'Bid');

    const existing = await GuideBooking.findOne({ request: requestId });
    if (existing) return res.status(200).json({ success: true, duplicate: true, booking: existing });

    const result = await loadConfirmation(requestId, bidId, req.user._id);
    if (result.status) {
      if (result.booking) return res.status(200).json({ success: true, duplicate: true, booking: result.booking });
      return res.status(result.status).json({ success: false, message: result.message });
    }
    const { request, bid, totals } = result;
    const method = ['card', 'paypal', 'bank_transfer'].includes(paymentMethod) ? paymentMethod : 'manual';
    const booking = await GuideBooking.create({
      bookingReference: makeBookingReference(),
      request: request._id,
      bid: bid._id,
      tourist: req.user._id,
      guide: bid.guide._id,
      startDate: request.startDate,
      endDate: request.endDate,
      travelers: request.travelers,
      destination: request.destination,
      meetingLocation: request.meetingLocation || request.destination,
      currency: bid.currency,
      ...totals,
      paymentMethod: method,
      paymentStatus: 'pending',
      status: 'pending',
    });

    await Promise.all([
      GuideRequest.findByIdAndUpdate(request._id, { status: 'booked', selectedBid: bid._id, booking: booking._id }),
      GuideBid.findByIdAndUpdate(bid._id, { status: 'accepted' }),
      GuideBid.updateMany({ request: request._id, _id: { $ne: bid._id }, status: 'active' }, { status: 'rejected' }),
    ]);
    return res.status(201).json({ success: true, booking });
  } catch (error) {
    if (error?.code === 11000) {
      const booking = await GuideBooking.findOne({ request: req.body.requestId });
      if (booking) return res.status(200).json({ success: true, duplicate: true, booking });
      return res.status(409).json({ success: false, message: 'A booking already exists' });
    }
    return next(error);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    if (!isValidId(req.params.bookingId)) return failInvalidId(res, 'Booking');
    const booking = await GuideBooking.findById(req.params.bookingId)
      .populate('tourist', 'fullName email')
      .populate('guide', 'fullName guideId')
      .populate('request')
      .populate('bid');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    const allowed = sameId(booking.tourist?._id, req.user._id) || sameId(booking.guide?._id, req.user._id);
    if (!allowed) return res.status(403).json({ success: false, message: 'Permission denied' });
    return res.json({ success: true, booking });
  } catch (error) {
    return next(error);
  }
};

export const listProviderBookings = async (req, res, next) => {
  try {
    const filter = { guide: req.user._id };
    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
    const bookings = await GuideBooking.find(filter)
      .populate('tourist', 'fullName')
      .populate('request', 'destination')
      .sort({ createdAt: -1 });
    return res.json({ success: true, bookings });
  } catch (error) {
    return next(error);
  }
};

export const getProviderBooking = async (req, res, next) => {
  try {
    if (!isValidId(req.params.bookingId)) return failInvalidId(res, 'Booking');
    const booking = await GuideBooking.findById(req.params.bookingId)
      .populate('tourist', 'fullName email contactNumber')
      .populate('request')
      .populate('bid');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!sameId(booking.guide, req.user._id)) return res.status(403).json({ success: false, message: 'Permission denied' });
    return res.json({ success: true, booking });
  } catch (error) {
    return next(error);
  }
};

export const updateProviderBookingStatus = async (req, res, next) => {
  try {
    if (!isValidId(req.params.bookingId)) return failInvalidId(res, 'Booking');
    const booking = await GuideBooking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!sameId(booking.guide, req.user._id)) return res.status(403).json({ success: false, message: 'Permission denied' });
    const transitions = {
      pending: ['confirmed', 'rejected'],
      confirmed: ['completed', 'cancelled'],
      rejected: [], cancelled: [], completed: [],
    };
    const nextStatus = req.body.status;
    if (!transitions[booking.status]?.includes(nextStatus)) {
      return res.status(409).json({ success: false, message: `Cannot change ${booking.status} booking to ${nextStatus}` });
    }
    booking.status = nextStatus;
    await booking.save();
    if (nextStatus === 'completed') await GuideRequest.findByIdAndUpdate(booking.request, { status: 'completed' });
    if (['rejected', 'cancelled'].includes(nextStatus)) await GuideRequest.findByIdAndUpdate(booking.request, { status: 'cancelled' });
    return res.json({ success: true, booking });
  } catch (error) {
    return next(error);
  }
};

export const createGuideReview = async (req, res, next) => {
  try {
    if (!isValidId(req.params.bookingId)) return failInvalidId(res, 'Booking');
    const booking = await GuideBooking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!sameId(booking.tourist, req.user._id)) return res.status(403).json({ success: false, message: 'Permission denied' });
    if (sameId(booking.guide, req.user._id)) return res.status(403).json({ success: false, message: 'You cannot review yourself' });
    if (booking.status !== 'completed') return res.status(409).json({ success: false, message: 'Only completed bookings can be reviewed' });
    const rating = Number(req.body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !req.body.comment?.trim()) {
      return res.status(400).json({ success: false, message: 'A rating from 1 to 5 and a comment are required' });
    }
    const review = await GuideReview.create({
      booking: booking._id,
      tourist: req.user._id,
      guide: booking.guide,
      rating,
      comment: req.body.comment,
    });
    booking.reviewedAt = new Date();
    await booking.save();
    const stats = await GuideReview.aggregate([
      { $match: { guide: booking.guide } },
      { $group: { _id: '$guide', ratingAverage: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
    ]);
    await GuideProfile.findOneAndUpdate(
      { user: booking.guide },
      {
        $set: {
          ratingAverage: roundMoney(stats[0]?.ratingAverage || 0),
          reviewCount: stats[0]?.reviewCount || 0,
        },
        $setOnInsert: { user: booking.guide },
      },
      { upsert: true },
    );
    return res.status(201).json({ success: true, review });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: 'This booking has already been reviewed' });
    return next(error);
  }
};

export const listPublicGuides = async (req, res, next) => {
  try {
    const profiles = await GuideProfile.find({ active: true }).sort({ verified: -1, ratingAverage: -1 });
    const users = await User.find({ _id: { $in: profiles.map((profile) => profile.user) }, role: 'guide_user' })
      .select('fullName guideId');
    const userMap = new Map(users.map((user) => [String(user._id), user]));
    const guides = profiles.map((profile) => publicGuide(userMap.get(String(profile.user)), profile)).filter((guide) => guide._id);
    return res.json({ success: true, guides });
  } catch (error) {
    return next(error);
  }
};

export const getPublicGuide = async (req, res, next) => {
  try {
    if (!isValidId(req.params.guideId)) return failInvalidId(res, 'Guide');
    const user = await User.findOne({ _id: req.params.guideId, role: 'guide_user' }).select('fullName guideId');
    if (!user) return res.status(404).json({ success: false, message: 'Guide not found' });
    const [profile, packages, reviews] = await Promise.all([
      GuideProfile.findOne({ user: user._id }),
      GuidePackage.find({ guide: user._id, status: 'published' }).sort({ updatedAt: -1 }),
      GuideReview.find({ guide: user._id }).populate('tourist', 'fullName').sort({ createdAt: -1 }).limit(20),
    ]);
    return res.json({ success: true, guide: publicGuide(user, profile), packages, reviews });
  } catch (error) {
    return next(error);
  }
};

export const getMyGuideProfile = async (req, res, next) => {
  try {
    const profile = await ensureGuideProfile(req.user._id);
    return res.json({
      success: true,
      profile: {
        ...profile.toObject(),
        fullName: req.user.fullName,
        email: req.user.email,
        contactNumber: req.user.contactNumber,
        guideId: req.user.guideId,
        dob: req.user.dob,
        gender: req.user.gender,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateMyGuideProfile = async (req, res, next) => {
  try {
    const updates = {};
    PROFILE_MUTABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    ['languages', 'expertise', 'highlights', 'specialSkills', 'gallery'].forEach((field) => {
      if (updates[field] !== undefined) updates[field] = parseList(updates[field]);
    });
    ['identityProof', 'certifications'].forEach((field) => {
      if (Array.isArray(updates[field])) {
        updates[field] = updates[field]
          .filter((document) => document?.url)
          .map((document) => ({ name: String(document.name || '').trim(), url: String(document.url).trim() }));
      }
    });
    const profile = await GuideProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates, $setOnInsert: { user: req.user._id } },
      { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    const userUpdates = {};
    ['fullName', 'contactNumber', 'dob', 'gender'].forEach((field) => {
      if (req.body[field] !== undefined) userUpdates[field] = req.body[field];
    });
    if (Object.keys(userUpdates).length) await User.findByIdAndUpdate(req.user._id, { $set: userUpdates }, { runValidators: true });
    return res.json({ success: true, profile });
  } catch (error) {
    return next(error);
  }
};

export const listGuidePackages = async (req, res, next) => {
  try {
    const packages = await GuidePackage.find({ guide: req.user._id }).sort({ updatedAt: -1 });
    return res.json({ success: true, packages });
  } catch (error) {
    return next(error);
  }
};

export const createGuidePackage = async (req, res, next) => {
  try {
    const packageData = {
      guide: req.user._id,
      title: req.body.title,
      category: req.body.category || 'Other',
      tags: parseList(req.body.tags),
      shortDescription: req.body.shortDescription,
      destination: req.body.destination,
      routeStops: parseList(req.body.routeStops),
      images: parseList(req.body.images),
      pricePerPerson: Number(req.body.pricePerPerson),
      currency: req.body.currency || 'LKR',
      duration: Number(req.body.duration),
      durationUnit: req.body.durationUnit || 'days',
      status: req.body.status === 'published' ? 'published' : 'draft',
    };
    const guidePackage = await GuidePackage.create(packageData);
    return res.status(201).json({ success: true, package: guidePackage });
  } catch (error) {
    return next(error);
  }
};

export const getGuidePackage = async (req, res, next) => {
  try {
    if (!isValidId(req.params.packageId)) return failInvalidId(res, 'Package');
    const guidePackage = await GuidePackage.findById(req.params.packageId);
    if (!guidePackage) return res.status(404).json({ success: false, message: 'Package not found' });
    if (!sameId(guidePackage.guide, req.user._id)) return res.status(403).json({ success: false, message: 'Permission denied' });
    return res.json({ success: true, package: guidePackage });
  } catch (error) {
    return next(error);
  }
};

export const updateGuidePackage = async (req, res, next) => {
  try {
    if (!isValidId(req.params.packageId)) return failInvalidId(res, 'Package');
    const guidePackage = await GuidePackage.findById(req.params.packageId);
    if (!guidePackage) return res.status(404).json({ success: false, message: 'Package not found' });
    if (!sameId(guidePackage.guide, req.user._id)) return res.status(403).json({ success: false, message: 'Permission denied' });
    const allowed = [
      'title', 'category', 'tags', 'shortDescription', 'destination', 'routeStops',
      'images', 'pricePerPerson', 'currency', 'duration', 'durationUnit', 'status',
    ];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) guidePackage[field] = ['tags', 'routeStops', 'images'].includes(field)
        ? parseList(req.body[field]) : req.body[field];
    });
    await guidePackage.save();
    return res.json({ success: true, package: guidePackage });
  } catch (error) {
    return next(error);
  }
};

const getEarningsData = async (guideId) => {
  const eligible = await GuideBooking.find({ guide: guideId, status: 'completed', paymentStatus: 'paid' })
    .populate('tourist', 'fullName')
    .sort({ updatedAt: -1 });
  const pending = await GuideBooking.find({ guide: guideId, paymentStatus: 'pending', status: { $in: ['confirmed', 'completed'] } });
  const totalEarnings = roundMoney(eligible.reduce((sum, booking) => sum + booking.bidAmount, 0));
  const pendingPayout = roundMoney(pending.reduce((sum, booking) => sum + booking.bidAmount, 0));
  return {
    totalEarnings,
    availablePayout: totalEarnings,
    pendingPayout,
    completedBookings: eligible.length,
    transactions: eligible,
    payoutMethods: [],
    payoutSupported: false,
  };
};

export const getGuideEarnings = async (req, res, next) => {
  try {
    return res.json({ success: true, earnings: await getEarningsData(req.user._id) });
  } catch (error) {
    return next(error);
  }
};

export const getGuideDashboard = async (req, res, next) => {
  try {
    const alreadyBid = await GuideBid.distinct('request', { guide: req.user._id });
    const [profile, earnings, activeTours, latestRequests, bidGroups] = await Promise.all([
      ensureGuideProfile(req.user._id),
      getEarningsData(req.user._id),
      GuideBooking.countDocuments({ guide: req.user._id, status: { $in: ['pending', 'confirmed'] } }),
      GuideRequest.find({
        _id: { $nin: alreadyBid },
        status: { $in: ['open', 'receiving_bids'] },
        endDate: { $gte: new Date() },
        $or: [{ preferredGuide: null }, { preferredGuide: req.user._id }],
      }).select('-tourist').sort({ createdAt: -1 }).limit(5),
      GuideBid.aggregate([{ $match: { guide: req.user._id } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);
    const bidStatus = Object.fromEntries(bidGroups.map((item) => [item._id, item.count]));
    return res.json({
      success: true,
      dashboard: {
        totalEarnings: earnings.totalEarnings,
        availablePayout: earnings.availablePayout,
        activeTours,
        averageRating: profile.ratingAverage,
        latestRequests,
        tourStatus: bidStatus,
      },
    });
  } catch (error) {
    return next(error);
  }
};
