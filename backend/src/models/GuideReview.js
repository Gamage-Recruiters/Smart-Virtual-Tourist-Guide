import mongoose from 'mongoose';
import {REVIEW_STATUSES} from '../utils/guideConstants.js';

const guideReviewSchema = new mongoose.Schema(
  {
    touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideProfile', required: true, index: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideBooking', required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1500 },
    status: { type: String, enum: REVIEW_STATUSES, default: 'Published', index: true },
  },
  { timestamps: true },
);

guideReviewSchema.index({ guideId: 1, status: 1, createdAt: -1 });

export default mongoose.models.GuideReview || mongoose.model('GuideReview', guideReviewSchema);
