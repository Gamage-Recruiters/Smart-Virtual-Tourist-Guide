const mongoose = require('mongoose');

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
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);
