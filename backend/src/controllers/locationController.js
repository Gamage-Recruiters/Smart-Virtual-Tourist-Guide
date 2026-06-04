const SharedLocation = require('../models/SharedLocation');
const logger = require('../utils/logger');

// Helper to generate random 6-char share code
const generateShareCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @desc    Generate a share link / start sharing location
// @route   POST /api/safety/location/share
// @access  Public (or Private for logged in Tourist)
exports.shareLocation = async (req, res, next) => {
  try {
    const { lat, lng, durationHours = 1 } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const shareCode = generateShareCode();
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

    const locationData = {
      touristId: req.user?._id || req.body.touristId,
      shareCode,
      location: { lat, lng },
      expiresAt,
    };

    const sharedLocation = await SharedLocation.create(locationData);
    res.status(201).json({ success: true, data: sharedLocation });
  } catch (error) {
    logger.error('Error sharing location:', error);
    next(error);
  }
};

// @desc    Get shared location by code
// @route   GET /api/safety/location/:shareCode
// @access  Public (with link)
exports.getSharedLocation = async (req, res, next) => {
  try {
    const { shareCode } = req.params;
    
    const sharedLocation = await SharedLocation.findOne({ shareCode, isActive: true });
    
    if (!sharedLocation) {
      return res.status(404).json({ success: false, message: 'Location sharing session not found or expired' });
    }

    res.status(200).json({ success: true, data: sharedLocation });
  } catch (error) {
    logger.error('Error getting shared location:', error);
    next(error);
  }
};

// @desc    Update shared location
// @route   PUT /api/safety/location/:shareCode
// @access  Private (Owner only - placeholder auth)
exports.updateSharedLocation = async (req, res, next) => {
  try {
    const { shareCode } = req.params;
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const sharedLocation = await SharedLocation.findOneAndUpdate(
      { shareCode, isActive: true },
      { location: { lat, lng } },
      { new: true }
    );

    if (!sharedLocation) {
      return res.status(404).json({ success: false, message: 'Location sharing session not found or expired' });
    }

    res.status(200).json({ success: true, data: sharedLocation });
  } catch (error) {
    logger.error('Error updating shared location:', error);
    next(error);
  }
};

// @desc    Stop sharing location
// @route   DELETE /api/safety/location/:shareCode
// @access  Private (Owner only - placeholder auth)
exports.stopSharingLocation = async (req, res, next) => {
  try {
    const { shareCode } = req.params;

    const sharedLocation = await SharedLocation.findOneAndUpdate(
      { shareCode },
      { isActive: false },
      { new: true }
    );

    if (!sharedLocation) {
      return res.status(404).json({ success: false, message: 'Location sharing session not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    logger.error('Error stopping location share:', error);
    next(error);
  }
};
