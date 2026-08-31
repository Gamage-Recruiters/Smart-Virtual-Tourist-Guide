import mongoose from 'mongoose';

const pricingItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
});

const tempHotBookSchema = new mongoose.Schema(
  {
    // Hotel & Room Specific Fields
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    roomNo: { type: String },
    roomName: { type: String },
    checkIn: { type: String },
    checkOut: { type: String },
    bookedDate: { type: String },
    bookingNo: { type: String },
    bookingPrice: { type: Number, default: 0 },
    adultCount: { type: Number, default: 1 },
    childCount: { type: Number, default: 0 },
    guestCountry: { type: String },
    
    customer: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      phone: { type: String },
    },
  payment: {
  method: { type: String, default: 'card' },
  cardBrand: { type: String },
  last4: { type: String },
  expiryDate: { type: String },
  paidAt: { type: Date },
  payhereOrderId: { type: String },
  payherePaymentId: { type: String },

  
  paymentStatus: {
    type: String,
    enum: [
      'pending','paid','failed','refunded', 'full-refunded','partial-refunded','pending refunded'
    ],
    default: 'pending',
  },

  // ✅ New fields
  refundAmount: { type: Number, default: 0 },   // how much refunded in total
  refundReason: { type: String },               // why refunded (no-show, cancellation, etc.)
  refundDate: { type: Date },                   // last refund timestamp
  refundHistory: [                              // optional: track multiple refunds
    {
      amount: Number,
      reason: String,
      date: Date
    }
  ],
  refundTransactionId: { type: String },

   cancellationAccountablePerson: { type: String },
},
    status: {
      type: String,
      enum: ['pending', 'ok', 'cancelled', 'checked-in', 'checked-out', 'no-show'],
      default: 'pending',
    },
    service: {
      serviceId: { type: String },
      name: { type: String },
      type: { type: String, default: 'hotel' },
      location: { type: String },
      image: { type: String },
      description: { type: String },
      rating: { type: Number, min: 0, max: 5 },
      reviews: { type: Number, min: 0 },
    },
    roomType: { type: String },
    guests: { type: Number, min: 1 },
    roomsCount: { type: Number, default: 1, min: 1 },
    bookingDetails: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    pricing: {
      currency: { type: String, default: 'USD' },
      items: [pricingItemSchema],
      total: { type: Number, min: 0 },
    },
  },
  {
    timestamps: true,
    collection: 'tempHotBook'
  }
);

// Use this pattern to avoid OverwriteModelError
export default mongoose.models.tempHotBook || mongoose.model('tempHotBook', tempHotBookSchema);