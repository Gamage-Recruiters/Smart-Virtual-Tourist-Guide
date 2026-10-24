import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiStar, FiMapPin, FiFileText, FiDollarSign, FiClock, FiCheckCircle, FiX, FiCheck, FiTag } from 'react-icons/fi';
import apiClient from '../../services/Admin/adminApi';
import ReviewSection from '../reviews/ReviewSection';
import { getBatchProviderRatings } from '../../services/reviews/review.service';

const getTargetType = (typeStr) => {
  const str = (typeStr || '').toLowerCase();
  if (str.includes('hotel') || str.includes('stay') || str.includes('resort')) return 'Hotel';
  if (str.includes('rest') || str.includes('food') || str.includes('dining')) return 'Restaurant';
  if (str.includes('act') || str.includes('tour') || str.includes('safari') || str.includes('hike')) return 'Activity';
  return 'Driver';
};

const ViewFullDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [ratingStats, setRatingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch real data from Backend
  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/admin/packages/${id}`);
        if (response && response.success) {
          const item = response.data;
          setListing(item);

          // Fetch rating stats
          try {
            const targetType = getTargetType(item.type);
            const providerId = item.providerId || item._id || id;
            const rRes = await getBatchProviderRatings(targetType, [providerId]);
            if (rRes.success && rRes.data && rRes.data[providerId]) {
              setRatingStats(rRes.data[providerId]);
            }
          } catch (rErr) {
            console.log('Error fetching provider rating stats:', rErr);
          }
        } else {
          setError('Failed to fetch listing details.');
        }
      } catch (err) {
        console.error("Error:", err);
        setError('Server error while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  // Handle Approve
  const handleApprove = async () => {
    if (listing.status === 'Approved') {
      alert('This listing is already approved!');
      return;
    }

    if (window.confirm(`Are you sure you want to approve ${listing.providerName}?`)) {
      try {
        const response = await apiClient.patch(`/admin/packages/${id}/approve`, {});
        if (response.success) {
          alert('Listing Approved Successfully!');
          navigate('/admin/listings'); // Go back to listings table
        }
      } catch (err) {
        alert('Failed to approve listing.');
      }
    }
  };

  // Handle Reject (Using browser prompt for quick rejection reason)
  const handleReject = async () => {
    if (listing.status === 'Rejected') {
      alert('This listing is already rejected!');
      return;
    }

    const reason = window.prompt(`Please enter the reason for rejecting ${listing.providerName}:`);
    if (reason && reason.trim() !== '') {
      try {
        const response = await apiClient.patch(`/admin/packages/${id}/reject`, { reason });
        if (response.success) {
          alert('Listing Rejected Successfully!');
          navigate('/admin/listings');
        }
      } catch (err) {
        alert('Failed to reject listing.');
      }
    } else if (reason !== null) {
      alert('Rejection reason is required.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EBF4FF]"><p className="text-gray-500 font-medium">Loading details...</p></div>;
  if (error || !listing) return <div className="min-h-screen flex items-center justify-center bg-[#EBF4FF] text-red-500 font-medium">{error || "Listing not found"}</div>;

  const currentTargetType = getTargetType(listing.type);
  const avgRatingVal = ratingStats?.averageRating || listing.rating || 4.9;
  const totalReviewsVal = ratingStats?.totalReviews || listing.reviewsCount || listing.reviews || 128;

  return (
    <div className="font-inter w-full bg-[#EBF4FF] min-h-screen pb-16 pt-8 px-6 md:px-12">
      <div className="max-w-4xl mx-auto w-full">

        {/* Header Title with Rating Badge (Screenshot 2) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="text-center md:text-left">
            <div className="inline-block mb-2">
              <span className={`px-4 py-1 rounded-full text-[12px] font-bold ${listing.status === 'Approved' ? 'bg-green-100 text-green-700' : listing.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {listing.status}
              </span>
            </div>
            <h1 className="text-[28px] md:text-[34px] font-extrabold text-[#111111] uppercase tracking-wide">
              {listing.title}
            </h1>
            <p className="text-[16px] font-semibold text-gray-700 mt-1">
              by {listing.providerName}
            </p>
          </div>

          {/* Top-right Rating Badge matching Screenshot 2: ★ 4.9/5 (128 reviews) */}
          <div className="flex items-center gap-2 bg-white border border-amber-200 shadow-xs px-4 py-2.5 rounded-2xl shrink-0">
            <FiStar className="text-yellow-400 fill-current text-xl" />
            <span className="font-extrabold text-slate-900 text-lg">
              {Number(avgRatingVal).toFixed(1)}/5
            </span>
            <span className="text-gray-500 text-xs font-medium">
              ({totalReviewsVal} {totalReviewsVal === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>

        {/* Main Image */}
        <div className="w-full h-[300px] md:h-[400px] rounded-[16px] overflow-hidden shadow-sm mb-8 bg-gray-200">
          <img src={listing.imageUrl || listing.images?.[0] || 'https://images.unsplash.com/photo-1544473244-f6895e69ce8d?w=1200&q=80'} alt={listing.title} className="w-full h-full object-cover" />
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-[16px] shadow-sm p-8 mb-6 border border-gray-100">
          <h2 className="text-[20px] font-bold text-[#111111] mb-4">Description</h2>
          <p className="text-[14px] text-gray-700 leading-relaxed mb-8">
            {listing.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <FiMapPin className="text-[#1E3A8A] mt-1" size={20} />
              <div>
                <h3 className="text-[14px] font-bold text-[#111111]">Location</h3>
                <p className="text-[13px] text-gray-600 font-medium">{listing.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiTag className="text-[#1E3A8A] mt-1" size={20} />
              <div>
                <h3 className="text-[14px] font-bold text-[#111111]">Category Type</h3>
                <p className="text-[13px] text-gray-600 font-medium">{listing.type}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiDollarSign className="text-[#1E3A8A] mt-1" size={20} />
              <div>
                <h3 className="text-[14px] font-bold text-[#111111]">Pricing</h3>
                <p className="text-[13px] text-gray-600 font-medium">{listing.price}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiClock className="text-[#1E3A8A] mt-1" size={20} />
              <div>
                <h3 className="text-[14px] font-bold text-[#111111]">Experience Since</h3>
                <p className="text-[13px] text-gray-600 font-medium">{listing.since || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        {listing.tags && listing.tags.length > 0 && (
          <div className="bg-white rounded-[16px] shadow-sm p-8 mb-8 border border-gray-100">
            <h3 className="text-[18px] font-bold text-[#111111] mb-6">Associated Tags</h3>
            <div className="flex flex-wrap gap-4">
              {listing.tags.map((tag, index) => (
                <span key={index} className="bg-blue-50 text-[#1877F2] px-4 py-2 rounded-[8px] text-[13px] font-bold border border-blue-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews & Moderation Section */}
        <div className="bg-white rounded-[16px] shadow-sm p-6 md:p-8 mb-8 border border-gray-100">
          <h2 className="text-[20px] font-bold text-[#111111] mb-6">Customer Reviews & Moderation</h2>
          <ReviewSection
            targetType={currentTargetType}
            targetProviderId={listing.providerId || listing._id || id}
            targetName={listing.title}
          />
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/admin/listings" className="w-full md:w-auto">
            <button className="w-full md:w-auto px-10 py-3 bg-white border border-gray-300 rounded-[8px] text-[14px] font-bold text-[#111111] hover:bg-gray-50 transition-colors shadow-sm">
              Back to List
            </button>
          </Link>

          {listing.status === 'Pending' && (
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button onClick={handleReject} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-red-500 text-white rounded-[8px] text-[14px] font-bold hover:bg-red-600 transition-colors shadow-sm">
                <FiX size={18} /> Reject Listing
              </button>
              <button onClick={handleApprove} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white rounded-[8px] text-[14px] font-bold hover:bg-green-700 transition-colors shadow-sm">
                <FiCheck size={18} /> Approve Listing
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ViewFullDetails;