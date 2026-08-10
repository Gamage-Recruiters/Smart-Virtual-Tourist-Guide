import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The provider being reviewed (could be a driver, hotel, vehicle, activity, restaurant, or guide)
  targetProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetType: {
    type: String,
    enum: ['Driver', 'Guide', 'Hotel', 'Vehicle', 'Activity', 'Restaurant'], // Added 'Guide' here
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  // --- NEW: Review Title ---
  title: {
    type: String,
    trim: true,
    default: null
  },
  reviewText: {
    type: String,
    required: true,
    trim: true
  },
  // --- NEW: Array of Cloudinary Image URLs ---
  images: {
    type: [String], 
    default: []
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
  },
  providerReply: {
    text: { type: String, trim: true, default: null },
    repliedAt: { type: Date, default: null }
  }
}, {
  timestamps: true 
});

// Create a compound index to optimize queries for reviews of a specific provider and type  
reviewSchema.index({ targetProviderId: 1, targetType: 1 });

export default mongoose.model('Review', reviewSchema);