import mongoose from 'mongoose';

const touristAreaSchema = new mongoose.Schema({
  area: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  covers: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('TouristArea', touristAreaSchema);
