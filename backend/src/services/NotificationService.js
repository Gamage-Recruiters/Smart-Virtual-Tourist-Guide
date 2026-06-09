/**
 * Notification Service
 * This is the central engine for sending messages and alerts.
 */

const Notification = require('../models/Notification');
const AppError = require('../errors/appError.js'); 

/**
 * Saves a notification to the database and sends it to users in real-time.
 * 
 * @param {Object} io - The Socket.io server object.
 * @param {Object} data - The notification details.
 */
const sendNotification = async (io, data) => {
    try {
        if (!io) {
            throw new AppError('Socket.io instance is required to send notifications', 500);
        }

        const newNotification = await Notification.create(data);

        const { scope, recipientId, recipientRole, region } = newNotification;

        switch (scope) {
            case 'UNICAST':
                io.to(`user_${recipientId}`).emit('new_notification', newNotification);
                break;

            case 'MULTICAST':
                if (recipientRole && region) {
                    const combinedRoom = `region_${region}_role_${recipientRole}`;
                    io.to(combinedRoom).emit('new_notification', newNotification);
                } 
                else if (recipientRole) {
                    io.to(`role_${recipientRole}`).emit('new_notification', newNotification);
                } 
                else if (region) {
                    io.to(`region_${region}`).emit('new_notification', newNotification);
                }
                break;

            case 'BROADCAST':
                io.emit('new_notification', newNotification);
                break;

            default:
                throw new AppError(`Unknown notification scope: ${scope}`, 400);
        }

        return newNotification;

    } catch (error) {
        if (error.isOperational) throw error;

        throw new AppError(`Failed to send notification: ${error.message}`, 500);
    }
};

module.exports = {
    sendNotification
};