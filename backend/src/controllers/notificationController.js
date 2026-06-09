/**
 * Notification Controller
 * Handles fetching and updating user notifications with centralized error handling.
 */

const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync'); 
const AppError = require('../errors/appError');   

/**
 * Fetch all relevant notifications for the logged-in user.
 * GET /api/notifications
 */
const getNotifications = catchAsync(async (req, res, next) => {
    const userId = req.user.id; 
    const userRole = req.user.role; 

    const notifications = await Notification.find({
        $or: [
            { recipientId: userId },
            { recipientRole: userRole },
            { scope: 'BROADCAST' }
        ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        results: notifications.length,
        data: notifications
    });
});

/**
 * Mark a specific notification as read.
 * PATCH /api/notifications/:id/read
 */
const markAsRead = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findById(id);

    if (!notification) {
        return next(new AppError('No notification found with that ID', 404));
    }

    // Logic for Personal Notifications
    if (notification.scope === 'UNICAST') {
        notification.isRead = true;
    } 
    // Logic for Group/Public Notifications
    else {
        const alreadyRead = notification.readBy.some(read => read.userId.toString() === userId);
        if (!alreadyRead) {
            notification.readBy.push({ userId });
        }
    }

    await notification.save();

    res.status(200).json({
        status: 'success',
        message: 'Marked as read successfully'
    });
});

/**
 * Get the total count of unread notifications.
 * GET /api/notifications/unread-count
 */
const getUnreadCount = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    const count = await Notification.countDocuments({
        $or: [
            { recipientId: userId, isRead: false },
            { 
                $or: [{ recipientRole: userRole }, { scope: 'BROADCAST' }],
                'readBy.userId': { $ne: userId } 
            }
        ]
    });

    res.status(200).json({
        status: 'success',
        data: {
            unreadCount: count
        }
    });
});

module.exports = {
    getNotifications,
    markAsRead,
    getUnreadCount
};