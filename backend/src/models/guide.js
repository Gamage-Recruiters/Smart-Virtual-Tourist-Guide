import mongoose from 'mongoose';

const guideSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: 'Tourist Guide',
    },
    price: {
      type: String,
      default: '0',
    },
    priceUnit: {
      type: String,
      default: 'day',
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
      default: '',
    },
    languages: {
      type: [String],
      default: ['English'],
    },
    specialties: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    },
    contactNumber: {
      type: String,
      required: true,
    },
    availability: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Guide", guideSchema);
