import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  // 1. BASIC INFORMATION
  title: { type: String, required: true },
  subtitle: { type: String },
  location: { type: String, required: true },

  // 2. DESCRIPTIONS
  longDescription: { type: String, required: true },
  shortDescription: { type: String },

  // 3. MEDIA FILES
  images: { type: [String], required: true },
  heroImage: { type: String, required: true },
  thumbnailImage: { type: String },

  // 4. PRICING & LOGISTICS
  price: { type: Number, required: true },
  priceDisplay: { type: String },
  currency: { type: String, default: "LKR" },
  duration: { type: Number },
  durationDisplay: { type: String },

  // 5. RATINGS & REVIEWS
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  reviews: [{
    userId: { type: String },
    userName: { type: String },
    rating: { type: Number, min: 0, max: 5 },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }],

  // 6. TRAVELER INFORMATION
  travelersCount: { type: Number, default: 0 },
  travelersDisplay: { type: String },
  maxGroupSize: { type: Number },
  minGroupSize: { type: Number, default: 1 },

  // 7. CATEGORIES
  categories: { type: [String] },

  // 8. FILTERING ATTRIBUTES
  province: { type: String },
  district: { type: String },
  adventureLevel: { type: String },
  isFamilyFriendly: { type: Boolean, default: false },
  isSoloTravel: { type: Boolean, default: false },
  isCoupleFriendly: { type: Boolean, default: false },
  isGroupFriendly: { type: Boolean, default: false },

  // 9. SEASONAL INFORMATION
  bestSeason: { type: [String] },
  bestSeasonDisplay: { type: String },

  // 10. ADDITIONAL FEATURES
  features: { type: [String] },
  amenities: { type: [String] },

  // 11. OPERATING INFORMATION
  isActive: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },

  // 12. SEO & METADATA
  metaTitle: { type: String },
  metaDescription: { type: String },
  keywords: { type: [String] },

  // 13. LOCATION DATA
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  address: { type: String },

  // 14. CONTACT INFORMATION
  contactInfo: {
    phone: { type: String },
    email: { type: String },
    website: { type: String }
  },

  // 15. BOOKING INFORMATION
  bookingInfo: {
    cancellationPolicy: { type: String },
    includes: { type: [String] },
    excludes: { type: [String] },
    whatToBring: { type: [String] },
    importantInfo: { type: String }
  },

  // 16. TIMESTAMPS (already handled by timestamps: true, but availableFrom/To)
  availableFrom: { type: Date },
  availableTo: { type: Date }
}, { timestamps: true });

// --- Indexes for Fast Filtering ---

// Single Field Indexes
destinationSchema.index({ title: 1 });
destinationSchema.index({ location: 1 });
destinationSchema.index({ price: 1 });
destinationSchema.index({ rating: 1 });
destinationSchema.index({ province: 1 });
destinationSchema.index({ district: 1 });
destinationSchema.index({ categories: 1 });
destinationSchema.index({ adventureLevel: 1 });

// Compound Indexes
destinationSchema.index({ categories: 1, province: 1 });
destinationSchema.index({ price: 1, rating: -1 });
destinationSchema.index({ isFeatured: 1, rating: -1 });

// Text Index for full-text search
destinationSchema.index({
  title: 'text',
  location: 'text',
  shortDescription: 'text',
  longDescription: 'text'
});

const Destination = mongoose.model('Destination', destinationSchema);

export default Destination;
