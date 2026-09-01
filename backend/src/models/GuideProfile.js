import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  url: { type: String, trim: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { _id: true });

const guideProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  professionalTitle: { type: String, trim: true, default: 'Local Tour Guide' },
  avatarUrl: { type: String, trim: true, default: '' },
  coverImageUrl: { type: String, trim: true, default: '' },
  bio: { type: String, trim: true, maxlength: 1600, default: '' },
  experienceYears: { type: Number, min: 0, max: 80, default: 0 },
  languages: [{ type: String, trim: true }],
  expertise: [{
    type: String,
    enum: ['Cultural', 'Adventure', 'Wildlife', 'Culinary', 'City', 'Nature'],
  }],
  highlights: [{ type: String, trim: true }],
  specialSkills: [{ type: String, trim: true }],
  gallery: [{ type: String, trim: true }],
  identityProof: [documentSchema],
  certifications: [documentSchema],
  verified: { type: Boolean, default: false },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
  },
  active: { type: Boolean, default: true },
  ratingAverage: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, min: 0, default: 0 },
}, { timestamps: true });

const GuideProfile = mongoose.model('GuideProfile', guideProfileSchema);
export default GuideProfile;
