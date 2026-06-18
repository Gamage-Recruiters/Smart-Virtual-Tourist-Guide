const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const NotificationReadStatus = require("../models/NotificationReadStatus");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../errors/appError");
const logger = require("../utils/logger");
const { getRegionFromCoords } = require("../utils/locationHelper");
const User = require("../models/User");

/**
 * 1. Fetch notifications with Pagination
 * GET /api/notifications?page=1&limit=20
 *
 * Description: Retrieves a list of notifications for the logged-in user.
 * It loads messages in chunks (pagination) to save data and improve speed.
 */
const getNotifications = catchAsync(async (req, res, next) => {
  // Get user ID from headers (Currently used for testing without full auth)
  const userId = req.headers["user-id"];

  if (!userId) {
    return next(
      new AppError("Testing Error: Please provide 'user-id' in Headers", 400),
    );
  }

  // Find the user in the database
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found in Database", 404));
  }

  const userRole = user.role;
  let userDistrict = null;
  let userDivision = null;

  // Extract the user's current location to find their division and district
  if (user.currentLocation && user.currentLocation.coordinates) {
    const [lng, lat] = user.currentLocation.coordinates;
    const regionData = await getRegionFromCoords(lat, lng);

    if (regionData && typeof regionData === "object") {
      userDivision = regionData.division;
      userDistrict = regionData.district;
    }
  }

  // Setup Pagination (e.g., page 1 brings first 20 items, page 2 brings next 20)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  logger.info(
    `🔍 Fetching notifications for User: ${userId} | Role: ${userRole}`,
  );

  // Advanced Database Query (Aggregation) to fetch and filter notifications
  const notifications = await Notification.aggregate([
    {
      // Step A: Filter messages that belong to this user
      $match: {
        $or: [
          { recipientId: new mongoose.Types.ObjectId(userId) }, // Personal messages
          { recipientRole: userRole }, // Role-based messages
          { recipientRole: "ALL" }, // Role-based messages
          { region: userDivision }, // City/Division messages
          { district: userDistrict }, // District messages
          { scope: "BROADCAST" }, // Messages for everyone
        ],
      },
    },
    {
      // Step B: Check the "NotificationReadStatus" collection to see if the user read this message
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
    {
      // Step C: Create an 'isRead' true/false flag based on the message type
      $addFields: {
        isRead: {
          $cond: {
            if: { $eq: ["$scope", "UNICAST"] },
            then: "$isRead", // If private, check the 'isRead' field directly
            else: { $gt: [{ $size: "$readInfo" }, 0] }, // If public, check if a read record exists
          },
        },
      },
    },
    // Step D: Clean up the output by removing unnecessary joined data
    { $project: { readInfo: 0 } },
    // Step E: Sort by newest first, and apply pagination
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  // Send the final result back to the frontend
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
    logger.warn(`⚠️ MarkAsRead Failed: Notification ${id} not found.`);
    return next(new AppError("No notification found with that ID", 404));
  }

  // If it's a private message, simply update the 'isRead' boolean
  if (notification.scope === "UNICAST") {
    // Security check: ensure the user owns this message
    if (notification.recipientId.toString() !== userId) {
      logger.warn(
        `🚫 Unauthorized read attempt by User ${userId} on Notif ${id}`,
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

  logger.info(`✅ Notification ${id} marked as read by User ${userId}`);

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
  if (!user) {
    return next(new AppError("User not found in Database", 404));
  }

  const userRole = user.role;
  let userDistrict = null;
  let userDivision = null;

  // Determine user's region based on their last location
  if (user.currentLocation && user.currentLocation.coordinates) {
    const [lng, lat] = user.currentLocation.coordinates;
    const regionData = await getRegionFromCoords(lat, lng);

    if (regionData && typeof regionData === "object") {
      userDivision = regionData.division;
      userDistrict = regionData.district;
    }
  }

  logger.info(
    `🔍 Fetching unread count for User: ${userId} | Role: ${userRole}`,
  );

  const result = await Notification.aggregate([
    {
      // Find all messages meant for this user
      $match: {
        $or: [
          { recipientId: new mongoose.Types.ObjectId(userId) },
          { recipientRole: userRole },
          { recipientRole: "ALL" }, // Messages sent to 'ALL' roles
          { region: userDivision },
          { district: userDistrict },
          { scope: "BROADCAST" },
        ],
      },
    },
    {
      // Join with read statuses to see if they read them
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
    {
      // Identify which ones are strictly unread
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
    // Keep only the unread ones and count them
    { $match: { isUnread: true } },
    { $count: "totalUnread" },
  ]);

  // Return the count, or 0 if there are no unread messages
  const count = result.length > 0 ? result[0].totalUnread : 0;

  res.status(200).json({
    status: "success",
    data: {
      unreadCount: count,
    },
  });
});

module.exports = {
  getNotifications,
  markAsRead,
  getUnreadCount,
};
