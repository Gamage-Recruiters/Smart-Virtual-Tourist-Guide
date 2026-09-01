import mongoose from 'mongoose';

const guideReviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuideBooking',
    required: true,
    unique: true,
    index: true,
  },
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  guide: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true });

guideReviewSchema.index({ guide: 1, createdAt: -1 });

const GuideReview = mongoose.model('GuideReview', guideReviewSchema);
export default GuideReview;
