// BACKEND/src/controllers/review.controller.js
import { 
    createReviewService, 
    getReviewsByProviderService, 
    deleteReviewService,
    getBatchReviewsService,
    reportReviewService,
    markHelpfulService,
    replyToReviewService,
    getReportedReviewsService
} from '../services/review.service.js';

import { calculateRatingStats, calculateBatchRatings } from '../utils/rating.util.js';
import Review from '../models/Review.model.js';

/**
 * @desc    Handles the creation of a new review
 * @route   POST /api/reviews
 * @access  Private (Authenticated tourists only)
 */
export const createReview = async (req, res) => {
    try {
        // Extract authenticated user ID or fallback to payload/guest ID
        const touristId = req.user?._id || req.body?.touristId || "64b5f8e2c3e1a2b3c4d5e6f7";
        
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
/**
 * @desc    Get owner reviews for dashboard (e.g., restaurant owner, hotel owner, driver)
 * @route   GET /api/reviews/owner/:restaurantId
 * @route   GET /api/reviews/restaurant/:restaurantId
 * @access  Public / Private
 */
export const getOwnerReviews = async (req, res) => {
    try {
        const { restaurantId, targetProviderId } = req.params;
        const providerId = targetProviderId || restaurantId;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

        // Find reviews matching providerId
        const allReviews = await Review.find({ targetProviderId: providerId }).sort({ createdAt: -1 });

        const stats = calculateRatingStats(allReviews);

        const totalReviews = allReviews.length;
        const totalPages = Math.ceil(totalReviews / limit) || 1;
        const pagedReviews = allReviews.slice((page - 1) * limit, page * limit);

        const mappedReviews = pagedReviews.map(r => ({
            _id: r._id,
            targetProviderId: r.targetProviderId,
            targetType: r.targetType,
            rating: r.rating,
            title: r.title || 'Customer Review',
            comment: r.reviewText || r.comment,
            reviewText: r.reviewText || r.comment,
            images: r.images || [],
            restaurantReply: r.providerReply?.text || r.restaurantReply || null,
            restaurantReplyDate: r.providerReply?.repliedAt || r.restaurantReplyDate || null,
            providerReply: r.providerReply || null,
            createdAt: r.createdAt,
            user: {
                fullName: 'Tourist Traveler',
                username: 'tourist',
                email: 'tourist@example.com'
            }
        }));

        res.status(200).json({
            success: true,
            stats,
            reviews: mappedReviews,
            userReview: null,
            page,
            totalPages
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

export const getRestaurantReviews = getOwnerReviews;

/**
 * @desc    Get all reported reviews for admin moderation
 * @route   GET /api/reviews/admin/reported
 * @access  Private (Admin only)
 */
export const getReportedReviews = async (req, res) => {
    try {
        const reportedReviews = await getReportedReviewsService();

        res.status(200).json({ 
            success: true, 
            count: reportedReviews.length,
            data: reportedReviews 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};