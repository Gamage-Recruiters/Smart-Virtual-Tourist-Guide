const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    touristId: {
      type: String, // Future: ObjectId ref
      required: true,
    },
    type: {
      type: String,
      enum: ['theft', 'scam', 'accident', 'health', 'harassment', 'other'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    status: {
      type: String,
      enum: ['reported', 'investigating', 'resolved', 'closed'],
      default: 'reported',
    },
    contactInfo: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
    },
    images: [
      {
        type: String, // URLs (future: file upload)
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Incident', incidentSchema);
