import mongoose from 'mongoose';

const guidePackageSchema = new mongoose.Schema({
  guide: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  destination: { type: String, required: true, trim: true },
  stops: { type: [String], default: [] },
  images: { type: [String], default: [] },
  pricePerPerson: { type: Number, required: true, min: 0 },
  currency: { type: String, trim: true, uppercase: true, default: 'LKR' },
  duration: { type: Number, required: true, min: 1 },
  durationUnit: { type: String, enum: ['hours', 'days'], default: 'days' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
}, { timestamps: true });

export default mongoose.models.GuidePackage || mongoose.model('GuidePackage', guidePackageSchema);
