import mongoose from 'mongoose';
import {CURRENCIES, REQUEST_STATUSES} from '../utils/guideConstants.js';

const guideRequestSchema = new mongoose.Schema(
  {
    touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    startLocation: { type: String, required: true, trim: true, maxlength: 160 },
    destination: { type: String, required: true, trim: true, maxlength: 160 },
    stops: { type: [{ type: String, trim: true, maxlength: 160 }], default: [], validate: [(items) => items.length <= 20, 'Too many stops.'] },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, match: /^([01]\d|2[0-3]):([0-5]\d)$/, default: '08:00' },
    adults: { type: Number, required: true, min: 1, max: 100 },
    children: { type: Number, min: 0, max: 100, default: 0 },
    pickupLocation: { type: String, trim: true, maxlength: 160, default: '' },
    dropoffLocation: { type: String, trim: true, maxlength: 160, default: '' },
    languages: { type: [{ type: String, trim: true, maxlength: 60 }], default: [], validate: [(items) => items.length <= 20, 'Too many languages.'] },
    specialities: { type: [{ type: String, trim: true, maxlength: 100 }], default: [], validate: [(items) => items.length <= 30, 'Too many specialities.'] },
    femaleGuidePreference: { type: Boolean, default: false },
    minExperience: { type: Number, min: 0, max: 80 },
    minRating: { type: Number, min: 0, max: 5 },
    minBudget: { type: Number, min: 0 },
    maxBudget: { type: Number, required: true, min: 0.01 },
    currency: { type: String, enum: CURRENCIES, required: true },
    description: { type: String, trim: true, maxlength: 600, default: '' },
    specialRequirements: { type: String, trim: true, maxlength: 1000, default: '' },
    accessibilityNeeds: { type: String, trim: true, maxlength: 1000, default: '' },
    contactPreference: { type: String, enum: ['In-app messages', 'Email updates', 'Phone after booking'], default: 'In-app messages' },
    status: { type: String, enum: REQUEST_STATUSES, default: 'Open', index: true },
    selectedBidId: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideBid' },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideBooking' },
    expiresAt: { type: Date, index: true },
    cancelledAt: Date,
  },
  { timestamps: true },
);

guideRequestSchema.pre('validate', function validateDates() {
  if (this.startDate && this.endDate && this.endDate < this.startDate) this.invalidate('endDate', 'End date cannot be before start date.');
  if (this.minBudget !== undefined && this.maxBudget !== undefined && this.minBudget > this.maxBudget) this.invalidate('minBudget', 'Minimum budget cannot exceed maximum budget.');
});

guideRequestSchema.index({ touristId: 1, status: 1, createdAt: -1 });
guideRequestSchema.index({ status: 1, startDate: 1, destination: 1 });

export default mongoose.models.GuideRequest || mongoose.model('GuideRequest', guideRequestSchema);
