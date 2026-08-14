import mongoose from 'mongoose';
import GuideBid from '../../models/GuideBid.js';
import GuideProfile from '../../models/GuideProfile.js';
import GuideRequest from '../../models/GuideRequest.js';
import AppError from '../../utils/AppError.js';
import {cleanString,
  cleanStringArray,
  parseBoolean,
  parseDate,
  parseOptionalNumber,
  parsePagination,
  paginationMeta,} from '../../utils/guideValidation.js';
import {checkGuideAvailability} from './guideAvailabilityService.js';
import {BID_STATUSES} from '../../utils/guideConstants.js';
import {assertOwner, expireIfNeeded} from './guideRequestService.js';
import {createNotification} from './guideNotificationService.js';
import {assertTransition} from './guideStateService.js';

const normalizeBidInput = (input = {}, request, { partial = false } = {}) => {
  const allowed = ['amount', 'currency', 'proposedItinerary', 'includedServices', 'excludedServices', 'message', 'cancellationPolicy', 'expiresAt'];
  if (Object.keys(input).some((field) => !allowed.includes(field))) throw new AppError('The bid contains fields that cannot be changed.', 400, 'UNSAFE_UPDATE');
  const output = {};
  const amount = parseOptionalNumber(input.amount, 'Bid amount', { min: 0.01 });
  if (amount !== undefined) output.amount = amount;
  else if (!partial) throw new AppError('Bid amount is required.', 400, 'VALIDATION_ERROR');
  if (input.currency !== undefined && input.currency !== request.currency) throw new AppError('Bid currency must match the request currency.', 400, 'CURRENCY_MISMATCH');
  if (!partial || input.currency !== undefined) output.currency = request.currency;
  const itinerary = cleanString(input.proposedItinerary, 4000, 'Proposed itinerary', { required: !partial });
  if (itinerary !== undefined) output.proposedItinerary = itinerary;
  const included = cleanStringArray(input.includedServices, 'Included services', { maxItems: 30, maxLength: 160 });
  if (included !== undefined) output.includedServices = included;
  const excluded = cleanStringArray(input.excludedServices, 'Excluded services', { maxItems: 30, maxLength: 160 });
  if (excluded !== undefined) output.excludedServices = excluded;
  const message = cleanString(input.message, 1000, 'Message');
  if (message !== undefined) output.message = message;
  const policy = cleanString(input.cancellationPolicy, 2000, 'Cancellation policy', { required: !partial });
  if (policy !== undefined) output.cancellationPolicy = policy;
  const expiresAt = parseDate(input.expiresAt, 'Bid expiry', { required: !partial });
  if (expiresAt !== undefined) {
    if (expiresAt <= new Date() || expiresAt > request.expiresAt) throw new AppError('Bid expiry must be in the future and no later than the request deadline.', 400, 'INVALID_BID_EXPIRY');
    output.expiresAt = expiresAt;
  }
  return output;
};

const getActiveGuideProfile = async (user) => {
  const profile = await GuideProfile.findOne({ userId: user._id, active: true }).select('+reservedDates');
  if (!profile) throw new AppError('An active guide profile is required.', 403, 'GUIDE_PROFILE_REQUIRED');
  return profile;
};

const assertRequestOpen = async (request) => {
  await expireIfNeeded(request);
  if (request.status !== 'Open') throw new AppError('This guide request is not open for bidding.', 409, 'REQUEST_NOT_OPEN');
};

const submitBid = async (user, requestId, input) => {
  const [profile, request] = await Promise.all([getActiveGuideProfile(user), GuideRequest.findById(requestId)]);
  if (!request) throw new AppError('Guide request not found.', 404, 'REQUEST_NOT_FOUND');
  await assertRequestOpen(request);
  const availability = await checkGuideAvailability({ guide: profile, startDate: request.startDate, endDate: request.endDate });
  if (!availability.available) throw new AppError(availability.reason, 409, 'GUIDE_UNAVAILABLE');
  const existing = await GuideBid.findOne({ requestId: request._id, guideId: profile._id });
  if (existing && existing.status !== 'Active') throw new AppError('The existing bid can no longer be changed.', 409, 'BID_NOT_EDITABLE');
  const data = normalizeBidInput(input, request, { partial: Boolean(existing) });
  let bid;
  let created;
  if (existing) {
    Object.assign(existing, data);
    bid = await existing.save();
    created = false;
  } else {
    bid = await GuideBid.create({ ...data, requestId: request._id, guideId: profile._id, status: 'Active' });
    created = true;
  }
  await createNotification({
    userId: request.touristId,
    type: created ? 'GUIDE_BID_SUBMITTED' : 'GUIDE_BID_UPDATED',
    title: created ? 'New guide bid' : 'Guide bid updated',
    message: `${profile.displayName} ${created ? 'submitted' : 'updated'} a bid for your trip.`,
    data: { requestId: request._id, bidId: bid._id, guideId: profile._id },
    dedupeKey: `${created ? 'guide-bid-submitted' : 'guide-bid-updated'}:${bid._id}:${bid.updatedAt.getTime()}`,
  });
  return { bid, created };
};

