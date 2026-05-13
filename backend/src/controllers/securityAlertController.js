const SecurityAlert = require('../models/SecurityAlert');
const logger = require('../utils/logger');

// @desc    Get all active security alerts
// @route   GET /api/safety/security-alerts
// @access  Public
exports.getAlerts = async (req, res, next) => {
  try {
    const alerts = await SecurityAlert.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    logger.error('Error fetching alerts:', error);
    next(error);
  }
};

// @desc    Get single security alert
// @route   GET /api/safety/security-alerts/:id
// @access  Public
exports.getAlertById = async (req, res, next) => {
  try {
    const alert = await SecurityAlert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    logger.error('Error fetching alert:', error);
    next(error);
  }
};

// @desc    Create new security alert
// @route   POST /api/safety/security-alerts
// @access  Private (Admin/Safety Manager)
exports.createAlert = async (req, res, next) => {
  try {
    // For now, use placeholder createdBy if not provided
    const alertData = {
      ...req.body,
      createdBy: req.body.createdBy || 'SafetyManager_1',
    };

    const alert = await SecurityAlert.create(alertData);
    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    logger.error('Error creating alert:', error);
    next(error);
  }
};

// @desc    Update security alert
// @route   PUT /api/safety/security-alerts/:id
// @access  Private (Admin/Safety Manager)
exports.updateAlert = async (req, res, next) => {
  try {
    const alert = await SecurityAlert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    logger.error('Error updating alert:', error);
    next(error);
  }
};

// @desc    Delete security alert
// @route   DELETE /api/safety/security-alerts/:id
// @access  Private (Admin/Safety Manager)
exports.deleteAlert = async (req, res, next) => {
  try {
    const alert = await SecurityAlert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    logger.error('Error deleting alert:', error);
    next(error);
  }
};
