import User from "../../models/User.js";
import Admin from "../../models/Admin/Admin.js"; 
import sendPush from "../../utils/pushNotificationHelper.js";
import logger from "../../utils/logger.js";

const sanitizeTopic = (name) =>
  name ? name.replace(/[^a-zA-Z0-9-_.~%]/g, "") : "";

export const deliverViaPush = async (notification) => {
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

  const pushData = { url: String(actionUrl), notificationId: String(_id) };

  try {
    // --- 1. PERSONAL MESSAGES (UNICAST) ---
    if (scope === "UNICAST") {
      let account = await User.findById(recipientId).select("fcmToken");
      
      if (!account) {
        account = await Admin.findById(recipientId).select("fcmToken");
      }

      if (account?.fcmToken) {
        await sendPush(account.fcmToken, title, message, pushData);
        logger.info(`📲 FCM Unicast sent to Account: ${recipientId}`);
      } else {
        logger.warn(`⚠️ FCM Unicast skipped: No token for Account ${recipientId}`);
      }
    }

    // --- 2. GROUP MESSAGES (MULTICAST) ---
    else if (scope === "MULTICAST") {
      const role = recipientRole;
      const div = sanitizeTopic(region);
      const dist = sanitizeTopic(district);
      let targetTopic = "";

      if (region && (!role || role === "ALL")) targetTopic = `topic_div_${div}`;
      else if (district && (!role || role === "ALL")) targetTopic = `topic_dist_${dist}`;
      else if (region && role) targetTopic = `topic_div_${div}_role_${role}`;
      else if (district && role) targetTopic = `topic_dist_${dist}_role_${role}`;
      else if (role) targetTopic = `topic_role_${role}`;

      if (targetTopic) {
        await sendPush(targetTopic, title, message, pushData);
        logger.info(` FCM Multicast sent to Topic: ${targetTopic}`);
      }
    }

    // --- 3. PUBLIC MESSAGES (BROADCAST) ---
    else if (scope === "BROADCAST") {
      await sendPush("topic_all_users", title, message, pushData);
      logger.info(` FCM Broadcast sent to all users`);
    }
  } catch (error) {
    logger.error(` FCM Delivery Failed for Notif ${_id}: ${error.message}`);
  }
};