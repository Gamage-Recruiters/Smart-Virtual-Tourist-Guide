import { isPastDate } from './guideFormatters'

export const DESCRIPTION_MAX_LENGTH = 600
export const LONG_TEXT_MAX_LENGTH = 1000
export const LOCATION_MAX_LENGTH = 160

export const initialGuideRequest = {
  startLocation: '',
  destination: '',
  stops: '',
  startDate: '',
  endDate: '',
  startTime: '08:00',
  adults: '1',
  children: '0',
  pickupLocation: '',
  dropoffLocation: '',
  preferredLanguage: 'English',
  additionalLanguages: '',
  specialities: [],
  femaleGuidePreference: false,
  minExperience: '',
  minRating: '',
  minBudget: '',
  maxBudget: '',
  currency: 'LKR',
  description: '',
  specialRequirements: '',
  accessibilityNeeds: '',
  contactPreference: 'In-app messages',
}

export const validateGuideRequest = (values) => {
  const errors = {}
  const adults = Number(values.adults)
  const children = Number(values.children)
  const minBudget = values.minBudget === '' ? null : Number(values.minBudget)
  const maxBudget = Number(values.maxBudget)
  const minExperience = values.minExperience === '' ? null : Number(values.minExperience)
  const minRating = values.minRating === '' ? null : Number(values.minRating)
  const stops = values.stops.split(',').map((value) => value.trim()).filter(Boolean)
  const additionalLanguages = values.additionalLanguages.split(',').map((value) => value.trim()).filter(Boolean)

  if (!values.startLocation?.trim()) errors.startLocation = 'Starting location is required.'
  else if (values.startLocation.trim().length > LOCATION_MAX_LENGTH) errors.startLocation = `Starting location must be ${LOCATION_MAX_LENGTH} characters or fewer.`
  if (!values.destination?.trim()) errors.destination = 'Main destination is required.'
  else if (values.destination.trim().length > LOCATION_MAX_LENGTH) errors.destination = `Destination must be ${LOCATION_MAX_LENGTH} characters or fewer.`
  if (stops.length > 20 || stops.some((value) => value.length > LOCATION_MAX_LENGTH)) errors.stops = 'Use at most 20 stops, each 160 characters or fewer.'
  if (values.pickupLocation.length > LOCATION_MAX_LENGTH) errors.pickupLocation = `Pickup location must be ${LOCATION_MAX_LENGTH} characters or fewer.`
  if (values.dropoffLocation.length > LOCATION_MAX_LENGTH) errors.dropoffLocation = `Drop-off location must be ${LOCATION_MAX_LENGTH} characters or fewer.`
  if (additionalLanguages.length > 19 || additionalLanguages.some((value) => value.length > 60)) errors.additionalLanguages = 'Use at most 19 additional languages, each 60 characters or fewer.'
  if (!values.startDate) errors.startDate = 'Start date is required.'
  else if (isPastDate(values.startDate)) errors.startDate = 'Start date cannot be in the past.'
  if (!values.endDate) errors.endDate = 'End date is required.'
  else if (isPastDate(values.endDate)) errors.endDate = 'End date cannot be in the past.'
  else if (values.startDate && values.endDate < values.startDate) {
    errors.endDate = 'End date cannot be before the start date.'
  }
  if (!Number.isInteger(adults) || adults < 1 || adults > 100) errors.adults = 'Adults must be a whole number between 1 and 100.'
  if (!Number.isInteger(children) || children < 0 || children > 100) errors.children = 'Children must be a whole number between 0 and 100.'
  if (minExperience !== null && (!Number.isFinite(minExperience) || minExperience < 0 || minExperience > 80)) errors.minExperience = 'Experience must be between 0 and 80 years.'
  if (minRating !== null && (!Number.isFinite(minRating) || minRating < 0 || minRating > 5)) errors.minRating = 'Rating must be between 0 and 5.'
  if (!Number.isFinite(maxBudget) || maxBudget <= 0) {
    errors.maxBudget = 'Maximum budget must be greater than zero.'
  }
  if (minBudget !== null && (!Number.isFinite(minBudget) || minBudget < 0)) {
    errors.minBudget = 'Minimum budget cannot be negative.'
  } else if (minBudget !== null && Number.isFinite(maxBudget) && minBudget > maxBudget) {
    errors.minBudget = 'Minimum budget cannot exceed maximum budget.'
  }
  if ((values.description?.length || 0) > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`
  }
  if (values.specialRequirements.length > LONG_TEXT_MAX_LENGTH) errors.specialRequirements = `Special requirements must be ${LONG_TEXT_MAX_LENGTH} characters or fewer.`
  if (values.accessibilityNeeds.length > LONG_TEXT_MAX_LENGTH) errors.accessibilityNeeds = `Accessibility needs must be ${LONG_TEXT_MAX_LENGTH} characters or fewer.`

  return errors
}

export const normalizeGuideRequest = (values) => ({
  startLocation: values.startLocation.trim(),
  destination: values.destination.trim(),
  stops: values.stops
    .split(',')
    .map((stop) => stop.trim())
    .filter(Boolean),
  startDate: values.startDate,
  endDate: values.endDate,
  startTime: values.startTime,
  adults: Number(values.adults),
  children: Number(values.children),
  pickupLocation: values.pickupLocation.trim(),
  dropoffLocation: values.dropoffLocation.trim(),
  languages: [values.preferredLanguage, ...values.additionalLanguages.split(',')]
    .map((language) => language.trim())
    .filter(Boolean),
  specialities: [...values.specialities],
  femaleGuidePreference: Boolean(values.femaleGuidePreference),
  minExperience: values.minExperience === '' ? null : Number(values.minExperience),
  minRating: values.minRating === '' ? null : Number(values.minRating),
  minBudget: values.minBudget === '' ? null : Number(values.minBudget),
  maxBudget: Number(values.maxBudget),
  currency: values.currency || 'LKR',
  description: values.description.trim(),
  specialRequirements: values.specialRequirements.trim(),
  accessibilityNeeds: values.accessibilityNeeds.trim(),
  contactPreference: values.contactPreference,
})
