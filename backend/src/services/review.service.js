// BACKEND/src/services/review.service.js
import Review from '../models/Review.model.js';

/**
 * Saves a new review document into the database.
 * 
 * @param {Object} reviewData - The payload containing touristId, targetProviderId, rating, etc.
 * @returns {Promise<Object>} - The newly created review document.
 */
export const createReviewService = async (reviewData) => {
    const newReview = new Review(reviewData);
    return await newReview.save();
};

/**
 * Retrieves all reviews associated with a specific service provider.
 * Sorts the results by creation date in descending order (newest first).
 * 
 * @param {String} targetType - The type of the service provider (e.g., 'Hotel', 'Guide').
 * @param {String} targetProviderId - The unique ObjectId of the service provider.
 * @returns {Promise<Array>} - An array of review documents.
 */
export const getReviewsByProviderService = async (targetType, targetProviderId) => {
    // TODO: Add .populate('touristId') to fetch user details when fully integrated with the User model.
    return await Review.find({ targetProviderId, targetType })
                       .sort({ createdAt: -1 }); 
};

/**
 * Retrieves reviews for multiple service providers simultaneously based on their IDs.
 * Used for batch processing to prevent the N+1 query problem.
 * 
 * @param {String} targetType - The type of the service providers (e.g., 'Driver').
 * @param {Array<String>} providerIds - An array of unique provider ObjectIds.
 * @returns {Promise<Array>} - An array of matching review documents.
 */
export const getBatchReviewsService = async (targetType, providerIds) => {
    return await Review.find({ 
        targetType: targetType, 
        targetProviderId: { $in: providerIds } 
    });
};

/**
 * Updates a specific review to flag it as reported and appends the reason.
 * 
 * @param {String} reviewId - The unique ObjectId of the review to be reported.
 * @param {String} reportReason - The reason provided by the user (e.g., 'Spam').
 * @returns {Promise<Object|null>} - The updated review document, or null if not found.
 */
export const reportReviewService = async (reviewId, reportReason) => {
    return await Review.findByIdAndUpdate(
        reviewId,
        { isReported: true, reportReason: reportReason },
        { new: true }
    );
};

/**
 * Increments either the helpful or unhelpful counter on a specific review.
 * 
 * @param {String} reviewId - The unique ObjectId of the review.
 * @param {Boolean} isHelpful - True increments helpfulCount, false increments unhelpfulCount.
 * @returns {Promise<Object|null>} - The updated review document, or null if not found.
 */
export const markHelpfulService = async (reviewId, isHelpful) => {
    const updateQuery = isHelpful 
        ? { $inc: { helpfulCount: 1 } } 
        : { $inc: { unhelpfulCount: 1 } };
        
    return await Review.findByIdAndUpdate(reviewId, updateQuery, { new: true });
};

/**
 * Adds or updates a provider's reply to a specific review.
 * 
 * @param {String} reviewId - The unique ObjectId of the review.
 * @param {String} replyText - The text content of the provider's reply.
 * @returns {Promise<Object|null>} - The updated review document, or null if not found.
 */
export const replyToReviewService = async (reviewId, replyText) => {
    return await Review.findByIdAndUpdate(
        reviewId,
        { 
            providerReply: {
                text: replyText,
                repliedAt: new Date()
            } 
        },
        { new: true }
    );
};

/**
 * Completely removes a review document from the database.
 * 
 * @param {String} reviewId - The unique ObjectId of the review to delete.
 * @returns {Promise<Object|null>} - The deleted review document, or null if not found.
 */
export const deleteReviewService = async (reviewId) => {
    return await Review.findByIdAndDelete(reviewId);
};