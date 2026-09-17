import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import HotelBooking from '../../models/HotelOwner/TempHotBook.js';
import getTestDb from '../../configs/HotelOwner/testDb.js';

const getHotelBookingModel = async () => {
  const conn = await getTestDb();
  return conn.models.HotelBooking || conn.model('HotelBooking', HotelBooking.schema);
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

const MAX_HOTEL_IMAGES = 20;

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
    const HotelBookingModel = await getHotelBookingModel();
    const bookings = await HotelBookingModel.find({ hotelId: hotelSubId });
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
// Updates the first hotel of the logged-in owner (basic fields + hotelLocation)
router.put('/hotel', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const {
      hotelName,
      hotelRegistrationNo,
      hotelAddress,
      hotelEmail,
      hotelRegisteredYear,
      hotelContactNumber,
      hotelCity,
      hotelDistrict,
      hotelAmenities,
      hotelPolicies,
      hotelDescription,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If no hotel exists yet, create one; otherwise update the first hotel.
    if (!user.hotels || user.hotels.length === 0) {
      user.hotels = [{
        hotelName,
        hotelRegistrationNo,
        hotelAddress,
        hotelEmail,
        hotelRegisteredYear,
        hotelContactNumber,
        hotelLocation: {
          city: hotelCity || '',
          district: hotelDistrict || '',
        },
        hotelImages: [],
        hotelAmenities: Array.isArray(hotelAmenities) ? hotelAmenities : [],
        hotelPolicies: hotelPolicies || '',
        hotelDescription: hotelDescription || '',
      }];
      await user.save();
    } else {
      const hotelUpdate = {};
      const hotelFields = {
        hotelName,
        hotelRegistrationNo,
        hotelAddress,
        hotelEmail,
        hotelRegisteredYear,
        hotelContactNumber,
        hotelPolicies,
        hotelDescription,
      };

      Object.entries(hotelFields).forEach(([field, value]) => {
        if (value !== undefined) hotelUpdate[`hotels.0.${field}`] = value;
      });
      if (Array.isArray(hotelAmenities)) hotelUpdate['hotels.0.hotelAmenities'] = hotelAmenities;

      // Safety: ensure hotelLocation exists for older records
      const existingHotel = user.hotels[0];
      if (!existingHotel.hotelLocation) {
        hotelUpdate['hotels.0.hotelLocation'] = { city: '', district: '' };
      }
      if (hotelCity !== undefined) hotelUpdate['hotels.0.hotelLocation.city'] = hotelCity;
      if (hotelDistrict !== undefined) hotelUpdate['hotels.0.hotelLocation.district'] = hotelDistrict;

      await User.updateOne(
        { _id: userId },
        { $set: hotelUpdate },
        { runValidators: true }
      );
    }

    const updatedUser = await User.findById(userId).select('hotels');

    res.json({
      message: 'Hotel info updated successfully.',
      hotels: updatedUser.hotels,
    });
  } catch (error) {
    console.error('PUT /hotel error:', {
      name: error.name,
      message: error.message,
      errors: error.errors,
    });
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      details: error.errors ? Object.keys(error.errors) : undefined,
    });
  }
});

