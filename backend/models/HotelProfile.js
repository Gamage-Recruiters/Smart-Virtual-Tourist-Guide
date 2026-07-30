// src/models/HotelProfile.js
import mongoose from 'mongoose';

const hotelProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profileImage: {
    url: String,
    publicId: String
  },
  hotelInfo: {
    hotelName: {
      type: String,
      required: true
    },
    hotelPosition: String,
    officialAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    hotelRegisterName: String,
    hotelRegisterNo: String,
    officialWebsite: String,
    contactNumber: String,
    email: String
  },
  amenities: [{
    type: String,
    enum: ['pool', 'spa', 'gym', 'restaurant', 'bar', 'parking', 'wifi', 'ac', 'roomService', 'laundry']
  }],
  roomTypes: [{
    name: String,
    price: Number,
    capacity: Number,
    available: Boolean
  }],
  images: [{
    url: String,
    publicId: String,
    isMain: Boolean,
    caption: String
  }],
  documents: [{
    name: String,
    type: {
      type: String,
      enum: ['registration', 'license', 'insurance', 'other']
    },
    url: String,
    publicId: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('HotelProfile', hotelProfileSchema);