const updateBid = async (user, bidId, input) => {
  const profile = await getActiveGuideProfile(user);
  const bid = await GuideBid.findById(bidId);
  if (!bid) throw new AppError('Guide bid not found.', 404, 'BID_NOT_FOUND');
  if (String(bid.guideId) !== String(profile._id)) throw new AppError('You can update only your own bid.', 403, 'FORBIDDEN');
  if (bid.status !== 'Active') throw new AppError('This bid can no longer be edited.', 409, 'BID_NOT_EDITABLE');
  const request = await GuideRequest.findById(bid.requestId);
  if (!request) throw new AppError('Guide request not found.', 404, 'REQUEST_NOT_FOUND');
  await assertRequestOpen(request);
  Object.assign(bid, normalizeBidInput(input, request, { partial: true }));
  await bid.save();
  await createNotification({
    userId: request.touristId,
    type: 'GUIDE_BID_UPDATED',
    title: 'Guide bid updated',
    message: `${profile.displayName} updated a bid for your trip.`,
    data: { requestId: request._id, bidId: bid._id, guideId: profile._id },
    dedupeKey: `guide-bid-updated:${bid._id}:${bid.updatedAt.getTime()}`,
  });
  return bid;
};

const withdrawBid = async (user, bidId) => {
  const profile = await getActiveGuideProfile(user);
  const bid = await GuideBid.findById(bidId);
  if (!bid) throw new AppError('Guide bid not found.', 404, 'BID_NOT_FOUND');
  if (String(bid.guideId) !== String(profile._id)) throw new AppError('You can withdraw only your own bid.', 403, 'FORBIDDEN');
  if (bid.status !== 'Active') throw new AppError('This bid cannot be withdrawn.', 409, 'BID_NOT_EDITABLE');
  assertTransition('bid', bid.status, 'Withdrawn');
  bid.status = 'Withdrawn';
  await bid.save();
  return bid;
};

const serializeBid = (bid) => ({
  id: String(bid._id),
  requestId: String(bid.requestId),
  guideId: String(bid.guideId),
  amount: bid.amount,
  currency: bid.currency,
  proposedItinerary: bid.proposedItinerary,
  includedServices: bid.includedServices,
  excludedServices: bid.excludedServices,
  message: bid.message,
  cancellationPolicy: bid.cancellationPolicy,
  status: bid.status,
  submittedAt: bid.submittedAt,
  updatedAt: bid.updatedAt,
  expiresAt: bid.expiresAt,
});

