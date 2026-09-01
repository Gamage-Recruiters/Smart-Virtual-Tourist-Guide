import mongoose from 'mongoose';

const guideBidSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuideRequest',
    required: true,
    index: true,
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, trim: true, uppercase: true, default: 'LKR' },
  proposal: { type: String, required: true, trim: true, maxlength: 3000 },
  includedServices: [{ type: String, trim: true }],
  excludedServices: [{ type: String, trim: true }],
  cancellationPolicy: { type: String, trim: true, maxlength: 1600, default: '' },
  status: {
    type: String,
    enum: ['active', 'accepted', 'rejected', 'withdrawn', 'expired'],
    default: 'active',
    index: true,
  },
  expiresAt: { type: Date, default: null },
}, { timestamps: true });

guideBidSchema.index({ request: 1, guide: 1 }, { unique: true });
guideBidSchema.index({ guide: 1, updatedAt: -1 });

const GuideBid = mongoose.model('GuideBid', guideBidSchema);
export default GuideBid;
