const { getMessaging } = require('firebase-admin/messaging');
require('../configs/firebaseConfig'); 

/**
 * Sends a Push Notification using Firebase Cloud Messaging (FCM)
 */
const sendPushNotification = async (target, title, body, data = {}) => {
  const message = {
    notification: { title, body },
    data: data,
  };

  if (target.startsWith('topic_')) {
    message.topic = target;
  } else {
    message.token = target;
  }

  try {
    const response = await getMessaging().send(message);
    console.log("📲 Push sent successfully to:", target);
    return response;
  } catch (error) {
    console.error("❌ FCM Error in Helper:", error.message);
  }
};

module.exports = sendPushNotification;