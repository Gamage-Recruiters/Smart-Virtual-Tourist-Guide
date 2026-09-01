import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Maps to the frontend colour/icon scheme
    type: {
      type: String,
      required: true,
      enum: ["warning", "info", "safety"],
      default: "info",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Optional deep-link for "View Details" button
    actionUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "notifications",
  }
);

export default mongoose.model("Notification", notificationSchema);
