const mongoose = require('mongoose');

const sharedLocationSchema = new mongoose.Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shareCode: {
      type: String, // Unique 6-char code for sharing
      required: true,
      unique: true,
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
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date, // Auto-expire after X hours
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Automatically remove expired documents (TTL index)
sharedLocationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('SharedLocation', sharedLocationSchema);
