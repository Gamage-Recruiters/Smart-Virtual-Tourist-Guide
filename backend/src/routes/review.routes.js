// BACKEND/src/routes/review.routes.js
const express = require('express');
const router = express.Router();

// 1. Controllers import karaganna
const reviewController = require('../controllers/review.controller');

// 2. Validators import karaganna (Ape Joi Guard eka)
const { validateReview } = require('../validators/review.validator');

/**  
 * @todo: Import the authentication middleware here later (e.g., const { protect } = require('../middleware/auth.middleware'); ).
 * @todo: Aysha (Authentication & Identity Management) will provide the exact middleware function name.
*/

// 1. Create a new review (POST /api/reviews)
// validateReview is added here as a middleware before createReview
router.post('/', validateReview, reviewController.createReview);

// 2. Get all reviews for a specific provider (GET /api/reviews/provider/:targetType/:targetProviderId)
router.get('/provider/:targetType/:targetProviderId', reviewController.getProviderReviews);

// 3. Report a specific review (PATCH /api/reviews/:id/report)
router.patch('/:id/report', reviewController.reportReview);

// 4. Mark a review as helpful or unhelpful (PATCH /api/reviews/:id/helpful)
router.patch('/:id/helpful', reviewController.markHelpful);

module.exports = router;