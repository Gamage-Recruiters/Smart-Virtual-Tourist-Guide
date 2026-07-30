// FRONTEND/src/pages/reviews/ReviewSection.jsx
import React, { useState } from 'react';
import ReviewStats from '../../components/reviews/ReviewStats';
import ReviewFilter from '../../components/reviews/ReviewFilter';
import ReviewCard from '../../components/reviews/ReviewCard';
import ReportModal from '../../components/reviews/ReportModal';
import WriteReviewModal from '../../components/reviews/WriteReviewModal';

// Ape custom hook eka
import { useReviews } from '../../hooks/reviews/useReviews';
// API service eken submitReview ekath gannawa
import { submitReview } from '../../services/reviews/review.service';

const ReviewSection = ({ targetType, targetProviderId, targetName = "the provider" }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

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

  // --- Handlers ---
  const handleOpenReport = (review) => {
    setSelectedReview(review);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async (reportData) => {
    if (selectedReview) {
      const success = await submitReport(selectedReview._id, reportData);
      if (success) {
        alert('Review reported successfully. Admins will verify it.');
      } else {
        alert('Failed to report the review. Please try again.');
      }
      setIsReportModalOpen(false);
    }
  };

  // --- REAL SUBMIT LOGIC (Cloudinary + MongoDB) ---
  const handleWriteReviewSubmit = async (reviewData) => {
    try {
      // 1. Modal eken ena data tika wen karagannawa
      const { rating, title, reviewText, files } = reviewData;
      const uploadedImageUrls = [];

      // 2. Cloudinary Upload (Photos thiyenawanam witarak)
      if (files && files.length > 0) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);

          const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
          });
          
          const uploadData = await uploadRes.json();
          uploadedImageUrls.push(uploadData.secure_url); // Cloudinary dunna link eka array ekata danawa
        }
      }

      // 3. Database ekata yawanna Payload eka hadanawa
      const finalReviewPayload = {
        touristId: "64b5f8e2c3e1a2b3c4d5e6f7", // TODO: Login system eka awama meka automatic enawa
        targetProviderId: targetProviderId,
        targetType: targetType,
        rating: rating,
        title: title,
        reviewText: reviewText,
        images: uploadedImageUrls // Cloudinary URLs
      };

      // 4. API Service eka haraha MongoDB ekata save karanawa
      const response = await submitReview(finalReviewPayload);

      if (response.success) {
        alert("Awesome! Your review and photos were uploaded successfully!");
        setIsWriteModalOpen(false);
        window.location.reload(); // Aluth review eka pennanna page eka refresh karanawa
      }

    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  // --- Render UI ---
  if (loading) return <div className="p-8 text-center text-gray-500">Loading reviews...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">View Ratings & Reviews</h2>
          <p className="text-gray-600">See what other travelers say about service providers</p>
        </div>
        
        <button 
          onClick={() => setIsWriteModalOpen(true)}
          className="bg-blue-600 text-white font-medium py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          Write a Review
        </button>
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
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        review={selectedReview ? { authorName: selectedReview.touristId?.name || 'Anonymous', text: selectedReview.reviewText } : null}
        onSubmit={handleReportSubmit}
      />

      <WriteReviewModal 
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        targetName={targetName}
        onSubmit={handleWriteReviewSubmit}
      />
      
    </div>
  );
};

export default ReviewSection;