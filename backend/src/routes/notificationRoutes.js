import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAllRead,
  markOneRead,
  createNotification,
  deleteNotification,
} from "../controllers/notificationController.js";

// All notification routes require authentication
router.use(authMiddleware);

/**
 * GET /api/notifications
 * Returns all notifications for the authenticated user (newest first).
 * Optional query: ?unread=true  (returns only unread)
 */
router.get("/", getNotifications);

/**
 * POST /api/notifications
 * Create a new notification.
 * Body: { type, title, message, actionUrl, userId? }
 */
router.post("/", createNotification);

/**
 * PATCH /api/notifications/read-all
 * Mark every notification for the authenticated user as read.
 * (Must be declared before /:id to avoid "read-all" being treated as an id)
 */
router.patch("/read-all", markAllRead);

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read.
 */
router.patch("/:id/read", markOneRead);

/**
 * DELETE /api/notifications/:id
 * Delete a single notification.
 */
router.delete("/:id", deleteNotification);

export default router;
