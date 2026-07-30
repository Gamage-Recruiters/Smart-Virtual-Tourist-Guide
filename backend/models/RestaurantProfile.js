// src/models/RestaurantProfile.js
import mongoose from 'mongoose';

const restaurantProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  restaurantInfo: {
    restaurantName: {
      type: String,
      required: true
    },
    bio: String,
    cuisineType: [String],
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    contactNumber: String,
    email: String,
    website: String,
    socialMedia: {
      instagram: String,
      tiktok: String,
      facebook: String
    }
  },
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  profileImage: {
    url: String,
    publicId: String
  },
  gallery: [{
    url: String,
    publicId: String,
    caption: String
  }],
  menu: [{
    name: String,
    description: String,
    price: Number,
    category: String,
    dietaryInfo: [String]
  }],
  features: [{
    type: String,
    enum: ['outdoorSeating', 'delivery', 'takeaway', 'reservations', 'parking', 'wifi', 'liveMusic']
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

export default mongoose.model('RestaurantProfile', restaurantProfileSchema);