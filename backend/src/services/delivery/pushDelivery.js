const User = require("../../../src/models/User");
const sendPush = require("../../../src/utils/pushNotificationHelper");
const logger = require("../../../src/utils/logger");

/**
 * Helper function to clean up topic names.
 * Firebase topics cannot contain spaces or special characters.
 */
const sanitizeTopic = (name) =>
  name ? name.replace(/[^a-zA-Z0-9-_.~%]/g, "") : "";

/**
 * Delivers notifications to mobile devices via Firebase Cloud Messaging (FCM).
 * This runs in the background and does not block the main Socket.io delivery.
 */
exports.deliverViaPush = async (notification) => {
  // Extract notification details
  const {
    _id,
    scope,
    recipientId,
    recipientRole,
    region,
    district,
    title,
    message,
    actionUrl,
  } = notification;

  // Extra data sent invisibly to the app (FCM requires all values to be strings)
  const pushData = { url: String(actionUrl), notificationId: String(_id) };

  try {
    // --- 1. PERSONAL MESSAGES (UNICAST) ---
    if (scope === "UNICAST") {
      // Find the specific user's device token from the database
      const user = await User.findById(recipientId).select("fcmToken");
      
      if (user?.fcmToken) {
        await sendPush(user.fcmToken, title, message, pushData);
        logger.info(`📲 FCM Unicast sent to User: ${recipientId}`);
      } else {
        logger.warn(`⚠️ FCM Unicast skipped: No token for User ${recipientId}`);
      }
    } 
    
    // --- 2. GROUP MESSAGES (MULTICAST) ---
    else if (scope === "MULTICAST") {
      const role = recipientRole;
      const div = sanitizeTopic(region);
      const dist = sanitizeTopic(district);
      let targetTopic = "";

      // Determine the most specific Firebase topic to send the message to
      
      // A. If sending to EVERYONE in a specific Division
      if (region && (!role || role === "ALL")) targetTopic = `topic_div_${div}`;
      
      // B. If sending to EVERYONE in a specific District
      else if (district && (!role || role === "ALL")) targetTopic = `topic_dist_${dist}`;
      
      // C. If sending to a specific Role in a Division (e.g., Drivers in Balangoda)
      else if (region && role) targetTopic = `topic_div_${div}_role_${role}`;
      
      // D. If sending to a specific Role in a District (e.g., Tourists in Ratnapura)
      else if (district && role) targetTopic = `topic_dist_${dist}_role_${role}`;
      
      // E. If sending to a Role across the whole country (e.g., All System Admins)
      else if (role) targetTopic = `topic_role_${role}`;

      // Send the push message to the determined topic
      if (targetTopic) {
        await sendPush(targetTopic, title, message, pushData);
        logger.info(` FCM Multicast sent to Topic: ${targetTopic}`);
      }
    } 
    
    // --- 3. PUBLIC MESSAGES (BROADCAST) ---
    else if (scope === "BROADCAST") {
      // Send to the global topic that every user is subscribed to
      await sendPush("topic_all_users", title, message, pushData);
      logger.info(` FCM Broadcast sent to all users`);
    }
  } catch (error) {
    // If FCM fails, log the error but do not crash the server
    logger.error(` FCM Delivery Failed for Notif ${_id}: ${error.message}`);
  }
};