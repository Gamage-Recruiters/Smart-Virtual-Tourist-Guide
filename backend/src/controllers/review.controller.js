const Review = require('../models/Review');

/**
 * @desc    Create a new review for a service provider
 * @route   POST /api/reviews
 * @access  Private (Only logged-in tourists can review)
 */

const createReview = async (req, res) => {
    try {
        const { touristId, targetProviderId, targetType, rating, reviewText } = req.body;

        // Create and save the new review to the database
        const newReview = new Review({
            touristId,
            targetProviderId,
            targetType,
            rating,
            reviewText
        });

        const savedReview = await newReview.save();

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
 * @desc    Get all reviews and calculate the overall rating for a specific provider
 * @route   GET /api/reviews/provider/:targetType/:targetProviderId
 * @access  Public
 */
const getProviderReviews = async (req, res) => {
    try {
        const { targetType, targetProviderId } = req.params;

        // Fetch all reviews for this specific provider
        // populate('touristId') will fetch the actual tourist name from the User collection
        const reviews = await Review.find({ targetProviderId, targetType })
                                    .populate('touristId', 'name country') // Assuming User model has name & country
                                    .sort({ createdAt: -1 }); // Sort by newest first

        // Calculate overall rating and star distribution for the UI progress bars
        let totalRating = 0;
        let starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        reviews.forEach(review => {
            totalRating += review.rating;
            starCounts[review.rating] += 1;
        });

        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        res.status(200).json({
            success: true,
            data: {
                reviews,
                totalReviews: reviews.length,
                averageRating,
                starCounts // This will be used for the progress bars in the View Ratings UI
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
        const { reportReason } = req.body; // e.g., 'Spam', 'Inappropriate Language'

        // Update the review status to reported
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
            message: 'Review reported successfully. Admins will review it.',
            data: updatedReview
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Increment the helpful/unhelpful count 
 * @route   PATCH /api/reviews/:id/helpful
 * @access  Private
 */
const markHelpful = async (req, res) => {
    try {
        const { id } = req.params;
        const { isHelpful } = req.body; // Boolean: true for false

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