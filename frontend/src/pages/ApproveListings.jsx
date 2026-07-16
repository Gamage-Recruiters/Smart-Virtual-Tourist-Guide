import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiClock, FiCheckCircle, FiXCircle, FiShield, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import apiClient from '../services/api';
import ListingCard from '../components/admin/ListingCard';
import RejectModal from '../components/admin/RejectModal';
import toast, { Toaster } from 'react-hot-toast';

const ApproveListings = () => {
  const [listingsData, setListingsData] = useState([]);
  const [stats, setStats] = useState({ pendingCount: 0, approvedCount: 0, rejectedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState({ id: null, providerName: '' });

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
      setError('Cannot connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

 const handleApprove = async (listingId, providerName) => {
    if (!window.confirm(`Are you sure you want to approve the listing from ${providerName}?`)) return;
    const toastId = toast.loading('Approving listing...');
    try {
      const response = await apiClient.patch(`/admin/listings/${listingId}/approve`, {});
      if (response.success) {
        fetchListings(); 
        toast.success('Listing approved successfully!', { id: toastId });
      } else {
        toast.error(response.message || 'Failed to approve listing.', { id: toastId });
      }
    } catch (err) {
      toast.error('Error connecting to the server.', { id: toastId });
    }
  };

  const openRejectModal = (listingId, providerName) => {
    setSelectedListing({ id: listingId, providerName });
    setIsRejectModalOpen(true);
  };

const handleRejectSubmit = async (reason) => {
    if (!reason || reason.trim() === '') {
      toast.error('Rejection reason is required!');
      return;
    }
    const toastId = toast.loading('Rejecting listing...');
    try {
      const response = await apiClient.patch(`/admin/listings/${selectedListing.id}/reject`, { reason });
      if (response.success) {
        setIsRejectModalOpen(false); 
        fetchListings(); 
        toast.success('Listing rejected successfully!', { id: toastId });
      } else {
        toast.error(response.message || 'Failed to reject listing.', { id: toastId });
      }
    } catch (err) {
      toast.error('Error connecting to the server.', { id: toastId });
    }
  };

  const filteredListings = listingsData.filter(listing => 
    listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredListings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const statCards = [
    { id: 1, title: 'Pending Review', value: stats.pendingCount, subText: 'High priority', subTextColor: 'text-yellow-600', icon: <FiClock size={20} className="text-yellow-500" /> },
    { id: 2, title: 'Rejected', value: stats.rejectedCount, subText: 'Needs revision', subTextColor: 'text-red-500', icon: <FiXCircle size={20} className="text-red-500" /> },
    { id: 3, title: 'Approved', value: stats.approvedCount, subText: 'Live on app', subTextColor: 'text-green-600', icon: <FiCheckCircle size={20} className="text-green-500" /> },
    { id: 4, title: 'Avg Verification', value: '90%', subText: 'Quality score', subTextColor: 'text-blue-500', icon: <FiShield size={20} className="text-blue-500" /> },
  ];

  return (
    <div className="font-inter w-full bg-[#EBF4FF] min-h-screen pb-12">
    <Toaster position="top-right" reverseOrder={false} />
      
      {/* 100% FIXED HERO SECTION - Matches UserManagement */}
      <div 
        className="relative w-full h-[350px] bg-cover bg-center flex items-center mb-8"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544085311-11a028465b03?w=1600&q=80')` }}
      >
        <div className="absolute inset-0 bg-black/20"></div> 
        <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <h1 className="text-[40px] font-bold text-white mb-2 drop-shadow-md">Listing Management</h1>
          <p className="text-[16px] font-medium text-white/90 drop-shadow-md">Review and approve travel package submissions</p>
        </div>
      </div>

      {/* Removed the negative margin (-mt-12) to match standard spacing */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full">
        
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

        {/* FIXED TABS CONTAINER - Matches ManageAds/UserManagement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-[#D3E8FA] p-6 rounded-[12px]">
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

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, provider, or location" 
              className="block w-full pl-12 pr-3 py-3 border border-gray-200 rounded-full leading-5 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1877F2] sm:text-sm transition-colors"
            />
          </div>
        </div>

        {loading ? (
           <div className="text-center py-10 text-gray-500 font-medium bg-white rounded-xl shadow-sm">Loading listings data...</div>
        ) : error ? (
           <div className="text-center py-10 text-red-500 font-medium bg-white rounded-xl shadow-sm">{error}</div>
        ) : currentItems.length === 0 ? (
           <div className="text-center py-10 text-gray-500 font-medium bg-white rounded-xl shadow-sm">
             {searchTerm ? "No results found for your search." : "No listings found in the database."}
           </div>
        ) : (
          <div className="flex flex-col gap-6 mb-8">
            {currentItems.map((listing) => (
              <ListingCard 
                key={listing._id} 
                listing={listing} 
                onApprove={handleApprove} 
                onReject={openRejectModal} 
              />
            ))}
          </div>
        )}

        {!loading && filteredListings.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pb-8">
             <button 
               onClick={() => paginate(currentPage - 1)}
               disabled={currentPage === 1}
               className={`w-10 h-10 flex items-center justify-center rounded-[8px] border border-gray-200 transition-colors ${currentPage === 1 ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
             >
               <FiChevronLeft size={20} />
             </button>
             
             {[...Array(totalPages)].map((_, index) => (
               <button 
                 key={index + 1}
                 onClick={() => paginate(index + 1)}
                 className={`w-10 h-10 flex items-center justify-center rounded-[8px] font-medium shadow-sm transition-colors ${currentPage === index + 1 ? 'bg-[#A855F7] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
               >
                 {index + 1}
               </button>
             ))}

             <button 
               onClick={() => paginate(currentPage + 1)}
               disabled={currentPage === totalPages}
               className={`w-10 h-10 flex items-center justify-center rounded-[8px] border border-gray-200 transition-colors ${currentPage === totalPages ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
             >
               <FiChevronRight size={20} />
             </button>
          </div>
        )}

      </div>

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