import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema({
  service: { type: String, required: true },
  number: { type: String, required: true },
  icon: { type: String },
  color: { type: String },
  country: { type: String, default: 'LK' },
  priority: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('EmergencyContact', emergencyContactSchema);
