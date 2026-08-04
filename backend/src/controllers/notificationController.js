import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import NotificationReadStatus from "../models/NotificationReadStatus.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../errors/appError.js";
import logger from "../utils/logger.js";
import { getRegionFromCoords } from "../utils/locationHelper.js";
import User from "../models/User.js";

/**
 * 1. Fetch notifications with Pagination
 * GET /api/notifications?page=1&limit=20
 *
 * Description: Retrieves a list of notifications for the logged-in user.
 * It loads messages in chunks (pagination) to save data and improve speed.
 */
const getNotifications = catchAsync(async (req, res, next) => {
  const userId = req.headers["user-id"];

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return next(
      new AppError(
        "Testing Error: Please provide valid 'user-id' in Headers",
        400,
      ),
    );
  }

  const user = await User.findById(userId);
  if (!user) return next(new AppError("User not found in Database", 404));

  const userRole = user.role;
  let userDistrict = null,
    userDivision = null;

  if (user.currentLocation?.coordinates) {
    const [lng, lat] = user.currentLocation.coordinates;
    const regionData = await getRegionFromCoords(lat, lng);
    if (regionData) {
      userDivision = regionData.division;
      userDistrict = regionData.district;
    }
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const matchCriteria = [
    { recipientId: new mongoose.Types.ObjectId(userId) },
    { recipientRole: userRole },
    { recipientRole: "ALL" },
    { scope: "BROADCAST" },
  ];

  if (userDivision) matchCriteria.push({ region: userDivision });
  if (userDistrict) matchCriteria.push({ district: userDistrict });

  const notifications = await Notification.aggregate([
    // 1. Filter Messages
    { $match: { $or: matchCriteria } },

    // 2. Deduplicate (Remove identical messages)
    { $group: { _id: "$_id", doc: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$doc" } },

    // 🚀 CRITICAL PERFORMANCE FIX: Sort & Paginate BEFORE $lookup
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },

    {
      $lookup: {
        from: "notificationreadstatuses",
        let: { notifId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$notificationId", "$$notifId"] },
                  { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                ],
              },
            },
          },
        ],
        as: "readInfo",
      },
    },

    { $match: { "readInfo.isDeleted": { $ne: true } } },

    {
      $addFields: {
        isRead: {
          $cond: {
            if: { $eq: ["$scope", "UNICAST"] },
            then: "$isRead",
            else: { $gt: [{ $size: "$readInfo" }, 0] },
          },
        },
      },
    },
    { $project: { readInfo: 0 } },
  ]);

  res.status(200).json({
    status: "success",
    page,
    results: notifications.length,
    data: notifications,
  });
});

/**
 * 2. Mark as read
 * PATCH /api/notifications/:id/read
 *
 * Description: Marks a specific notification as 'read' when the user clicks on it.
 */
const markAsRead = catchAsync(async (req, res, next) => {
  const { id } = req.params; // The ID of the notification from the URL

  // Get user ID from headers (for testing)
  const userId = req.headers["user-id"];

  if (!userId) {
    return next(
      new AppError("Testing Error: Please provide 'user-id' in Headers", 400),
    );
  }

  // Validate if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid Notification ID format", 400));
  }

  // Find the notification in the database
  const notification = await Notification.findById(id);

  if (!notification) {
    logger.warn(` MarkAsRead Failed: Notification ${id} not found.`);
    return next(new AppError("No notification found with that ID", 404));
  }

  // If it's a private message, simply update the 'isRead' boolean
  if (notification.scope === "UNICAST") {
    // Security check: ensure the user owns this message
    if (notification.recipientId.toString() !== userId) {
      logger.warn(
        ` Unauthorized read attempt by User ${userId} on Notif ${id}`,
      );
      return next(
        new AppError("Unauthorized access to this notification", 403),
      );
    }
    notification.isRead = true;
    await notification.save();
  } else {
    // If it's a public message, add a new record to the ReadStatus collection
    // 'upsert: true' creates a new record if it doesn't exist
    await NotificationReadStatus.updateOne(
      { notificationId: id, userId },
      { $setOnInsert: { readAt: new Date() } },
      { upsert: true },
    );
  }

  logger.info(` Notification ${id} marked as read by User ${userId}`);

  res.status(200).json({
    status: "success",
    message: "Marked as read successfully",
  });
});

/**
 * 3. Get total unread count
 * GET /api/notifications/unread-count
 *
 * Description: Calculates how many unread messages the user has.
 * This is useful for displaying the red badge number on the notification bell icon.
 */
