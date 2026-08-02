// BACKEND/src/routes/review.routes.js
import express from 'express';

// Import our controller functions
import { 
    createReview, 
    getProviderReviews, 
    reportReview, 
    markHelpful, 
    deleteReview 
} from '../controllers/review.controller.js';

// Import our Joi Validator
import { validateReview } from '../validators/review.validator.js';

// Import the authentication middleware 
// Ensure the path and file name perfectly match the actual auth middleware file
import { protect } from '../middleware/auth.middleware.js'; 

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private
 * @note    The 'protect' middleware ensures the user is authenticated before payload validation and review creation.
 */
router.post('/', protect, validateReview, createReview);

/**
 * @route   GET /api/reviews/provider/:targetType/:targetProviderId
 * @desc    Get all reviews and statistical data for a specific provider
 * @access  Public
 */
router.get('/provider/:targetType/:targetProviderId', getProviderReviews);

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