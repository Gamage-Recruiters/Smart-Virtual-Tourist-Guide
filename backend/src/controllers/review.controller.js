// BACKEND/src/controllers/review.controller.js
import { 
    createReviewService, 
    getReviewsByProviderService, 
    deleteReviewService,
    getBatchReviewsService,
    reportReviewService,
    markHelpfulService,
    replyToReviewService
} from '../services/review.service.js';

import { calculateRatingStats, calculateBatchRatings } from '../utils/rating.util.js';

/**
 * @desc    Handles the creation of a new review
 * @route   POST /api/reviews
 * @access  Private (Authenticated tourists only)
 */
export const createReview = async (req, res) => {
    try {
        // Extract securely authenticated user ID from the middleware context
        const touristId = req.user._id;
        
        // Construct payload preventing touristId spoofing
        const reviewData = { ...req.body, touristId: touristId };
        
        const savedReview = await createReviewService(reviewData);

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
 * @desc    Retrieves all reviews and computes rating statistics for a provider
 * @route   GET /api/reviews/provider/:targetType/:targetProviderId
 * @access  Public
 */
export const getProviderReviews = async (req, res) => {
    try {
        const { targetType, targetProviderId } = req.params;
        
        const reviews = await getReviewsByProviderService(targetType, targetProviderId);
        const stats = calculateRatingStats(reviews);

        res.status(200).json({ 
            success: true, 
            data: { reviews, stats } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Calculates average ratings for an array of providers simultaneously (Batch Fetching)
 * @route   POST /api/reviews/batch-ratings
 * @access  Public
 */
export const getBatchProviderRatings = async (req, res) => {
    try {
        const { targetType, providerIds } = req.body;

        if (!targetType || !providerIds || !Array.isArray(providerIds)) {
            return res.status(400).json({ success: false, message: 'targetType and providerIds (array) are required' });
        }

        const allReviews = await getBatchReviewsService(targetType, providerIds);
        const batchResults = calculateBatchRatings(allReviews, providerIds);

        res.status(200).json({ success: true, data: batchResults });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Flags a review as reported for administrative action
 * @route   PATCH /api/reviews/:id/report
 * @access  Private
 */
export const reportReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { reportReason } = req.body;

        const updatedReview = await reportReviewService(id, reportReason);

        if (!updatedReview) return res.status(404).json({ success: false, message: 'Review not found' });
        
        res.status(200).json({ success: true, message: 'Review reported successfully.', data: updatedReview });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Increments the helpful or unhelpful counter of a review
 * @route   PATCH /api/reviews/:id/helpful
 * @access  Private
 */
export const markHelpful = async (req, res) => {
    try {
        const { id } = req.params;
        const { isHelpful } = req.body; 

        const updatedReview = await markHelpfulService(id, isHelpful);

        if (!updatedReview) return res.status(404).json({ success: false, message: 'Review not found' });
        
        res.status(200).json({ success: true, data: updatedReview });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Allows a service provider to publicly reply to a review
 * @route   PATCH /api/reviews/:id/reply
 * @access  Private (Should be restricted to the specific provider)
 */
export const replyToReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { replyText } = req.body;

        if (!replyText) return res.status(400).json({ success: false, message: 'Reply text is required' });

        const updatedReview = await replyToReviewService(id, replyText);

        if (!updatedReview) return res.status(404).json({ success: false, message: 'Review not found' });
        
        res.status(200).json({ success: true, message: 'Replied to review successfully.', data: updatedReview });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Permanently deletes a review from the database
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await deleteReviewService(id);
        
        if (!deletedReview) return res.status(404).json({ success: false, message: 'Review not found' });
        
        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};