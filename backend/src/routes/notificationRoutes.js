/**
 * Notification Routes
 * This file defines the API endpoints (URL paths) for the notification system.
 * It connects the web requests to the logic defined in the controller.
 */

const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  getUnreadCount,
} = require("../controllers/notificationController");

/**
 * Route: GET /
 * Description: Get all notifications for the logged-in user.
 * This includes personal messages, group alerts, and public broadcasts.
 */
router.get("/", getNotifications);

/**
 * Route: GET /unread-count
 * Description: Get the total number of messages that the user has not read yet.
 * Used to show the red number on the notification bell icon.
 */
router.get("/unread-count", getUnreadCount);

/**
 * Route: PATCH /:id/read
 * Description: Mark a specific notification as "read" using its unique ID.
 * @param {string} id - The ID of the notification passed in the URL.
 */
router.patch("/:id/read", markAsRead);

module.exports = router;