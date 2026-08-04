import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../errors/appError.js";

/**
 * Update User's FCM Token for Push Notifications
 * PATCH /api/users/fcm-token (protected — userId from JWT token)
 */
export const updateFCMToken = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { fcmToken } = req.body;

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