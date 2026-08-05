import EmergencyLocation from '../models/EmergencyLocation.js';
import logger from '../utils/logger.js';

const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// --- In-Memory Cache for Overpass API ---
const apiCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const getCacheKey = (type, lat, lng, radius) => {
  // Round to 2 decimal places to group queries within ~1km of each other
  const rLat = parseFloat(lat).toFixed(2);
  const rLng = parseFloat(lng).toFixed(2);
  return `${type}_${rLat}_${rLng}_${radius}`;
};
// ----------------------------------------

// @desc    Get all Tourist Police stations from the database
// @route   GET /api/safety/emergency-locations/police
// @access  Public
export const getPoliceStations = async (req, res, next) => {
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
export const getNearbyHospitals = async (req, res, next) => {
  try {
    const { lat, lng, radius = 15000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    // Check cache first
    const cacheKey = getCacheKey('hospital', lat, lng, radius);
    if (apiCache.has(cacheKey)) {
      const cachedData = apiCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < CACHE_TTL_MS) {
        return res.status(200).json({
          success: true,
          count: cachedData.data.length,
          data: cachedData.data,
          isCached: true
        });
      } else {
        apiCache.delete(cacheKey); // Expired
      }
    }

    // Convert radius from meters to a bounding box for Overpass API
    // Approximate: 1 degree latitude ≈ 111,320 meters
    const latDelta = radius / 111320;
    const lngDelta = radius / (111320 * Math.cos((lat * Math.PI) / 180));

    const south = parseFloat(lat) - latDelta;
    const north = parseFloat(lat) + latDelta;
    const west = parseFloat(lng) - lngDelta;
    const east = parseFloat(lng) + lngDelta;

    // Overpass QL query: fetch only human hospitals, exclude veterinary/animal facilities
    const overpassQuery = `[out:json][timeout:30];(node["amenity"="hospital"]["veterinary"!~"yes"]["animal"!~"yes"](${south},${west},${north},${east});way["amenity"="hospital"]["veterinary"!~"yes"]["animal"!~"yes"](${south},${west},${north},${east});relation["amenity"="hospital"]["veterinary"!~"yes"]["animal"!~"yes"](${south},${west},${north},${east}););out center body;`;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
    const response = await fetch(overpassUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SmartVirtualTouristGuide/1.0',
      },
    });

    if (!response.ok) {
      logger.error('Overpass API HTTP error:', response.status);

      // Fallback: Query database for all hospitals
      const fallbackHospitals = await EmergencyLocation.find({ type: 'hospital', isActive: true });
      const filteredHospitals = fallbackHospitals.filter(h => {
        if (!h.location || !h.location.lat || !h.location.lng) return false;
        return haversineDistance(parseFloat(lat), parseFloat(lng), h.location.lat, h.location.lng) <= radius;
      });
      return res.status(200).json({
        success: true,
        count: filteredHospitals.length,
        data: filteredHospitals,
        isFallback: true
      });
    }

    const data = await response.json();

    // Keywords to exclude veterinary / pet / animal facilities that may slip through
    const excludeKeywords = /\b(veterinary|vet|animal|pet|livestock|cattle|poultry)\b/i;

    // Transform Overpass results into a consistent format
    const hospitals = (data.elements || [])
      .filter((element) => {
        const name = element.tags?.name || '';
        const description = element.tags?.description || '';
        // Exclude if name or description contains veterinary-related keywords
        return !excludeKeywords.test(name) && !excludeKeywords.test(description);
      })
      .map((element) => {
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
      })
      .filter((h) => h.location.lat && h.location.lng); // Filter out entries without valid coordinates

    // Save to cache
    apiCache.set(cacheKey, { timestamp: Date.now(), data: hospitals });

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error) {
    logger.error('Error fetching nearby hospitals (Overpass API failed):', error);

    try {
      // Fallback on Exception
      const fallbackHospitals = await EmergencyLocation.find({ type: 'hospital', isActive: true });
      const filteredHospitals = fallbackHospitals.filter(h => {
        if (!h.location || !h.location.lat || !h.location.lng) return false;
        return haversineDistance(parseFloat(lat), parseFloat(lng), h.location.lat, h.location.lng) <= radius;
      });
      return res.status(200).json({
        success: true,
        count: filteredHospitals.length,
        data: filteredHospitals,
        isFallback: true
      });
    } catch (fallbackError) {
      next(error);
    }
  }
};

