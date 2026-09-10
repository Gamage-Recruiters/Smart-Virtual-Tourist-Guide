import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    incidentCategory: { type: String, trim: true },
    status: { type: String, default: 'reported', trim: true },
    description: { type: String, default: '', trim: true },
    district: { type: String, default: '', trim: true },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    referenceNumber: { type: String, default: '' },
    reporterName: { type: String, default: '' },
    incidentDate: { type: String, default: '' },
    incidentTime: { type: String, default: '' },
    reportedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'incidents' }
);

export default mongoose.model('NavIncident', incidentSchema);
