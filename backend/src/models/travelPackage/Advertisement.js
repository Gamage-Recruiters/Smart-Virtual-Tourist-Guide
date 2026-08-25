import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    default: 'Banner Ad'
  },
  budget: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  image: {
    type: [String],
    default: [],
    validate: {
      validator: (images) => images.length <= 10,
      message: 'An advertisement can have up to 10 images'
    }
  },
  clicks: {
    type: Number,
    default: 0
  },
  impressions: {
    type: Number,
    default: 0
  },
  CTR: {
    type: Number,
    default: 0
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: false,
    default: null
  }
}, {
  timestamps: true,
  collection: 'travelPackageAdvertisments'  
});

export default mongoose.model('Advertisement', advertisementSchema);
