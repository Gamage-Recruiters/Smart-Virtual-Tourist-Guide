const logger = require("../../utils/logger");

/**
 * Push Delivery Service (Stub)
 * 
 * Firebase Cloud Messaging (FCM) is not configured for this module.
 * This stub ensures the NotificationService works without Firebase.
 *
 * Replace this file with the full FCM push delivery implementation when needed.
 */
exports.deliverViaPush = async (notification) => {
  logger.info(
    `[Push] FCM not configured — skipping push delivery for notification ${notification._id}`,
  );
  return;
};
