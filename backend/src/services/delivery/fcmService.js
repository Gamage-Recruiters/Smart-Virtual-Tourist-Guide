const { getMessaging } = require("firebase-admin/messaging");
const logger = require("../../utils/logger");

/**
 * Helper function to clean up region/district names for Firebase.
 * Firebase Topics do not allow spaces or special characters.
 * E.g., "Galle Four Gravets" becomes "GalleFourGravets".
 */
const sanitize = (name) => (name ? name.replace(/[^a-zA-Z0-9-_.~%]/g, "") : "");

/**
 * FCM Topic Management Service
 * 
 * Description:
 * Subscribes or unsubscribes a user's mobile device (FCM Token) to location-based topics.
 * This ensures they receive background push notifications for their specific region and role.
 */
exports.manageRegionalTopics = async (
  fcmToken,
  regionData,
  role,
  action = "subscribe", // Default action is to 'subscribe'
) => {
  // 1. Safety Check: Stop the process if the token or location data is missing
  if (
    !fcmToken ||
    !regionData ||
    !regionData.division ||
    !regionData.district
  ) {
    logger.warn(`⚠️ FCM ${action} skipped: Missing fcmToken or regionData.`);
    return;
  }

  // Extract and clean the division and district names
  const { division, district } = regionData;
  const divS = sanitize(division);
  const distS = sanitize(district);

  // 2. Build the list of Firebase Topics this user should listen to
  // They will receive messages sent to any of these 4 channels
  const topics = [
    `topic_div_${divS}`,                     // E.g., Everyone in Balangoda
    `topic_dist_${distS}`,                   // E.g., Everyone in Ratnapura district
    `topic_div_${divS}_role_${role}`,        // E.g., Drivers in Balangoda
    `topic_dist_${distS}_role_${role}`,      // E.g., Drivers in Ratnapura district
  ];

  try {
    // 3. Execute all FCM requests at the same time (Parallel processing)
    // Promise.allSettled ensures that if one topic fails, the others will still continue
    const results = await Promise.allSettled(
      topics.map((topic) =>
        action === "subscribe"
          ? getMessaging().subscribeToTopic([fcmToken], topic)
          : getMessaging().unsubscribeFromTopic([fcmToken], topic),
      ),
    );

    // 4. Check the results and log them for debugging and monitoring
    results.forEach((res, index) => {
      const topicName = topics[index];

      if (res.status === "fulfilled") {
        // The API call was successful, now check if Firebase actually added/removed the token
        const successCount = res.value?.successCount || 0;
        if (successCount > 0) {
          logger.info(` FCM ${action} success: ${topicName}`);
        } else {
          // The API call succeeded, but the token was invalid or rejected by Firebase
          const errorDetail = res.value?.errors?.[0]?.error || "Unknown error";
          logger.error(
            ` FCM ${action} failed for ${topicName}: ${errorDetail}`,
          );
        }
      } else {
        // The API call itself failed (e.g., Network issue or Firebase server down)
        const errorMessage =
          res.reason?.message || res.reason || "Unknown failure";
        logger.error(
          ` FCM ${action} rejected for ${topicName}: ${errorMessage}`,
        );
      }
    });
  } catch (err) {
    // Catch any unexpected fatal errors in the overall process
    logger.error(` Fatal error in manageRegionalTopics: ${err.message}`);
  }
};