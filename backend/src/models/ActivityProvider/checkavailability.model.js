import mongoose from 'mongoose';

const checkAvailabilitySchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ActivityBooking',
      required: true,
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: false,
    },
    serviceName: {
      type: String,
    },
    date: {
      type: String, // e.g. "YYYY-MM-DD"
      required: true,
    },
    timeSlot: {
      type: String, // e.g. "08:00 AM – 12:00 PM"
      required: true,
    },
    participants: {
      type: Number,
      default: 1,
    },
    customerName: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
    customerPhone: {
      type: String,
    },
    status: {
      type: String,
      enum: ['booked', 'confirmed', 'cancelled'],
      default: 'booked',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

checkAvailabilitySchema.index({ date: 1, activityId: 1 });
checkAvailabilitySchema.index({ bookingId: 1 });

const CheckAvailability =
  mongoose.models.CheckAvailability ||
  mongoose.model('CheckAvailability', checkAvailabilitySchema);

export default CheckAvailability;
