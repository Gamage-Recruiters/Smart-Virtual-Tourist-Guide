import mongoose from 'mongoose';
import {PROFILE_AVAILABILITY} from '../utils/guideConstants.js';

const languageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    proficiency: { type: String, required: true, trim: true, maxlength: 60 },
  },
  { _id: false },
);

const unavailableRangeSchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, trim: true, maxlength: 160 },
  },
  { _id: false },
);

const guideProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    // Retained privately for compatibility with Stable_Version_V4 databases,
    // which may still enforce the legacy unique guideIdNumber index.
    guideIdNumber: { type: String, trim: true, unique: true, sparse: true, select: false },
    displayName: { type: String, required: true, trim: true, maxlength: 120 },
    profileImage: { type: String, trim: true, maxlength: 2048, default: '' },
    verified: { type: Boolean, default: false, index: true },
    verificationStatus: { type: String, enum: ['Unverified', 'Pending', 'Verified', 'Rejected'], default: 'Unverified' },
    location: { type: String, trim: true, maxlength: 160, default: '' },
    bio: { type: String, trim: true, maxlength: 2000, default: '' },
    tourStyle: { type: String, trim: true, maxlength: 500, default: '' },
    localKnowledge: { type: String, trim: true, maxlength: 500, default: '' },
    experienceYears: { type: Number, min: 0, max: 80, default: 0, index: true },
    completedTours: { type: Number, min: 0, default: 0 },
    responseTime: { type: String, trim: true, maxlength: 120, default: '' },
    languages: { type: [languageSchema], default: [], validate: [(items) => items.length <= 20, 'Too many languages.'] },
    specialities: { type: [{ type: String, trim: true, maxlength: 100 }], default: [], validate: [(items) => items.length <= 30, 'Too many specialities.'] },
    qualifications: { type: [{ type: String, trim: true, maxlength: 200 }], default: [], validate: [(items) => items.length <= 30, 'Too many qualifications.'] },
    certifications: { type: [{ type: String, trim: true, maxlength: 200 }], default: [], validate: [(items) => items.length <= 30, 'Too many certifications.'] },
    areasCovered: { type: [{ type: String, trim: true, maxlength: 120 }], default: [], validate: [(items) => items.length <= 50, 'Too many covered areas.'] },
    availability: { type: String, enum: PROFILE_AVAILABILITY, default: 'Available', index: true },
    unavailableRanges: { type: [unavailableRangeSchema], default: [], validate: [(items) => items.length <= 100, 'Too many unavailable ranges.'] },
    reservedDates: { type: [Date], default: [], select: false },
    averageRating: { type: Number, min: 0, max: 5, default: 0, index: true },
    reviewCount: { type: Number, min: 0, default: 0 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

guideProfileSchema.index({ displayName: 'text', location: 'text' });
guideProfileSchema.index({ specialities: 1 });
guideProfileSchema.index({ 'languages.name': 1 });

const hidePrivateProfileFields = (document, value) => { // eslint-disable-line no-unused-vars
  delete value.guideIdNumber;
  delete value.reservedDates;
  return value;
};
guideProfileSchema.set('toJSON', { transform: hidePrivateProfileFields });
guideProfileSchema.set('toObject', { transform: hidePrivateProfileFields });

export default mongoose.models.GuideProfile || mongoose.model('GuideProfile', guideProfileSchema);
