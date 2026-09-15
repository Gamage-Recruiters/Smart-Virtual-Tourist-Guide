import mongoose from "mongoose";

const rentalEarningSchema = new mongoose.Schema(
  {
    renterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RentalRequest",
      required: true,
      unique: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicle",
      required: true,
    },
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    tripDescription: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    // Trip lifecycle states
    tripStatus: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
    },
    // Financial status for payouts
    payoutStatus: {
      type: String,
      enum: ["PROCESSING", "PENDING_PAYOUT", "PAID"],
      default: "PROCESSING",
    },
    completionDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RentalEarning", rentalEarningSchema);
