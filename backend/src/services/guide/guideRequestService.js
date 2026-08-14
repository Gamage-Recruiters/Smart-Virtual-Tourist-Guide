import GuideRequest from '../../models/GuideRequest.js';
import GuideBid from '../../models/GuideBid.js';
import AppError from '../../utils/AppError.js';
import {CURRENCIES, REQUEST_STATUSES} from '../../utils/guideConstants.js';
import {cleanString,
  cleanStringArray,
  parseBoolean,
  parseDate,
  parseOptionalNumber,
  parsePagination,
  paginationMeta,} from '../../utils/guideValidation.js';
import {assertTransition} from './guideStateService.js';
import {createNotification} from './guideNotificationService.js';

const editableFields = [
  'startLocation', 'destination', 'stops', 'startDate', 'endDate', 'startTime', 'adults', 'children',
  'pickupLocation', 'dropoffLocation', 'languages', 'specialities', 'femaleGuidePreference',
  'minExperience', 'minRating', 'minBudget', 'maxBudget', 'currency', 'description',
  'specialRequirements', 'accessibilityNeeds', 'contactPreference',
];

const normalizeRequestInput = (input = {}, { partial = false } = {}) => {
  const acceptedFields = [...editableFields, 'additionalStops', 'preferredLanguages', 'femaleGuidePreferred', 'minimumExperience', 'minimumRating'];
  if (Object.keys(input).some((field) => !acceptedFields.includes(field))) {
    throw new AppError('The guide request contains unsupported or protected fields.', 400, 'UNSAFE_REQUEST_PAYLOAD');
  }
  const has = (field) => Object.prototype.hasOwnProperty.call(input, field);
  const output = {};
  const set = (field, value) => { if (value !== undefined || has(field)) output[field] = value; };

  set('startLocation', cleanString(input.startLocation, 160, 'Starting location', { required: !partial }));
  set('destination', cleanString(input.destination, 160, 'Destination', { required: !partial }));
  set('stops', cleanStringArray(input.stops ?? input.additionalStops, 'Additional stops', { maxItems: 20, maxLength: 160 }));
  set('startDate', parseDate(input.startDate, 'Start date', { required: !partial }));
  set('endDate', parseDate(input.endDate, 'End date', { required: !partial }));
  set('startTime', cleanString(input.startTime, 5, 'Start time'));
  set('adults', parseOptionalNumber(input.adults, 'Adults', { min: 1, max: 100, integer: true }));
  set('children', parseOptionalNumber(input.children, 'Children', { min: 0, max: 100, integer: true }));
  set('pickupLocation', cleanString(input.pickupLocation, 160, 'Pickup location'));
  set('dropoffLocation', cleanString(input.dropoffLocation, 160, 'Drop-off location'));
  set('languages', cleanStringArray(input.languages ?? input.preferredLanguages, 'Languages', { maxItems: 20, maxLength: 60 }));
  set('specialities', cleanStringArray(input.specialities, 'Specialities', { maxItems: 30, maxLength: 100 }));
  set('femaleGuidePreference', parseBoolean(input.femaleGuidePreference ?? input.femaleGuidePreferred, 'Female guide preference'));
  set('minExperience', parseOptionalNumber(input.minExperience ?? input.minimumExperience, 'Minimum experience', { min: 0, max: 80 }));
  set('minRating', parseOptionalNumber(input.minRating ?? input.minimumRating, 'Minimum rating', { min: 0, max: 5 }));
  set('minBudget', parseOptionalNumber(input.minBudget, 'Minimum budget', { min: 0 }));
  set('maxBudget', parseOptionalNumber(input.maxBudget, 'Maximum budget', { min: 0.01 }));
  set('currency', cleanString(input.currency, 3, 'Currency'));
  set('description', cleanString(input.description, 600, 'Description'));
  set('specialRequirements', cleanString(input.specialRequirements, 1000, 'Special requirements'));
  set('accessibilityNeeds', cleanString(input.accessibilityNeeds, 1000, 'Accessibility needs'));
  set('contactPreference', cleanString(input.contactPreference, 40, 'Contact preference'));

  if (!partial) {
    if (output.adults === undefined) throw new AppError('Adults is required.', 400, 'VALIDATION_ERROR');
    if (output.maxBudget === undefined) throw new AppError('Maximum budget is required.', 400, 'VALIDATION_ERROR');
    output.currency ||= 'LKR';
  }
  if (output.currency && !CURRENCIES.includes(output.currency)) throw new AppError('Unsupported currency.', 400, 'VALIDATION_ERROR');
  if (output.startTime && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(output.startTime)) throw new AppError('Start time must use HH:mm format.', 400, 'VALIDATION_ERROR');
  return output;
};

const validateRequestDatesAndBudget = (values, current = {}) => {
  const startDate = values.startDate ?? current.startDate;
  const endDate = values.endDate ?? current.endDate;
  const minBudget = values.minBudget ?? current.minBudget;
  const maxBudget = values.maxBudget ?? current.maxBudget;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (startDate < today || endDate < today) throw new AppError('New guide requests cannot use dates in the past.', 400, 'INVALID_DATES');
  if (endDate < startDate) throw new AppError('End date cannot be before start date.', 400, 'INVALID_DATES');
  if (minBudget !== undefined && minBudget !== null && minBudget > maxBudget) throw new AppError('Minimum budget cannot exceed maximum budget.', 400, 'INVALID_BUDGET');
};

const requestDeadline = (startDate, startTime = '08:00') => {
  const deadline = new Date(startDate);
  const [hours, minutes] = startTime.split(':').map(Number);
  deadline.setUTCHours(hours, minutes, 0, 0);
  return deadline;
};

