import mongoose from 'mongoose';

const placePhotoSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  photoUrl: { type: String }, // legacy fallback
  photoUrls: { type: [String], default: [] },
  expiresAt: { type: Date, required: true },
});

placePhotoSchema.index({ lat: 1, lng: 1 }, { unique: true });
// TTL index for dynamic expiration
placePhotoSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.PlacePhoto || mongoose.model('PlacePhoto', placePhotoSchema);
