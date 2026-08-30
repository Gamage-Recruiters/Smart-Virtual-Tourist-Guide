import mongoose from 'mongoose';

const SmeParticipationSchema = new mongoose.Schema({
  category: { type: String, required: true },
  registered: { type: Number, required: true },
  active: { type: Number, required: true },
  inactive: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('SmeParticipation', SmeParticipationSchema);