const expireIfNeeded = async (request) => {
  if (request.status === 'Open' && request.expiresAt <= new Date()) {
    assertTransition('request', request.status, 'Expired');
    request.status = 'Expired';
    await request.save();
  }
  return request;
};

const assertOwner = (request, user) => {
  if (user.role !== 'admin' && String(request.touristId) !== String(user._id)) {
    throw new AppError('This guide request does not belong to you.', 403, 'FORBIDDEN');
  }
};

const createRequest = async (user, input) => {
  const data = normalizeRequestInput(input);
  validateRequestDatesAndBudget(data);
  const request = await GuideRequest.create({
    ...data,
    touristId: user._id,
    status: 'Open',
    expiresAt: requestDeadline(data.startDate, data.startTime),
  });
  await createNotification({
    userId: user._id,
    type: 'GUIDE_REQUEST_CREATED',
    title: 'Guide request created',
    message: `Your request from ${request.startLocation} to ${request.destination} is open for bids.`,
    data: { requestId: request._id },
    dedupeKey: `guide-request-created:${request._id}`,
  });
  return request;
};

const listOwnRequests = async (user, query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = user.role === 'admin' ? {} : { touristId: user._id };
  if (query.status) {
    const status = cleanString(query.status, 40, 'Request status');
    if (!REQUEST_STATUSES.includes(status)) throw new AppError('Invalid request status filter.', 400, 'INVALID_FILTER');
    filter.status = status;
  }
  const sort = query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
  const [requests, totalItems] = await Promise.all([
    GuideRequest.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    GuideRequest.countDocuments(filter),
  ]);
  return { requests, pagination: paginationMeta({ page, limit, totalItems }) };
};

const getOwnedRequest = async (user, requestId) => {
  const request = await GuideRequest.findById(requestId);
  if (!request) throw new AppError('Guide request not found.', 404, 'REQUEST_NOT_FOUND');
  assertOwner(request, user);
  return expireIfNeeded(request);
};

const updateRequest = async (user, requestId, input = {}) => {
  if (Object.keys(input).some((field) => !editableFields.includes(field))) {
    throw new AppError('The request contains fields that cannot be changed.', 400, 'UNSAFE_UPDATE');
  }
  const request = await getOwnedRequest(user, requestId);
  if (!['Draft', 'Open'].includes(request.status)) throw new AppError('This request can no longer be edited.', 409, 'REQUEST_NOT_EDITABLE');
  const updates = normalizeRequestInput(input, { partial: true });
  validateRequestDatesAndBudget(updates, request);
  Object.assign(request, updates);
  if (updates.startDate || updates.startTime) request.expiresAt = requestDeadline(updates.startDate || request.startDate, updates.startTime || request.startTime);
  await request.save();
  return request;
};

const cancelRequest = async (user, requestId) => {
  const request = await getOwnedRequest(user, requestId);
  if (['Completed', 'Cancelled', 'Expired'].includes(request.status)) throw new AppError('This request cannot be cancelled.', 409, 'INVALID_REQUEST_STATE');
  if (request.bookingId) throw new AppError('Cancel the confirmed booking instead of the request.', 409, 'BOOKING_EXISTS');
  assertTransition('request', request.status, 'Cancelled');
  request.status = 'Cancelled';
  request.cancelledAt = new Date();
  const affectedBids = await GuideBid.find({ requestId: request._id, status: 'Active' }).populate('guideId', 'userId displayName');
  await request.save();
  await GuideBid.updateMany({ requestId: request._id, status: 'Active' }, { status: 'Rejected' });
  await Promise.all(affectedBids.map((bid) => createNotification({
    userId: bid.guideId?.userId,
    type: 'GUIDE_BID_REJECTED',
    title: 'Guide request cancelled',
    message: `The request for your bid from ${request.startLocation} to ${request.destination} was cancelled.`,
    data: { requestId: request._id, bidId: bid._id },
    dedupeKey: `guide-request-cancelled:${request._id}:${bid.guideId?._id}`,
  })));
  return request;
};

const listOpportunities = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const now = new Date();
  const filter = { status: 'Open', expiresAt: { $gt: now }, startDate: { $gte: now } };
  if (query.location) filter.startLocation = new RegExp(`^${escapeRegex(cleanString(query.location, 160, 'Location'))}`, 'i');
  if (query.destination) filter.destination = new RegExp(`^${escapeRegex(cleanString(query.destination, 160, 'Destination'))}`, 'i');
  if (query.startDate) filter.startDate = { $gte: parseDate(query.startDate, 'Start date') };
  if (query.language) filter.languages = cleanString(query.language, 60, 'Language');
  if (query.speciality) filter.specialities = cleanString(query.speciality, 100, 'Speciality');
  const minBudget = parseOptionalNumber(query.minBudget, 'Minimum budget', { min: 0 });
  const maxBudget = parseOptionalNumber(query.maxBudget, 'Maximum budget', { min: 0 });
  if (minBudget !== undefined || maxBudget !== undefined) filter.maxBudget = { ...(minBudget !== undefined && { $gte: minBudget }), ...(maxBudget !== undefined && { $lte: maxBudget }) };
  const projection = '-touristId -accessibilityNeeds -contactPreference';
  const [requests, totalItems] = await Promise.all([
    GuideRequest.find(filter).select(projection).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    GuideRequest.countDocuments(filter),
  ]);
  return { requests, pagination: paginationMeta({ page, limit, totalItems }) };
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export {
  createRequest,
  listOwnRequests,
  getOwnedRequest,
  updateRequest,
  cancelRequest,
  listOpportunities,
  expireIfNeeded,
  assertOwner,
  normalizeRequestInput,
};
