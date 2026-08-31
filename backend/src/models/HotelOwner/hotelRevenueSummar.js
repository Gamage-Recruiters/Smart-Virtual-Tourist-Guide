import mongoose from 'mongoose';

const revenueSummarySchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // YYYY-MM format

  metrics: {
    totalRevenue: { type: Number, default: 0 },   // sum of bookingPrice - refunds
    occupancyRate: { type: Number, default: 0 },  // percentage
    avgDailyRate: { type: Number, default: 0 },   // ADR
    revPAR: { type: Number, default: 0 }          // Revenue per available room
  },

  revenue: {
    revenue: { type: Number, default: 0 }       // monthly revenue
  },

  revenueByRoomType: [
    {
      roomType: { type: String },
      total: { type: Number, default: 0 }
    }
  ],

  refunds: [
    {
      refundTransactionId: { type: String, required: true },
      amount: { type: Number, default: 0 },
      reason: { type: String, default: '' },
      date: { type: Date }
    }
  ],

  lastUpdated: { type: Date, default: Date.now }
}, {
  collection: 'hotelRevenueSummary', // ✅ chosen collection name
  timestamps: true
});

revenueSummarySchema.index({ hotelId: 1, month: 1 }, { unique: true });

// Avoid OverwriteModelError
export default mongoose.models.hotelRevenueSummary || mongoose.model('hotelRevenueSummary', revenueSummarySchema);
