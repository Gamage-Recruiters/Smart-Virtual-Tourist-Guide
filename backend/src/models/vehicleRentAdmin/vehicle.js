import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    licensePlate: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["Available", "Rented", "Maintenance"],
      default: "Available",
    },
    transmission: { type: String, enum: ["Automatic", "Manual"] },
    fuelType: { type: String },
    passengers: { type: Number },
    luggage: { type: Number },
    tripsCompleted: { type: Number, default: 0 },
    currentLocation: { type: String },
    dailyRentalPrice: { type: Number },
    photos: {
      exterior: { type: String },
      interior: { type: String },
      side: { type: String },
      dashboard: { type: String },
    },
    documents: {
      vehicleInsurance: { type: String },
      revenueLicense: { type: String },
    },
  },
  { timestamps: true },
);

const Vehicle = mongoose.model("vehicle", vehicleSchema);

export default Vehicle;