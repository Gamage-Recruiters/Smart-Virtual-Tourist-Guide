import mongoose from 'mongoose';
import {BID_STATUSES, CURRENCIES} from '../utils/guideConstants.js';

const guideBidSchema = new mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideRequest', required: true, index: true },
    guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideProfile', required: true, index: true },
    amount: { type: Number, required: true, min: 0.01, index: true },
    currency: { type: String, enum: CURRENCIES, required: true },
    proposedItinerary: { type: String, required: true, trim: true, maxlength: 4000 },
    includedServices: { type: [{ type: String, trim: true, maxlength: 160 }], default: [], validate: [(items) => items.length <= 30, 'Too many included services.'] },
    excludedServices: { type: [{ type: String, trim: true, maxlength: 160 }], default: [], validate: [(items) => items.length <= 30, 'Too many excluded services.'] },
    message: { type: String, trim: true, maxlength: 1000, default: '' },
    cancellationPolicy: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: BID_STATUSES, default: 'Active', index: true },
    submittedAt: { type: Date, default: Date.now, index: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

guideBidSchema.index({ requestId: 1, guideId: 1 }, { unique: true });
guideBidSchema.index({ requestId: 1, status: 1, amount: 1 });

export default mongoose.models.GuideBid || mongoose.model('GuideBid', guideBidSchema);
