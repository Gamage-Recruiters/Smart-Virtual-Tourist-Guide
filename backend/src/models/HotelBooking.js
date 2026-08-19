import mongoose from 'mongoose';

const pricingItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
});

const hotelBookingSchema = new mongoose.Schema(
  {
    service: {
      serviceId: { type: String },
      name: { type: String, required: true },
      type: { type: String, default: 'hotel' },
      location: { type: String },
      image: { type: String },
      description: { type: String },
      rating: { type: Number, min: 0, max: 5 },
      reviews: { type: Number, min: 0 },
    },
    checkInDate: { type: String },
    checkOutDate: { type: String },
    roomType: { type: String },
    guests: { type: Number, min: 1 },
    roomsCount: { type: Number, default: 1, min: 1 },
    bookingDetails: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    pricing: {
      currency: { type: String, default: 'USD' },
      items: [pricingItemSchema],
      total: { type: Number, required: true, min: 0 },
    },
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    payment: {
      method: { type: String, default: 'card' },
      cardBrand: { type: String },
      last4: { type: String },
      expiryDate: { type: String },
      paidAt: { type: Date },
      payhereOrderId: { type: String },
      payherePaymentId: { type: String },
    },
    status: {
      type: String,
      enum: ['pending', 'pending_payment', 'confirmed', 'cancelled', 'payment_failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('HotelBooking', hotelBookingSchema);
