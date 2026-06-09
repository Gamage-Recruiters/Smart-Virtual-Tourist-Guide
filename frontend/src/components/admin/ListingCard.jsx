import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiFileText, FiEye, FiCheck, FiX, FiStar } from 'react-icons/fi';

const ListingCard = ({ listing, onApprove, onReject }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 flex flex-col lg:flex-row overflow-hidden hover:shadow-md transition-shadow relative">
      
      {/* Status Badge overlay */}
      <div className="absolute top-4 left-4 z-10">
         <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
           listing.status === 'Approved' ? 'bg-green-100 text-green-700' :
           listing.status === 'Rejected' ? 'bg-red-100 text-red-700' :
           'bg-yellow-100 text-yellow-700'
         }`}>
           {listing.status.toUpperCase()}
         </span>
      </div>

      {/* Image Section */}
      <div className="lg:w-2/5 h-64 lg:h-auto bg-gray-100">
        <img 
          src={listing.imageUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'} 
          alt={listing.title} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Content Section */}
      <div className="lg:w-3/5 p-6 flex flex-col justify-between">
        
        <div>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-[22px] font-bold text-[#111111] leading-tight pr-4">{listing.title}</h2>
            <div className="flex items-center gap-1 text-[14px] font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded-md shrink-0">
              <FiStar className="text-yellow-400 fill-current" /> {listing.rating}
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-[14px]">
                {listing.providerInitial || listing.providerName.charAt(0).toUpperCase()}
              </div>
              <span className="text-[14px] font-medium text-[#111111]">{listing.providerName}</span>
            </div>
            <span className="text-[12px] font-medium text-gray-500">Since {listing.since || '2026'}</span>
          </div>

          <p className="text-[14px] text-gray-600 leading-relaxed mb-6 line-clamp-3">
            {listing.description}
          </p>
        </div>

        <div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[13px] text-[#111111] font-medium">
                <FiMapPin className="text-gray-500" size={16} /> {listing.location}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[#111111] font-medium">
                <FiFileText className="text-gray-500" size={16} /> Submitted {formatDate(listing.createdAt)}
              </div>
            </div>
            
            <div className="flex flex-col md:items-end gap-3">
              <span className="text-[14px] font-bold text-[#111111]">{listing.price}</span>
              <span className="text-[13px] font-medium text-[#1877F2]">{listing.verificationScore}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-gray-100 pt-6">
            
            <div className="flex flex-wrap gap-2">
              {listing.tags && listing.tags.map((tag, index) => (
                <span key={index} className="bg-[#EBF4FF] text-[#1877F2] px-3 py-1.5 rounded-[6px] text-[12px] font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
              <Link to={`/view-details/${listing._id}`} className="flex-1 md:flex-none">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-[#111111] rounded-[6px] text-[13px] font-medium hover:bg-gray-50 transition-colors">
                  <FiEye size={16} /> View Details
                </button>
              </Link>
              
              {/* Approve Button */}
              {listing.status !== 'Approved' && (
                <button 
                  onClick={() => onApprove(listing._id, listing.providerName)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-[#1877F2] text-white rounded-[6px] text-[13px] font-medium hover:bg-blue-600 transition-colors"
                >
                  <FiCheck size={16} /> Approve
                </button>
              )}
              
              {/* Reject Button */}
              {listing.status !== 'Rejected' && (
                <button 
                  onClick={() => onReject(listing._id, listing.providerName)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-[#6A994E] text-white rounded-[6px] text-[13px] font-medium hover:bg-[#5a8342] transition-colors"
                >
                  <FiX size={16} /> Reject
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ListingCard;