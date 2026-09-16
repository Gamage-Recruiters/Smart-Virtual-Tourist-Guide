import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
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
    sessionToken: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export default mongoose.model("User", userSchema);