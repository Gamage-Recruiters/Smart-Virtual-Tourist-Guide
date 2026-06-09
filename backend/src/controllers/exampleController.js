const { sendNotification } = require('../services/notificationService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../errors/appError');

/**
 * 1. EXAMPLE: PRIVATE NOTIFICATION (UNICAST)
 * Scenario: Tourist confirms a booking. Driver gets a personal alert.
 */
const simulateBookingConfirm = catchAsync(async (req, res, next) => {
    if (!req.body.driverId) {
        return next(new AppError('Please provide a driverId to send the notification', 400));
    }

    console.log("Action: Booking saved to Database.");

    const io = req.app.get('io');
    await sendNotification(io, {
        scope: 'UNICAST',
        recipientId: req.body.driverId,
        title: 'Booking Confirmed! ✅',
        message: 'A tourist has confirmed your ride. View details now.',
        category: 'BOOKING',
        priority: 'high',
        actionUrl: '/driver/bookings/123'
    });

    res.status(200).json({ 
        status: 'success', 
        message: "Booking action complete and Driver notified." 
    });
});

/**
 * 2. EXAMPLE: ROLE-BASED NOTIFICATION (MULTICAST - ROLE ONLY)
 */
const simulateSystemUpdate = catchAsync(async (req, res, next) => {
    // Action logic
    console.log("Action: System policy updated.");

    const io = req.app.get('io');
    await sendNotification(io, {
        scope: 'MULTICAST',
        recipientRole: 'DRIVER',
        title: 'New Service Charges 📄',
        message: 'The system service charges have been updated for all drivers.',
        category: 'SYSTEM',
        priority: 'low',
        actionUrl: '/driver/policy'
    });

    res.status(200).json({ 
        status: 'success', 
        message: "Policy update complete and all drivers notified." 
    });
});

/**
 * 3. EXAMPLE: REGIONAL NOTIFICATION (MULTICAST - ROLE + REGION)
 */
const simulateTripRequest = catchAsync(async (req, res, next) => {
    // Action logic
    console.log("Action: Trip request posted for Balangoda.");

    const io = req.app.get('io');
    await sendNotification(io, {
        scope: 'MULTICAST',
        recipientRole: 'DRIVER',
        region: 'Balangoda',
        title: 'New Request in Balangoda! 🚗',
        message: 'A tourist near you needs a ride to Kandy. Bid now!',
        category: 'BID',
        priority: 'high',
        actionUrl: '/driver/marketplace'
    });

    res.status(200).json({ 
        status: 'success', 
        message: "Trip request posted and nearby drivers notified." 
    });
});

/**
 * 4. EXAMPLE: GLOBAL EMERGENCY (BROADCAST)
 */
const simulateEmergencyAlert = catchAsync(async (req, res, next) => {
    // Action logic
    console.log("Action: National safety alert issued.");

    const io = req.app.get('io');
    await sendNotification(io, {
        scope: 'BROADCAST',
        title: 'National Safety Warning! ⚠️',
        message: 'Strong winds expected. All outdoor activities are suspended.',
        category: 'SAFETY',
        priority: 'critical',
        actionUrl: '/safety/updates'
    });

    res.status(200).json({ 
        status: 'success', 
        message: "Emergency alert sent to everyone." 
    });
});

module.exports = {
    simulateBookingConfirm,
    simulateSystemUpdate,
    simulateTripRequest,
    simulateEmergencyAlert
};