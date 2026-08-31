import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import tempHotBookSchema from '../../models/HotelOwner/TempHotBook.js';
import getTestDb from '../../configs/HotelOwner/testDb.js';

const getTempHotBookModel = async () => {
  const conn = await getTestDb();
  return conn.models.TempHotBook || conn.model('TempHotBook', tempHotBookSchema.schema);
};

const router = express.Router();

const getUserIdFromToken = (req) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    return decoded.id || decoded._id || decoded.userId;
  } catch {
    return null;
  }
};

// GET /api/users/bookings
router.get('/bookings', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('hotels');
    if (!user || !user.hotels?.length) {
      return res.json({ bookings: [] });
    }

    const hotelSubId = user.hotels[0]._id.toString();
    const TempHotBook = await getTempHotBookModel();
    const bookings = await TempHotBook.find({ hotelId: hotelSubId });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/users/me
router.get('/me', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId).select('hotels');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ hotels: user.hotels || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/users/hotel
router.put('/hotel', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const { hotelName, hotelRegistrationNo, hotelAddress, hotelEmail, hotelOwnerName, hotelRegisteredYear, hotelContactNumber } = req.body;
    const hotel = { hotelName, hotelRegistrationNo, hotelAddress, hotelEmail, hotelRegisteredYear, hotelContactNumber };
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { 'hotels.0': hotel } },
      { new: true, upsert: false }
    ).select('hotels');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Hotel info updated successfully.', hotels: user.hotels });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/users/profile
router.put('/profile', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { fullName, contactNumber, email } = req.body;
    const update = {};
    if (fullName !== undefined) update.fullName = fullName;
    if (contactNumber !== undefined) update.contactNumber = contactNumber;
    if (email !== undefined) update.email = email;

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('fullName email contactNumber');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully.', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/users/change-password
router.put('/change-password', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select('password googleId');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.googleId) {
      return res.status(403).json({ message: 'Google users cannot change password' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Your password has been changed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(req.params.id).select('fullName email contactNumber role googleId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
