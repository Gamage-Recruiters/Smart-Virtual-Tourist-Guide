import mongoose from 'mongoose';
import Incident from '../models/Incident.js';
import logger from '../utils/logger.js';

// @desc    Report a new incident
// @route   POST /api/safety/incidents
// @access  Public (or semi-private for Tourists)
export const createIncident = async (req, res, next) => {
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
      touristId: req.user?._id || req.body.touristId,
      tripId: req.body.tripId || req.body.travelId,
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
export const getIncidents = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.type) query.type = req.query.type;
    if (req.query.touristId) query.touristId = req.query.touristId;
    if (req.query.tripId || req.query.travelId || req.query.tripID) {
      query.tripId = req.query.tripId || req.query.travelId || req.query.tripID;
    }

    let queryBuilder = Incident.find(query).sort({ createdAt: -1 });
    if (mongoose.models.User) {
      queryBuilder = queryBuilder.populate('touristId', 'fullName email country');
    }
    const incidents = await queryBuilder;
    res.status(200).json({ success: true, count: incidents.length, data: incidents });
  } catch (error) {
    logger.error('Error fetching incidents:', error);
    next(error);
  }
};

// @desc    Get all incidents for public display (limited fields, no contact info)
// @route   GET /api/safety/incidents/public
// @access  Public
export const getPublicIncidents = async (req, res, next) => {
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

// @desc    Get count of incidents (optionally filtered by touristId)
// @route   GET /api/safety/incidents/count
// @access  Private (Report Generator/Tourist)
export const getIncidentCount = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.touristId) query.touristId = req.query.touristId;
    if (req.query.tripId || req.query.travelId || req.query.tripID) {
      query.tripId = req.query.tripId || req.query.travelId || req.query.tripID;
    }
    if (req.query.status) query.status = req.query.status;
    if (req.query.incidentCategory) query.incidentCategory = req.query.incidentCategory;

    // Date range filter for the trip duration
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) query.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) query.createdAt.$lte = new Date(req.query.endDate);
    }

    const count = await Incident.countDocuments(query);
    
    res.status(200).json({ success: true, count });
  } catch (error) {
    logger.error('Error fetching incident count:', error);
    next(error);
  }
};

// @desc    Get single incident
// @route   GET /api/safety/incidents/:id
// @access  Private
export const getIncidentById = async (req, res, next) => {
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
export const updateIncident = async (req, res, next) => {
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
export const deleteIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    // Prevent deletion if the incident is already being processed (not in 'reported' status)
    // Note: Once auth is fully integrated, you may want to bypass this check for Admin users
    if (incident.status !== 'reported') {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot delete this incident as it is already being processed or resolved.' 
      });
    }

    await incident.deleteOne();
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    logger.error('Error deleting incident:', error);
    next(error);
  }
};
