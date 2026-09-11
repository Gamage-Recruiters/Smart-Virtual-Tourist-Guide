import express from "express";
const router = express.Router();
import { protect } from "../../middleware/authMiddleware.js";

// Import the functions from the new central notification controller
import {
  getNotifications,
  markAsRead,
  getUnreadCount,
  markAllAsRead,
  clearAllNotifications,
} from "../../controllers/notificationController.js"; 

// Protect all routes below. Only logged-in users can access these endpoints.
router.use(protect);

/**
 * GET /api/notifications
 * Fetch notifications for the logged-in user.
 * Supports pagination and location-based filtering.
 */
router.get("/", getNotifications);

/**
 * GET /api/notifications/unread-count
 * Get the total number of unread notifications.
 * Useful for displaying the red badge number on the notification bell icon.
 */
router.get("/unread-count", getUnreadCount);

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as "read" for the current user at once.
 */
router.patch("/read-all", markAllAsRead);

/**
 * PATCH /api/notifications/:id/read
 * Mark a single specific notification as "read" when the user clicks on it.
 */
router.patch("/:id/read", markAsRead);

/**
 * DELETE /api/notifications/clear-all
 * Clear or delete all notifications for the current user.
 */
router.delete("/clear-all", clearAllNotifications);

export default router;