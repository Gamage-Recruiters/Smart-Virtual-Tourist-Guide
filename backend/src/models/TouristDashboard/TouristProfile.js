import mongoose from "mongoose";

const touristProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      default: "Male",
      trim: true,
    },
    country: {
      type: String,
      default: "Sri Lanka",
      trim: true,
    },
    travelType: {
      type: String,
      default: "Solo",
      trim: true,
    },
    passportNumber: {
      type: String,
      default: "",
      trim: true,
    },
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    budget: {
      type: Number,
      default: 50000,
    },
    budgetMin: {
      type: Number,
      default: 10000,
    },
    budgetMax: {
      type: Number,
      default: 50000,
    },
    budgetRange: {
      type: String,
      default: "Rs. 10000 - Rs. 50000",
      trim: true,
    },
    preferences: {
      type: [String],
      default: [],
    },
    accommodationType: {
      type: String,
      default: "Hotel",
      trim: true,
    },
    bloodType: {
      type: String,
      default: "O+",
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
    emergencyContactName: {
      type: String,
      default: "",
      trim: true,
    },
    emergencyPhone: {
      type: String,
      default: "",
      trim: true,
    },
    relationship: {
      type: String,
      default: "",
      trim: true,
    },
    emergencyCountry: {
      type: String,
      default: "United States",
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "touristprofile",
  }
);

export default mongoose.model("TouristProfile", touristProfileSchema);