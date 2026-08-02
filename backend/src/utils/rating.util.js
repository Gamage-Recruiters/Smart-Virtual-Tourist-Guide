// BACKEND/src/utils/rating.util.js

/**
 * Calculates the average rating and star distribution from an array of reviews.
 * 
 * @param {Array} reviews - Array of review objects fetched from the database.
 * @returns {Object} - Object containing the average rating, total review count, and star distribution breakdown.
 */
export const calculateRatingStats = (reviews) => {
    let totalRating = 0;
    let starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach(review => {
        totalRating += review.rating;
        starCounts[review.rating] += 1;
    });

    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    return {
        totalReviews: reviews.length,
        averageRating,
        starCounts
    };
};