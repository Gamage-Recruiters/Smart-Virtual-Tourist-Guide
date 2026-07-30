const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    tableType: {
      type: String,
      enum: ["ethereal", "obsidian"],
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },
    date: {
      type: String, // format YYYY-MM-DD
      required: true,
    },
    pricePerPerson: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    serviceCharge: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Paid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
