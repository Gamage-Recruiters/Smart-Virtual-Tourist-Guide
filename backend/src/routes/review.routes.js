const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');


/**  
 * @todo: Import the authentication middleware here later (e.g., const { protect } = require('../middleware/auth.middleware'); ).
 * @todo: Aysha (Authentication & Identity Management) will provide the exact middleware function name.
*/


// 1. Create a new review (POST /api/reviews)
// Has to wrap this with Aysha's auth middleware to ensure only logged-in users can post
router.post('/', reviewController.createReview);

// 2. Get all reviews for a specific provider (GET /api/reviews/provider/:targetType/:targetProviderId)
router.get('/provider/:targetType/:targetProviderId', reviewController.getProviderReviews);

// 3. Report a specific review (PATCH /api/reviews/:id/report)
router.patch('/:id/report', reviewController.reportReview);

// 4. Mark a review as helpful or unhelpful (PATCH /api/reviews/:id/helpful)
router.patch('/:id/helpful', reviewController.markHelpful);

module.exports = router;