export const API_ENDPOINTS = {
  SERVICES: '/services',
  USERS: '/users',
  TOURS: '/tours',
  SAFETY: '/safety',
};

export const EMERGENCY_CONTACTS = [
  { service: 'Police', number: '119', icon: '🚔' },
  { service: 'Ambulance', number: '1990', icon: '🚑' }, // Update matching requirements vs plan
  { service: 'Fire & Rescue', number: '110', icon: '🚒' }, // Plan had conflicting numbers, using common ones from Phase 7 plan
  { service: 'Tourist Police', number: '011-2421451', icon: '🛡️' }, // From Phase 7 plan
  { service: 'Accident Service', number: '011-2691111', icon: '🏥' },
  { service: 'Government Info', number: '1919', icon: 'ℹ️' }
];

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
