import crypto from 'crypto';
import mongoose from 'mongoose';
import User from '../../models/User.js';
import GuideProfile from '../../models/GuideProfile.js';
import GuideRequest from '../../models/GuideRequest.js';
import GuideBid from '../../models/GuideBid.js';
import GuideBooking from '../../models/GuideBooking.js';
import GuidePackage from '../../models/GuidePackage.js';
import GuideReview from '../../models/GuideReview.js';

const isId = (value) => mongoose.Types.ObjectId.isValid(value);
const sameId = (a, b) => String(a?._id || a) === String(b?._id || b);
const fail = (res, status, message) => res.status(status).json({ success: false, message });
const cleanList = (value) => (Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : []).map(String).map((item) => item.trim()).filter(Boolean);
const guideUnavailable = (profile) => profile && (profile.active === false || ['rejected', 'suspended'].includes(profile.approvalStatus));
const ensureGuideProfile = (user) => GuideProfile.findOneAndUpdate(
  { user }, { $setOnInsert: { user } },
  { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
);
const safeUser = (user) => user ? {
  _id: user._id,
  fullName: user.fullName,
  username: user.username,
  role: user.role,
} : null;
const safeProfile = (profile) => profile ? {
  professionalTitle: profile.professionalTitle,
  bio: profile.bio,
  languages: profile.languages,
  expertise: profile.expertise,
  experienceYears: profile.experienceYears,
  highlights: profile.highlights,
  avatar: profile.avatar,
  coverImage: profile.coverImage,
  gallery: profile.gallery,
  includedServices: profile.includedServices,
  dailyRate: profile.dailyRate,
  currency: profile.currency,
  verified: Boolean(profile.verified),
  ratingAverage: profile.ratingAverage,
  reviewCount: profile.reviewCount,
} : null;

const requestDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.max(1, Math.ceil((end - start) / 86400000) + 1);
};

const totalsFor = (request, bid) => {
  const days = requestDays(request.startDate, request.endDate);
  const subtotal = Number((bid.pricingBasis === 'trip' ? Number(bid.amount) : Number(bid.amount) * days).toFixed(2));
  const dailyRate = Number((subtotal / days).toFixed(2));
  const serviceFee = Number((subtotal * 0.05).toFixed(2));
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + serviceFee + tax).toFixed(2));
  return { days, dailyRate, subtotal, serviceFee, tax, total, currency: bid.currency || request.currency || 'LKR' };
};

const profileFor = async (guideId) => {
  const [user, profile, reviews] = await Promise.all([
    User.findOne({ _id: guideId, role: 'guide_user' }).select('fullName username role guideId'),
    GuideProfile.findOne({ user: guideId }).lean(),
    GuideReview.find({ guide: guideId }).sort({ createdAt: -1 }).limit(20).populate('tourist', 'fullName').lean(),
  ]);
  if (!user || guideUnavailable(profile)) return null;
  return {
    user: safeUser(user),
    guideId: user.guideId || '',
    professionalTitle: profile?.professionalTitle || 'Local Tour Guide',
    bio: profile?.bio || '',
    languages: profile?.languages || [],
    expertise: profile?.expertise || [],
    experienceYears: profile?.experienceYears || 0,
    highlights: profile?.highlights || [],
    avatar: profile?.avatar || '',
    coverImage: profile?.coverImage || '',
    gallery: profile?.gallery || [],
    includedServices: profile?.includedServices || [],
    dailyRate: profile?.dailyRate || 0,
    currency: profile?.currency || 'LKR',
    verified: Boolean(profile?.verified),
    ratingAverage: profile?.ratingAverage || 0,
    reviewCount: profile?.reviewCount || 0,
    reviews: reviews.map((review) => ({
      _id: review._id,
      touristName: review.tourist?.fullName || 'Tourist',
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    })),
  };
};

