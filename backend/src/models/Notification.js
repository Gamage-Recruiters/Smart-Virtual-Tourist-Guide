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
    // 1. Target Audience
    scope: {
      type: String,
      enum: Object.values(NOTIFICATION_SCOPES),
      required: [true, "Notification scope is required"],
    },

    // Required for UNICAST
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: function () {
        return this.scope === NOTIFICATION_SCOPES.UNICAST;
      },
    },

    // Required for MULTICAST
    recipientRole: {
      type: String,
      enum: Object.values(RECIPIENT_ROLES),
      required: function () {
        return this.scope === NOTIFICATION_SCOPES.MULTICAST;
      },
    },

    senderId: { type: Schema.Types.ObjectId, ref: 'User' },

    // 2. Content
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

    // 3. Location Data (For Regional Alerts)
    region: { type: String, trim: true },

    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] }, // [longitude, latitude]
    },

    // 4. Metadata (Relationship to Bids/Bookings)
    metadata: {
      relatedId: { type: Schema.Types.ObjectId },
      entityType: {
        type: String,
        enum: Object.values(ENTITY_TYPES),
      },
    },

    // 5. Action & Status
    actionUrl: { type: String, required: true },
    isRead: { type: Boolean, default: false }, // Only for UNICAST

    // For MULTICAST and BROADCAST
    readBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        readAt: { type: Date, default: Date.now },
      },
    ],

    // 6. Maintenance & Push
    fcmToken: { type: String, default: null }, // Track which token was used (Optional)
    expiresAt: { type: Date }, // For Auto-deletion (TTL)
  },
  { 
    timestamps: true 
  }
);

// --- INDEXES (For Performance) ---

// 1. Nearby search (Geospatial)
notificationSchema.index({ location: "2dsphere" }, { sparse: true });

// 2. Fast history loading for a user
notificationSchema.index({ recipientId: 1, createdAt: -1 });

// 3. Auto-delete expired notifications (TTL Index)
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


// --- PRE-SAVE HOOK (Validation & Cleanup) ---
notificationSchema.pre("save", async function () {
  if (this.scope === NOTIFICATION_SCOPES.UNICAST && this.isModified("recipientId")) {
    const User = mongoose.model("User");
    const userExists = await User.exists({ _id: this.recipientId });

    if (!userExists) {
      throw new Error(`Recipient User with ID ${this.recipientId} not found in the system.`);
    }
  }

  if (this.location && (!this.location.coordinates || this.location.coordinates.length < 2)) {
    this.location = undefined; 
  }
});

module.exports = mongoose.model('Notification', notificationSchema);