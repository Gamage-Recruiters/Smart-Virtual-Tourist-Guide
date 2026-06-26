import { useState, useEffect } from 'react';
import { getProviderReviews, markReviewHelpful, reportReview } from '../../services/reviews/review.service';

/**
 * Custom hook to manage review data, loading states, filtering, and sorting.
 * Separates the business logic from the UI component.
 */
export const useReviews = (targetType, targetProviderId) => {
  // State variables
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, starPercentages: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort States
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch data from Backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getProviderReviews(targetType, targetProviderId);
        if (response.success) {
          setReviews(response.data.reviews);
          setStats(response.data.stats);
        }
      } catch (err) {
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (targetType && targetProviderId) {
      fetchReviews();
    }
  }, [targetType, targetProviderId]);

  // 2. Action Handlers (Helpful & Report)
  const handleHelpfulClick = async (reviewId, isHelpful) => {
    try {
      await markReviewHelpful(reviewId, isHelpful);
      setReviews(prevReviews => 
        prevReviews.map(review => {
          if (review._id === reviewId) {
            return {
              ...review,
              helpfulCount: isHelpful ? review.helpfulCount + 1 : review.helpfulCount,
              unhelpfulCount: !isHelpful ? review.unhelpfulCount + 1 : review.unhelpfulCount
            };
          }
          return review;
        })
      );
    } catch (err) {
      console.error("Failed to mark review as helpful", err);
    }
  };

  const submitReport = async (reviewId, reportData) => {
    try {
      await reportReview(reviewId, reportData.reason);
      return true; // Success
    } catch (err) {
      return false; // Failed
    }
  };

  // 3. Process data (Filter, Sort, Search)
  let processedReviews = [...reviews];

  if (searchQuery) {
    processedReviews = processedReviews.filter(review => 
      review.reviewText?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterRating !== 'all') {
    processedReviews = processedReviews.filter(review => review.rating >= parseInt(filterRating));
  }

  processedReviews.sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Return everything the UI needs
  return {
    stats,
    loading,
    error,
    processedReviews,
    filterRating,
    setFilterRating,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    handleHelpfulClick,
    submitReport
  };
};