const mongoose = require('mongoose');

const emergencyLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['tourist_police', 'hospital', 'fire_station', 'local_police'],
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    operatingHours: {
      type: String,
      default: '24/7',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geolocation-based queries
emergencyLocationSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('EmergencyLocation', emergencyLocationSchema);