// @desc    Get nearby local police stations using Overpass API (OpenStreetMap) — free, no API key
// @route   GET /api/safety/emergency-locations/local-police?lat=X&lng=Y&radius=15000
// @access  Public
export const getNearbyPoliceStations = async (req, res, next) => {
  try {
    const { lat, lng, radius = 15000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    // Check cache first
    const cacheKey = getCacheKey('police', lat, lng, radius);
    if (apiCache.has(cacheKey)) {
      const cachedData = apiCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < CACHE_TTL_MS) {
        return res.status(200).json({
          success: true,
          count: cachedData.data.length,
          data: cachedData.data,
          isCached: true
        });
      } else {
        apiCache.delete(cacheKey); // Expired
      }
    }

    // Convert radius from meters to a bounding box for Overpass API
    const latDelta = radius / 111320;
    const lngDelta = radius / (111320 * Math.cos((lat * Math.PI) / 180));

    const south = parseFloat(lat) - latDelta;
    const north = parseFloat(lat) + latDelta;
    const west = parseFloat(lng) - lngDelta;
    const east = parseFloat(lng) + lngDelta;

    // Overpass QL query: fetch police stations within the bounding box
    const overpassQuery = `[out:json][timeout:30];(node["amenity"="police"](${south},${west},${north},${east});way["amenity"="police"](${south},${west},${north},${east}););out center body;`;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
    const response = await fetch(overpassUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SmartVirtualTouristGuide/1.0',
      },
    });

    if (!response.ok) {
      logger.error('Overpass API HTTP error (police):', response.status);

      // Fallback: Query database for local police stations
      const fallbackPolice = await EmergencyLocation.find({ type: 'local_police', isActive: true });
      const filteredPolice = fallbackPolice.filter(p => {
        if (!p.location || !p.location.lat || !p.location.lng) return false;
        return haversineDistance(parseFloat(lat), parseFloat(lng), p.location.lat, p.location.lng) <= radius;
      });
      return res.status(200).json({
        success: true,
        count: filteredPolice.length,
        data: filteredPolice,
        isFallback: true
      });
    }

    const data = await response.json();

    // Transform Overpass results into a consistent format
    const policeStations = (data.elements || [])
      .map((element) => {
        const elLat = element.lat || (element.center && element.center.lat);
        const elLng = element.lon || (element.center && element.center.lon);

        return {
          name: element.tags?.name || element.tags?.['name:en'] || 'Police Station',
          type: 'local_police',
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
      })
      .filter((s) => s.location.lat && s.location.lng);

    // Save to cache
    apiCache.set(cacheKey, { timestamp: Date.now(), data: policeStations });

    res.status(200).json({
      success: true,
      count: policeStations.length,
      data: policeStations,
    });
  } catch (error) {
    logger.error('Error fetching nearby police stations (Overpass API failed):', error);

    try {
      // Fallback on Exception
      const fallbackPolice = await EmergencyLocation.find({ type: 'local_police', isActive: true });
      const filteredPolice = fallbackPolice.filter(p => {
        if (!p.location || !p.location.lat || !p.location.lng) return false;
        return haversineDistance(parseFloat(lat), parseFloat(lng), p.location.lat, p.location.lng) <= radius;
      });
      return res.status(200).json({
        success: true,
        count: filteredPolice.length,
        data: filteredPolice,
        isFallback: true
      });
    } catch (fallbackError) {
      next(error);
    }
  }
};

// @desc    Get all emergency locations (with optional type filter)
// @route   GET /api/safety/emergency-locations?type=tourist_police
// @access  Public
export const getAllLocations = async (req, res, next) => {
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
export const createLocation = async (req, res, next) => {
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
export const updateLocation = async (req, res, next) => {
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
export const deleteLocation = async (req, res, next) => {
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
