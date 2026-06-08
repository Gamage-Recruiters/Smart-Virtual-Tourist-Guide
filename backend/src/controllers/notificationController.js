/**
 * Notification Controller
 * This file handles the logic for fetching and updating user notifications.
 * It ensures users see messages meant specifically for them, their role, or everyone.
 */

const Notification = require('../models/Notification');

/**
 * Fetch all relevant notifications for the logged-in user.
 * It filters messages based on User ID (Unicast), User Role (Multicast), 
 * or System-wide messages (Broadcast).
 */
const getNotifications = async (req, res) => {
    try {
        // Get the current user's ID and Role from the request (attached by Auth middleware)
        const userId = req.user.id; 
        const userRole = req.user.role; 

        // Find notifications where:
        // 1. The message is sent to this specific User ID.
        // 2. The message is sent to this specific User Role (e.g., all DRIVERS).
        // 3. The message is a global broadcast for everyone.
        const notifications = await Notification.find({
            $or: [
                { recipientId: userId },
                { recipientRole: userRole },
                { scope: 'BROADCAST' }
            ]
        }).sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
};

/**
 * Mark a specific notification as read.
 * If it's a personal message, it updates a simple checkbox.
 * If it's a group message, it adds the user to a "read by" list.
 */
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params; // Notification ID from the URL
        const userId = req.user.id; // ID of the user who is reading it

        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Logic for Personal Notifications (Unicast)
        if (notification.scope === 'UNICAST') {
            notification.isRead = true;
        } 
        // Logic for Group/Public Notifications (Multicast/Broadcast)
        else {
            // Check if the user has already been added to the 'readBy' list
            const alreadyRead = notification.readBy.some(read => read.userId.toString() === userId);
            
            if (!alreadyRead) {
                // Add this user to the list of people who have read this message
                notification.readBy.push({ userId });
            }
        }

        await notification.save();
        res.status(200).json({ message: "Marked as read successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification status", error: error.message });
    }
};

/**
 * Calculate the total number of notifications the user has not read yet.
 * This is used to display the notification count (badge) on the UI.
 */
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        const count = await Notification.countDocuments({
            $or: [
                // Count personal messages where 'isRead' is still false
                { recipientId: userId, isRead: false },
                // Count group/broadcast messages where this user's ID is NOT in the 'readBy' list
                { 
                    $or: [{ recipientRole: userRole }, { scope: 'BROADCAST' }],
                    'readBy.userId': { $ne: userId } 
                }
            ]
        });

        res.status(200).json({ unreadCount: count });
    } catch (error) {
        res.status(500).json({ message: "Error counting unread messages", error: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    getUnreadCount
};