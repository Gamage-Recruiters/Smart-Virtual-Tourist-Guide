import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    driverName: {
      type: String,
      required: true,
    },
    vehicleName: {
      type: String,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    vehicleColor: {
      type: String,
      required: true,
    },
    nationalIdNumber: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    showCurrentLocation: {
      type: Boolean,
      default: false,
    },
    availability: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Experienced Driver',
    },
    price: {
      type: String, // Kept as string since frontend displays '8,500' or can be stored as Number
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
    tags: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Driver", driverSchema);