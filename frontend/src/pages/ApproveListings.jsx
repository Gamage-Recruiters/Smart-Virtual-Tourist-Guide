import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiClock, FiCheckCircle, FiXCircle, FiShield } from 'react-icons/fi';
import apiClient from '../services/api';

// Import newly created components
import ListingCard from '../components/admin/ListingCard';
import RejectModal from '../components/admin/RejectModal';

const ApproveListings = () => {
  // States
  const [listingsData, setListingsData] = useState([]);
  const [stats, setStats] = useState({ pendingCount: 0, approvedCount: 0, rejectedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // States for Reject Modal control
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState({ id: null, providerName: '' });

  // 1. Fetch Listings Data
  const fetchListings = async () => {
    try {
      setLoading(true);
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

  // 2. Handle Approve Listing
  const handleApprove = async (listingId, providerName) => {
    if (!window.confirm(`Are you sure you want to approve the listing from ${providerName}?`)) {
      return;
    }
    try {
      // Using the newly created patch route
      const response = await apiClient.patch(`/admin/listings/${listingId}/approve`, {});
      if (response.success) {
        alert(`Listing successfully approved.`);
        fetchListings(); // Refresh data
      } else {
        alert(response.message || 'Failed to approve listing.');
      }
    } catch (err) {
      console.error("Approve error:", err);
      alert('Error approving listing. Please try again.');
    }
  };

  // 3. Open Reject Modal
  const openRejectModal = (listingId, providerName) => {
    setSelectedListing({ id: listingId, providerName });
    setIsRejectModalOpen(true);
  };

  // 4. Handle Reject Submit (after receiving reason from modal)
  const handleRejectSubmit = async (reason) => {
    try {
      // Sending the patch request along with the rejection reason
      const response = await apiClient.patch(`/admin/listings/${selectedListing.id}/reject`, { reason });
      if (response.success) {
        alert(`Listing successfully rejected.`);
        setIsRejectModalOpen(false); // Close modal
        fetchListings(); // Refresh data
      } else {
        alert(response.message || 'Failed to reject listing.');
      }
    } catch (err) {
      console.error("Reject error:", err);
      alert('Error rejecting listing. Please try again.');
    }
  };

  // Stat Cards
  const statCards = [
    { id: 1, title: 'Pending Review', value: stats.pendingCount, subText: 'High priority', subTextColor: 'text-yellow-600', icon: <FiClock size={20} className="text-yellow-500" /> },
    { id: 2, title: 'Rejected', value: stats.rejectedCount, subText: 'Needs revision', subTextColor: 'text-red-500', icon: <FiXCircle size={20} className="text-red-500" /> },
    { id: 3, title: 'Approved', value: stats.approvedCount, subText: 'Live on app', subTextColor: 'text-green-600', icon: <FiCheckCircle size={20} className="text-green-500" /> },
    { id: 4, title: 'Avg Verification', value: '90%', subText: 'Quality score', subTextColor: 'text-blue-500', icon: <FiShield size={20} className="text-blue-500" /> },
  ];

  return (
    <div className="font-inter w-full bg-[#EBF4FF] min-h-screen pb-12">
      
      {/* Hero Section */}
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
        
        {/* Stat Cards */}
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

        {/* Navigation Tabs */}
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

        {/* Search Input */}
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

        {/* Assembled Listing Cards */}
        {loading ? (
           <div className="text-center py-10 text-gray-500 font-medium bg-white rounded-xl shadow-sm">Loading listings data...</div>
        ) : error ? (
           <div className="text-center py-10 text-red-500 font-medium bg-white rounded-xl shadow-sm">{error}</div>
        ) : listingsData.length === 0 ? (
           <div className="text-center py-10 text-gray-500 font-medium bg-white rounded-xl shadow-sm">No listings found in the database.</div>
        ) : (
          <div className="flex flex-col gap-6 mb-12">
            {listingsData.map((listing) => (
              <ListingCard 
                key={listing._id} 
                listing={listing} 
                onApprove={handleApprove} 
                onReject={openRejectModal} 
              />
            ))}
          </div>
        )}

      </div>

      {/* Assembled Reject Modal */}
      <RejectModal 
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
        providerName={selectedListing.providerName}
      />

    </div>
  );
};

export default ApproveListings;