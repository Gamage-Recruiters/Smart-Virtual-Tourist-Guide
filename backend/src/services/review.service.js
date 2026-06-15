// BACKEND/src/services/review.service.js
const Review = require('../models/Review.model');

/**
 * Service to save a new review into the database
 */
const createReviewService = async (reviewData) => {
    const newReview = new Review(reviewData);
    return await newReview.save();
};

/**
 * Service to fetch all reviews for a specific provider
 */
const getReviewsByProviderService = async (targetType, targetProviderId) => {
    return await Review.find({ targetProviderId, targetType })
                       .sort({ createdAt: -1 }); // We will add .populate() later when User model is ready
};

module.exports = {
    createReviewService,
    getReviewsByProviderService
};