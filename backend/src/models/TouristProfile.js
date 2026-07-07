const mongoose = require("mongoose");

const touristProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    passportNumber: {
      type: String,
      default: "",
      trim: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 1,
    },
    preferences: {
      type: [String],
      default: [],
    },
    bloodType: {
      type: String,
      default: "",
      trim: true,
    },
    allergies: {
      type: [String],
      default: [],
    },
    medicalConditions: {
      type: String,
      default: "",
      trim: true,
    },
    visaType: {
      type: String,
      default: "",
      trim: true,
    },
    emergencyContactName: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyPhone: {
      type: String,
      required: true,
      trim: true,
    },
    relationship: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "touristprofile",
  }
);

module.exports = mongoose.model("TouristProfile", touristProfileSchema);