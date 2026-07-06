const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../errors/appError");

/**
 * Update User's FCM Token for Push Notifications
 * PATCH /api/users/:id/fcm-token
 */
exports.updateFCMToken = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const { fcmToken } = req.body;

  if (!userId) {
    return next(new AppError("User ID is required", 400));
  }

  if (!fcmToken) {
    return next(new AppError("FCM Token is required", 400));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { fcmToken: fcmToken },
    { new: true, runValidators: false },
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "FCM Token saved successfully",
  });
});
