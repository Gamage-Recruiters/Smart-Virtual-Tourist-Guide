import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import NotificationReadStatus from "../models/NotificationReadStatus.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../errors/appError.js";
import logger from "../utils/logger.js";
import { getRegionFromCoords } from "../utils/locationHelper.js";
import User from "../models/User.js";
import Admin from "../models/Admin/Admin.js";

/**
 * Retrieves a paginated list of notifications for the authenticated user.
 *
 * Targets notifications relevant to the user by matching their userId, role,
 * broadcast scope, and geographic region (division/district). Performs a
 * `$lookup` join with `NotificationReadStatus` to compute per-user read state
 * for broadcast notifications, and filters out soft-deleted entries.
 *
 * @route   GET /api/notifications?page=1&limit=20
 * @access  Private
 * @param   {import('express').Request}  req
 * @param   {import('express').Response} res
 * @param   {import('express').NextFunction} next
 * @returns {Promise<void>} JSON response with paginated notification array.
 */
const getNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return next(
      new AppError(
        "Invalid or missing user ID in the request context",
        400,
      ),
    );
  }

  let user = await User.findById(userId);
  if (!user) {
    user = await Admin.findById(userId);
  }

   if (!user) return next(new AppError("User or Admin not found in Database", 404));

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

    //  CRITICAL PERFORMANCE FIX: Sort & Paginate BEFORE $lookup
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
 * Marks a specific notification as read for the authenticated user.
 *
 * For UNICAST notifications, updates the `isRead` flag directly on the document
 * after verifying ownership. For broadcast/regional notifications, creates or
 * updates a `NotificationReadStatus` record (upsert) to track per-user read state
 * without modifying the shared notification document.
 *
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 * @param   {import('express').Request}  req
 * @param   {import('express').Response} res
 * @param   {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const markAsRead = catchAsync(async (req, res, next) => {
  const { id } = req.params; // The ID of the notification from the URL

  // Get the current logged-in user's ID and safely convert it to a string
  const userId = (req.user._id || req.user.id)?.toString();

  if (!userId) {
    return next(
      new AppError("Authenticated user ID could not be resolved", 400),
    );
  }

  let account = await User.findById(userId);
  if (!account) {
    account = await Admin.findById(userId);
  }
  
  if (!account) {
    return next(new AppError("User or Admin not found in Database", 404));
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

  // If it's a private message sent only to this user (UNICAST)
  if (notification.scope === "UNICAST") {
    // Get the owner's ID and convert it to a string for accurate comparison.
    // We check both 'recipientId' and 'userId' to support older database records.
    const targetUserId = (
      notification.recipientId || notification.userId
    )?.toString();

    // Security check: Make sure the logged-in user/admin is the actual owner of this notification
    if (targetUserId !== userId) {
      logger.warn(
        ` Unauthorized read attempt by User/Admin ${userId} on Notif ${id}`,
      );
      return next(
        new AppError("Unauthorized access to this notification", 403),
      );
    }

    // Update the read status and save it to the database
    notification.isRead = true;
    await notification.save();
  } else {
    // If it's a public message, keep track of who read it in a separate collection.
    // 'upsert: true' creates a new record if it doesn't exist yet.
    await NotificationReadStatus.updateOne(
      { notificationId: id, userId },
      { $setOnInsert: { readAt: new Date() } },
      { upsert: true },
    );
  }

  logger.info(` Notification ${id} marked as read by User/Admin ${userId}`);

  res.status(200).json({
    status: "success",
    message: "Marked as read successfully",
  });
});


/**
 * Calculates the total number of unread notifications for the authenticated user.
 *
 * Uses the same matching logic as `getNotifications` (userId, role, region) and
 * joins with `NotificationReadStatus` to identify unread broadcast notifications.
 * The result is used to seed the red badge count on the notification bell icon.
 *
 * @route   GET /api/notifications/unread-count
 * @access  Private
 * @param   {import('express').Request}  req
 * @param   {import('express').Response} res
 * @param   {import('express').NextFunction} next
 * @returns {Promise<void>} JSON response with `{ unreadCount: number }`.
 */
const getUnreadCount = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  if (!userId) {
    return next(
      new AppError("Authenticated user ID could not be resolved", 400),
    );
  }

  let user = await User.findById(userId);
  
  if (!user) {
    user = await Admin.findById(userId);
  }

  if (!user) return next(new AppError("User or Admin not found in Database", 404));

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

  const orConditions = [
    { recipientId: new mongoose.Types.ObjectId(userId) },
    { recipientRole: userRole },
    { recipientRole: "ALL" },
    { scope: "BROADCAST" },
  ];
  if (userDivision) orConditions.push({ region: userDivision });
  if (userDistrict) orConditions.push({ district: userDistrict });

  const result = await Notification.aggregate([
    {
      $match: {
        $or: orConditions,
      },
    },

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
 * Marks all visible notifications as read for the authenticated user.
 *
 * For UNICAST notifications, performs a bulk `updateMany`. For broadcast/regional
 * notifications, bulk-upserts `NotificationReadStatus` records.
 * Uses `bulkWrite` with `ordered: false` to maximise throughput and avoid a single
 * failing upsert from blocking the rest of the batch.
 *
 * @route   PATCH /api/notifications/mark-all-read
 * @access  Private
 * @param   {import('express').Request}  req
 * @param   {import('express').Response} res
 * @param   {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const markAllAsRead = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  if (!userId) return next(new AppError("User ID required", 400));

  let user = await User.findById(userId);
  if (!user) {
    user = await Admin.findById(userId);
  }

  if (!user) return next(new AppError("User or Admin not found", 404));

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
        logger.error(`bulkWrite failed in markAllAsRead: ${e.message}`);
      },
    );
  }

  res.status(200).json({
    status: "success",
    message: "All notifications safely marked as read",
  });
});

/**
 * Soft-deletes all visible notifications for the authenticated user.
 *
 * Permanently deletes UNICAST notifications owned by the user. For broadcast/regional
 * notifications, sets `isDeleted: true` and records `deletedAt` in `NotificationReadStatus`
 * (soft delete) so the shared notification document is unaffected for other users.
 *
 * @route   DELETE /api/notifications/clear-all
 * @access  Private
 * @param   {import('express').Request}  req
 * @param   {import('express').Response} res
 * @param   {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const clearAllNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  if (!userId) return next(new AppError("User ID required", 400));

  let user = await User.findById(userId);
  if (!user) {
    user = await Admin.findById(userId);
  }

  if (!user) return next(new AppError("User or Admin not found", 404));

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
        logger.error(`bulkWrite failed in clearAllNotifications: ${e.message}`);
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
