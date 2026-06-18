const reviewService = require('../services/review.service');
const { calculateRatingStats } = require('../utils/rating.util');
const Review = require('../models/Review'); 

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = async (req, res) => {
    try {
        const reviewData = req.body;
        const savedReview = await reviewService.createReviewService(reviewData);

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: savedReview
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Get reviews and stats for a specific provider
 * @route   GET /api/reviews/provider/:targetType/:targetProviderId
 * @access  Public
 */
const getProviderReviews = async (req, res) => {
    try {
        const { targetType, targetProviderId } = req.params;

        // Service eken reviews gannawa
        const reviews = await reviewService.getReviewsByProviderService(targetType, targetProviderId);

        // Util eken calculations tika karanawa (Average & Star Counts)
        const stats = calculateRatingStats(reviews);

        res.status(200).json({
            success: true,
            data: {
                reviews,
                stats
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Report a review (from the 'Report Review' modal in UI)
 * @route   PATCH /api/reviews/:id/report
 * @access  Private
 */
const reportReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { reportReason } = req.body;

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { isReported: true, reportReason: reportReason },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Review reported successfully.',
            data: updatedReview
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Increment the helpful/unhelpful count (Was this helpful? 👍 👎)
 * @route   PATCH /api/reviews/:id/helpful
 * @access  Private
 */
const markHelpful = async (req, res) => {
    try {
        const { id } = req.params;
        const { isHelpful } = req.body; // true for 👍, false for 👎

        const updateQuery = isHelpful 
            ? { $inc: { helpfulCount: 1 } } 
            : { $inc: { unhelpfulCount: 1 } };

        const updatedReview = await Review.findByIdAndUpdate(id, updateQuery, { new: true });

        res.status(200).json({ success: true, data: updatedReview });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createReview,
    getProviderReviews,
    reportReview,
    markHelpful
};