// PUT /api/users/hotel/images
// Add or replace the image list for a specific hotel (max 20)
// Body: { hotelId?: string, images: string[] }  -> if hotelId omitted, uses hotels[0]
router.put('/hotel/images', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { hotelId, images } = req.body;

    if (!Array.isArray(images)) {
      return res.status(400).json({ message: '`images` must be an array of image URLs.' });
    }

    if (images.length > MAX_HOTEL_IMAGES) {
      return res.status(400).json({
        message: `You can upload up to ${MAX_HOTEL_IMAGES} images per hotel.`,
      });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.hotels || user.hotels.length === 0) {
      return res.status(400).json({ message: 'No hotel found for this user.' });
    }

    const hotel = hotelId
      ? user.hotels.id(hotelId)
      : user.hotels[0];

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }

    await User.updateOne(
      { _id: userId, 'hotels._id': hotel._id },
      { $set: { 'hotels.$.hotelImages': images } },
      { runValidators: true }
    );
    const updatedUser = await User.findById(userId).select('hotels');
    const updatedHotel = updatedUser.hotels.id(hotel._id);

    res.json({
      message: 'Hotel images updated successfully.',
      hotelId: updatedHotel._id,
      hotelImages: updatedHotel.hotelImages,
    });
  } catch (error) {
    console.error('PUT /hotel/images error:', {
      name: error.name,
      message: error.message,
      errors: error.errors,
    });
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      details: error.errors ? Object.keys(error.errors) : undefined,
    });
  }
});

// POST /api/users/hotel/images
// Append one or more images to a hotel (max 20 total)
// Body: { hotelId?: string, images: string[] }
router.post('/hotel/images', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { hotelId, images } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: '`images` must be a non-empty array.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.hotels || user.hotels.length === 0) {
      return res.status(400).json({ message: 'No hotel found for this user.' });
    }

    const hotel = hotelId
      ? user.hotels.id(hotelId)
      : user.hotels[0];

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }

    if (hotel.hotelImages.length + images.length > MAX_HOTEL_IMAGES) {
      return res.status(400).json({
        message: `A hotel can have a maximum of ${MAX_HOTEL_IMAGES} images.`,
        currentCount: hotel.hotelImages.length,
        allowed: MAX_HOTEL_IMAGES - hotel.hotelImages.length,
      });
    }

    await User.updateOne(
      { _id: userId, 'hotels._id': hotel._id },
      { $push: { 'hotels.$.hotelImages': { $each: images } } },
      { runValidators: true }
    );
    const updatedUser = await User.findById(userId).select('hotels');
    const updatedHotel = updatedUser.hotels.id(hotel._id);

    res.json({
      message: 'Hotel images added successfully.',
      hotelId: updatedHotel._id,
      hotelImages: updatedHotel.hotelImages,
    });
  } catch (error) {
    console.error('POST /hotel/images error:', {
      name: error.name,
      message: error.message,
      errors: error.errors,
    });
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      details: error.errors ? Object.keys(error.errors) : undefined,
    });
  }
});

// DELETE /api/users/hotel/images?url=<encoded>&hotelId=<optional>
// Remove a single image from a hotel by URL
router.delete('/hotel/images', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { url, hotelId } = req.query;

    if (!url) {
      return res.status(400).json({ message: '`url` query parameter is required.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.hotels || user.hotels.length === 0) {
      return res.status(400).json({ message: 'No hotel found for this user.' });
    }

    const hotel = hotelId ? user.hotels.id(hotelId) : user.hotels[0];
    if (!hotel) return res.status(404).json({ message: 'Hotel not found.' });

    await User.updateOne(
      { _id: userId, 'hotels._id': hotel._id },
      { $pull: { 'hotels.$.hotelImages': url } }
    );
    const updatedUser = await User.findById(userId).select('hotels');

    res.json({
      message: 'Hotel image removed successfully.',
      hotelId: hotel._id,
      hotelImages: updatedUser.hotels.id(hotel._id)?.hotelImages || [],
    });
  } catch (error) {
    console.error('DELETE /hotel/images error:', {
      name: error.name,
      message: error.message,
      errors: error.errors,
    });
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      details: error.errors ? Object.keys(error.errors) : undefined,
    });
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
    console.error('PUT /profile error:', {
      name: error.name,
      message: error.message,
      errors: error.errors,
    });
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      details: error.errors ? Object.keys(error.errors) : undefined,
    });
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
    console.error('PUT /change-password error:', {
      name: error.name,
      message: error.message,
      errors: error.errors,
    });
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      details: error.errors ? Object.keys(error.errors) : undefined,
    });
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