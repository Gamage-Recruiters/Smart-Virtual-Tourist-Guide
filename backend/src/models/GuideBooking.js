import mongoose from 'mongoose';

const guideBookingSchema = new mongoose.Schema({
  bookingReference: { type: String, required: true, unique: true, index: true },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuideRequest',
    required: true,
    unique: true,
    index: true,
  },
  bid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuideBid',
    required: true,
    unique: true,
  },
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  guide: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  travelers: { type: Number, required: true, min: 1 },
  destination: { type: String, required: true, trim: true },
  meetingLocation: { type: String, trim: true, default: '' },
  currency: { type: String, required: true, trim: true, uppercase: true },
  bidAmount: { type: Number, required: true, min: 0 },
  serviceFee: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
    default: 'pending',
    index: true,
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'bank_transfer', 'manual'],
    default: 'manual',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'pending', 'paid', 'refunded'],
    default: 'pending',
    index: true,
  },
  reviewedAt: { type: Date, default: null },
}, { timestamps: true });

guideBookingSchema.index({ guide: 1, startDate: 1, endDate: 1 });

const GuideBooking = mongoose.model('GuideBooking', guideBookingSchema);
export default GuideBooking;
