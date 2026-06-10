/**
 * Notification Service
 * This is the central engine for sending messages via Sockets and Push Notifications (FCM).
 */

const Notification = require("../models/Notification");
const User = require("../models/User"); 
const AppError = require("../errors/appError.js");
const sendPush = require("../utils/pushNotificationHelper"); 

/**
 * Saves a notification to the database and sends it via Socket.io and FCM.
 */
const sendNotification = async (io, data) => {
  try {
    if (!io) {
      throw new AppError("Socket.io instance is required", 500);
    }

    const newNotification = await Notification.create(data);

    const { 
      scope, recipientId, recipientRole, region, 
      title, message, actionUrl 
    } = newNotification;

    // 2. REAL-TIME SOCKET.IO (In-app notifications)
    switch (scope) {
      case "UNICAST":
        io.to(`user_${recipientId}`).emit("new_notification", newNotification);
        break;

      case "MULTICAST":
        if (recipientRole && region) {
          io.to(`region_${region}_role_${recipientRole}`).emit("new_notification", newNotification);
        } else if (recipientRole) {
          io.to(`role_${recipientRole}`).emit("new_notification", newNotification);
        } else if (region) {
          io.to(`region_${region}`).emit("new_notification", newNotification);
        }
        break;

      case "BROADCAST":
        io.emit("new_notification", newNotification);
        break;
    }

    // 3. PUSH NOTIFICATIONS (Background alerts via FCM)
    const pushData = { url: String(actionUrl) };

    if (scope === "UNICAST") {
      const user = await User.findById(recipientId);
      if (user && user.fcmToken) {
        await sendPush(user.fcmToken, title, message, pushData);
      }
    } 
    else if (scope === "MULTICAST") {
      if (region && recipientRole) {
        // උදා: topic_Balangoda_DRIVER
        await sendPush(`topic_${region}_${recipientRole}`, title, message, pushData);
      } else if (recipientRole) {
        await sendPush(`topic_${recipientRole}`, title, message, pushData);
      } else if (region) {
        await sendPush(`topic_${region}`, title, message, pushData);
      }
    } 
    else if (scope === "BROADCAST") {
      await sendPush("topic_all_users", title, message, pushData);
    }

    return newNotification;

  } catch (error) {
    if (error.isOperational) throw error;
    throw new AppError(`Failed to send notification: ${error.message}`, 500);
  }
};

module.exports = {
  sendNotification,
};