const Notification = require("../models/Notification");
const AppError = require("../errors/appError");
const { deliverViaSocket } = require("./delivery/socketDelivery");
const { deliverViaPush } = require("./delivery/pushDelivery");
const logger = require("../utils/logger");

/**
 * Notification Service
 * 
 * Central function to send notifications. Saves to DB, then delivers via
 * Socket.io (real-time) and FCM Push (background) in parallel.
 * 
 * Usage from any controller:
 *   const { sendNotification } = require('../services/NotificationService');
 *   const io = req.app.get('io');
 *   await sendNotification(io, { scope, title, message, category, priority, actionUrl, ... });
 */
const sendNotification = async (io, data) => {
  try {
    if (!io) {
      throw new AppError("Socket.io instance is required for delivery", 500);
    }

    const newNotification = await Notification.create(data);
    logger.info(`Notification saved to DB: ${newNotification._id}`);

    const results = await Promise.allSettled([
      deliverViaSocket(io, newNotification),
      deliverViaPush(newNotification),
    ]);

    const socketStatus = results[0].status === "fulfilled" ? "✅" : "❌";
    const pushStatus = results[1].status === "fulfilled" ? "✅" : "❌";

    logger.info(
      `Dispatch Summary for ${newNotification._id}: Socket=${socketStatus}, Push=${pushStatus}`,
    );

    return newNotification;
  } catch (error) {
    logger.error(`Notification Engine Failure: ${error.message}`);

    if (error.isOperational) throw error;
    throw new AppError(`Notification processing failed: ${error.message}`, 500);
  }
};

module.exports = { sendNotification };