const listRequestBids = async (user, requestId, query) => {
  const request = await GuideRequest.findById(requestId);
  if (!request) throw new AppError('Guide request not found.', 404, 'REQUEST_NOT_FOUND');
  assertOwner(request, user);
  await expireIfNeeded(request);
  await GuideBid.updateMany({ requestId: request._id, status: 'Active', expiresAt: { $lte: new Date() } }, { $set: { status: 'Expired' } });
  const { page, limit, skip } = parsePagination(query);
  const match = { requestId: request._id, status: 'Active', expiresAt: { $gt: new Date() } };
  const profileMatch = { 'guide.active': true };
  const minPrice = parseOptionalNumber(query.minPrice, 'Minimum price', { min: 0 });
  const maxPrice = parseOptionalNumber(query.maxPrice, 'Maximum price', { min: 0 });
  const minRating = parseOptionalNumber(query.minRating, 'Minimum rating', { min: 0, max: 5 });
  const minExperience = parseOptionalNumber(query.minExperience, 'Minimum experience', { min: 0, max: 80 });
  if (minPrice !== undefined || maxPrice !== undefined) match.amount = { ...(minPrice !== undefined && { $gte: minPrice }), ...(maxPrice !== undefined && { $lte: maxPrice }) };
  if (minRating !== undefined) profileMatch['guide.averageRating'] = { $gte: minRating };
  if (minExperience !== undefined) profileMatch['guide.experienceYears'] = { $gte: minExperience };
  if (query.language) profileMatch['guide.languages.name'] = cleanString(query.language, 60, 'Language');
  if (query.speciality) profileMatch['guide.specialities'] = cleanString(query.speciality, 100, 'Speciality');
  if (query.availability) {
    if (!['Available', 'Unavailable'].includes(query.availability)) throw new AppError('Invalid availability filter.', 400, 'INVALID_FILTER');
    profileMatch['guide.availability'] = query.availability;
  }
  const verified = parseBoolean(query.verified, 'Verified');
  if (verified !== undefined) profileMatch['guide.verified'] = verified;
  if (query.search) profileMatch['guide.displayName'] = { $regex: escapeRegex(cleanString(query.search, 120, 'Search')), $options: 'i' };
  const sorts = {
    recommended: { 'guide.verified': -1, 'guide.averageRating': -1, amount: 1 },
    price_asc: { amount: 1 }, price_desc: { amount: -1 }, rating_desc: { 'guide.averageRating': -1 },
    experience_desc: { 'guide.experienceYears': -1 }, newest: { submittedAt: -1 },
  };
  const sort = sorts[query.sort || 'recommended'];
  if (!sort) throw new AppError('Invalid bid sort option.', 400, 'INVALID_SORT');
  const pipeline = [
    { $match: match },
    { $lookup: { from: 'guideprofiles', localField: 'guideId', foreignField: '_id', as: 'guide' } },
    { $unwind: '$guide' },
    { $match: profileMatch },
    { $facet: { items: [{ $sort: sort }, { $skip: skip }, { $limit: limit }], metadata: [{ $count: 'total' }] } },
  ];
  const [{ items, metadata }] = await GuideBid.aggregate(pipeline);
  const totalItems = metadata[0]?.total || 0;
  const bids = items.map((item) => ({
    ...serializeBid(item),
    guide: {
      id: String(item.guide._id), name: item.guide.displayName, image: item.guide.profileImage,
      verified: item.guide.verified, rating: item.guide.averageRating, reviewCount: item.guide.reviewCount,
      experienceYears: item.guide.experienceYears, location: item.guide.location, languages: item.guide.languages,
      specialities: item.guide.specialities, bio: item.guide.bio, availability: item.guide.availability, responseTime: item.guide.responseTime,
    },
  }));
  return { request, bids, pagination: paginationMeta({ page, limit, totalItems }) };
};

const getOwnedBid = async (user, requestId, bidId) => {
  const request = await GuideRequest.findById(requestId);
  if (!request) throw new AppError('Guide request not found.', 404, 'REQUEST_NOT_FOUND');
  assertOwner(request, user);
  const bid = await GuideBid.findOne({ _id: bidId, requestId });
  if (!bid) throw new AppError('Guide bid not found for this request.', 404, 'BID_NOT_FOUND');
  if (bid.status === 'Active' && bid.expiresAt <= new Date()) {
    bid.status = 'Expired';
    await bid.save();
  }
  return bid;
};

const listOwnBids = async (user, query) => {
  const profile = await getActiveGuideProfile(user);
  const { page, limit, skip } = parsePagination(query);
  const filter = { guideId: profile._id };
  if (query.status) {
    const status = cleanString(query.status, 40, 'Bid status');
    if (!BID_STATUSES.includes(status)) throw new AppError('Invalid bid status filter.', 400, 'INVALID_FILTER');
    filter.status = status;
  }
  const [bids, totalItems] = await Promise.all([
    GuideBid.find(filter).populate('requestId', 'startLocation destination startDate endDate status').sort({ submittedAt: -1 }).skip(skip).limit(limit).lean(),
    GuideBid.countDocuments(filter),
  ]);
  return { bids, pagination: paginationMeta({ page, limit, totalItems }) };
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export { submitBid, updateBid, withdrawBid, listRequestBids, getOwnedBid, listOwnBids, serializeBid, getActiveGuideProfile };
