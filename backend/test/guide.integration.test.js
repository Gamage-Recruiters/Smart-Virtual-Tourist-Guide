import { before, beforeEach, after, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';

import app from '../src/app.js';
import User from '../src/models/User.js';
import GuideProfile from '../src/models/GuideProfile.js';
import GuideRequest from '../src/models/GuideRequest.js';
import GuideBid from '../src/models/GuideBid.js';
import GuideBooking from '../src/models/GuideBooking.js';
import GuideReview from '../src/models/GuideReview.js';
import Notification from '../src/models/Notification.js';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'guide-integration-test-secret';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';

let mongo;

const tokenFor = (user, options = {}) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: '1h', algorithm: 'HS256', ...options,
});

const futureDates = (offset = 20) => {
  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() + offset);
  startDate.setUTCHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + 3);
  return { startDate, endDate };
};

const createUser = async (role, name) => User.create({
  fullName: name, email: `${name.toLowerCase().replace(/\s/g, '.')}@test.local`, password: await bcrypt.hash('test-only-password', 4), role,
});

const requestPayload = (overrides = {}) => {
  const { startDate, endDate } = futureDates();
  return {
    startLocation: 'Colombo', destination: 'Sigiriya', stops: ['Dambulla'],
    startDate: startDate.toISOString(), endDate: endDate.toISOString(), startTime: '08:00',
    adults: 2, children: 0, languages: ['English'], specialities: ['Historical tours'],
    minBudget: 10000, maxBudget: 40000, currency: 'LKR', description: 'Test trip', ...overrides,
  };
};

const createGuide = async (name = 'Test Guide', overrides = {}) => {
  const user = await createUser('guide_user', name);
  const profile = await GuideProfile.create({
    userId: user._id, displayName: name, profileImage: '/guide.svg', verified: true,
    verificationStatus: 'Verified', location: 'Colombo', bio: 'Experienced guide', experienceYears: 8,
    languages: [{ name: 'English', proficiency: 'Professional' }], specialities: ['Historical tours'],
    availability: 'Available', active: true, averageRating: 4.8, ...overrides,
  });
  return { user, profile, token: tokenFor(user) };
};

const createOpenRequest = async (tourist, overrides = {}) => {
  const payload = requestPayload(overrides);
  return GuideRequest.create({ ...payload, touristId: tourist._id, status: 'Open', expiresAt: payload.startDate });
};

const bidPayload = (requestRecord, overrides = {}) => ({
  amount: 18000, currency: 'LKR', proposedItinerary: 'A safe and detailed itinerary.',
  includedServices: ['Guide service'], excludedServices: ['Tickets'], message: 'Welcome',
  cancellationPolicy: 'Free cancellation up to 72 hours before departure.',
  expiresAt: new Date(new Date(requestRecord.startDate).getTime() - 3600000).toISOString(), ...overrides,
});

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await Promise.all(Object.values(mongoose.models).map((model) => model.syncIndexes()));
});

