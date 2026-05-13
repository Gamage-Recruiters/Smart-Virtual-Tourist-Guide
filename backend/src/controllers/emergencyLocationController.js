const EmergencyLocation = require('../models/EmergencyLocation');
const logger = require('../utils/logger');

// @desc    Get all Tourist Police stations from the database
// @route   GET /api/safety/emergency-locations/police
// @access  Public
exports.getPoliceStations = async (req, res, next) => {
  try {
    const stations = await EmergencyLocation.find({
      type: 'tourist_police',
      isActive: true,
    }).sort({ district: 1 });

    res.status(200).json({
      success: true,
      count: stations.length,
      data: stations,
    });
  } catch (error) {
    logger.error('Error fetching police stations:', error);
    next(error);
  }
};

// @desc    Get nearby hospitals using Overpass API (OpenStreetMap) — free, no API key
// @route   GET /api/safety/emergency-locations/hospitals?lat=X&lng=Y&radius=5000
// @access  Public
exports.getNearbyHospitals = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    // Convert radius from meters to a bounding box for Overpass API
    // Approximate: 1 degree latitude ≈ 111,320 meters
    const latDelta = radius / 111320;
    const lngDelta = radius / (111320 * Math.cos((lat * Math.PI) / 180));

    const south = parseFloat(lat) - latDelta;
    const north = parseFloat(lat) + latDelta;
    const west = parseFloat(lng) - lngDelta;
    const east = parseFloat(lng) + lngDelta;

    // Overpass QL query to find hospitals within the bounding box
    const overpassQuery = `[out:json][timeout:10];(node["amenity"="hospital"](${south},${west},${north},${east});way["amenity"="hospital"](${south},${west},${north},${east});relation["amenity"="hospital"](${south},${west},${north},${east}););out center body;`;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
    const response = await fetch(overpassUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SmartVirtualTouristGuide/1.0',
      },
    });

    if (!response.ok) {
      logger.error('Overpass API HTTP error:', response.status);
      return res.status(502).json({
        success: false,
        message: `Overpass API error: HTTP ${response.status}`,
      });
    }

    const data = await response.json();

    // Transform Overpass results into a consistent format
    const hospitals = (data.elements || []).map((element) => {
      // For ways/relations, use the 'center' coordinates; for nodes, use lat/lon directly
      const elLat = element.lat || (element.center && element.center.lat);
      const elLng = element.lon || (element.center && element.center.lon);

      return {
        name: element.tags?.name || 'Hospital',
        address: element.tags?.['addr:street']
          ? `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street']}, ${element.tags['addr:city'] || ''}`.trim()
          : element.tags?.['addr:full'] || '',
        location: {
          lat: elLat,
          lng: elLng,
        },
        phone: element.tags?.phone || element.tags?.['contact:phone'] || null,
        website: element.tags?.website || null,
        osmId: element.id,
      };
    }).filter((h) => h.location.lat && h.location.lng); // Filter out entries without valid coordinates

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error) {
    logger.error('Error fetching nearby hospitals:', error);
    next(error);
  }
};

// @desc    Get all emergency locations (with optional type filter)
// @route   GET /api/safety/emergency-locations?type=tourist_police
// @access  Public
exports.getAllLocations = async (req, res, next) => {
  try {
    const query = { isActive: true };
    if (req.query.type) {
      query.type = req.query.type;
    }

    const locations = await EmergencyLocation.find(query).sort({ district: 1 });

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    logger.error('Error fetching emergency locations:', error);
    next(error);
  }
};

// @desc    Create a new emergency location (admin/seed)
// @route   POST /api/safety/emergency-locations
// @access  Private (Admin)
exports.createLocation = async (req, res, next) => {
  try {
    const location = await EmergencyLocation.create(req.body);
    res.status(201).json({ success: true, data: location });
  } catch (error) {
    logger.error('Error creating emergency location:', error);
    next(error);
  }
};

// @desc    Update an emergency location
// @route   PUT /api/safety/emergency-locations/:id
// @access  Private (Admin)
exports.updateLocation = async (req, res, next) => {
  try {
    const location = await EmergencyLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Emergency location not found',
      });
    }

    res.status(200).json({ success: true, data: location });
  } catch (error) {
    logger.error('Error updating emergency location:', error);
    next(error);
  }
};

// @desc    Delete an emergency location
// @route   DELETE /api/safety/emergency-locations/:id
// @access  Private (Admin)
exports.deleteLocation = async (req, res, next) => {
  try {
    const location = await EmergencyLocation.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Emergency location not found',
      });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    logger.error('Error deleting emergency location:', error);
    next(error);
  }
};
