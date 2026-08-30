import mongoose from 'mongoose';

const RegionalImpactSchema = new mongoose.Schema({
  region: { type: String, required: true },
  smeCount: { type: Number, required: true },
  revenueLKR: { type: String, required: true },
  growthRate: { type: String, required: true },
  topSectors: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('RegionalImpact', RegionalImpactSchema);
