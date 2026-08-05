import SecurityAlert from '../models/SecurityAlert.js';
import logger from '../utils/logger.js';

// @desc    Get all active security alerts
// @route   GET /api/safety/security-alerts
// @access  Public
export const getAlerts = async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.query;
    let query = { isActive: true };
    if (req.query.category) query.category = req.query.category;

    // If location params provided, use geospatial $nearSphere query
    if (lat && lng) {
      const searchRadius = parseInt(radius) || 30000; // default 30km
      query.location = {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: searchRadius,
        },
      };
    }

    const alerts = await SecurityAlert.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    logger.error('Error fetching alerts:', error);
    next(error);
  }
};

// @desc    Get single security alert
// @route   GET /api/safety/security-alerts/:id
// @access  Public
export const getAlertById = async (req, res, next) => {
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
export const createAlert = async (req, res, next) => {
  try {
    // Convert old { lat, lng } format to GeoJSON if needed
    if (req.body.location && req.body.location.lat && !req.body.location.coordinates) {
      req.body.location = {
        type: 'Point',
        coordinates: [req.body.location.lng, req.body.location.lat],
      };
    }

    // Use authenticated user if available, fallback to body value
    const alertData = {
      ...req.body,
      createdBy: req.user?._id || req.body.createdBy,
      source: req.body.source || 'manual',
    };

    const alert = await SecurityAlert.create(alertData);

    // --- Trigger Notification Engine ---
    // Push this security alert to all connected users via Socket.io
    try {
      const { sendNotification } = await import('../services/NotificationService.js');
      const io = req.app.get('io');
      if (io) {
        await sendNotification(io, {
          scope: 'BROADCAST',
          title: `🚨 ${alert.title}`,
          message: alert.description,
          category: 'SAFETY',
          priority: alert.severity === 'critical' ? 'critical' : alert.severity === 'high' ? 'high' : 'medium',
          actionUrl: '/safety/security-alerts',
          metadata: {
            relatedId: alert._id,
            entityType: 'SecurityAlert',
          },
          location: alert.location,
          district: alert.district || alert.region,
          expiresAt: alert.expiresAt,
        });
        logger.info(`Notification dispatched for security alert: ${alert._id}`);
      }
    } catch (notifErr) {
      // Non-blocking: alert creation succeeds even if notification fails
      logger.error('Notification dispatch failed (non-blocking):', notifErr.message);
    }

    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    logger.error('Error creating alert:', error);
    next(error);
  }
};

// @desc    Update security alert
// @route   PUT /api/safety/security-alerts/:id
// @access  Private (Admin/Safety Manager)
export const updateAlert = async (req, res, next) => {
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
export const deleteAlert = async (req, res, next) => {
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
