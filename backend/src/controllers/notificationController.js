import Notification from "../models/Notification.js";

// ─────────────────────────────────────────────────────────────
// GET /api/notifications
// Returns all notifications for the authenticated user,
// newest first. Supports ?unread=true filter.
// ─────────────────────────────────────────────────────────────
async function getNotifications(req, res) {
  try {
    const userId = req.user.id;

    const filter = { userId };
    if (req.query.unread === "true") {
      filter.isRead = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (err) {
    console.error("[notificationController] getNotifications error:", err);
    return res.status(500).json({ message: "Failed to fetch notifications." });
  }
}

// ─────────────────────────────────────────────────────────────
// PATCH /api/notifications/read-all
// Marks every notification for the authenticated user as read.
// ─────────────────────────────────────────────────────────────
async function markAllRead(req, res) {
  try {
    const userId = req.user.id;

    await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } });

    return res.status(200).json({ success: true, message: "All notifications marked as read." });
  } catch (err) {
    console.error("[notificationController] markAllRead error:", err);
    return res.status(500).json({ message: "Failed to mark notifications as read." });
  }
}

// ─────────────────────────────────────────────────────────────
// PATCH /api/notifications/:id/read
// Marks a single notification as read.
// ─────────────────────────────────────────────────────────────
async function markOneRead(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (err) {
    console.error("[notificationController] markOneRead error:", err);
    return res.status(500).json({ message: "Failed to mark notification as read." });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/notifications
// Create a new notification (admin / system use).
//
// Body: { userId, type, title, message, actionUrl }
// When called on behalf of the authenticated user, userId can
// be omitted — it defaults to req.user.id.
// ─────────────────────────────────────────────────────────────
async function createNotification(req, res) {
  try {
    const { type, title, message, actionUrl, userId: bodyUserId } = req.body;

    // Allow creating for self or an explicit userId (admin flow)
    const targetUserId = bodyUserId || req.user.id;

    if (!type || !title || !message) {
      return res.status(400).json({ message: "type, title, and message are required." });
    }

    const ALLOWED_TYPES = ["warning", "info", "safety"];
    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({
        message: `type must be one of: ${ALLOWED_TYPES.join(", ")}`,
      });
    }

    const notification = await Notification.create({
      userId: targetUserId,
      type,
      title: String(title).trim(),
      message: String(message).trim(),
      actionUrl: String(actionUrl || ""),
    });

    return res.status(201).json({ success: true, data: notification });
  } catch (err) {
    console.error("[notificationController] createNotification error:", err);
    return res.status(500).json({ message: "Failed to create notification." });
  }
}

// ─────────────────────────────────────────────────────────────
// DELETE /api/notifications/:id
// Delete a single notification belonging to the authenticated user.
// ─────────────────────────────────────────────────────────────
async function deleteNotification(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({ _id: id, userId });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    return res.status(200).json({ success: true, message: "Notification deleted." });
  } catch (err) {
    console.error("[notificationController] deleteNotification error:", err);
    return res.status(500).json({ message: "Failed to delete notification." });
  }
}

export {
  getNotifications,
  markAllRead,
  markOneRead,
  createNotification,
  deleteNotification,
};
