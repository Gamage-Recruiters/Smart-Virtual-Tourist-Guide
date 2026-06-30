const mongoose = require("mongoose");

/**
 * Notification Read Status Model
 * 
 * Tracks which users have read MULTICAST/BROADCAST notifications.
 * UNICAST notifications use the isRead field on the Notification model directly.
 */
const notificationReadStatusSchema = new mongoose.Schema(
  {
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to efficiently query "has user X read notification Y?"
notificationReadStatusSchema.index(
  { notificationId: 1, userId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "NotificationReadStatus",
  notificationReadStatusSchema
);
