import mongoose from 'mongoose';

const routeStopSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    default: '',
  },
  fileName: {
    type: String,
    default: '',
  },
  mimeType: {
    type: String,
    default: '',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const tourPackageSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: [true, 'Package Name is required'],
      trim: true,
      minlength: [5, 'Package Name must be at least 5 characters long'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Cultural',
        'Adventure',
        'Wildlife',
        'Culinary',
        'Beach & Relax',
        'Historical',
        'Nature & Trekking',
      ],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Short Description cannot exceed 500 characters'],
      default: '',
    },
    primaryDestination: {
      type: String,
      required: [true, 'Primary Destination is required'],
      enum: [
        'Sigiriya',
        'Ella',
        'Kandy',
        'Galle',
        'Nuwara Eliya',
        'Yala',
        'Colombo',
        'Mirissa',
        'Polonnaruwa',
        'Dambulla',
      ],
    },
    destinationCoordinates: {
      lat: { type: Number, default: 7.9570 },
      lng: { type: Number, default: 80.7603 },
    },
    routeStops: [routeStopSchema],
    photos: [photoSchema],
    pricePerPerson: {
      type: Number,
      required: [true, 'Price per person is required'],
      min: [0, 'Price per person cannot be negative'],
    },
    durationValue: {
      type: Number,
      required: [true, 'Duration value is required'],
      min: [1, 'Duration value must be at least 1'],
      default: 1,
    },
    durationUnit: {
      type: String,
      required: [true, 'Duration unit is required'],
      enum: ['Days', 'Hours', 'Half Day'],
      default: 'Days',
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Guide reference is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to re-index routeStops order (1..N)
tourPackageSchema.pre('save', function () {
  if (this.routeStops && this.routeStops.length > 0) {
    this.routeStops.forEach((stop, index) => {
      stop.order = index + 1;
    });
  }
});

const TourPackage = mongoose.model('TourPackage', tourPackageSchema);

export default TourPackage;
