const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    driverName: { type: String, required: true },
    vehicleName: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    vehicleColor: { type: String, required: true },
    nationalIdNumber: { type: String, required: true },
    contactNumber: { type: String, required: true },
    showCurrentLocation: { type: Boolean, default: false },
    availability: { type: Boolean, default: false },
    currentLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);