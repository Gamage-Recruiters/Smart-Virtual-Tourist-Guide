const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    scope: {
      type: String,
      enum: ["UNICAST", "MULTICAST", "BROADCAST"],
      required: [true, "Notification scope is required"],
    },

    recipientId: {
      type: Schema.Types.ObjectId,
      required: function () {
        return this.scope === "UNICAST";
      },
    },

    recipientRole: {
      type: String,
      enum: ["TOURIST", "DRIVER", "GUIDE", "ADMIN", "ALL"],
      required: function () {
        return this.scope === "MULTICAST";
      },
    },

    senderId: { type: Schema.Types.ObjectId },

    title: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, required: true },

    category: {
      type: String,
      enum: [
        "BID",
        "BOOKING",
        "SAFETY",
        "PAYMENT",
        "ACCOUNT",
        "REVIEW",
        "INQUIRY",
        "BUDGET",
        "SYSTEM",
      ],
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    region: { type: String, trim: true },

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },

    metadata: {
      relatedId: { type: Schema.Types.ObjectId },
      entityType: {
        type: String,
        enum: ["Bid", "Booking", "SecurityAlert", "Payment"],
      },
    },

    actionUrl: { type: String, required: true },
    isRead: { type: Boolean, default: false },

    readBy: [
      {
        userId: { type: Schema.Types.ObjectId },
        readAt: { type: Date, default: Date.now },
      },
    ],

    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

// --- INDEXES ---

notificationSchema.index({ location: "2dsphere" }, { sparse: true });
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// --- FIXED PRE-SAVE HOOK ---

notificationSchema.pre("save", async function () {
  if (this.scope === "UNICAST" && this.isModified("recipientId")) {
    const Driver = mongoose.model("Driver");
    const Tourist = mongoose.model("Tourist");

    const userExists =
      (await Driver.exists({ _id: this.recipientId })) ||
      (await Tourist.exists({ _id: this.recipientId }));

    if (!userExists) {
      throw new Error(
        `Recipient User with ID ${this.recipientId} not found in Drivers or Tourists.`,
      );
    }
  }

  if (
    this.location &&
    (!this.location.coordinates || this.location.coordinates.length !== 2)
  ) {
    this.location = undefined;
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
