const mongoose = require("mongoose");
const { Schema } = mongoose;
const {
  NOTIFICATION_SCOPES,
  RECIPIENT_ROLES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITIES,
  ENTITY_TYPES,
} = require("../constants/notificationConstants");

/**
 * Notification Model
 */
const notificationSchema = new Schema(
  {
    // 1. Target Audience (Who receives the notification)
    scope: {
      type: String,
      enum: Object.values(NOTIFICATION_SCOPES),
      required: [true, "Notification scope is required"],
    },

    // recipientId is only required for private messages (UNICAST)
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.scope === NOTIFICATION_SCOPES.UNICAST;
      },
    },

    // recipientRole is only required for group messages (MULTICAST)
    recipientRole: {
      type: String,
      enum: Object.values(RECIPIENT_ROLES),
      required: function () {
        return this.scope === NOTIFICATION_SCOPES.MULTICAST;
      },
    },

    // Optional field to track who sent the notification
    senderId: { type: Schema.Types.ObjectId, ref: "User" },

    // 2. Content (The actual message details)
    title: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, required: true },

    category: {
      type: String,
      enum: Object.values(NOTIFICATION_CATEGORIES),
      required: true,
    },

    priority: {
      type: String,
      enum: Object.values(NOTIFICATION_PRIORITIES),
      default: NOTIFICATION_PRIORITIES.MEDIUM,
    },

    // 3. Location Data (Used for targeting specific geographic areas)
    region: { type: String, trim: true },
    district: { type: String, trim: true },

    // Specific GPS coordinates for radius-based alerts
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },

    // 4. Metadata (Links the notification to a specific booking, bid, etc.)
    metadata: {
      relatedId: { type: Schema.Types.ObjectId },
      entityType: {
        type: String,
        enum: Object.values(ENTITY_TYPES),
      },
    },

    // 5. Action & Status
    actionUrl: { type: String, required: true },
    
    // Tracks if a private message is read.
    isRead: { type: Boolean, default: false }, 

    // 6. Maintenance & Push
    fcmToken: { type: String, default: null },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

// --- INDEXES ---
notificationSchema.index({ location: "2dsphere" }, { sparse: true });
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ scope: 1, recipientRole: 1, createdAt: -1 });
notificationSchema.index({ scope: 1, region: 1, createdAt: -1 });
notificationSchema.index({ scope: 1, district: 1, createdAt: -1 });
notificationSchema.index({ scope: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// --- PRE-SAVE HOOK ---
notificationSchema.pre("save", async function () {
  try {
    if (
      this.scope === NOTIFICATION_SCOPES.UNICAST &&
      this.isModified("recipientId")
    ) {
      const User = mongoose.models.User || mongoose.model("User");
      const userExists = await User.exists({ _id: this.recipientId });

      if (!userExists) {
        throw new Error(
          `Recipient User with ID ${this.recipientId} does not exist.`,
        );
      }
    }

    // Clean up invalid location data before saving
    if (this.location) {
      if (
        !this.location.coordinates ||
        this.location.coordinates.length < 2 ||
        this.location.coordinates.some((c) => c === null || c === undefined)
      ) {
        this.location = undefined;
      }
    }
  } catch (error) {
    throw error;
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
