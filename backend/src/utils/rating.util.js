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


export const calculateBatchRatings = (reviewsArray, providerIds) => {
    const results = {};
    
    // Mulinma okkoma IDs walata 0 set karanawa (Review nathi ayata 0 yanna ooni nisa)
    providerIds.forEach(id => {
        results[id] = { averageRating: 0, totalReviews: 0 };
    });

    // Hama provider ID ekatama adala reviews tika wen karagena calculate karanawa
    providerIds.forEach(id => {
        const providerReviews = reviewsArray.filter(review => review.targetProviderId.toString() === id);
        if (providerReviews.length > 0) {
            const stats = calculateRatingStats(providerReviews);
            results[id] = {
                averageRating: stats.averageRating,
                totalReviews: stats.totalReviews
            };
        }
    });

    return results;
};