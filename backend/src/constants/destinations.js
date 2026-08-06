/**
 * Destination Coordinates Lookup Table
 * Static lat/lng coordinates for top Sri Lankan tourist destinations
 */
export const DESTINATION_COORDINATES = {
  Sigiriya: { lat: 7.9570, lng: 80.7603 },
  Ella: { lat: 6.8667, lng: 81.0466 },
  Kandy: { lat: 7.2906, lng: 80.6337 },
  Galle: { lat: 6.0535, lng: 80.2210 },
  'Nuwara Eliya': { lat: 6.9497, lng: 80.7891 },
  Yala: { lat: 6.3725, lng: 81.5185 },
  Colombo: { lat: 6.9271, lng: 79.8612 },
  Mirissa: { lat: 5.9483, lng: 80.4716 },
  Polonnaruwa: { lat: 7.9403, lng: 81.0188 },
  Dambulla: { lat: 7.8742, lng: 80.6511 },
};

/**
 * Helper to resolve lat/lng coordinates for a destination
 * @param {string} destinationName 
 * @returns {{ lat: number, lng: number }}
 */
export const getDestinationCoordinates = (destinationName) => {
  if (destinationName && DESTINATION_COORDINATES[destinationName]) {
    return DESTINATION_COORDINATES[destinationName];
  }
  // Default to Sigiriya coordinates if unmapped
  return { lat: 7.9570, lng: 80.7603 };
};
