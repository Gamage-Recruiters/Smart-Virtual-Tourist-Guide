import mongoose from 'mongoose';

const guidePackageSchema = new mongoose.Schema({
  guide: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Cultural', 'Adventure', 'City', 'Nature', 'Wildlife', 'Culinary', 'Other'],
    default: 'Other',
  },
  tags: [{ type: String, trim: true }],
  shortDescription: { type: String, required: true, trim: true, maxlength: 800 },
  destination: { type: String, required: true, trim: true },
  routeStops: [{ type: String, trim: true }],
  images: [{ type: String, trim: true }],
  pricePerPerson: { type: Number, required: true, min: 0 },
  currency: { type: String, trim: true, uppercase: true, default: 'LKR' },
  duration: { type: Number, required: true, min: 1 },
  durationUnit: { type: String, enum: ['hours', 'days'], default: 'days' },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
}, { timestamps: true });

guidePackageSchema.index({ guide: 1, updatedAt: -1 });

const GuidePackage = mongoose.model('GuidePackage', guidePackageSchema);
export default GuidePackage;
