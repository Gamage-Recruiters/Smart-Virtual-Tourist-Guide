// BACKEND/src/controllers/review.controller.js
import { createReviewService, getReviewsByProviderService, deleteReviewService } from '../services/review.service.js';
import { calculateRatingStats , calculateBatchRatings } from '../utils/rating.util.js';
import Review from '../models/Review.model.js'; 

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private (Authenticated users only)
 */
export const createReview = async (req, res) => {
    try {
        // Retrieve the authenticated user's ID securely from the request object.
        // This is populated by the authentication middleware (e.g., Aysha's 'protect' guard).
        const touristId = req.user._id;

        // Construct the final review payload by combining the authenticated ID with the request body.
        // This prevents malicious users from spoofing the 'touristId' in the frontend payload.
        const reviewData = {
            ...req.body,
            touristId: touristId
        };
        
        // Delegate the database save operation to the service layer
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
 * @desc    Get reviews and statistical data for a specific service provider
 * @route   GET /api/reviews/provider/:targetType/:targetProviderId
 * @access  Public
 */
export const getProviderReviews = async (req, res) => {
    try {
        const { targetType, targetProviderId } = req.params;
        
        // Fetch raw review documents via the service layer
        const reviews = await getReviewsByProviderService(targetType, targetProviderId);
        
        // Compute the overall average rating and star distribution percentages
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
 * @desc    Report a review for spam or inappropriate content
 * @route   PATCH /api/reviews/:id/report
 * @access  Private
 */
export const reportReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { reportReason } = req.body;

        // Update the document to flag it for admin review
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
            message: 'Review reported successfully. Admins will verify it.', 
            data: updatedReview 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Increment the helpful or unhelpful counter of a review (👍 / 👎)
 * @route   PATCH /api/reviews/:id/helpful
 * @access  Private
 */
export const markHelpful = async (req, res) => {
    try {
        const { id } = req.params;
        const { isHelpful } = req.body; 

        // Dynamically choose which counter to increment based on the boolean flag
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
 * @desc    Delete a specific review 
 * @route   DELETE /api/reviews/:id
 * @access  Private (Currently accessible to the author; should be restricted to Admins eventually)
 */
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedReview = await deleteReviewService(id);
        
        if (!deletedReview) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};



/**
 * @desc    Get average ratings for multiple providers at once (Batch)
 * @route   POST /api/reviews/batch-ratings
 * @access  Public
 */
export const getBatchProviderRatings = async (req, res) => {
    try {
        const { targetType, providerIds } = req.body;

        if (!targetType || !providerIds || !Array.isArray(providerIds)) {
            return res.status(400).json({ success: false, message: 'targetType and providerIds (array) are required' });
        }

        // Database eken e IDs okkotama adala reviews eka paara gannawa (Performance optimized!)
        const allReviews = await Review.find({ 
            targetType: targetType, 
            targetProviderId: { $in: providerIds } 
        });

        // Util eka haraha eka eka guide ta adala average rating eka calculate karanawa
        const batchResults = calculateBatchRatings(allReviews, providerIds);

        res.status(200).json({
            success: true,
            data: batchResults
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};



/**
 * @desc    Add a reply to a review (By Service Provider)
 * @route   PATCH /api/reviews/:id/reply
 * @access  Private (Provider only)
 */
export const replyToReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { replyText } = req.body;

        if (!replyText) {
            return res.status(400).json({ success: false, message: 'Reply text is required' });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { 
                providerReply: {
                    text: replyText,
                    repliedAt: new Date()
                } 
            },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Replied to review successfully.', 
            data: updatedReview 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};