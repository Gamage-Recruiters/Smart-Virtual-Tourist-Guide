import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiClock, FiCheckCircle, FiXCircle, FiShield, FiMapPin, FiFileText, FiEye, FiCheck, FiX, FiStar } from 'react-icons/fi';
import apiClient from '../services/api'; // Make sure this path is correct based on your folder structure

const ApproveListings = () => {
  // States for dynamic data
  const [listingsData, setListingsData] = useState([]);
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch Listings Data from Backend
  const fetchListings = async () => {
    try {
      setLoading(true);
      // We use the apiClient to automatically handle tokens if configured
      const response = await apiClient.get('/admin/listings/all');
      
      if (response.success) {
        setListingsData(response.data.listings);
        setStats(response.data.stats);
      } else {
        setError('Failed to load listings data.');
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError('Cannot connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // 2. Handle Status Update (Approve or Reject)
  const handleStatusUpdate = async (listingId, newStatus, providerName) => {
    const confirmMessage = newStatus === 'Approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${confirmMessage} the listing from ${providerName}?`)) {
      return;
    }

    try {
      const response = await apiClient.put(`/admin/listings/${listingId}/status`, { status: newStatus });

      if (response.success) {
        alert(`Listing successfully marked as ${newStatus}.`);
        // Refresh the data to update stats and list
        fetchListings(); 
      } else {
        alert(response.message || 'Failed to update status.');
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert('Error updating status. Please try again.');
    }
  };

  // Format Date Helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Static structure for Top Cards combined with Dynamic Data
  const statCards = [
    { id: 1, title: 'Pending Review', value: stats.pendingCount, subText: 'High priority', subTextColor: 'text-yellow-600', icon: <FiClock size={20} className="text-yellow-500" /> },
    { id: 2, title: 'Rejected', value: stats.rejectedCount, subText: 'Needs revision', subTextColor: 'text-red-500', icon: <FiXCircle size={20} className="text-red-500" /> },
    { id: 3, title: 'Approved', value: stats.approvedCount, subText: 'Live on app', subTextColor: 'text-green-600', icon: <FiCheckCircle size={20} className="text-green-500" /> },
    { id: 4, title: 'Avg Verification', value: '90%', subText: 'Quality score', subTextColor: 'text-blue-500', icon: <FiShield size={20} className="text-blue-500" /> },
  ];

  return (
    <div className="font-inter w-full bg-[#EBF4FF] min-h-screen pb-12">
      
      {/* 1. Page Specific Hero Section */}
      <div 
        className="relative w-full h-[300px] bg-cover bg-center flex items-center px-6 md:px-16"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544085311-11a028465b03?w=1600&q=80')` }}
      >
        <div className="absolute inset-0 bg-black/30"></div> 
        <div className="relative z-10 text-white drop-shadow-md">
          <h1 className="text-[36px] font-bold mb-2 text-white">Listing Management</h1>
          <p className="text-[16px] font-medium text-white/90">Review and approve travel package submissions</p>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-7xl mx-auto -mt-12 relative z-20">
        
        {/* 2. Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.id} className="bg-gradient-to-br from-white to-[#F8FAFC] p-6 rounded-[12px] shadow-sm border border-white flex flex-col gap-4">
               <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                     <h3 className="text-[16px] font-medium text-[#111111]">{stat.title}</h3>
                     <h2 className="text-[32px] font-bold text-[#111111] mt-1">{loading ? '...' : stat.value}</h2>
                  </div>
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    {stat.icon}
                  </div>
               </div>
               <span className={`text-[12px] font-medium ${stat.subTextColor}`}>
                 {stat.subText}
               </span>
            </div>
          ))}
        </div>

        {/* 3. Navigation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <Link to="/user-management" className="block w-full">
             <button className="bg-white border border-gray-200 text-[#111111] font-medium py-3 px-6 rounded-full shadow-sm hover:bg-gray-50 transition-colors w-full">
               User Management
             </button>
           </Link>
           <Link to="/approve-listings" className="block w-full">
             <button className="bg-[#D1FAE5] border border-green-200 text-[#065F46] font-medium py-3 px-6 rounded-full shadow-sm transition-colors w-full">
               Approve Listings
             </button>
           </Link>
           <Link to="/manage-ads" className="block w-full">
             <button className="bg-white border border-gray-200 text-[#111111] font-medium py-3 px-6 rounded-full shadow-sm hover:bg-gray-50 transition-colors w-full">
               Manage Ads
             </button>
           </Link>
        </div>

        {/* 4. Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search by title, provider, or location" 
              className="block w-full pl-12 pr-3 py-3 border border-gray-200 rounded-full leading-5 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* 5. Listing Cards Display */}
        {loading ? (
           <div className="text-center py-10 text-gray-500 font-medium bg-white rounded-xl shadow-sm">Loading listings data...</div>
        ) : error ? (
           <div className="text-center py-10 text-red-500 font-medium bg-white rounded-xl shadow-sm">{error}</div>
        ) : listingsData.length === 0 ? (
           <div className="text-center py-10 text-gray-500 font-medium bg-white rounded-xl shadow-sm">No listings found in the database.</div>
        ) : (
          <div className="flex flex-col gap-6 mb-12">
            {listingsData.map((listing) => (
              <div key={listing._id} className="bg-white rounded-[12px] shadow-sm border border-gray-100 flex flex-col lg:flex-row overflow-hidden hover:shadow-md transition-shadow relative">
                
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
                        
                        {/* Only show Approve/Reject buttons if status is Pending or Rejected */}
                        {listing.status !== 'Approved' && (
                          <button 
                            onClick={() => handleStatusUpdate(listing._id, 'Approved', listing.providerName)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-[#1877F2] text-white rounded-[6px] text-[13px] font-medium hover:bg-blue-600 transition-colors"
                          >
                            <FiCheck size={16} /> Approve
                          </button>
                        )}
                        
                        {listing.status !== 'Rejected' && (
                          <button 
                            onClick={() => handleStatusUpdate(listing._id, 'Rejected', listing.providerName)}
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
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ApproveListings;