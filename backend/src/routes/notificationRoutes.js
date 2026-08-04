/**
 * Notification Routes
 *
 * Description:
 * This file defines the API endpoints (URL paths) for the notification system.
 * It acts as a bridge, connecting incoming web requests from the frontend to the logic in the controllers.
 */

import express from "express";

// Create an Express router to handle these specific routes
const router = express.Router();

// Import the main notification logic (Controllers)
import {
  getNotifications,
  markAsRead,
  getUnreadCount,
  markAllAsRead,
  clearAllNotifications,
} from "../controllers/notificationController.js";

// Import the testing/simulation controller
import { triggerSimulation } from "../controllers/exampleController.js";

// Import Auth Middleware to protect all notification routes
import { protect } from "../middleware/authMiddleware.js";

/**
 * Route: GET /
 * Description: Fetches all notifications (with pagination) for the logged-in user.
 * This includes personal messages (UNICAST), group alerts (MULTICAST), and public broadcasts.
 */
router.get("/", protect, getNotifications);

/**
 * Route: GET /unread-count
 * Description: Gets the total number of messages that the user has not read yet.
 * This is used to display the red badge/number on the notification bell icon.
 */
router.get("/unread-count", protect, getUnreadCount);

/**
 * Route: PATCH /:id/read
 * Description: Marks a specific notification as "read".
 * @param {string} id - The unique ID of the notification passed in the URL.
 */
router.patch("/:id/read", protect, markAsRead);

/**
 * Route: POST /simulate-system-update
 * Description: A special testing route to manually trigger different notification scenarios via Postman.
 * Note: Keep this route only for development/testing purposes. 
 */
router.post("/simulate-system-update", protect, triggerSimulation);

router.patch("/mark-all-read", protect, markAllAsRead);

router.delete("/clear-all-notifications", protect, clearAllNotifications);

// Export the router so it can be registered in the main server.js file
export default router;