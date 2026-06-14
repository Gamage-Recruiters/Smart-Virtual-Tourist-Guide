
/**
 * Defines the allowed target types for reviews
 * This prevents typos when saving to the database
 */
const PROVIDER_TYPES = ['Driver', 'Hotel', 'Vehicle', 'Activity', 'Restaurant'];

/**
 * Defines the allowed reasons for reporting a review
 */
const REPORT_REASONS = ['Spam', 'Inappropriate Language', 'False Information', 'Other'];

module.exports = {
    PROVIDER_TYPES,
    REPORT_REASONS
};