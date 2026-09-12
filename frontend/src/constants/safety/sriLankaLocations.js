/**
 * Sri Lanka location data for the Safety & Emergency module.
 * Merges district coordinates (from WeatherAlertsPage) and
 * location names (from SecurityAlertsPage) into a single dataset.
 */

// All 25 districts with coordinates
export const SRI_LANKA_DISTRICTS = [
  { name: 'Ampara',        lat: 7.2912, lng: 81.6724 },
  { name: 'Anuradhapura',  lat: 8.3114, lng: 80.4037 },
  { name: 'Badulla',       lat: 6.9847, lng: 81.0565 },
  { name: 'Batticaloa',    lat: 7.7102, lng: 81.6924 },
  { name: 'Colombo',       lat: 6.9271, lng: 79.8612 },
  { name: 'Galle',         lat: 6.0328, lng: 80.2150 },
  { name: 'Gampaha',       lat: 7.0840, lng: 80.0098 },
  { name: 'Hambantota',    lat: 6.1246, lng: 81.1213 },
  { name: 'Jaffna',        lat: 9.6615, lng: 80.0255 },
  { name: 'Kalutara',      lat: 6.5854, lng: 79.9607 },
  { name: 'Kandy',         lat: 7.2906, lng: 80.6337 },
  { name: 'Kegalle',       lat: 7.2513, lng: 80.3464 },
  { name: 'Kilinochchi',   lat: 9.3803, lng: 80.3770 },
  { name: 'Kurunegala',    lat: 7.4818, lng: 80.3609 },
  { name: 'Mannar',        lat: 8.9810, lng: 79.9044 },
  { name: 'Matale',        lat: 7.4675, lng: 80.6234 },
  { name: 'Matara',        lat: 5.9549, lng: 80.5550 },
  { name: 'Monaragala',    lat: 6.8728, lng: 81.3507 },
  { name: 'Mullaitivu',    lat: 9.2671, lng: 80.8142 },
  { name: 'Nuwara Eliya',  lat: 6.9497, lng: 80.7891 },
  { name: 'Polonnaruwa',   lat: 7.9403, lng: 81.0188 },
  { name: 'Puttalam',      lat: 8.0330, lng: 79.8260 },
  { name: 'Ratnapura',     lat: 6.7056, lng: 80.3847 },
  { name: 'Trincomalee',   lat: 8.5874, lng: 81.2152 },
  { name: 'Vavuniya',      lat: 8.7542, lng: 80.4982 },
];

// Popular tourist areas (used by SecurityAlertsPage autocomplete only)
export const TOURIST_SPOTS = [
  'Sigiriya', 'Ella', 'Mirissa', 'Unawatuna', 'Hikkaduwa',
  'Dambulla', 'Negombo', 'Bentota', 'Arugam Bay', 'Tangalle',
  'Horton Plains', 'Yala', 'Udawalawe', 'Wilpattu', 'Pinnawala',
];

// District names only (for dropdowns / iteration)
export const DISTRICT_NAMES = SRI_LANKA_DISTRICTS.map(d => d.name);

// All location names combined (for SecurityAlertsPage autocomplete)
export const ALL_LOCATION_NAMES = [...DISTRICT_NAMES, ...TOURIST_SPOTS];


/**
 * Build a coordinates lookup object keyed by district name.
 * Used by WeatherAlertsPage for its district selector.
 */
export const DISTRICT_COORDINATES_MAP = Object.fromEntries(
  SRI_LANKA_DISTRICTS.map(d => [d.name, { lat: d.lat, lng: d.lng }])
);
