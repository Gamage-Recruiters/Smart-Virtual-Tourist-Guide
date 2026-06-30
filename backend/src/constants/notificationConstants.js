/**
 * Defines how a notification should be delivered.
 * UNICAST: Sent to a single, specific user.
 * MULTICAST: Sent to a group of users (based on Region and/or Role).
 * BROADCAST: Sent to everyone in the system.
 */
const NOTIFICATION_SCOPES = {
  UNICAST: 'UNICAST',
  MULTICAST: 'MULTICAST',
  BROADCAST: 'BROADCAST'
};

/**
 * All available user roles in the Smart Virtual Tourist Guide system.
 * 'ALL' is used specifically for MULTICAST/BROADCAST when the message is for everyone.
 */
const RECIPIENT_ROLES = {
  TOURIST: 'TOURIST',
  DRIVER: 'DRIVER',
  VEHICLE_OWNER: 'VEHICLE_OWNER',
  HOTEL_OWNER: 'HOTEL_OWNER',
  RESTAURANT_OWNER: 'RESTAURANT_OWNER',
  LOCAL_FOOD_PROVIDER: 'LOCAL_FOOD_PROVIDER',
  SURF_INSTRUCTOR: 'SURF_INSTRUCTOR',
  TRAVEL_AGENCY: 'TRAVEL_AGENCY',
  DESTINATION_MANAGER: 'DESTINATION_MANAGER',
  SAFETY_MANAGER: 'SAFETY_MANAGER',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  ADVERTISER: 'ADVERTISER',
  EMERGENCY_PROVIDER: 'EMERGENCY_PROVIDER',
  EVENT_ORGANIZER: 'EVENT_ORGANIZER',
  ALL: 'ALL'
};

/**
 * Categorizes notifications.
 * Useful for the Frontend to show different icons (e.g., a warning icon for SAFETY).
 */
const NOTIFICATION_CATEGORIES = {
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
 * 'critical' priorities might trigger loud alarms or override phone silent modes.
 */
const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Used to link a notification to a specific database record (Metadata).
 */
const ENTITY_TYPES = {
  BID: 'Bid',
  BOOKING: 'Booking',
  SECURITY_ALERT: 'SecurityAlert',
  PAYMENT: 'Payment'
};

module.exports = {
  NOTIFICATION_SCOPES,
  RECIPIENT_ROLES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITIES,
  ENTITY_TYPES
};
