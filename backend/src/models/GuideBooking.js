import mongoose from 'mongoose';
import {BOOKING_STATUSES, CURRENCIES, PAYMENT_STATUSES} from '../utils/guideConstants.js';

const tripDetailsSchema = new mongoose.Schema(
  {
    guideName: { type: String, required: true },
    startLocation: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: String,
    adults: { type: Number, required: true },
    children: { type: Number, required: true },
    stops: [String],
    pickupLocation: String,
    dropoffLocation: String,
    preferredLanguages: [String],
    specialRequirements: String,
    accessibilityNeeds: String,
    includedServices: [String],
    excludedServices: [String],
    cancellationPolicy: String,
  },
  { _id: false },
);

const guideBookingSchema = new mongoose.Schema(
  {
    bookingReference: { type: String, required: true, unique: true, index: true },
    touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideProfile', required: true, index: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideRequest', required: true, unique: true },
    bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideBid', required: true, unique: true },
    tripDetails: { type: tripDetailsSchema, required: true },
    amount: { type: Number, required: true, min: 0.01 },
    currency: { type: String, enum: CURRENCIES, required: true },
    bookingStatus: { type: String, enum: BOOKING_STATUSES, default: 'Confirmed', index: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: 'Pending' },
    confirmedAt: { type: Date, default: Date.now },
    cancelledAt: Date,
    completedAt: Date,
  },
  { timestamps: true },
);

guideBookingSchema.index({ guideId: 1, bookingStatus: 1, 'tripDetails.startDate': 1, 'tripDetails.endDate': 1 });
guideBookingSchema.index({ touristId: 1, createdAt: -1 });

export default mongoose.models.GuideBooking || mongoose.model('GuideBooking', guideBookingSchema);
