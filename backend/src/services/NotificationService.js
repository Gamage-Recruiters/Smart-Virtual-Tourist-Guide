/**
 * Notification Service
 * This is the central engine for sending messages and alerts.
 * It saves every message to the database and sends it live using WebSockets.
 */

const Notification = require('../models/Notification');

/**
 * Saves a notification to the database and sends it to users in real-time.
 * 
 * @param {Object} io - The Socket.io server object used to send live messages.
 * @param {Object} data - The notification details (title, message, scope, category, etc.).
 * @returns {Object} - The saved notification record from the database.
 */
const sendNotification = async (io, data) => {
    try {
        // STEP 1: Save the notification to the Database first.
        // This ensures the user can see it later in their history.
        const newNotification = await Notification.create(data);

        // STEP 2: Extract routing details to decide who gets the message.
        const { scope, recipientId, recipientRole, region } = newNotification;

        // STEP 3: Send the message live based on the "scope" (Target Audience).
        switch (scope) {
            case 'UNICAST':
                // Send to one specific user room (e.g., user_12345)
                io.to(`user_${recipientId}`).emit('new_notification', newNotification);
                break;

            case 'MULTICAST':
                // If it's for a specific role like "DRIVER" and not limited to a city.
                if (recipientRole && !region) {
                    io.to(`role_${recipientRole}`).emit('new_notification', newNotification);
                } 
                // If it's for a specific city/area (e.g., region_Colombo).
                else if (region) {
                    io.to(`region_${region}`).emit('new_notification', newNotification);
                }
                break;

            case 'BROADCAST':
                // Send to every single person connected to the app.
                io.emit('new_notification', newNotification);
                break;

            default:
                // Log a warning if the scope type is not recognized.
                console.warn(`Warning: Unknown notification scope: ${scope}`);
        }

        // Log success message in the server console.
        console.log(`Success: Notification "${newNotification.title}" sent via ${scope}.`);
        
        return newNotification;

    } catch (error) {
        // If something goes wrong, log the error and stop.
        console.error("Error: Failed to send notification in Service:", error);
        throw error; 
    }
};

module.exports = {
    sendNotification
};