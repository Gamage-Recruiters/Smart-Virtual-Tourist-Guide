// BACKEND/src/services/review.service.js
import Review from '../models/Review.model.js'; // Added .js extension

/**
 * Service to save a new review into the database.
 * 
 * @param {Object} reviewData - The data payload for the new review.
 * @returns {Promise<Object>} - The newly saved review document.
 */
export const createReviewService = async (reviewData) => {
    const newReview = new Review(reviewData);
    return await newReview.save();
};

/**
 * Service to fetch all reviews for a specific provider.
 * 
 * @param {String} targetType - The type of the service provider (e.g., 'Driver', 'Hotel', 'Guide').
 * @param {String} targetProviderId - The unique identifier of the service provider.
 * @returns {Promise<Array>} - An array of review documents sorted by the newest first.
 */
export const getReviewsByProviderService = async (targetType, targetProviderId) => {
    return await Review.find({ targetProviderId, targetType })
                       .sort({ createdAt: -1 }); // TODO: Add .populate('touristId') when User model is ready
};

/**
 * Service to delete a specific review from the database.
 * 
 * @param {String} reviewId - The unique identifier of the review to delete.
 * @returns {Promise<Object|null>} - The deleted review document, or null if not found.
 */
export const deleteReviewService = async (reviewId) => {
    return await Review.findByIdAndDelete(reviewId);
};