import mongoose from 'mongoose';

const securityAlertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat] — GeoJSON standard
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.Mixed, // String for system alerts (e.g., 'System_OpenWeather'), ObjectId for user-created alerts
      required: true,
    },

    // NEW FIELDS for auto weather alerts
    source: {
      type: String,
      enum: ['manual', 'openweather'],
      default: 'manual',
    },
    category: {
      type: String,
      enum: ['weather', 'crime', 'natural_disaster', 'general'],
      default: 'general',
    },
    externalId: {
      type: String,
      unique: true,
      sparse: true,
    },
    district: { type: String },           // e.g., 'Colombo', 'Kandy'
    weatherCondition: { type: String },    // e.g., 'Thunderstorm', 'Heavy Rain'
    temperature: { type: Number },
    windSpeed: { type: Number },
    isVerifiedByManager: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Virtual getters for backward compatibility with old { lat, lng } format
securityAlertSchema.virtual('location.lat').get(function () {
  return this.location?.coordinates?.[1];
});
securityAlertSchema.virtual('location.lng').get(function () {
  return this.location?.coordinates?.[0];
});
securityAlertSchema.set('toJSON', { virtuals: true });
securityAlertSchema.set('toObject', { virtuals: true });

// 2dsphere index for geospatial "nearby" queries
securityAlertSchema.index({ location: '2dsphere' });

export default mongoose.model('SecurityAlert', securityAlertSchema);
