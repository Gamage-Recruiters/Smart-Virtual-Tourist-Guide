// BACKEND/src/routes/review.routes.js
import express from 'express';

// Import our controller functions
import { 
    createReview, 
    getProviderReviews, 
    reportReview, 
    markHelpful, 
    deleteReview,
    getBatchProviderRatings,
    replyToReview,
    getReportedReviews,
    getOwnerReviews,
    getRestaurantReviews
} from '../controllers/review.controller.js';

// Import our Joi Validator
import { validateReview } from '../validators/review.validator.js';

// Import the authentication middleware 
// Ensure the path and file name perfectly match the actual auth middleware file
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Public / Private (Authenticated tourists or guests)
 */
router.post('/', optionalProtect, validateReview, createReview);

/**
 * @route   GET /api/reviews/provider/:targetType/:targetProviderId
 * @desc    Get all reviews and statistical data for a specific provider
 * @access  Public
 */
router.get('/provider/:targetType/:targetProviderId', getProviderReviews);

/**
 * @route   GET /api/reviews/owner/:restaurantId
 * @route   GET /api/reviews/restaurant/:restaurantId
 * @desc    Get owner reviews for dashboard
 * @access  Public / Private
 */
router.get('/owner/:restaurantId', getOwnerReviews);
router.get('/restaurant/:restaurantId', getRestaurantReviews);

/**
 * @route   GET /api/reviews/admin/reported
 * @desc    Get all flagged/reported reviews
 * @access  Private (Admin only)
 */
// TODO: Add authorizeRoles('admin_user') middleware here later
router.get('/admin/reported', protect, getReportedReviews);


/**
 * @route   POST /api/reviews/batch-ratings
 * @desc    Get ratings for multiple providers
 * @access  Public
 */
router.post('/batch-ratings', getBatchProviderRatings);


/**
 * @route   PATCH /api/reviews/:id/reply
 * @route   PUT /api/reviews/:id/reply
 * @desc    Add a reply to a review
 * @access  Public / Private 
 */
router.patch('/:id/reply', replyToReview);
router.put('/:id/reply', replyToReview);



/**
 * @route   PATCH /api/reviews/:id/report
 * @desc    Report a specific review for spam or inappropriate content
 * @access  Private
 */
router.patch('/:id/report', protect, reportReview);

/**
 * @route   PATCH /api/reviews/:id/helpful
 * @desc    Mark a review as helpful or unhelpful (👍/👎)
 * @access  Private
 */
router.patch('/:id/helpful', protect, markHelpful);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a specific review 
 * @access  Private
 * @todo    Consider adding authorizeRoles('Admin') in the future for admin-specific deletions.
 */
router.delete('/:id', protect, deleteReview);

export default router;