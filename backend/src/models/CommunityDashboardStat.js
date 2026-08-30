import mongoose from 'mongoose';

const CommunityDashboardStatSchema = new mongoose.Schema({
  totalSme: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  economicImpact: {
    tourismRevenuePercent: { type: Number, default: 0 },
    localBusinessProfitPercent: { type: Number, default: 0 },
    jobCreationPercent: { type: Number, default: 0 },
  },
  feedback: {
    fullySatisfiedPercent: { type: Number, default: 0 },
    acceptedPercent: { type: Number, default: 0 },
    negativePercent: { type: Number, default: 0 },
  }
}, { timestamps: true });

export default mongoose.model('CommunityDashboardStat', CommunityDashboardStatSchema);
