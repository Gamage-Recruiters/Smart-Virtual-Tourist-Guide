// src/models/GuideProfile.js
const mongoose = require('mongoose');

const guideProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profilePhoto: {
    url: String,
    publicId: String
  },
  personalInfo: {
    fullName: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    dateOfBirth: Date,
    contactNumber: String,
    email: String
  },
  guideDetails: {
    guideIdNumber: String,
    yearsOfExperience: Number,
    languages: [String],
    expertise: [{
      type: String,
      enum: ['Cultural', 'Adventure', 'Wildlife', 'Culinary']
    }]
  },
  aboutMe: {
    bio: String,
    specialSkills: String
  },
  documents: [{
    name: String,
    type: {
      type: String,
      enum: ['id', 'certification', 'license', 'other']
    },
    url: String,
    publicId: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  completedTours: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Middleware to check profile completeness
guideProfileSchema.pre('save', function(next) {
  const requiredFields = [
    'personalInfo.fullName',
    'personalInfo.contactNumber',
    'personalInfo.email',
    'guideDetails.guideIdNumber',
    'guideDetails.yearsOfExperience',
    'guideDetails.languages'
  ];
  
  const allFieldsPresent = requiredFields.every(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], this);
    return value !== undefined && value !== null && value !== '';
  });
  
  this.isProfileComplete = allFieldsPresent && this.guideDetails.languages?.length > 0;
  next();
});

module.exports = mongoose.model('GuideProfile', guideProfileSchema);