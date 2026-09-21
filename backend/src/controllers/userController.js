import User from "../models/User.js";
import Admin from "../models/Admin/Admin.js"; // Import the Admin model
// (If you have a separate Restaurant model, import it here too. e.g., import Restaurant from "../models/Restaurant.js";)

import catchAsync from "../utils/catchAsync.js";
import AppError from "../errors/appError.js";

/**
 * Update User's, Admin's or Restaurant's FCM Token for Push Notifications
 * PATCH /api/users/fcm-token (protected — userId from JWT token)
 */
export const updateFCMToken = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { fcmToken } = req.body;

  if (!fcmToken) {
    return next(new AppError("FCM Token is required", 400));
  }

  // 1. First, try to find and update a standard User
  let account = await User.findByIdAndUpdate(
    userId,
    { fcmToken: fcmToken },
    { new: true, runValidators: false },
  );

  // 2. If it is not a standard User, try to find and update an Admin
  if (!account) {
    account = await Admin.findByIdAndUpdate(
      userId,
      { fcmToken: fcmToken },
      { new: true, runValidators: false },
    );
  }

  /* 
  // 3. If Restaurants are stored in a separate collection, uncomment and use this block:
  if (!account) {
    account = await Restaurant.findByIdAndUpdate(
      userId,
      { fcmToken: fcmToken },
      { new: true, runValidators: false },
    );
  }
  */

  // 4. If the account is not found in any collection, return an error
  if (!account) {
    return next(new AppError("User, Admin or Restaurant not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "FCM Token saved successfully",
  });
});