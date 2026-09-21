import { getMessaging } from "firebase-admin/messaging";
import logger from "../../utils/logger.js";

// Import the User and Admin models to remove invalid tokens from the database
import User from "../../models/User.js";
import Admin from "../../models/Admin/Admin.js";

// Helper function to remove spaces and special characters from topic names
const sanitize = (name) => (name ? name.replace(/[^a-zA-Z0-9-_.~%]/g, "") : "");

/**
 * FCM Topic Management Service
 * Subscribes or unsubscribes a user's FCM token to regional and role-based topics.
 */
export const manageRegionalTopics = async (
  fcmToken,
  regionData,
  role,
  action = "subscribe",
) => {
  // 1. Stop ONLY if the FCM token is missing. (Do not stop if location is missing!)
  if (!fcmToken) {
    logger.warn(`⚠️ FCM ${action} skipped: Missing fcmToken.`);
    return;
  }

  // 2. Prepare an empty array to hold the topics
  const topics = [];

  // 3. Add Regional Topics ONLY IF the user has location data (e.g., normal users/drivers)
  if (regionData && regionData.division && regionData.district) {
    const divS = sanitize(regionData.division);
    const distS = sanitize(regionData.district);

    // Push location-based topics
    topics.push(`topic_div_${divS}`);
    topics.push(`topic_dist_${distS}`);
    
    // Push location + role combined topics
    if (role) {
      topics.push(`topic_div_${divS}_role_${role}`);
      topics.push(`topic_dist_${distS}_role_${role}`);
    }
  }

  // 4. Add Global & Role Topics (ALWAYS added, even for Admins without GPS)
  if (role) {
    topics.push(`topic_role_${role}`);
  }
  topics.push(`topic_all_users`); // MUST ADD THIS so everyone gets broadcast messages

  try {
    // 5. Send requests to Firebase for all determined topics at the same time
    const results = await Promise.allSettled(
      topics.map((topic) =>
        action === "subscribe"
          ? getMessaging().subscribeToTopic([fcmToken], topic)
          : getMessaging().unsubscribeFromTopic([fcmToken], topic),
      ),
    );

    // Flag to check if the FCM token is expired or invalid
    let isTokenInvalid = false;

    // 6. Loop through the results to check for success or failure
    for (let index = 0; index < results.length; index++) {
      const res = results[index];
      const topicName = topics[index];

      if (res.status === "fulfilled") {
        const successCount = res.value?.successCount || 0;

        if (successCount > 0) {
          logger.info(`FCM ${action} success: ${topicName}`);
        } else {
          // Firebase processed the request, but returned an error for this token
          const errorObj = res.value?.errors?.[0]?.error;
          const errorMessage = errorObj?.message || errorObj?.code || "Unknown error";

          logger.error(`FCM ${action} failed for ${topicName}: ${errorMessage}`);

          // Check if Firebase says the token is no longer valid
          if (
            errorMessage.includes("not registered") ||
            errorMessage.includes("not-registered")
          ) {
            isTokenInvalid = true;
          }
        }
      } else {
        // The API request completely failed (e.g., network error)
        const errorMessage = res.reason?.message || res.reason || "Unknown failure";
        logger.error(`FCM ${action} rejected for ${topicName}: ${errorMessage}`);

        // Check again if the failure was due to an invalid token
        if (
          errorMessage.includes("not registered") ||
          errorMessage.includes("not-registered")
        ) {
          isTokenInvalid = true;
        }
      }
    }

    // 7. Clean up invalid tokens from BOTH User and Admin collections ONCE
    if (isTokenInvalid) {
      logger.warn(`Invalid FCM Token detected. Removing from Database...`);
      await Promise.all([
        User.updateMany({ fcmToken: fcmToken }, { $set: { fcmToken: null } }),
        Admin.updateMany({ fcmToken: fcmToken }, { $set: { fcmToken: null } }),
      ]);
    }
  } catch (err) {
    // Catch any unexpected fatal errors
    logger.error(`Fatal error in manageRegionalTopics: ${err.message}`);
  }
};