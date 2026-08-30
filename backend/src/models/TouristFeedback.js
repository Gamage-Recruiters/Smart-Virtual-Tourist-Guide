import mongoose from 'mongoose';

const TouristFeedbackSchema = new mongoose.Schema({
  service: { type: String, required: true },
  rating: { type: Number, required: true },
  positive: { type: String, required: true },
  negative: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('TouristFeedback', TouristFeedbackSchema);
