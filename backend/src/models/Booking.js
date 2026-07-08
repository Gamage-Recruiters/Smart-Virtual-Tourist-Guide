const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // e.g. "hotel", "driver", "activity", "vehicle", "guide"
    type: {
      type: String,
      required: true,
      enum: ["hotel", "driver", "activity", "vehicle", "guide", "food", "package"],
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    // ISO date-time string, e.g. "2026-05-16T15:00:00"
    dateTime: {
      type: String,
      default: "",
    },
    // Human-friendly display time, e.g. "3:00 PM"
    displayTime: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Cancelled"],
      default: "Pending",
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    // Optional price in USD
    priceUSD: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "bookings",
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
