import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referenceNumber: {
      type: String,
      index: true,
    },
    reporterName: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    incidentCategory: {
      type: String,
      enum: ['Severe Weather (Flood/Wind)', 'Landslide', 'Road Blockage', 'Accident', 'Other Emergency'],
      required: true,
    },
    incidentDate: {
      type: String, // MM/DD/YYYY from the design
      required: true,
    },
    incidentTime: {
      type: String, // HH:MM AM/PM from the design
      required: true,
    },
    district: {
      type: String,
      enum: [
        'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
        'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
        'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
        'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
        'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
      ],
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['reported', 'investigating', 'resolved', 'closed'],
      default: 'reported',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Incident', incidentSchema);