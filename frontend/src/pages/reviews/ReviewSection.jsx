import React, { useState, useEffect } from 'react';

// 1. Import our UI Components (Lego Blocks)
import ReviewStats from '../../components/reviews/ReviewStats';
import ReviewFilter from '../../components/reviews/ReviewFilter';
import ReviewCard from '../../components/reviews/ReviewCard';
import ReportModal from '../../components/reviews/ReportModal';

// 2. Import our API Service
import { 
  getProviderReviews, 
  markReviewHelpful, 
  reportReview 
} from '../../services/reviews/review.service';

/**
 * ReviewSection Component
 * 
 * The main container for the review system. It fetches data from the backend,
 * handles filtering/sorting state, and renders the UI components.
 * Other team members will import this component into their pages (e.g., HotelPage).
 * 
 * @param {Object} props
 * @param {string} props.targetType - e.g., 'Driver', 'Hotel', 'Vehicle'
 * @param {string} props.targetProviderId - The unique ID of the service provider
 * @returns {JSX.Element} The complete Reviews & Ratings section
 */
const ReviewSection = ({ targetType, targetProviderId }) => {
  // --- State Management ---
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, starPercentages: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Sort States
  const [filterRating, setFilterRating] = useState('all'); // 'all', '5', '4', '3'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'highest', 'lowest'
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // --- 1. Fetch Data from API ---
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Call the backend API
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

  // --- 2. Action Handlers ---

  // Handle 👍 / 👎 clicks
  const handleHelpfulClick = async (reviewId, isHelpful) => {
    try {
      await markReviewHelpful(reviewId, isHelpful);
      // Update local state so UI updates instantly without reloading the page
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

  // Open the report modal
  const handleOpenReport = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  // Submit the report to the backend
  const handleReportSubmit = async (reportData) => {
    try {
      if (selectedReview) {
        await reportReview(selectedReview._id, reportData.reason);
        alert('Review reported successfully. Admins will verify it.');
      }
    } catch (err) {
      alert('Failed to report the review. Please try again.');
    }
  };

  // --- 3. Filter, Sort & Search Logic ---
  
  // Create a copy of reviews to safely manipulate
  let processedReviews = [...reviews];

  // Apply Search
  if (searchQuery) {
    processedReviews = processedReviews.filter(review => 
      review.reviewText?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply Rating Filter
  if (filterRating !== 'all') {
    const minRating = parseInt(filterRating);
    processedReviews = processedReviews.filter(review => review.rating >= minRating);
  }

  // Apply Sorting
  processedReviews.sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    // Default: 'recent'
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // --- 4. Render UI ---
  
  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading reviews...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">View Ratings & Reviews</h2>
        <p className="text-gray-600">See what other travelers say about service providers</p>
      </div>

      {/* Stats Box */}
      <ReviewStats 
        averageRating={stats.averageRating} 
        starPercentages={stats.starPercentages} 
      />

      {/* Filters Toolbar */}
      <ReviewFilter 
        onFilterChange={(rating) => setFilterRating(rating)}
        onSortChange={(sort) => setSortBy(sort)}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* Review List */}
      <div className="space-y-6">
        {processedReviews.length > 0 ? (
          processedReviews.map((review) => (
            <ReviewCard 
              key={review._id} 
              review={{
                _id: review._id,
                authorName: review.touristId?.name || 'Anonymous Tourist',
                authorCountry: review.touristId?.country || 'LK',
                date: new Date(review.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                rating: review.rating,
                text: review.reviewText,
                helpfulCount: review.helpfulCount,
                unhelpfulCount: review.unhelpfulCount,
                postDate: new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              }}
              onHelpful={(isHelpful) => handleHelpfulClick(review._id, isHelpful)}
              onReport={() => handleOpenReport(review)}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
            No reviews found matching your criteria.
          </div>
        )}
      </div>

      {/* Report Modal Popup */}
      <ReportModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        review={selectedReview ? {
          authorName: selectedReview.touristId?.name || 'Anonymous Tourist',
          text: selectedReview.reviewText
        } : null}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default ReviewSection;