const refreshRating = async (guideId) => {
  const [stats] = await GuideReview.aggregate([
    { $match: { guide: new mongoose.Types.ObjectId(String(guideId)) } },
    { $group: { _id: '$guide', ratingAverage: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
  ]);
  await GuideProfile.findOneAndUpdate(
    { user: guideId },
    { $set: { ratingAverage: Number((stats?.ratingAverage || 0).toFixed(2)), reviewCount: stats?.reviewCount || 0 } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
};

export const createRequest = async (req, res, next) => {
  try {
    const { destination, startDate, endDate, travellers, language, guideTypes, budgetMin, budgetMax, currency, meetingLocation, requirements } = req.body;
    if (!destination?.trim() || !startDate || !endDate || !language?.trim()) return fail(res, 400, 'Destination, dates and language are required');
    const preferredGuide = req.body.preferredGuide || null;
    if (preferredGuide && (!isId(preferredGuide) || !await User.exists({ _id: preferredGuide, role: 'guide_user' }))) return fail(res, 400, 'Invalid preferred guide');
    if (Number.isNaN(Date.parse(startDate)) || Number.isNaN(Date.parse(endDate)) || new Date(endDate) < new Date(startDate)) return fail(res, 400, 'Travel dates are invalid');
    if (!Number.isInteger(Number(travellers)) || Number(travellers) < 1) return fail(res, 400, 'Number of travellers must be at least 1');
    if (!Number.isFinite(Number(budgetMax)) || Number(budgetMax) < 0) return fail(res, 400, 'A valid maximum budget is required');

    const guideRequest = await GuideRequest.create({
      tourist: req.user._id, preferredGuide,
      destination: destination.trim(), startDate, endDate, travellers: Number(travellers), language: language.trim(),
      guideTypes: cleanList(guideTypes), budgetMin: Number(budgetMin || 0), budgetMax: Number(budgetMax),
      currency: String(currency || 'LKR').toUpperCase(), meetingLocation: meetingLocation?.trim() || destination.trim(),
      requirements: requirements?.trim() || '',
    });
    res.status(201).json({ success: true, request: guideRequest, requestId: guideRequest._id });
  } catch (error) { next(error); }
};

export const listMyRequests = async (req, res, next) => {
  try {
    const requests = await GuideRequest.find({ tourist: req.user._id }).sort({ createdAt: -1 }).lean();
    const ids = requests.map((item) => item._id);
    const bidCounts = await GuideBid.aggregate([{ $match: { request: { $in: ids }, status: { $in: ['active', 'accepted'] }, $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }] } }, { $group: { _id: '$request', count: { $sum: 1 } } }]);
    const counts = Object.fromEntries(bidCounts.map((item) => [String(item._id), item.count]));
    res.json({ success: true, requests: requests.map((item) => ({ ...item, bidCount: counts[String(item._id)] || 0 })) });
  } catch (error) { next(error); }
};

export const getMyRequest = async (req, res, next) => {
  try {
    if (!isId(req.params.requestId)) return fail(res, 400, 'Invalid request ID');
    const guideRequest = await GuideRequest.findById(req.params.requestId).lean();
    if (!guideRequest) return fail(res, 404, 'Guide request not found');
    if (!sameId(guideRequest.tourist, req.user._id)) return fail(res, 403, 'You do not own this guide request');
    res.json({ success: true, request: guideRequest });
  } catch (error) { next(error); }
};

export const updateMyRequest = async (req, res, next) => {
  try {
    if (!isId(req.params.requestId)) return fail(res, 400, 'Invalid request ID');
    const guideRequest = await GuideRequest.findById(req.params.requestId);
    if (!guideRequest) return fail(res, 404, 'Guide request not found');
    if (!sameId(guideRequest.tourist, req.user._id)) return fail(res, 403, 'You do not own this guide request');
    if (!['open', 'receiving_bids'].includes(guideRequest.status)) return fail(res, 409, 'This request can no longer be edited');
    const allowed = ['destination', 'startDate', 'endDate', 'travellers', 'language', 'budgetMin', 'budgetMax', 'currency', 'meetingLocation', 'requirements'];
    allowed.forEach((field) => { if (req.body[field] !== undefined) guideRequest[field] = req.body[field]; });
    if (req.body.guideTypes !== undefined) guideRequest.guideTypes = cleanList(req.body.guideTypes);
    if (new Date(guideRequest.endDate) < new Date(guideRequest.startDate)) return fail(res, 400, 'Travel dates are invalid');
    await guideRequest.save();
    res.json({ success: true, request: guideRequest });
  } catch (error) { next(error); }
};

export const cancelMyRequest = async (req, res, next) => {
  try {
    if (!isId(req.params.requestId)) return fail(res, 400, 'Invalid request ID');
    const guideRequest = await GuideRequest.findById(req.params.requestId);
    if (!guideRequest) return fail(res, 404, 'Guide request not found');
    if (!sameId(guideRequest.tourist, req.user._id)) return fail(res, 403, 'You do not own this guide request');
    if (['booked', 'completed', 'cancelled'].includes(guideRequest.status)) return fail(res, 409, 'This request cannot be cancelled here');
    guideRequest.status = 'cancelled';
    await guideRequest.save();
    await GuideBid.updateMany({ request: guideRequest._id, status: 'active' }, { status: 'rejected' });
    res.json({ success: true, request: guideRequest });
  } catch (error) { next(error); }
};

export const listRequestBids = async (req, res, next) => {
  try {
    if (!isId(req.params.requestId)) return fail(res, 400, 'Invalid request ID');
    const guideRequest = await GuideRequest.findById(req.params.requestId).lean();
    if (!guideRequest) return fail(res, 404, 'Guide request not found');
    if (!sameId(guideRequest.tourist, req.user._id)) return fail(res, 403, 'You do not own this guide request');
    const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
    const limit = Math.min(20, Math.max(1, Math.floor(Number(req.query.limit) || 5)));
    const filter = { request: guideRequest._id, status: { $in: ['active', 'accepted'] }, $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }] };
    const [bids, total] = await Promise.all([
      GuideBid.find(filter).sort({ amount: 1 }).skip((page - 1) * limit).limit(limit).populate('guide', 'fullName username guideId').lean(),
      GuideBid.countDocuments(filter),
    ]);
    const profileIds = bids.map((bid) => bid.guide?._id).filter(Boolean);
    const profiles = await GuideProfile.find({ user: { $in: profileIds } }).lean();
    const byGuide = Object.fromEntries(profiles.map((profile) => [String(profile.user), profile]));
    res.json({
      success: true,
      request: guideRequest,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      bids: bids.map((bid) => ({ ...bid, guide: { ...safeUser(bid.guide), guideId: bid.guide?.guideId || '', profile: safeProfile(byGuide[String(bid.guide?._id)]) } })),
    });
  } catch (error) { next(error); }
};

