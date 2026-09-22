/**
 * Geo Utilities
 * 
 * Description:
 * Calculates the straight-line distance between two GPS coordinates (in meters).
 * It uses the 'Haversine formula', which accounts for the spherical shape of the Earth.
 * This is highly useful for our Throttling logic to check if a user has moved more than 100 meters.
 */
const calculateDistance = (lat1, lon1, lat2, lng2) => {
  // Radius of the Earth in meters (approx. 6371 kilometers)
  const R = 6371e3;

  // Convert latitudes from degrees to radians (required for trigonometric functions in Math)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;

  // Calculate the differences between the coordinates in radians
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lon1) * Math.PI) / 180;

  // The Haversine formula calculation to find the great-circle distance
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Return the final distance in meters
  return R * c;
};

export default calculateDistance;