import Notification from "../models/Notification.js";
import AppError from "../errors/appError.js";
import { deliverViaSocket } from "./delivery/socketDelivery.js";
import { deliverViaPush } from "./delivery/pushDelivery.js";
import logger from "../utils/logger.js";

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