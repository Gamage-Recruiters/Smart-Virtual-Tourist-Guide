import mongoose from 'mongoose';

const placePhotoSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  photoUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 604800 }, // TTL: 7 days
});

placePhotoSchema.index({ lat: 1, lng: 1 }, { unique: true });

export default mongoose.model('PlacePhoto', placePhotoSchema);
