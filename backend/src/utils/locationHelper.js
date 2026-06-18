const Region = require("../models/Region");
const logger = require("../utils/logger");

/**
 * Location Helper
 * 
 * Description:
 * This function takes latitude and longitude coordinates and finds the corresponding
 * administrative division and district using our local MongoDB geographic data.
 */
async function getRegionFromCoords(lat, lng) {
  try {
    // 1. Convert the incoming string coordinates into decimal numbers (floats)
    const nLat = parseFloat(lat);
    const nLng = parseFloat(lng);

    // 2. Validate the coordinates to ensure they are actual numbers
    if (isNaN(nLat) || isNaN(nLng)) {
      logger.warn(`⚠️ Invalid coordinates provided: lat=${lat}, lng=${lng}`);
      return null;
    }

    // 3. Search the database using MongoDB's spatial query ($geoIntersects)
    // It checks if the user's exact Point falls inside any Region Polygon.
    // .lean() is used to return a plain JavaScript object instead of a Mongoose document, which makes the query much faster.
    const foundRegion = await Region.findOne({
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            // Important: GeoJSON always expects coordinates in [Longitude, Latitude] order
            coordinates: [nLng, nLat],
          },
        },
      },
    }).lean();

    // 4. If a matching region is found, return its specific division and district names
    if (foundRegion) {
      return {
        division: foundRegion.name,
        district: foundRegion.district,
      };
    }

    // 5. If the location is outside our mapped areas (e.g., in the ocean), return a safe default value
    // This prevents the system from crashing when trying to read division/district properties later
    return {
      division: "Unknown",
      district: "Sri Lanka",
    };
  } catch (error) {
    // Catch any database or execution errors and log them
    logger.error(` Local Geo-fencing failure: ${error.message}`);
    return null;
  }
}

module.exports = {
  getRegionFromCoords,
};