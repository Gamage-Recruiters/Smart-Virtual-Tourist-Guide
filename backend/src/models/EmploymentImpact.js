import mongoose from 'mongoose';

const EmploymentImpactSchema = new mongoose.Schema({
  sector: { type: String, required: true },
  fullTime: { type: Number, required: true },
  partTime: { type: Number, required: true },
  selfEmployed: { type: Number, required: true },
  total: { type: Number, required: true },
  malePercent: { type: String, required: true },
  femalePercent: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('EmploymentImpact', EmploymentImpactSchema);
