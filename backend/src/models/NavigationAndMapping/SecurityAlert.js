import mongoose from 'mongoose';

const securityAlertSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    severity: { type: String, default: null },
    source: { type: String, default: null, trim: true },
    district: { type: String, default: null },
    region: { type: String, default: null },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: undefined }, // [lng, lat]
    },
    weatherCondition: { type: String, default: null },
    temperature: { type: Number, default: null },
    windSpeed: { type: Number, default: null },
    expiresAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'securityalerts' }
);

export default mongoose.model('SecurityAlert', securityAlertSchema);
