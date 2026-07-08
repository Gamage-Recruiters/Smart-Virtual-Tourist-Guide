const mongoose = require('mongoose');

const touristAreaSchema = new mongoose.Schema({
  area: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  covers: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('TouristArea', touristAreaSchema);
