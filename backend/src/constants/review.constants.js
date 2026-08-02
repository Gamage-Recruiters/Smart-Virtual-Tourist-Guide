/**
 * Defines the allowed target types for reviews
 * This prevents typos when saving to the database
 */
export const PROVIDER_TYPES = ['Driver', 'Guide', 'Hotel', 'Vehicle', 'Activity', 'Restaurant'];

/**
 * Defines the allowed reasons for reporting a review
 */
export const REPORT_REASONS = ['Spam', 'Inappropriate Language', 'False Information', 'Other'];