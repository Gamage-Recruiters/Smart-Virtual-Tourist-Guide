import React, { useState } from 'react';
import ReviewStats from '../../components/reviews/ReviewStats';
import ReviewFilter from '../../components/reviews/ReviewFilter';
import ReviewCard from '../../components/reviews/ReviewCard';
import ReportModal from '../../components/reviews/ReportModal';

// Custom hook to manage review data, filtering, sorting, and actions
import { useReviews } from '../../hooks/reviews/useReviews';

const ReviewSection = ({ targetType, targetProviderId }) => {
  // State for managing the report modal visibility and selected review
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Use the custom hook to fetch and manage reviews, stats, and actions
  const {
    stats,
    loading,
    error,
    processedReviews,
    setFilterRating,
    setSortBy,
    setSearchQuery,
    handleHelpfulClick,
    submitReport
  } = useReviews(targetType, targetProviderId);

  const handleOpenReport = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleReportSubmit = async (reportData) => {
    if (selectedReview) {
      const success = await submitReport(selectedReview._id, reportData);
      if (success) {
        alert('Review reported successfully. Admins will verify it.');
      } else {
        alert('Failed to report the review. Please try again.');
      }
      setIsModalOpen(false);
    }
  };

  // --- Render UI ---
  if (loading) return <div className="p-8 text-center text-gray-500">Loading reviews...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">View Ratings & Reviews</h2>
        <p className="text-gray-600">See what other travelers say about service providers</p>
      </div>

      <ReviewStats averageRating={stats.averageRating} starPercentages={stats.starPercentages} />

      <ReviewFilter 
        onFilterChange={setFilterRating}
        onSortChange={setSortBy}
        onSearch={setSearchQuery}
      />

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

      <ReportModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        review={selectedReview ? { authorName: selectedReview.touristId?.name || 'Anonymous Tourist', text: selectedReview.reviewText } : null}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default ReviewSection;