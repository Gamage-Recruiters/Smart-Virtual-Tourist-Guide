const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Hiking & Adventure', 'Safari', 'Water Sports', 'Cultural', 'Wellness', 'Food & Cuisine', 'Sightseeing'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      enum: ['Sigiriya', 'Yala National Park', 'Galle', 'Ella', 'Kandy', 'Colombo', 'Weligama', 'Mirissa', 'Dambulla', 'Nuwara Eliya'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      enum: ['1 Hour', '2 Hours', '3 Hours', '4 Hours', 'Half Day', 'Full Day', '2 Days'],
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Max participants is required'],
      min: 1,
      max: 100,
    },
    pricePerPerson: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    requiredEquipment: {
      type: [String],
      default: [],
    },
    safetyNotes: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 8,
        message: 'Cannot upload more than 8 images',
      },
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'inactive'],
      default: 'draft',
    },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

activitySchema.index({ title: 'text', description: 'text' });
activitySchema.index({ category: 1, location: 1, status: 1 });

module.exports = mongoose.model('Activity', activitySchema);