export const confirmationPreview = async (req, res, next) => {
  try {
    const { requestId, bidId } = req.params;
    if (!isId(requestId) || !isId(bidId)) return fail(res, 400, 'Invalid request or bid ID');
    const [guideRequest, bid] = await Promise.all([GuideRequest.findById(requestId).lean(), GuideBid.findById(bidId).populate('guide', 'fullName username guideId').lean()]);
    if (!guideRequest) return fail(res, 404, 'Guide request not found');
    if (!sameId(guideRequest.tourist, req.user._id)) return fail(res, 403, 'You do not own this guide request');
    if (!bid || !sameId(bid.request, guideRequest._id)) return fail(res, 404, 'Bid does not belong to this request');
    if (!['active', 'accepted'].includes(bid.status)) return fail(res, 409, 'This bid is no longer active');
    if (bid.expiresAt && new Date(bid.expiresAt) < new Date()) return fail(res, 409, 'This bid has expired');
    const existing = await GuideBooking.findOne({ request: guideRequest._id }).lean();
    if (existing && !['cancelled', 'rejected'].includes(existing.status)) return fail(res, 409, 'This request already has a booking');
    const conflict = await GuideBooking.exists({ guide: bid.guide._id, status: { $in: ['pending', 'confirmed'] }, startDate: { $lte: guideRequest.endDate }, endDate: { $gte: guideRequest.startDate } });
    if (conflict) return fail(res, 409, 'The guide is no longer available for these dates');
    const profile = await GuideProfile.findOne({ user: bid.guide._id }).lean();
    if (!['open', 'receiving_bids'].includes(guideRequest.status)) return fail(res, 409, 'This request cannot be booked');
    if (guideUnavailable(profile)) return fail(res, 409, 'This guide is unavailable');
    res.json({ success: true, request: guideRequest, bid, guide: { ...safeUser(bid.guide), guideId: bid.guide.guideId || '', profile: safeProfile(profile) }, totals: totalsFor(guideRequest, bid) });
  } catch (error) { next(error); }
};

