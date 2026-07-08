const mongoose = require("mongoose");

// Sub-document for a single itinerary day
const daySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true },
    date: { type: String, default: "" },
    location: { type: String, default: "" },
    activities: { type: [String], default: [] },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const tripItinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Friendly trip name shown in TripPlan widget
    title: {
      type: String,
      default: "My Sri Lanka Tour",
      trim: true,
    },
    // Cover image URL for the TripPlan card
    imageUrl: {
      type: String,
      default: "",
    },
    // Where the tourist currently is
    currentLocation: {
      type: String,
      default: "",
      trim: true,
    },
    // Next activity label shown on the card, e.g. "Temple Tour at 2:00 PM"
    nextActivity: {
      type: String,
      default: "",
      trim: true,
    },
    // Total number of trip days
    totalDays: {
      type: Number,
      default: 1,
      min: 1,
    },
    // Which day the tourist is currently on
    currentDay: {
      type: Number,
      default: 1,
      min: 1,
    },
    // Weather snapshot (refreshed externally or manually)
    weather: {
      temperatureC: { type: Number, default: null },
      description: { type: String, default: "" },
    },
    // Per-day breakdown (optional, populated gradually)
    days: {
      type: [daySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "tripitineraries",
  }
);

module.exports = mongoose.model("TripItinerary", tripItinerarySchema);
