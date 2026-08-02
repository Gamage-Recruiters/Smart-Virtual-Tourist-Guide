// BACKEND/src/controllers/review.controller.js
import { createReviewService, getReviewsByProviderService, deleteReviewService } from '../services/review.service.js';
import { calculateRatingStats } from '../utils/rating.util.js';
import Review from '../models/Review.model.js'; 

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = async (req, res) => {
    try {
        const reviewData = req.body;
        
        // Delegate the review creation logic to the service layer
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
 * @desc    Get reviews and stats for a specific provider
 * @route   GET /api/reviews/provider/:targetType/:targetProviderId
 * @access  Public
 */
export const getProviderReviews = async (req, res) => {
    try {
        const { targetType, targetProviderId } = req.params;

        // Fetch all reviews for the specified provider via the service layer
        const reviews = await getReviewsByProviderService(targetType, targetProviderId);

        // Calculate overall rating and star distribution statistics
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
export const reportReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { reportReason } = req.body;

        // Update the review status to reported and append the reason
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
export const markHelpful = async (req, res) => {
    try {
        const { id } = req.params;
        const { isHelpful } = req.body; // Boolean: true for helpful, false for unhelpful

        // Determine whether to increment the helpful or unhelpful counter
        const updateQuery = isHelpful 
            ? { $inc: { helpfulCount: 1 } } 
            : { $inc: { unhelpfulCount: 1 } };

        const updatedReview = await Review.findByIdAndUpdate(id, updateQuery, { new: true });

        res.status(200).json({ success: true, data: updatedReview });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Delete a review (By User or Admin)
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Handle the deletion via the service layer
        const deletedReview = await deleteReviewService(id);
        
        if (!deletedReview) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};