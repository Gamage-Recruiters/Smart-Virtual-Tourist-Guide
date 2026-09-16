import mongoose from "mongoose";

const rentalRequestSchema = new mongoose.Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicle",
      required: true,
    },
    fromLocation: {
      type: String,
      required: true,
      trim: true,
    },
    toLocation: {
      type: String,
      required: true,
      trim: true,
    },
    route: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    isBid: {
      type: Boolean,
      default: false,
    },
    offeredDailyRate: {
      type: Number,
      required: true,
    },
    originalDailyPrice: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "EXPIRED","COMPLETED"],
      default: "PENDING",
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RentalRequest", rentalRequestSchema);
