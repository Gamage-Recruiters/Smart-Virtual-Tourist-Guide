const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // The provider being reviewed (could be a driver, hotel, vehicle, activity, or restaurant)
  targetProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetType: {
    type: String,
    enum: ['Driver', 'Hotel', 'Vehicle', 'Activity', 'Restaurant'],
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: true,
    trim: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  unhelpfulCount: {
    type: Number,
    default: 0
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    enum: ['Spam', 'Inappropriate Language', 'False Information', 'Other', null],
    default: null
  }
}, {
  timestamps: true 
});

// Create a compound index to optimize queries for reviews of a specific provider and type  
reviewSchema.index({ targetProviderId: 1, targetType: 1 });

module.exports = mongoose.model('Review', reviewSchema);