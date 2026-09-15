import mongoose from 'mongoose';

const guideBookingSchema = new mongoose.Schema({
  bookingReference: { type: String, required: true, unique: true, index: true },
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideRequest', required: true, unique: true },
  bid: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideBid', required: true, unique: true },
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  guide: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  travellers: { type: Number, required: true, min: 1 },
  destination: { type: String, required: true, trim: true },
  meetingLocation: { type: String, trim: true, default: '' },
  dailyRate: { type: Number, required: true, min: 0 },
  days: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true, min: 0 },
  serviceFee: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, trim: true, uppercase: true },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'], default: 'pending', index: true },
  paymentStatus: { type: String, enum: ['unpaid', 'pending', 'paid', 'refunded'], default: 'unpaid', index: true },
  paymentMethod: { type: String, enum: ['manual', 'card', 'paypal', 'bank_transfer'], default: 'manual' },
}, { timestamps: true });

guideBookingSchema.index({ guide: 1, startDate: 1, endDate: 1, status: 1 });

export default mongoose.models.GuideBooking || mongoose.model('GuideBooking', guideBookingSchema);
