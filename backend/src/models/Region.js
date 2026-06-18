const mongoose = require("mongoose");

/**
 * Region Model
 * 
 * Description:
 * This model stores the geographical boundaries (Polygons) of all divisions and districts in Sri Lanka.
 * It allows the system to instantly find which city a user is in, just by checking their GPS coordinates,
 * without needing any paid third-party APIs like Google Maps.
 */
const regionSchema = new mongoose.Schema({
  // The specific name of the Divisional Secretariat (e.g., "GalleFourGravets", "Panadura")
  name: { type: String, required: true },
  
  // The broader district the division belongs to (e.g., "Galle", "Kalutara")
  district: { type: String, required: true },
  
  // GeoJSON data that defines the exact shape/boundary of the region on the map
  geometry: {
    type: {
      type: String,
      // We only accept Polygon or MultiPolygon shapes for map boundaries
      enum: ["Polygon", "MultiPolygon"],
      required: true,
    },
    coordinates: {
      type: Array, // Holds the list of [longitude, latitude] points that draw the boundary line
      required: true,
    },
  },
});

// --- INDEXES (For Geo-spatial Performance) ---

/**
 * '2dsphere' Index
 * This is the magic that makes location tracking extremely fast.
 * It tells MongoDB to treat the 'geometry' field as a real-world map,
 * allowing us to use operators like $geoIntersects to instantly find if a user's dot (Point) falls inside these boundary shapes.
 */
regionSchema.index({ geometry: "2dsphere" });

module.exports = mongoose.model("Region", regionSchema);