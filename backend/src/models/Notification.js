const mongoose = require("mongoose");
const { Schema } = mongoose;
const {
  NOTIFICATION_SCOPES,
  RECIPIENT_ROLES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITIES,
  ENTITY_TYPES,
} = require("../constants/notificationConstants");

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
    region: { type: String, trim: true }, // Divisional Secretariat (NAME_2)
    district: { type: String, trim: true }, // District Name (NAME_1)

    // Specific GPS coordinates for radius-based alerts
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] }, // Format must be: [longitude, latitude]
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
    // The URL the user will be redirected to when they click the notification
    actionUrl: { type: String, required: true },

    actionData: {
      type: Schema.Types.Mixed,
    },

    // Tracks if a private message is read.
    // Note: Group message read statuses are handled in the 'NotificationReadStatus' collection.
    isRead: { type: Boolean, default: false },

    // 6. Maintenance & Push
    fcmToken: { type: String, default: null }, // Tracks which Firebase token was used
    expiresAt: { type: Date }, // Used for automatically deleting old notifications
  },
  {
    timestamps: true,
  },
);

// --- INDEXES (For Performance Optimization) ---

// 1. Geospatial index for fast location-based searches
notificationSchema.index({ location: "2dsphere" }, { sparse: true });

// 2. Indexes for fast history loading (Optimizes the Aggregation Pipeline in the controller)
notificationSchema.index({ recipientId: 1, createdAt: -1 }); // For UNICAST
notificationSchema.index({ scope: 1, recipientRole: 1, createdAt: -1 }); // For MULTICAST (Role)
notificationSchema.index({ scope: 1, region: 1, createdAt: -1 }); // For MULTICAST (Region)
notificationSchema.index({ scope: 1, district: 1, createdAt: -1 }); // For MULTICAST (District)
notificationSchema.index({ scope: 1, createdAt: -1 }); // For BROADCAST

// 3. TTL (Time-To-Live) Index to automatically delete documents when 'expiresAt' time is reached
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// --- PRE-SAVE HOOK (Data Validation & Cleanup) ---
notificationSchema.pre("save", async function () {
  try {
    // If it's a private message, check if the recipient actually exists in the User collection
    if (
      this.scope === NOTIFICATION_SCOPES.UNICAST &&
      this.isModified("recipientId")
    ) {
      // Use mongoose.models to prevent schema missing errors during server startup
      const User = mongoose.models.User || mongoose.model("User");
      const userExists = await User.exists({ _id: this.recipientId });

      if (!userExists) {
        throw new Error(
          `Recipient User with ID ${this.recipientId} does not exist.`,
        );
      }
    }

    // Clean up invalid location data before saving to prevent MongoDB index errors
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
    // Throw the error to be handled by the calling service
    throw error;
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