beforeEach(async () => {
  await Promise.all(Object.values(mongoose.connection.collections).map((collection) => collection.deleteMany({})));
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('stable authentication contract', () => {
  test('rejects invalid and expired bearer tokens with 401', async () => {
    const invalid = await request(app)
      .post('/api/guides/requests')
      .set('Authorization', 'Bearer not-a-valid-jwt')
      .send(requestPayload());
    assert.equal(invalid.status, 401);

    const tourist = await createUser('tourist_user', 'Expired Tourist');
    const expiredToken = tokenFor(tourist, { expiresIn: '-1s' });
    const expired = await request(app)
      .post('/api/guides/requests')
      .set('Authorization', `Bearer ${expiredToken}`)
      .send(requestPayload());
    assert.equal(expired.status, 401);
    assert.match(expired.body.message, /expired/i);
  });

  test('uses a real login token to create a guide request', async () => {
    const tourist = await createUser('tourist_user', 'Login Tourist');
    const login = await request(app).post('/api/auth/login').send({
      identifier: tourist.email,
      password: 'test-only-password',
    });
    assert.equal(login.status, 200);
    assert.equal(login.body.user.role, 'tourist_user');
    assert.ok(login.body.token);

    const created = await request(app)
      .post('/api/guides/requests')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(requestPayload());
    assert.equal(created.status, 201);
    assert.equal(String(created.body.data.request.touristId), String(tourist._id));
  });
});

describe('guide request API', () => {
  test('rejects unauthenticated and wrong-role creation', async () => {
    const unauthenticated = await request(app).post('/api/guides/requests').send(requestPayload());
    assert.equal(unauthenticated.status, 401);
    const guide = await createGuide();
    const wrongRole = await request(app).post('/api/guides/requests').set('Authorization', `Bearer ${guide.token}`).send(requestPayload());
    assert.equal(wrongRole.status, 403);
  });

  test('validates dates, travellers and budget server-side', async () => {
    const tourist = await createUser('tourist_user', 'Request Tourist');
    const token = tokenFor(tourist);
    const past = new Date(Date.now() - 86400000).toISOString();
    assert.equal((await request(app).post('/api/guides/requests').set('Authorization', `Bearer ${token}`).send(requestPayload({ startDate: past }))).status, 400);
    assert.equal((await request(app).post('/api/guides/requests').set('Authorization', `Bearer ${token}`).send(requestPayload({ adults: 0 }))).status, 400);
    assert.equal((await request(app).post('/api/guides/requests').set('Authorization', `Bearer ${token}`).send(requestPayload({ minBudget: 50000, maxBudget: 10000 }))).status, 400);
  });

  test('uses the authenticated tourist and enforces ownership', async () => {
    const tourist = await createUser('tourist_user', 'Owner Tourist');
    const other = await createUser('tourist_user', 'Other Tourist');
    const unsafe = await request(app).post('/api/guides/requests').set('Authorization', `Bearer ${tokenFor(tourist)}`).send({ ...requestPayload(), touristId: other._id, status: 'Booked' });
    assert.equal(unsafe.status, 400);
    const response = await request(app).post('/api/guides/requests').set('Authorization', `Bearer ${tokenFor(tourist)}`).send(requestPayload());
    assert.equal(response.status, 201);
    const saved = await GuideRequest.findById(response.body.data.request.id);
    assert.equal(String(saved.touristId), String(tourist._id));
    assert.equal(saved.status, 'Open');
    assert.equal((await request(app).get(`/api/guides/requests/${saved._id}`).set('Authorization', `Bearer ${tokenFor(other)}`)).status, 403);
  });

  test('cancels an owned open request and rejects status mass assignment', async () => {
    const tourist = await createUser('tourist_user', 'Cancel Tourist');
    const record = await createOpenRequest(tourist);
    const token = tokenFor(tourist);
    assert.equal((await request(app).patch(`/api/guides/requests/${record._id}`).set('Authorization', `Bearer ${token}`).send({ status: 'Booked' })).status, 400);
    const cancelled = await request(app).patch(`/api/guides/requests/${record._id}/cancel`).set('Authorization', `Bearer ${token}`);
    assert.equal(cancelled.status, 200);
    assert.equal(cancelled.body.data.request.status, 'Cancelled');
  });

  test('lists safe open opportunities only for authenticated guides', async () => {
    const tourist = await createUser('tourist_user', 'Opportunity Tourist');
    const guide = await createGuide('Opportunity Guide');
    const open = await createOpenRequest(tourist);
    open.description = 'Visible opportunity';
    open.accessibilityNeeds = 'Private accessibility details';
    await open.save();
    const cancelled = await createOpenRequest(tourist);
    cancelled.status = 'Cancelled';
    await cancelled.save();

    assert.equal((await request(app).get('/api/guides/opportunities')).status, 401);
    assert.equal((await request(app).get('/api/guides/opportunities').set('Authorization', `Bearer ${tokenFor(tourist)}`)).status, 403);
    const response = await request(app).get('/api/guides/opportunities?destination=Sigiriya&page=1&limit=6').set('Authorization', `Bearer ${guide.token}`);
    assert.equal(response.status, 200);
    assert.equal(response.body.data.requests.length, 1);
    assert.equal(response.body.data.requests[0].id, String(open._id));
    assert.equal(response.body.data.requests[0].touristId, undefined);
    assert.equal(response.body.data.requests[0].accessibilityNeeds, undefined);
    assert.equal(response.body.data.pagination.totalItems, 1);
  });
});

describe('guide bidding and filters', () => {
  test('creates and updates only the authenticated guide own bid', async () => {
    const tourist = await createUser('tourist_user', 'Bid Tourist');
    const guide = await createGuide('Bid Guide');
    const otherGuide = await createGuide('Other Bid Guide');
    const record = await createOpenRequest(tourist);
    const created = await request(app).post(`/api/guides/requests/${record._id}/bids`).set('Authorization', `Bearer ${guide.token}`).send(bidPayload(record));
    assert.equal(created.status, 201);
    const duplicate = await request(app).post(`/api/guides/requests/${record._id}/bids`).set('Authorization', `Bearer ${guide.token}`).send({ amount: 19000 });
    assert.equal(duplicate.status, 200);
    assert.equal(duplicate.body.data.updatedExisting, true);
    const forbidden = await request(app).patch(`/api/guides/bids/${created.body.data.bid.id}`).set('Authorization', `Bearer ${otherGuide.token}`).send({ amount: 22000 });
    assert.equal(forbidden.status, 403);
    assert.equal(await GuideBid.countDocuments({ requestId: record._id, guideId: guide.profile._id }), 1);
  });

  test('rejects invalid amounts, closed requests and unavailable guides', async () => {
    const tourist = await createUser('tourist_user', 'Blocked Bid Tourist');
    const guide = await createGuide('Blocked Bid Guide');
    const record = await createOpenRequest(tourist);
    assert.equal((await request(app).post(`/api/guides/requests/${record._id}/bids`).set('Authorization', `Bearer ${guide.token}`).send(bidPayload(record, { amount: -1 }))).status, 400);
    record.status = 'Cancelled';
    await record.save();
    assert.equal((await request(app).post(`/api/guides/requests/${record._id}/bids`).set('Authorization', `Bearer ${guide.token}`).send(bidPayload(record))).status, 409);
  });

  test('filters, sorts and paginates bids without exposing user data', async () => {
    const tourist = await createUser('tourist_user', 'Filter Tourist');
    const record = await createOpenRequest(tourist);
    const first = await createGuide('Alpha Guide', { averageRating: 4.9, experienceYears: 12 });
    const second = await createGuide('Beta Guide', { averageRating: 4.1, experienceYears: 3, verified: false });
    await GuideBid.create({ ...bidPayload(record), requestId: record._id, guideId: first.profile._id, amount: 15000, status: 'Active' });
    await GuideBid.create({ ...bidPayload(record), requestId: record._id, guideId: second.profile._id, amount: 25000, status: 'Active' });
    const response = await request(app)
      .get(`/api/guides/requests/${record._id}/bids?minRating=4.5&verified=true&sort=price_asc&page=1&limit=1`)
      .set('Authorization', `Bearer ${tokenFor(tourist)}`);
    assert.equal(response.status, 200);
    assert.equal(response.body.data.bids.length, 1);
    assert.equal(response.body.data.bids[0].guide.name, 'Alpha Guide');
    assert.equal(response.body.data.bids[0].guide.userId, undefined);
    assert.equal(response.body.data.pagination.totalItems, 1);
  });
});

describe('guide profile management', () => {
  test('allows guides to manage safe profile fields but not verification', async () => {
    const user = await createUser('guide_user', 'Profile Manager');
    const token = tokenFor(user);
    const unsafe = await request(app).post('/api/guides/me/profile').set('Authorization', `Bearer ${token}`).send({ displayName: 'Profile Manager', verified: true });
    assert.equal(unsafe.status, 400);
    const created = await request(app).post('/api/guides/me/profile').set('Authorization', `Bearer ${token}`).send({
      displayName: 'Profile Manager', location: 'Kandy', experienceYears: 4,
      languages: [{ name: 'English', proficiency: 'Professional' }], specialities: ['Cultural tours'], availability: 'Available',
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.profile.verified, false);
    const updated = await request(app).patch('/api/guides/me/profile').set('Authorization', `Bearer ${token}`).send({ experienceYears: 5 });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.data.profile.experienceYears, 5);
  });

  test('creates profiles for multiple legacy-compatible guide accounts without exposing internal identifiers', async () => {
    const first = await createUser('guide_user', 'First Legacy Profile');
    const second = await createUser('guide_user', 'Second Legacy Profile');
    const firstResponse = await request(app).post('/api/guides/me/profile').set('Authorization', `Bearer ${tokenFor(first)}`).send({ displayName: 'First Legacy Profile' });
    const secondResponse = await request(app).post('/api/guides/me/profile').set('Authorization', `Bearer ${tokenFor(second)}`).send({ displayName: 'Second Legacy Profile' });
    assert.equal(firstResponse.status, 201);
    assert.equal(secondResponse.status, 201);
    assert.equal(firstResponse.body.data.profile.guideIdNumber, undefined);
    assert.equal(secondResponse.body.data.profile.guideIdNumber, undefined);
    const publicProfile = await request(app).get(`/api/guides/${secondResponse.body.data.profile._id}`);
    assert.equal(publicProfile.body.data.guide.guideIdNumber, undefined);
  });
});

describe('confirmation and booking integrity', () => {
  test('previews, books from database bid amount and returns the same booking on retry', async () => {
    const tourist = await createUser('tourist_user', 'Booking Tourist');
    const guide = await createGuide('Booking Guide');
    const record = await createOpenRequest(tourist);
    const bid = await GuideBid.create({ ...bidPayload(record), requestId: record._id, guideId: guide.profile._id, status: 'Active' });
    const rejectedGuide = await createGuide('Rejected Guide');
    const rejectedBid = await GuideBid.create({ ...bidPayload(record, { amount: 21000 }), requestId: record._id, guideId: rejectedGuide.profile._id, status: 'Active' });
    const token = tokenFor(tourist);
    const preview = await request(app).get(`/api/guides/requests/${record._id}/bids/${bid._id}/confirmation`).set('Authorization', `Bearer ${token}`);
    assert.equal(preview.status, 200);
    assert.equal(preview.body.data.canConfirm, true);
    const payload = {
      requestId: record._id, bidId: bid._id, amount: 1,
      acknowledgements: { tripDetailsConfirmed: true, cancellationPolicyAccepted: true, termsAccepted: true },
    };
    assert.equal((await request(app).post('/api/guides/bookings').set('Authorization', `Bearer ${token}`).send(payload)).status, 400);
    delete payload.amount;
    const first = await request(app).post('/api/guides/bookings').set('Authorization', `Bearer ${token}`).send(payload);
    const second = await request(app).post('/api/guides/bookings').set('Authorization', `Bearer ${token}`).send(payload);
    assert.equal(first.status, 201);
    assert.equal(second.status, 200);
    assert.equal(first.body.data.booking.amount, 18000);
    assert.equal(first.body.data.booking.id, second.body.data.booking.id);
    assert.match(first.body.data.booking.bookingReference, /^GUIDE-\d{4}-[A-F0-9]{10}$/);
    assert.equal(await GuideBooking.countDocuments({ requestId: record._id }), 1);
    assert.equal((await GuideRequest.findById(record._id)).status, 'Booked');
    assert.equal((await GuideBid.findById(bid._id)).status, 'Accepted');
    assert.equal((await GuideBid.findById(rejectedBid._id)).status, 'Rejected');
    assert.equal(await Notification.countDocuments({ type: 'GUIDE_BID_REJECTED', userId: rejectedGuide.user._id }), 1);
  });

  test('database uniqueness prevents concurrent duplicate confirmations', async () => {
    const tourist = await createUser('tourist_user', 'Concurrent Tourist');
    const guide = await createGuide('Concurrent Guide');
    const record = await createOpenRequest(tourist);
    const bid = await GuideBid.create({ ...bidPayload(record), requestId: record._id, guideId: guide.profile._id, status: 'Active' });
    const payload = { requestId: record._id, bidId: bid._id, acknowledgements: { tripDetailsConfirmed: true, cancellationPolicyAccepted: true, termsAccepted: true } };
    const responses = await Promise.all(Array.from({ length: 4 }, () => request(app).post('/api/guides/bookings').set('Authorization', `Bearer ${tokenFor(tourist)}`).send(payload)));
    assert.ok(responses.some((response) => response.status === 201));
    assert.ok(responses.every((response) => [200, 201, 409].includes(response.status)));
    assert.equal(await GuideBooking.countDocuments({ requestId: record._id }), 1);
  });

  test('atomically prevents overlapping confirmations from different requests', async () => {
    const firstTourist = await createUser('tourist_user', 'Parallel First Tourist');
    const secondTourist = await createUser('tourist_user', 'Parallel Second Tourist');
    const guide = await createGuide('Parallel Booking Guide');
    const firstRequest = await createOpenRequest(firstTourist);
    const secondRequest = await createOpenRequest(secondTourist);
    const firstBid = await GuideBid.create({ ...bidPayload(firstRequest), requestId: firstRequest._id, guideId: guide.profile._id, status: 'Active' });
    const secondBid = await GuideBid.create({ ...bidPayload(secondRequest), requestId: secondRequest._id, guideId: guide.profile._id, status: 'Active' });
    const acknowledgements = { tripDetailsConfirmed: true, cancellationPolicyAccepted: true, termsAccepted: true };
    const responses = await Promise.all([
      request(app).post('/api/guides/bookings').set('Authorization', `Bearer ${tokenFor(firstTourist)}`).send({ requestId: firstRequest._id, bidId: firstBid._id, acknowledgements }),
      request(app).post('/api/guides/bookings').set('Authorization', `Bearer ${tokenFor(secondTourist)}`).send({ requestId: secondRequest._id, bidId: secondBid._id, acknowledgements }),
    ]);
    assert.equal(responses.filter((response) => response.status === 201).length, 1);
    assert.equal(responses.filter((response) => response.status === 409).length, 1);
    assert.equal(await GuideBooking.countDocuments({ guideId: guide.profile._id }), 1);
  });

  test('detects overlapping bookings and protects booking retrieval', async () => {
    const tourist = await createUser('tourist_user', 'Overlap Tourist');
    const otherTourist = await createUser('tourist_user', 'Private Tourist');
    const guide = await createGuide('Overlap Guide');
    const record = await createOpenRequest(tourist);
    const bid = await GuideBid.create({ ...bidPayload(record), requestId: record._id, guideId: guide.profile._id, status: 'Active' });
    await GuideBooking.create({
      bookingReference: 'GUIDE-2026-CONFLICT01', touristId: otherTourist._id, guideId: guide.profile._id,
      requestId: new mongoose.Types.ObjectId(), bidId: new mongoose.Types.ObjectId(), amount: 100, currency: 'LKR',
      tripDetails: { guideName: 'Overlap Guide', startLocation: 'A', destination: 'B', startDate: record.startDate, endDate: record.endDate, adults: 1, children: 0 },
      bookingStatus: 'Confirmed', paymentStatus: 'Pending',
    });
    const preview = await request(app).get(`/api/guides/requests/${record._id}/bids/${bid._id}/confirmation`).set('Authorization', `Bearer ${tokenFor(tourist)}`);
    assert.equal(preview.status, 200);
    assert.equal(preview.body.data.canConfirm, false);
    assert.match(preview.body.data.blockingReason, /overlapping/i);
    const privateBooking = await GuideBooking.findOne({ bookingReference: 'GUIDE-2026-CONFLICT01' });
    assert.equal((await request(app).get(`/api/guides/bookings/${privateBooking._id}`).set('Authorization', `Bearer ${tokenFor(tourist)}`)).status, 403);
  });
});

describe('guide reviews', () => {
  test('allows one review after completion and refreshes public aggregates', async () => {
    const tourist = await createUser('tourist_user', 'Review Tourist');
    const guide = await createGuide('Reviewed Guide', { averageRating: 0 });
    const booking = await GuideBooking.create({
      bookingReference: 'GUIDE-2026-REVIEW0001', touristId: tourist._id, guideId: guide.profile._id,
      requestId: new mongoose.Types.ObjectId(), bidId: new mongoose.Types.ObjectId(), amount: 100, currency: 'LKR',
      tripDetails: { guideName: 'Reviewed Guide', startLocation: 'A', destination: 'B', ...futureDates(), adults: 1, children: 0 },
      bookingStatus: 'Completed', paymentStatus: 'Paid', completedAt: new Date(),
    });
    const token = tokenFor(tourist);
    const created = await request(app).post(`/api/guides/bookings/${booking._id}/reviews`).set('Authorization', `Bearer ${token}`).send({ rating: 5, comment: 'Excellent guide.' });
    assert.equal(created.status, 201);
    assert.equal((await request(app).post(`/api/guides/bookings/${booking._id}/reviews`).set('Authorization', `Bearer ${token}`).send({ rating: 4, comment: 'Again' })).status, 409);
    assert.equal(await GuideReview.countDocuments({ bookingId: booking._id }), 1);
    const publicProfile = await request(app).get(`/api/guides/${guide.profile._id}`);
    assert.equal(publicProfile.body.data.guide.rating, 5);
    assert.equal(publicProfile.body.data.guide.reviewCount, 1);
    assert.equal(publicProfile.body.data.guide.reviews[0].reviewerName, 'Review Tourist');
  });
});

describe('public guide profile', () => {
  test('lists active guide profiles with safe filtering and pagination', async () => {
    await createGuide('English Heritage Guide', { averageRating: 4.9, verified: true });
    await createGuide('Tamil Nature Guide', { averageRating: 3.5, verified: false });
    const response = await request(app).get('/api/guides?search=Heritage&minRating=4.5&verified=true&page=1&limit=6');
    assert.equal(response.status, 200);
    assert.equal(response.body.data.guides.length, 1);
    assert.equal(response.body.data.guides[0].name, 'English Heritage Guide');
    assert.equal(response.body.data.guides[0].userId, undefined);
    assert.equal(response.body.data.guides[0].email, undefined);
    assert.equal(response.body.data.pagination.totalItems, 1);
    assert.equal((await request(app).get('/api/guides?minRating=not-a-number')).status, 400);
  });

  test('returns a safe profile and handles missing profiles', async () => {
    const guide = await createGuide('Public Guide');
    const response = await request(app).get(`/api/guides/${guide.profile._id}`);
    assert.equal(response.status, 200);
    assert.equal(response.body.data.guide.name, 'Public Guide');
    assert.equal(response.body.data.guide.userId, undefined);
    assert.equal(response.body.data.guide.email, undefined);
    assert.deepEqual(response.body.data.guide.ratingDistribution, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    assert.equal((await request(app).get(`/api/guides/${new mongoose.Types.ObjectId()}`)).status, 404);
  });

  test('returns 400 for malformed MongoDB identifiers', async () => {
    assert.equal((await request(app).get('/api/guides/not-an-object-id')).status, 400);
    const tourist = await createUser('tourist_user', 'Malformed Id Tourist');
    assert.equal((await request(app).get('/api/guides/requests/not-an-object-id').set('Authorization', `Bearer ${tokenFor(tourist)}`)).status, 400);
    assert.equal((await request(app).get(`/api/guides/bookings/not-an-object-id`).set('Authorization', `Bearer ${tokenFor(tourist)}`)).status, 400);
  });
});
