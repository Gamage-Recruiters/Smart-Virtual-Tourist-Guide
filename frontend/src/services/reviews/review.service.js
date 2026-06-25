import axios from 'axios';

/**
 * Base URL for the reviews API.
 * Uses Vite's environment variable from the .env file.
 * Make sure VITE_API_URL is defined in your root .env file.
 */
const API_URL = `${import.meta.env.VITE_API_URL}/reviews`;

/**
 * Submits a new review to the database.
 * 
 * @param {Object} reviewData - The review details (touristId, targetProviderId, rating, reviewText, etc.)
 * @returns {Promise<Object>} The API response data.
 */
export const submitReview = async (reviewData) => {
    try {
        const response = await axios.post(API_URL, reviewData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Fetches all reviews and statistics for a specific service provider.
 * 
 * @param {String} targetType - The type of provider (e.g., 'Driver', 'Hotel', 'Vehicle').
 * @param {String} targetProviderId - The unique ID of the provider.
 * @returns {Promise<Object>} The API response data containing reviews and stats.
 */
export const getProviderReviews = async (targetType, targetProviderId) => {
    try {
        const response = await axios.get(`${API_URL}/provider/${targetType}/${targetProviderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Reports a specific review to the admins.
 * 
 * @param {String} reviewId - The unique ID of the review.
 * @param {String} reportReason - The reason for reporting (e.g., 'Spam').
 * @returns {Promise<Object>} The API response data.
 */
export const reportReview = async (reviewId, reportReason) => {
    try {
        const response = await axios.patch(`${API_URL}/${reviewId}/report`, { reportReason });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Marks a review as helpful or unhelpful.
 * 
 * @param {String} reviewId - The unique ID of the review.
 * @param {Boolean} isHelpful - True if helpful (👍), False if unhelpful (👎).
 * @returns {Promise<Object>} The API response data.
 */
export const markReviewHelpful = async (reviewId, isHelpful) => {
    try {
        const response = await axios.patch(`${API_URL}/${reviewId}/helpful`, { isHelpful });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};