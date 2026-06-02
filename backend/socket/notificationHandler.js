/**
 * Notification & Alerts Socket Handler
 * This file manages real-time communication, room joining, and live location updates.
 */

const Driver = require('../models/Driver'); 

/**
 * Main Socket Logic
 * @param {Object} io - The Socket.io server instance
 */
module.exports = (io) => {
    
    // Triggered whenever a new user connects to the app
    io.on('connection', (socket) => {
        
        // 1. Get user data (ID, Role, Area) sent from the Frontend during connection
        const { userId, role, initialRegion } = socket.handshake.query;

        if (userId && role) {
            // Join a private room for personal notifications (Unicast)
            socket.join(`user_${userId}`);

            // Join a role-based room (Multicast - e.g., all DRIVERS or all TOURISTS)
            socket.join(`role_${role}`);

            // Join a region-based room for local alerts (e.g., Colombo area)
            if (initialRegion) {
                socket.join(`region_${initialRegion}`);
                socket.currentRegion = initialRegion; // Remember current area in socket memory
            }
            
            socket.userId = userId; // Store userId in the socket object for later use
        }

        /**
         * Event: update_location
         * Triggered when a user (especially a Driver) moves and sends new coordinates
         */
        socket.on('update_location', async (data) => {
            const { lat, lng } = data;
            
            try {
                // Determine the city/area based on coordinates (Logic to be added)
                const newRegion = "Colombo"; // Example placeholder

                // If the user enters a NEW area (e.g., moving from Galle to Colombo)
                if (newRegion && newRegion !== socket.currentRegion) {
                    
                    // Leave the old region room
                    if (socket.currentRegion) {
                        socket.leave(`region_${socket.currentRegion}`);
                    }

                    // Join the new region room to receive local alerts
                    socket.join(`region_${newRegion}`);
                    socket.currentRegion = newRegion; // Update current area in memory
                }

                // If the user is a DRIVER, update their live location in the Database
                if (role === 'DRIVER') {
                    await Driver.findByIdAndUpdate(userId, {
                        currentLocation: { 
                            type: 'Point', 
                            coordinates: [lng, lat] 
                        },
                        showCurrentLocation: true
                    });
                }
            } catch (error) {
                console.error("Location update error:", error);
            }
        });

        // Triggered when the user closes the app or loses internet
        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
        });
    });
};