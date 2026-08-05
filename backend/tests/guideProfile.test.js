import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import GuideProfile from '../src/models/GuideProfile.js';

describe('Guide Profile API Endpoints', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/smart_tourist_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Clear collections
    await User.deleteMany({});
    await GuideProfile.deleteMany({});

    // Create test user
    const user = await User.create({
      fullName: 'Rohan Perera',
      email: 'rohan.test@example.com',
      password: 'password123',
      role: 'guide_user',
    });
    userId = user._id;

    // Login token simulation
    token = 'mock-bearer-token';
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('GET /api/guides/:id/profile should fail without auth token', async () => {
    const res = await request(app).get(`/api/guides/${userId}/profile`);
    expect(res.statusCode).toEqual(401);
  });

  it('PUT /api/guides/:id/profile should validate required fullName and email', async () => {
    const res = await request(app)
      .put(`/api/guides/${userId}/profile`)
      .set('Authorization', `Bearer ${token}`)
      .send({ fullName: '', email: 'invalid-email' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});
