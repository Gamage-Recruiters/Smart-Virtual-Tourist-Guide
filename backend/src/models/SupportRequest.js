import mongoose from 'mongoose';

const SupportRequestSchema = new mongoose.Schema({
  type: { type: String, required: true },
  requests: { type: Number, required: true },
  region: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('SupportRequest', SupportRequestSchema);
