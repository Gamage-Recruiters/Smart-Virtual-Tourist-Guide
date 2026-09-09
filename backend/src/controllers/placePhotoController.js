import PlacePhoto from '../models/placePhoto.js';

// GET /api/place-photos?lat=X&lng=Y
export const getPlacePhoto = async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ success: false });
  const photo = await PlacePhoto.findOne({
    lat: parseFloat(parseFloat(lat).toFixed(4)),
    lng: parseFloat(parseFloat(lng).toFixed(4)),
  });
  if (!photo) return res.status(404).json({ success: false });
  res.json({ success: true, photoUrl: photo.photoUrl });
};

// POST /api/place-photos  { lat, lng, photoUrl }
export const createPlacePhoto = async (req, res) => {
  const { lat, lng, photoUrl } = req.body;
  if (!lat || !lng || !photoUrl) return res.status(400).json({ success: false });
  await PlacePhoto.findOneAndUpdate(
    { lat: parseFloat(parseFloat(lat).toFixed(4)), lng: parseFloat(parseFloat(lng).toFixed(4)) },
    { photoUrl, createdAt: new Date() },
    { upsert: true },
  );
  res.status(201).json({ success: true });
};
