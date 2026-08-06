const VALID_CATEGORIES = [
  'Cultural',
  'Adventure',
  'Wildlife',
  'Culinary',
  'Beach & Relax',
  'Historical',
  'Nature & Trekking',
];

const VALID_DESTINATIONS = [
  'Sigiriya',
  'Ella',
  'Kandy',
  'Galle',
  'Nuwara Eliya',
  'Yala',
  'Colombo',
  'Mirissa',
  'Polonnaruwa',
  'Dambulla',
];

const VALID_DURATION_UNITS = ['Days', 'Hours', 'Half Day'];

/**
 * Validates a package payload prior to draft creation or update
 */
export const validateDraftPackage = (req, res, next) => {
  const errors = [];
  const { packageName, pricePerPerson, durationValue, category, primaryDestination } = req.body;

  if (packageName !== undefined && packageName !== null && packageName !== '') {
    if (typeof packageName !== 'string' || packageName.trim().length < 5) {
      errors.push({ field: 'packageName', message: 'Package Name must be at least 5 characters long' });
    }
  }

  if (category !== undefined && category !== null && category !== '') {
    if (!VALID_CATEGORIES.includes(category)) {
      errors.push({ field: 'category', message: 'Invalid category value' });
    }
  }

  if (primaryDestination !== undefined && primaryDestination !== null && primaryDestination !== '') {
    if (!VALID_DESTINATIONS.includes(primaryDestination)) {
      errors.push({ field: 'primaryDestination', message: 'Invalid primary destination value' });
    }
  }

  if (pricePerPerson !== undefined && pricePerPerson !== null && pricePerPerson !== '') {
    const price = Number(pricePerPerson);
    if (isNaN(price) || price < 0) {
      errors.push({ field: 'pricePerPerson', message: 'Price per person must be a non-negative number' });
    }
  }

  if (durationValue !== undefined && durationValue !== null && durationValue !== '') {
    const dur = Number(durationValue);
    if (isNaN(dur) || dur < 1) {
      errors.push({ field: 'durationValue', message: 'Duration value must be at least 1' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

/**
 * Validates full package readiness for publishing
 */
export const validatePublishPackage = (req, res, next) => {
  const errors = [];
  const {
    packageName,
    category,
    primaryDestination,
    pricePerPerson,
    durationValue,
    durationUnit,
    routeStops,
    photos,
  } = req.body;

  if (!packageName || typeof packageName !== 'string' || !packageName.trim()) {
    errors.push({ field: 'packageName', message: 'Package Name is required' });
  } else if (packageName.trim().length < 5) {
    errors.push({ field: 'packageName', message: 'Package Name must be at least 5 characters long' });
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    errors.push({ field: 'category', message: 'Please select a valid Category' });
  }

  if (!primaryDestination || !VALID_DESTINATIONS.includes(primaryDestination)) {
    errors.push({ field: 'primaryDestination', message: 'Please select a valid Primary Destination' });
  }

  if (pricePerPerson === undefined || pricePerPerson === null || pricePerPerson === '') {
    errors.push({ field: 'pricePerPerson', message: 'Price per person is required' });
  } else {
    const price = Number(pricePerPerson);
    if (isNaN(price) || price < 0) {
      errors.push({ field: 'pricePerPerson', message: 'Price per person must be a non-negative number' });
    }
  }

  if (durationValue === undefined || durationValue === null || durationValue === '') {
    errors.push({ field: 'durationValue', message: 'Duration value is required' });
  } else {
    const dur = Number(durationValue);
    if (isNaN(dur) || dur < 1) {
      errors.push({ field: 'durationValue', message: 'Duration value must be at least 1' });
    }
  }

  if (!durationUnit || !VALID_DURATION_UNITS.includes(durationUnit)) {
    errors.push({ field: 'durationUnit', message: 'Please select a valid Duration Unit' });
  }

  if (routeStops !== undefined) {
    if (!Array.isArray(routeStops) || routeStops.length === 0) {
      errors.push({ field: 'routeStops', message: 'At least 1 route stop is required to publish' });
    }
  }

  if (photos !== undefined) {
    if (!Array.isArray(photos) || photos.length === 0) {
      errors.push({ field: 'photos', message: 'At least 1 photo is required to publish' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};
