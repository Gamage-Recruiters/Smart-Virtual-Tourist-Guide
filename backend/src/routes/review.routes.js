// BACKEND/src/routes/review.routes.js
import express from 'express';

// Import controller functions using named imports and .js extension
import { 
    createReview, 
    getProviderReviews, 
    reportReview, 
    markHelpful, 
    deleteReview 
} from '../controllers/review.controller.js';

// Import Joi validation middleware
import { validateReview } from '../validators/review.validator.js';

const router = express.Router();

/**  
 * @todo: Import the authentication middleware here later.
 * Example: import { protect } from '../middleware/auth.middleware.js';
 * Aysha (Authentication & Identity Management module) will provide the exact middleware function name.
 */

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private (Needs auth middleware to ensure only logged-in users can post)
 * @note    validateReview is executed first to ensure the payload is correct.
 */
router.post('/', validateReview, createReview);

/**
 * @route   GET /api/reviews/provider/:targetType/:targetProviderId
 * @desc    Get all reviews and statistical data for a specific service provider
 * @access  Public
 */
router.get('/provider/:targetType/:targetProviderId', getProviderReviews);

/**
 * @route   PATCH /api/reviews/:id/report
 * @desc    Report a specific review for spam or inappropriate content
 * @access  Private
 */
router.patch('/:id/report', reportReview);

/**
 * @route   PATCH /api/reviews/:id/helpful
 * @desc    Mark a review as helpful or unhelpful (👍/👎)
 * @access  Private
 */
router.patch('/:id/helpful', markHelpful);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a specific review (By the review author or Admin)
 * @access  Private
 */
router.delete('/:id', deleteReview);

export default router;