const getUnreadCount = catchAsync(async (req, res, next) => {
  const userId = req.headers["user-id"];

  if (!userId) {
    return next(
      new AppError("Testing Error: Please provide 'user-id' in Headers", 400),
    );
  }

  const user = await User.findById(userId);
  if (!user) return next(new AppError("User not found in Database", 404));

  const userRole = user.role;
  let userDistrict = null;
  let userDivision = null;

  if (user.currentLocation && user.currentLocation.coordinates) {
    const [lng, lat] = user.currentLocation.coordinates;
    const regionData = await getRegionFromCoords(lat, lng);
    if (regionData && typeof regionData === "object") {
      userDivision = regionData.division;
      userDistrict = regionData.district;
    }
  }

  const result = await Notification.aggregate([
    {
      $match: {
        $or: [
          { recipientId: new mongoose.Types.ObjectId(userId) },
          { recipientRole: userRole },
          { recipientRole: "ALL" },
          { region: userDivision },
          { district: userDistrict },
          { scope: "BROADCAST" },
        ],
      },
    },

    {
      $group: {
        _id: "$_id",
        doc: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$doc" } },

    {
      $lookup: {
        from: "notificationreadstatuses",
        let: { notifId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$notificationId", "$$notifId"] },
                  { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                ],
              },
            },
          },
        ],
        as: "readRecord",
      },
    },

    { $match: { "readRecord.isDeleted": { $ne: true } } },

    {
      $addFields: {
        isUnread: {
          $cond: {
            if: { $eq: ["$scope", "UNICAST"] },
            then: { $eq: ["$isRead", false] },
            else: { $eq: [{ $size: "$readRecord" }, 0] },
          },
        },
      },
    },
    { $match: { isUnread: true } },
    { $count: "totalUnread" },
  ]);

  const count = result.length > 0 ? result[0].totalUnread : 0;

  res.status(200).json({
    status: "success",
    data: {
      unreadCount: count,
    },
  });
});
/**
 * 4. Mark all notifications as read for a user
 * PATCH /api/notifications/mark-all-read
 */

const markAllAsRead = catchAsync(async (req, res, next) => {
  const userId = req.headers["user-id"];

  if (!userId) return next(new AppError("User ID required", 400));

  const user = await User.findById(userId);
  if (!user) return next(new AppError("User not found", 404));

  const { role: userRole, currentLocation } = user;

  let userDistrict = null,
    userDivision = null;
  if (currentLocation?.coordinates) {
    const [lng, lat] = currentLocation.coordinates;
    const regionData = await getRegionFromCoords(lat, lng);
    userDivision = regionData?.division;
    userDistrict = regionData?.district;
  }

  await Notification.updateMany(
    { recipientId: userId, isRead: false },
    { $set: { isRead: true } },
  );

  const orConditions = [
    { recipientRole: userRole },
    { recipientRole: "ALL" },
    { scope: "BROADCAST" },
  ];
  if (userDivision) orConditions.push({ region: userDivision });
  if (userDistrict) orConditions.push({ district: userDistrict });

  const unreadNotifications = await Notification.aggregate([
    { $match: { scope: { $ne: "UNICAST" }, $or: orConditions } },
    {
      $lookup: {
        from: "notificationreadstatuses",
        let: { notifId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$notificationId", "$$notifId"] },
                  { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                ],
              },
            },
          },
        ],
        as: "readRecord",
      },
    },
    { $match: { "readRecord.0": { $exists: false } } },

    { $group: { _id: "$_id" } },
  ]);

  if (unreadNotifications.length > 0) {
    const bulkOps = unreadNotifications.map((n) => ({
      updateOne: {
        filter: {
          notificationId: n._id,
          userId: new mongoose.Types.ObjectId(userId),
        },
        update: { $setOnInsert: { readAt: new Date() } },
        upsert: true,
      },
    }));

      await NotificationReadStatus.bulkWrite(bulkOps, { ordered: false }).catch(
        (e) => {
          console.error("Error in bulkWrite for markAllAsRead:", e.message);
        },
      );
  }

  res.status(200).json({
    status: "success",
    message: "All notifications safely marked as read",
  });
});

/**
 * 5. Clear all notifications for a user
 * DELETE /api/notifications/clear-all
 */

const clearAllNotifications = catchAsync(async (req, res, next) => {
  const userId = req.headers["user-id"];

  if (!userId) return next(new AppError("User ID required", 400));

  const user = await User.findById(userId);
  if (!user) return next(new AppError("User not found", 404));

  const { role: userRole, currentLocation } = user;

  let userDistrict = null,
    userDivision = null;
  if (currentLocation?.coordinates) {
    const [lng, lat] = currentLocation.coordinates;
    const regionData = await getRegionFromCoords(lat, lng);
    userDivision = regionData?.division;
    userDistrict = regionData?.district;
  }
  await Notification.deleteMany({ recipientId: userId, scope: "UNICAST" });

  const orConditions = [
    { recipientRole: userRole },
    { recipientRole: "ALL" },
    { scope: "BROADCAST" },
  ];
  if (userDivision) orConditions.push({ region: userDivision });
  if (userDistrict) orConditions.push({ district: userDistrict });

  const publicNotifications = await Notification.aggregate([
    { $match: { scope: { $ne: "UNICAST" }, $or: orConditions } },
    {
      $lookup: {
        from: "notificationreadstatuses",
        let: { notifId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$notificationId", "$$notifId"] },
                  { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                ],
              },
            },
          },
        ],
        as: "readRecord",
      },
    },
    { $match: { "readRecord.isDeleted": { $ne: true } } },
    { $group: { _id: "$_id" } },
  ]);

  if (publicNotifications.length > 0) {
    const bulkOps = publicNotifications.map((n) => ({
      updateOne: {
        filter: {
          notificationId: n._id,
          userId: new mongoose.Types.ObjectId(userId),
        },
        update: {
          $set: { isDeleted: true, deletedAt: new Date() },
          $setOnInsert: { readAt: new Date() },
        },
        upsert: true,
      },
    }));

    await NotificationReadStatus.bulkWrite(bulkOps, { ordered: false }).catch(
      (e) => {
        console.error("Error in bulkWrite for clearAll:", e.message);
      },
    );
  }

  res.status(200).json({
    status: "success",
    message: "All notifications cleared successfully",
  });
});

export {
  getNotifications,
  markAsRead,
  getUnreadCount,
  markAllAsRead,
  clearAllNotifications,
};