export const createBooking = async (req, res, next) => {
  try {
    const { requestId, bidId } = req.body;
    if (!isId(requestId) || !isId(bidId)) return fail(res, 400, 'Invalid request or bid ID');
    const existing = await GuideBooking.findOne({ request: requestId });
    if (existing) {
      if (!sameId(existing.tourist, req.user._id)) return fail(res, 403, 'You do not own this guide request');
      return res.json({ success: true, bookingId: existing._id, booking: existing, duplicate: true });
    }
    const [guideRequest, bid] = await Promise.all([GuideRequest.findById(requestId), GuideBid.findById(bidId)]);
    if (!guideRequest) return fail(res, 404, 'Guide request not found');
    if (!sameId(guideRequest.tourist, req.user._id)) return fail(res, 403, 'You do not own this guide request');
    if (!bid || !sameId(bid.request, guideRequest._id)) return fail(res, 404, 'Bid does not belong to this request');
    if (!['open', 'receiving_bids'].includes(guideRequest.status)) return fail(res, 409, 'This request cannot be booked');
    if (guideUnavailable(await GuideProfile.findOne({ user: bid.guide }).lean())) return fail(res, 409, 'This guide is unavailable');
    if (!['active', 'accepted'].includes(bid.status)) return fail(res, 409, 'This bid is no longer active');
    if (bid.expiresAt && new Date(bid.expiresAt) < new Date()) return fail(res, 409, 'This bid has expired');
    const conflict = await GuideBooking.exists({ guide: bid.guide, status: { $in: ['pending', 'confirmed'] }, startDate: { $lte: guideRequest.endDate }, endDate: { $gte: guideRequest.startDate } });
    if (conflict) return fail(res, 409, 'The guide is no longer available for these dates');
    const totals = totalsFor(guideRequest, bid);
    let booking;
    try {
      booking = await GuideBooking.create({
        bookingReference: `GDE-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        request: guideRequest._id, bid: bid._id, tourist: req.user._id, guide: bid.guide,
        startDate: guideRequest.startDate, endDate: guideRequest.endDate, travellers: guideRequest.travellers,
        destination: guideRequest.destination, meetingLocation: guideRequest.meetingLocation,
        ...totals, paymentMethod: 'manual', paymentStatus: 'unpaid', status: 'pending',
      });
    } catch (error) {
      if (error?.code === 11000) {
        const duplicate = await GuideBooking.findOne({ request: guideRequest._id });
        if (!duplicate) return fail(res, 409, 'A booking conflict occurred; please try again');
        if (!sameId(duplicate.tourist, req.user._id)) return fail(res, 403, 'You do not own this booking');
        return res.json({ success: true, bookingId: duplicate._id, booking: duplicate, duplicate: true });
      }
      throw error;
    }
    guideRequest.status = 'booked'; guideRequest.selectedBid = bid._id; guideRequest.booking = booking._id;
    bid.status = 'accepted';
    await Promise.all([guideRequest.save(), bid.save(), GuideBid.updateMany({ request: guideRequest._id, _id: { $ne: bid._id }, status: 'active' }, { status: 'rejected' })]);
    res.status(201).json({ success: true, bookingId: booking._id, booking });
  } catch (error) { next(error); }
};

export const getTouristBooking = async (req, res, next) => {
  try {
    if (!isId(req.params.bookingId)) return fail(res, 400, 'Invalid booking ID');
    const booking = await GuideBooking.findById(req.params.bookingId).populate('tourist', 'fullName').populate('guide', 'fullName username').populate('request').lean();
    if (!booking) return fail(res, 404, 'Booking not found');
    if (!sameId(booking.tourist, req.user._id)) return fail(res, 403, 'You do not own this booking');
    const review = await GuideReview.findOne({ booking: booking._id }).lean();
    res.json({ success: true, booking, review });
  } catch (error) { next(error); }
};

export const createReview = async (req, res, next) => {
  try {
    if (!isId(req.params.bookingId)) return fail(res, 400, 'Invalid booking ID');
    const booking = await GuideBooking.findById(req.params.bookingId);
    if (!booking) return fail(res, 404, 'Booking not found');
    if (!sameId(booking.tourist, req.user._id)) return fail(res, 403, 'You do not own this booking');
    if (sameId(booking.tourist, booking.guide)) return fail(res, 400, 'You cannot review yourself');
    if (booking.status !== 'completed') return fail(res, 409, 'This booking is not yet eligible for review');
    const rating = Number(req.body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !req.body.comment?.trim()) return fail(res, 400, 'A rating from 1 to 5 and a review comment are required');
    try {
      const review = await GuideReview.create({ booking: booking._id, tourist: req.user._id, guide: booking.guide, rating, comment: req.body.comment.trim() });
      booking.reviewedAt = new Date();
      await booking.save();
      await refreshRating(booking.guide);
      res.status(201).json({ success: true, review });
    } catch (error) {
      if (error?.code === 11000) return fail(res, 409, 'This booking has already been reviewed');
      throw error;
    }
  } catch (error) { next(error); }
};

export const listOpportunities = async (req, res, next) => {
  try {
    const myBidRequestIds = await GuideBid.find({ guide: req.user._id }).distinct('request');
    const requests = await GuideRequest.find({ status: { $in: ['open', 'receiving_bids'] }, _id: { $nin: myBidRequestIds }, endDate: { $gte: new Date() }, $or: [{ preferredGuide: null }, { preferredGuide: req.user._id }] }).select('-tourist').sort({ createdAt: -1 }).lean();
    res.json({ success: true, requests });
  } catch (error) { next(error); }
};

export const createBid = async (req, res, next) => {
  try {
    if (!isId(req.params.requestId)) return fail(res, 400, 'Invalid request ID');
    const guideRequest = await GuideRequest.findById(req.params.requestId);
    if (!guideRequest) return fail(res, 404, 'Guide request not found');
    if (!['open', 'receiving_bids'].includes(guideRequest.status)) return fail(res, 409, 'This request is not accepting bids');
    if (sameId(guideRequest.tourist, req.user._id)) return fail(res, 400, 'You cannot bid on your own request');
    if (guideRequest.preferredGuide && !sameId(guideRequest.preferredGuide, req.user._id)) return fail(res, 403, 'This request is reserved for another guide');
    if (guideUnavailable(await ensureGuideProfile(req.user._id))) return fail(res, 403, 'Your guide profile is not active');
    if (new Date(guideRequest.endDate) < new Date()) return fail(res, 409, 'This request has expired');
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0 || !req.body.proposal?.trim()) return fail(res, 400, 'A positive amount and proposal are required');
    try {
      const bid = await GuideBid.create({
        request: guideRequest._id, guide: req.user._id, amount,
        currency: guideRequest.currency || 'LKR', proposal: req.body.proposal.trim(),
        includedServices: cleanList(req.body.includedServices), excludedServices: cleanList(req.body.excludedServices),
        cancellationPolicy: req.body.cancellationPolicy?.trim() || '', expiresAt: req.body.expiresAt || null,
      });
      guideRequest.status = 'receiving_bids'; await guideRequest.save();
      res.status(201).json({ success: true, bid, bidId: bid._id });
    } catch (error) {
      if (error?.code === 11000) return fail(res, 409, 'You already have a bid for this request');
      throw error;
    }
  } catch (error) { next(error); }
};

export const listMyBids = async (req, res, next) => {
  try {
    await GuideBid.updateMany({ guide: req.user._id, status: 'active', expiresAt: { $ne: null, $lt: new Date() } }, { status: 'expired' });
    const bids = await GuideBid.find({ guide: req.user._id }).sort({ createdAt: -1 }).populate('request').lean();
    res.json({ success: true, bids });
  } catch (error) { next(error); }
};

export const updateMyBid = async (req, res, next) => {
  try {
    if (!isId(req.params.bidId)) return fail(res, 400, 'Invalid bid ID');
    const bid = await GuideBid.findById(req.params.bidId);
    if (!bid) return fail(res, 404, 'Bid not found');
    if (!sameId(bid.guide, req.user._id)) return fail(res, 403, 'You do not own this bid');
    if (bid.status !== 'active') return fail(res, 409, 'Only active bids can be edited');
    if (req.body.amount !== undefined) {
      const amount = Number(req.body.amount); if (!Number.isFinite(amount) || amount <= 0) return fail(res, 400, 'Bid amount must be positive'); bid.amount = amount;
    }
    ['proposal', 'cancellationPolicy', 'expiresAt'].forEach((field) => { if (req.body[field] !== undefined) bid[field] = req.body[field]; });
    if (req.body.includedServices !== undefined) bid.includedServices = cleanList(req.body.includedServices);
    if (req.body.excludedServices !== undefined) bid.excludedServices = cleanList(req.body.excludedServices);
    await bid.save(); res.json({ success: true, bid });
  } catch (error) { next(error); }
};

export const withdrawMyBid = async (req, res, next) => {
  try {
    if (!isId(req.params.bidId)) return fail(res, 400, 'Invalid bid ID');
    const bid = await GuideBid.findById(req.params.bidId);
    if (!bid) return fail(res, 404, 'Bid not found');
    if (!sameId(bid.guide, req.user._id)) return fail(res, 403, 'You do not own this bid');
    if (bid.status !== 'active') return fail(res, 409, 'Only active bids can be withdrawn');
    bid.status = 'withdrawn'; await bid.save(); res.json({ success: true, bid });
  } catch (error) { next(error); }
};

export const providerBookings = async (req, res, next) => {
  try {
    const bookings = await GuideBooking.find({ guide: req.user._id }).sort({ createdAt: -1 }).populate('tourist', 'fullName').populate('request', 'destination').lean();
    res.json({ success: true, bookings });
  } catch (error) { next(error); }
};

export const providerBooking = async (req, res, next) => {
  try {
    if (!isId(req.params.bookingId)) return fail(res, 400, 'Invalid booking ID');
    const booking = await GuideBooking.findById(req.params.bookingId).populate('tourist', 'fullName username').populate('request').populate('bid').lean();
    if (!booking) return fail(res, 404, 'Booking not found');
    if (!sameId(booking.guide, req.user._id)) return fail(res, 403, 'You do not own this booking');
    res.json({ success: true, booking });
  } catch (error) { next(error); }
};

export const updateProviderBookingStatus = async (req, res, next) => {
  try {
    if (!isId(req.params.bookingId)) return fail(res, 400, 'Invalid booking ID');
    const booking = await GuideBooking.findById(req.params.bookingId);
    if (!booking) return fail(res, 404, 'Booking not found');
    if (!sameId(booking.guide, req.user._id)) return fail(res, 403, 'You do not own this booking');
    const status = String(req.body.status || '').toLowerCase();
    const transitions = { pending: ['confirmed', 'rejected'], confirmed: ['completed', 'cancelled'], rejected: [], cancelled: [], completed: [] };
    if (!transitions[booking.status]?.includes(status)) return fail(res, 409, 'Invalid booking status transition');
    booking.status = status; await booking.save();
    if (['rejected', 'cancelled'].includes(status)) await GuideRequest.findByIdAndUpdate(booking.request, { status: 'cancelled' });
    if (status === 'completed') await GuideRequest.findByIdAndUpdate(booking.request, { status: 'completed' });
    res.json({ success: true, booking });
  } catch (error) { next(error); }
};

export const dashboard = async (req, res, next) => {
  try {
    const alreadyBid = await GuideBid.distinct('request', { guide: req.user._id });
    const [profile, activeTours, bookings, opportunities, earningStats] = await Promise.all([
      GuideProfile.findOne({ user: req.user._id }).lean(),
      GuideBooking.countDocuments({ guide: req.user._id, status: { $in: ['pending', 'confirmed'] } }),
      GuideBooking.find({ guide: req.user._id }).sort({ createdAt: -1 }).limit(8).populate('tourist', 'fullName').lean(),
      GuideRequest.find({ _id: { $nin: alreadyBid }, status: { $in: ['open', 'receiving_bids'] }, endDate: { $gte: new Date() }, $or: [{ preferredGuide: null }, { preferredGuide: req.user._id }] }).select('-tourist').sort({ createdAt: -1 }).limit(5).lean(),
      GuideBooking.aggregate([
        { $match: { guide: req.user._id, status: 'completed', paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$subtotal' } } },
      ]),
    ]);
    const totalEarnings = earningStats[0]?.total || 0;
    res.json({ success: true, summary: { totalEarnings, availablePayout: totalEarnings, activeTours, averageRating: profile?.ratingAverage || 0 }, latestRequests: opportunities, bookings });
  } catch (error) { next(error); }
};

const packagePayload = (body) => ({
  name: body.name?.trim(), category: body.category?.trim(), description: body.description?.trim(), destination: body.destination?.trim(),
  stops: cleanList(body.stops), tags: cleanList(body.tags), images: cleanList(body.images), pricePerPerson: Number(body.pricePerPerson),
  currency: String(body.currency || 'LKR').toUpperCase(), duration: Number(body.duration), durationUnit: body.durationUnit || 'days',
  status: ['published', 'archived'].includes(body.status) ? body.status : 'draft',
});

export const listPackages = async (req, res, next) => { try { res.json({ success: true, packages: await GuidePackage.find({ guide: req.user._id }).sort({ createdAt: -1 }).lean() }); } catch (error) { next(error); } };
export const createPackage = async (req, res, next) => {
  try {
    const data = packagePayload(req.body);
    if (!data.name || !data.category || !data.description || !data.destination || !Number.isFinite(data.pricePerPerson) || data.pricePerPerson < 0 || !Number.isFinite(data.duration) || data.duration < 1) return fail(res, 400, 'Complete all required package fields');
    const guidePackage = await GuidePackage.create({ ...data, guide: req.user._id }); res.status(201).json({ success: true, package: guidePackage, packageId: guidePackage._id });
  } catch (error) { next(error); }
};
export const getPackage = async (req, res, next) => {
  try { if (!isId(req.params.packageId)) return fail(res, 400, 'Invalid package ID'); const guidePackage = await GuidePackage.findById(req.params.packageId).lean(); if (!guidePackage) return fail(res, 404, 'Package not found'); if (!sameId(guidePackage.guide, req.user._id)) return fail(res, 403, 'You do not own this package'); res.json({ success: true, package: guidePackage }); } catch (error) { next(error); }
};
export const updatePackage = async (req, res, next) => {
  try { if (!isId(req.params.packageId)) return fail(res, 400, 'Invalid package ID'); const guidePackage = await GuidePackage.findById(req.params.packageId); if (!guidePackage) return fail(res, 404, 'Package not found'); if (!sameId(guidePackage.guide, req.user._id)) return fail(res, 403, 'You do not own this package'); Object.assign(guidePackage, packagePayload({ ...guidePackage.toObject(), ...req.body })); await guidePackage.save(); res.json({ success: true, package: guidePackage }); } catch (error) { next(error); }
};

export const earnings = async (req, res, next) => {
  try {
    const transactions = await GuideBooking.find({ guide: req.user._id, status: 'completed', paymentStatus: 'paid' }).sort({ updatedAt: -1 }).populate('tourist', 'fullName').lean();
    const totalEarnings = transactions.reduce((sum, item) => sum + item.subtotal, 0);
    const pending = await GuideBooking.find({ guide: req.user._id, paymentStatus: 'pending', status: { $in: ['confirmed', 'completed'] } }).populate('tourist', 'fullName').lean();
    res.json({ success: true, summary: { totalEarnings, availablePayout: totalEarnings, pendingPayout: pending.reduce((sum, item) => sum + item.subtotal, 0), completedBookings: transactions.length }, transactions, payoutMethods: [], payoutSupported: false });
  } catch (error) { next(error); }
};

export const getMyProfile = async (req, res, next) => {
  try { const profile = await ensureGuideProfile(req.user._id); res.json({ success: true, user: { _id: req.user._id, fullName: req.user.fullName, email: req.user.email, contactNumber: req.user.contactNumber, guideId: req.user.guideId, dob: req.user.dob, gender: req.user.gender }, profile: profile || null }); } catch (error) { next(error); }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const userAllowed = ['fullName', 'contactNumber', 'dob', 'gender'];
    const userUpdates = {}; userAllowed.forEach((field) => { if (req.body[field] !== undefined) userUpdates[field] = req.body[field]; });
    if (Object.keys(userUpdates).length) await User.findByIdAndUpdate(req.user._id, { $set: userUpdates }, { runValidators: true });
    const profileInput = req.body.profile || req.body;
    const profileAllowed = ['professionalTitle', 'bio', 'experienceYears', 'avatar', 'coverImage', 'dailyRate', 'currency', 'specialSkills'];
    const profileUpdates = {}; profileAllowed.forEach((field) => { if (profileInput[field] !== undefined) profileUpdates[field] = profileInput[field]; });
    ['languages', 'expertise', 'highlights', 'gallery', 'includedServices'].forEach((field) => { if (profileInput[field] !== undefined) profileUpdates[field] = cleanList(profileInput[field]); });
    for (const field of ['identityProof', 'certifications']) {
      if (profileInput[field] === undefined) continue;
      if (!Array.isArray(profileInput[field])) return fail(res, 400, 'Documents must be a list');
      profileUpdates[field] = profileInput[field].filter((document) => document?.url).map((document) => ({
        name: String(document.name || '').trim(), url: String(document.url).trim(), status: 'pending',
      }));
    }
    const profile = await GuideProfile.findOneAndUpdate({ user: req.user._id }, { $set: profileUpdates, $setOnInsert: { user: req.user._id } }, { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true });
    res.json({ success: true, profile });
  } catch (error) { next(error); }
};

export const listPublicGuides = async (_req, res, next) => {
  try {
    const users = await User.find({ role: 'guide_user' }).select('fullName username guideId').lean();
    const profiles = await GuideProfile.find({ user: { $in: users.map((item) => item._id) } }).lean();
    const byUser = Object.fromEntries(profiles.map((item) => [String(item.user), item]));
    res.json({ success: true, guides: users.filter((user) => !guideUnavailable(byUser[String(user._id)])).sort((a, b) => Number(byUser[String(b._id)]?.verified || false) - Number(byUser[String(a._id)]?.verified || false) || (byUser[String(b._id)]?.ratingAverage || 0) - (byUser[String(a._id)]?.ratingAverage || 0)).map((user) => ({ user: safeUser(user), guideId: user.guideId || '', ...(safeProfile(byUser[String(user._id)]) || {}) })) });
  } catch (error) { next(error); }
};

export const getPublicGuide = async (req, res, next) => {
  try { if (!isId(req.params.guideId)) return fail(res, 400, 'Invalid guide ID'); const guide = await profileFor(req.params.guideId); if (!guide) return fail(res, 404, 'Guide not found'); const packages = await GuidePackage.find({ guide: req.params.guideId, status: 'published' }).sort({ updatedAt: -1 }).lean(); res.json({ success: true, guide, packages }); } catch (error) { next(error); }
};
