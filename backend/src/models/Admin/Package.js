import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  BasicInformation: {
    title: String,
    categories: [String],
    duration: String,
    price: Number,
    groupSize: String,
    difficulty: String,
    whatsIncluded: [String],
    packageFeatures: [String],
    description: String,
    promotionPrice: Number,
    promotionExpiryDate: Date,
  },
  LocationAndHighlights: {
    destination: String,
    highlights: [String],
    images: [String],
  },
  DayByDayItinerary: [
    {
      day: Number,
      title: String,
      description: String,
      activities: [String],
    },
  ],
  AgencyContactInformation: {
    agencyName: String,
    email: String,
    phone: String,
  },
  status: {
    type: String,
    enum: ['publish', 'draft'],
    default: 'draft',
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  approvedAt: Date,
  rejectedAt: Date,
  rejectionReason: String
}, { timestamps: true });

export default mongoose.model('Package', PackageSchema);