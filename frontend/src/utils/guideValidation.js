import { isPastDate } from './guideFormatters'

export const DESCRIPTION_MAX_LENGTH = 600

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

  if (!values.startLocation?.trim()) errors.startLocation = 'Starting location is required.'
  if (!values.destination?.trim()) errors.destination = 'Main destination is required.'
  if (!values.startDate) errors.startDate = 'Start date is required.'
  else if (isPastDate(values.startDate)) errors.startDate = 'Start date cannot be in the past.'
  if (!values.endDate) errors.endDate = 'End date is required.'
  else if (isPastDate(values.endDate)) errors.endDate = 'End date cannot be in the past.'
  else if (values.startDate && values.endDate < values.startDate) {
    errors.endDate = 'End date cannot be before the start date.'
  }
  if (!Number.isInteger(adults) || adults < 1) errors.adults = 'At least one adult is required.'
  if (!Number.isInteger(children) || children < 0) errors.children = 'Children cannot be negative.'
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
