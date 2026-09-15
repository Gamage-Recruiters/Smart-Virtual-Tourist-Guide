import mongoose from 'mongoose';

const guideRequestSchema = new mongoose.Schema({
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  destination: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  travellers: { type: Number, required: true, min: 1, max: 100 },
  language: { type: String, required: true, trim: true },
  guideTypes: [{ type: String, enum: ['Cultural', 'Adventure', 'City', 'Nature', 'Wildlife', 'Culinary'] }],
  budgetMin: { type: Number, min: 0, default: 0 },
  budgetMax: { type: Number, min: 0, required: true },
  currency: { type: String, trim: true, uppercase: true, default: 'LKR' },
  meetingLocation: { type: String, trim: true, default: '' },
  requirements: { type: String, trim: true, maxlength: 3000, default: '' },
  status: {
    type: String,
    enum: ['open', 'receiving_bids', 'selected', 'booked', 'cancelled', 'completed'],
    default: 'open',
    index: true,
  },
  preferredGuide: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  selectedBid: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideBid', default: null },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideBooking', default: null },
}, { timestamps: true });

guideRequestSchema.index({ startDate: 1, endDate: 1, status: 1 });

guideRequestSchema.pre('validate', function validateDates() {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date must be on or after the start date');
  }
  if (this.budgetMax != null && this.budgetMin > this.budgetMax) {
    this.invalidate('budgetMin', 'Minimum budget cannot exceed maximum budget');
  }
});

guideRequestSchema.index({ tourist: 1, createdAt: -1 });

export default mongoose.models.GuideRequest || mongoose.model('GuideRequest', guideRequestSchema);
