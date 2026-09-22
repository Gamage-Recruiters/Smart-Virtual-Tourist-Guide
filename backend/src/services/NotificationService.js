import Notification from "../models/Notification.js";
import AppError from "../errors/appError.js";
import { deliverViaSocket } from "./delivery/socketDelivery.js";
import { deliverViaPush } from "./delivery/pushDelivery.js";
import logger from "../utils/logger.js";

/**
 * Core notification dispatch function for the Notification Engine.
 *
 * Persists the notification to MongoDB and concurrently delivers it via two channels:
 * 1. **Socket.IO** — Real-time in-app delivery to connected clients via `deliverViaSocket`.
 * 2. **Firebase Cloud Messaging (FCM)** — Push notification for background/offline clients.
 *
 * Uses `Promise.allSettled` so a failure in one delivery channel does not prevent
 * the other from succeeding. Both results are logged for monitoring.
 *
 * @async
 * @param {import("socket.io").Server} io   - The Socket.IO server instance.
 * @param {Object}                     data - The notification payload conforming to the Notification model schema.
 * @returns {Promise<import("mongoose").Document>} The persisted notification document.
 * @throws {AppError} If the `io` instance is missing, or if DB persistence fails.
 */
export const sendNotification = async (io, data) => {
  try {
    if (!io) {
      throw new AppError("Socket.io instance is required for delivery", 500);
    }

    const newNotification = await Notification.create(data);
    logger.info(`💾 Notification saved to DB: ${newNotification._id}`);

    const results = await Promise.allSettled([
      deliverViaSocket(io, newNotification),
      deliverViaPush(newNotification),
    ]);

    const socketStatus = results[0].status === "fulfilled" ? "✅" : "❌";
    const pushStatus = results[1].status === "fulfilled" ? "✅" : "❌";

    logger.info(
      `📢 Dispatch Summary for ${newNotification._id}: Socket=${socketStatus}, Push=${pushStatus}`,
    );

    return newNotification;
  } catch (error) {
    logger.error(` Notification Engine Failure: ${error.message}`);

    if (error.isOperational) throw error;
    throw new AppError(`Notification processing failed: ${error.message}`, 500);
  }
};