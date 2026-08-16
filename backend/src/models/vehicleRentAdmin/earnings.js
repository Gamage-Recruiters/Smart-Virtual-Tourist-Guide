import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    renterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RentalRequest",
    },
    transactionId: { type: String, unique: true },
    description: { type: String },

    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["Trip Earning", "Withdrawal/Payout"],
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Transaction", transactionSchema);
