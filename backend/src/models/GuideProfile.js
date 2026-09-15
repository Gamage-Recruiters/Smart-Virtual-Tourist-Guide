import mongoose from 'mongoose';

const guideProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  professionalTitle: { type: String, trim: true, default: 'Local Tour Guide' },
  bio: { type: String, trim: true, maxlength: 2000, default: '' },
  languages: { type: [String], default: [] },
  expertise: { type: [String], default: [] },
  experienceYears: { type: Number, min: 0, max: 80, default: 0 },
  highlights: { type: [String], default: [] },
  avatar: { type: String, trim: true, default: '' },
  coverImage: { type: String, trim: true, default: '' },
  gallery: { type: [String], default: [] },
  includedServices: { type: [String], default: [] },
  dailyRate: { type: Number, min: 0, default: 0 },
  currency: { type: String, trim: true, uppercase: true, default: 'LKR' },
  specialSkills: { type: String, trim: true, maxlength: 1000, default: '' },
  verified: { type: Boolean, default: false },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  ratingAverage: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, min: 0, default: 0 },
}, { timestamps: true });

export default mongoose.models.GuideProfile || mongoose.model('GuideProfile', guideProfileSchema);
