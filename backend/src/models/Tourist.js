/**
 * Tourist Model
 * Stores profile information and live location data for Tourists.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const touristSchema = new Schema(
  {
    // 1. Basic Profile Information
    touristName: {
      type: String,
      required: [true, "Tourist name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },

    // 2. Real-time Location Data (Crucial for the Notification Engine)
    // This stores the last known GPS position of the tourist.
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"], // GeoJSON standard
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0], 
      },
    },

    // 3. User Preferences (Optional - for targeted alerts)
    languagePreference: {
      type: String,
      default: "en",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * 2dsphere Index
 * This allows the database to find tourists within a specific radius.
 * Essential for sending location-based safety alerts.
 */
touristSchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("Tourist", touristSchema);