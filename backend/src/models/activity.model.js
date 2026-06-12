import mongoose from 'mongoose';

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
    timeSlotTemplates: {
      type: [
        {
          label: {
            type: String,
            required: [true, 'Time slot label is required'],
            trim: true,
            maxlength: [50, 'Label cannot exceed 50 characters'],
          },
          startTime: {
            type: String,
            required: [true, 'Start time is required'],
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:mm format'],
          },
          endTime: {
            type: String,
            required: [true, 'End time is required'],
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:mm format'],
          },
          capacity: {
            type: Number,
            required: [true, 'Capacity is required'],
            min: [1, 'Capacity must be at least 1'],
            max: [500, 'Capacity cannot exceed 500'],
          },
        },
      ],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 6,
        message: 'Cannot define more than 6 time slot templates',
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

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity;