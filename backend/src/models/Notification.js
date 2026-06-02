/**
 * Notification Model
 * This model handles all types of alerts (Personal, Group, and Public) 
 * for the Smart Virtual Tourist Guide system.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  
  /**
   * Defines who receives the notification.
   * UNICAST: Sent to 1 specific user.
   * MULTICAST: Sent to a specific group (e.g., all Drivers).
   * BROADCAST: Sent to everyone in the system.
   */
  scope: { 
    type: String, 
    enum: ['UNICAST', 'MULTICAST', 'BROADCAST'], 
    required: [true, 'Notification scope is required'] 
  },

  /**
   * The ID of the specific user receiving the message.
   * Only required if scope is 'UNICAST'.
   */
  recipientId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: function() { return this.scope === 'UNICAST'; } 
  },

  /**
   * The type of users who will receive the message.
   * Only required if scope is 'MULTICAST'.
   */
  recipientRole: { 
    type: String, 
    enum: ['TOURIST', 'DRIVER', 'GUIDE', 'ADMIN', 'ALL'],
    required: function() { return this.scope === 'MULTICAST'; }
  },

  /**
   * The ID of the user who sent the notification (e.g., an Admin or a Driver).
   */
  senderId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },

  /**
   * The short heading of the notification.
   */
  title: { 
    type: String, 
    required: [true, 'Title is required'], 
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },

  /**
   * The detailed body text of the notification.
   */
  message: { 
    type: String, 
    required: [true, 'Message body is required'] 
  },
  
  /**
   * Categorizes the alert so the App can show the correct Icon.
   * Examples: Bids, Bookings, Safety warnings, etc.
   */
  category: { 
    type: String, 
    enum: ['BID', 'BOOKING', 'SAFETY', 'PAYMENT', 'ACCOUNT', 'REVIEW', 'INQUIRY', 'BUDGET', 'SYSTEM'], 
    required: true 
  },

  /**
   * How urgent the notification is. 
   * Used to decide if the app should play a loud sound or just a silent pop-up.
   */
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'medium' 
  },

  /**
   * Location data for local alerts. 
   * Useful for sending safety warnings to people in a specific city/region.
   */
  region: { type: String, trim: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] } // [longitude, latitude]
  },

  /**
   * Links the notification to a specific record like a Bid ID or a Booking ID.
   */
  metadata: {
    relatedId: { type: Schema.Types.ObjectId }, 
    entityType: { type: String, enum: ['Bid', 'Booking', 'SecurityAlert', 'Payment'] }
  },

  /**
   * The URL/Link where the user is taken when they click the notification.
   */
  actionUrl: { 
    type: String, 
    required: [true, 'Action URL is required for redirection'] 
  },

  /**
   * For UNICAST: True if the user has opened the message.
   */
  isRead: { type: Boolean, default: false },
  
  /**
   * For MULTICAST/BROADCAST: Keeps a list of every user who has read the message.
   */
  readBy: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],

  /**
   * The date when the notification should be automatically deleted.
   * Useful for temporary safety alerts.
   */
  expiresAt: { type: Date } 

}, {
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

// --- INDEXES (For making database searches faster) ---

/**
 * 2dsphere index: Allows searching for alerts based on the user's GPS location.
 */
notificationSchema.index({ location: "2dsphere" });

/**
 * Recipient index: Allows fast loading of a specific user's notification history.
 */
notificationSchema.index({ recipientId: 1, createdAt: -1 });

/**
 * TTL Index: Automatically deletes the document when 'expiresAt' time is reached.
 */
notificationSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });


// --- PRE-SAVE HOOK (Validation) ---

/**
 * Before saving, check if the recipient actually exists in the User database.
 */
notificationSchema.pre('save', async function (next) {
  if (this.scope === 'UNICAST' && this.isModified('recipientId')) {
    try {
      const User = mongoose.model('User');
      const userExists = await User.findById(this.recipientId).select('_id');
      if (!userExists) {
        throw new Error(`Recipient User with ID ${this.recipientId} not found.`);
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);