import mongoose from "mongoose";

const rentalRequestSchema = new mongoose.Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    durationDays: { type: Number },
    vehiclePreference: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Bidding Closed", "Assigned", "Expired", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("RentalRequest", rentalRequestSchema);
