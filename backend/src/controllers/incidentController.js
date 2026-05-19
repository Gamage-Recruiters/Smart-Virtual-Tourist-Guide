const Incident = require('../models/Incident');
const logger = require('../utils/logger');

// @desc    Report a new incident
// @route   POST /api/safety/incidents
// @access  Public (or semi-private for Tourists)
exports.createIncident = async (req, res, next) => {
  try {
    logger.info('Creating incident with body:', req.body);
    logger.info('Files received:', req.files?.length || 0);

    const sequence = (await Incident.countDocuments()) + 1;
    
    // Process uploaded images
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        // Store the secure Cloudinary URL
        imageUrls.push(file.path);
      });
    }
    
    // Extract and validate location
    const lat = parseFloat(req.body['location[lat]'] || req.body.location?.lat);
    const lng = parseFloat(req.body['location[lng]'] || req.body.location?.lng);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Invalid location coordinates');
    }

    const incidentData = {
      reporterName: req.body.reporterName?.trim(),
      contactNumber: req.body.contactNumber?.trim(),
      incidentCategory: req.body.incidentCategory,
      incidentDate: req.body.incidentDate,
      incidentTime: req.body.incidentTime,
      district: req.body.district,
      location: {
        lat,
        lng,
      },
      images: imageUrls,
      touristId: req.body.touristId || 'Tourist_123',
      referenceNumber:
        req.body.referenceNumber ||
        `SRL-${new Date().getFullYear()}-${String(sequence).padStart(4, '0')}`,
    };

    logger.info('Creating incident with data:', incidentData);
    const incident = await Incident.create(incidentData);
    
    res.status(201).json({ 
      success: true, 
      data: incident,
      referenceNumber: incident.referenceNumber 
    });
  } catch (error) {
    logger.error('Error reporting incident:', error);
    next(error);
  }
};

// @desc    Get all incidents (with optional filters)
// @route   GET /api/safety/incidents
// @access  Private (Admin/Safety Manager)
exports.getIncidents = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.type) query.type = req.query.type;
    if (req.query.touristId) query.touristId = req.query.touristId;

    const incidents = await Incident.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: incidents.length, data: incidents });
  } catch (error) {
    logger.error('Error fetching incidents:', error);
    next(error);
  }
};

// @desc    Get all incidents for public display (limited fields, no contact info)
// @route   GET /api/safety/incidents/public
// @access  Public
exports.getPublicIncidents = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.incidentCategory) query.incidentCategory = req.query.incidentCategory;
    if (req.query.district) query.district = req.query.district;

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) query.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) query.createdAt.$lte = new Date(req.query.endDate);
    }

    // Select only public-safe fields (exclude contact info)
    const incidents = await Incident.find(query)
      .select('-contactNumber -touristId')
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 100);

    res.status(200).json({ success: true, count: incidents.length, data: incidents });
  } catch (error) {
    logger.error('Error fetching public incidents:', error);
    next(error);
  }
};

// @desc    Get single incident
// @route   GET /api/safety/incidents/:id
// @access  Private
exports.getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    res.status(200).json({ success: true, data: incident });
  } catch (error) {
    logger.error('Error fetching incident:', error);
    next(error);
  }
};

// @desc    Update incident status
// @route   PUT /api/safety/incidents/:id
// @access  Private (Admin/Safety Manager)
exports.updateIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    res.status(200).json({ success: true, data: incident });
  } catch (error) {
    logger.error('Error updating incident:', error);
    next(error);
  }
};

// @desc    Delete incident
// @route   DELETE /api/safety/incidents/:id
// @access  Private (Admin/Safety Manager/Tourist)
exports.deleteIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    logger.error('Error deleting incident:', error);
    next(error);
  }
};
