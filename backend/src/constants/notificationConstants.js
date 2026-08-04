/**
 * Defines how a notification should be delivered.
 * UNICAST: Sent to a single, specific user.
 * MULTICAST: Sent to a group of users (based on Region and/or Role).
 * BROADCAST: Sent to everyone in the system.
 */
export const NOTIFICATION_SCOPES = {
  UNICAST: 'UNICAST',
  MULTICAST: 'MULTICAST',
  BROADCAST: 'BROADCAST'
};

/**
 * All available user roles in the Smart Virtual Tourist Guide system.
 * 'ALL' is used specifically for MULTICAST/BROADCAST when the message is for everyone.
 */
export const RECIPIENT_ROLES = {
  TOURIST: "tourist_user",
  DRIVER: "driver_user",
  GUIDE: "guide_user",
  HOTEL_OWNER: "hotelowner_user",
  RESTAURANT: "restaurant_user",
  ACTIVITY_PROVIDER: "activityprovider_user",
  RENTER: "renter_user",
  GOVERNMENT: "government_user",
  ADMIN: "admin",
  ALL: "ALL", // Broadcast
};

/**
 * Categorizes notifications.
 * This is highly useful for the Frontend to show different icons (e.g., a car icon for BID, a warning icon for SAFETY).
 */
export const NOTIFICATION_CATEGORIES = {
  BID: 'BID',
  BOOKING: 'BOOKING',
  SAFETY: 'SAFETY',
  PAYMENT: 'PAYMENT',
  ACCOUNT: 'ACCOUNT',
  REVIEW: 'REVIEW',
  INQUIRY: 'INQUIRY',
  BUDGET: 'BUDGET',
  SYSTEM: 'SYSTEM'
};

/**
 * Defines the urgency of the notification.
 * 'critical' priorities might trigger loud alarms or override phone silent modes in the mobile app.
 */
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Used to link a notification to a specific database record (Metadata).
 * For example, if it's a Booking alert, it can store the related 'Booking' ID.
 */
export const ENTITY_TYPES = {
  BID: 'Bid',
  BOOKING: 'Booking',
  SECURITY_ALERT: 'SecurityAlert',
  PAYMENT: 'Payment'
};