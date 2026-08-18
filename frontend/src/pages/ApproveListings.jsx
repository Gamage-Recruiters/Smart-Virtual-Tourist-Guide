import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiClock, FiCheckCircle, FiXCircle, FiShield, FiChevronLeft, FiChevronRight, FiSliders } from 'react-icons/fi';
import apiClient from '../services/adminApi';
import ListingCard from '../components/Admin/ListingCard';
import RejectModal from '../components/Admin/RejectModal';
import toast, { Toaster } from 'react-hot-toast';
import ListingManagementBg from '../assets/Listing_Management.png';

const ApproveListings = () => {
  const [listingsData, setListingsData] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, avgVerification: '0%' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshIndex, setRefreshIndex] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState({ id: null, providerName: '' });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await apiClient.get('/admin/packages');
        if (response.success) {
          setListingsData(response.data || []);
          setStats(response.stats || { pending: 0, approved: 0, rejected: 0, avgVerification: '0%' });
        } else {
          setError('Failed to load listings data.');
        }
      } catch {
        setError('Cannot connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [refreshIndex]);

 const handleApprove = async (listingId, providerName) => {
    if (!window.confirm(`Are you sure you want to approve the listing from ${providerName}?`)) return;
    const toastId = toast.loading('Approving listing...');
    try {

      const response = await apiClient.patch(`/admin/packages/${listingId}/approve`, {});
      if (response.success) {
        setRefreshIndex((index) => index + 1);
        toast.success('Listing approved successfully!', { id: toastId });
      } else {
        toast.error(response.message || 'Failed to approve listing.', { id: toastId });
      }
    } catch {
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

      const response = await apiClient.patch(`/admin/packages/${selectedListing.id}/reject`, { reason });
      if (response.success) {
        setIsRejectModalOpen(false);
        setRefreshIndex((index) => index + 1);
        toast.success('Listing rejected successfully!', { id: toastId });
      } else {
        toast.error(response.message || 'Failed to reject listing.', { id: toastId });
      }
    } catch {
      toast.error('Error connecting to the server.', { id: toastId });
    }
  };

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredListings = listingsData
    .map((listing, originalIndex) => ({ listing, originalIndex }))
    .filter(({ listing }) => (
      listing.title?.toLowerCase().includes(normalizedSearchTerm) ||
      listing.providerName?.toLowerCase().includes(normalizedSearchTerm) ||
      listing.location?.toLowerCase().includes(normalizedSearchTerm)
    ))
    .filter(({ listing }) => priorityFilter === 'all' || listing.status === priorityFilter)
    .sort((a, b) => {
      const aDate = Date.parse(a.listing.createdAt || a.listing.submittedAt || a.listing.updatedAt || '');
      const bDate = Date.parse(b.listing.createdAt || b.listing.submittedAt || b.listing.updatedAt || '');

      if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) {
        return sortOrder === 'newest' ? bDate - aDate : aDate - bDate;
      }

      // The API already returns newest first; preserve or reverse that order when timestamps are absent.
      return sortOrder === 'newest'
        ? a.originalIndex - b.originalIndex
        : b.originalIndex - a.originalIndex;
    })
    .map(({ listing }) => listing);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredListings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const statCards = [
    { id: 1, title: 'Pending Review', value: stats.pending, subText: 'High priority', subTextColor: 'text-yellow-600', icon: <FiClock size={20} className="text-yellow-500" /> },
    { id: 2, title: 'Rejected', value: stats.rejected, subText: 'Needs revision', subTextColor: 'text-red-500', icon: <FiXCircle size={20} className="text-red-500" /> },
    { id: 3, title: 'Approved', value: stats.approved, subText: 'Live on app', subTextColor: 'text-green-600', icon: <FiCheckCircle size={20} className="text-green-500" /> },
    { id: 4, title: 'Avg Verification', value: stats.avgVerification, subText: 'Quality score', subTextColor: 'text-blue-500', icon: <FiShield size={20} className="text-blue-500" /> },
  ];

  return (
    <div className="min-h-screen w-full bg-white font-inter">
    <Toaster position="top-right" reverseOrder={false} />

      <div
        className="relative flex min-h-[360px] w-full items-start bg-cover bg-center pt-28 sm:min-h-[520px] sm:pt-40 lg:h-[min(53.75vw,774px)] lg:min-h-[660px] lg:pt-[14.5vw]"
        style={{ backgroundImage: `url(${ListingManagementBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent" />
        <div className="relative z-10 w-full px-6 sm:px-8 lg:px-[47px]">
          <h1 className="mb-3 text-[38px] font-extrabold leading-tight text-black sm:text-[40px]">Listing Management</h1>
          <p className="text-[18px] font-semibold text-black sm:text-[21px] lg:text-[24px]">Review and approve travel package submissions</p>
        </div>
      </div>

      <section className="bg-gradient-to-b from-[#D8F0FF] to-white px-6 pb-16 pt-12 sm:px-8 lg:px-12 lg:pb-20 lg:pt-14">
      <div className="mx-auto w-full max-w-[1298px]">

        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-24">
          {statCards.map((stat) => (
            <div key={stat.id} className="flex min-h-[150px] flex-col justify-between rounded-[9px] border border-white bg-gradient-to-br from-white to-[#F4F9FF] p-5 shadow-[0_8px_22px_rgba(46,92,136,0.14)]">
               <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                     <h3 className="text-[16px] font-medium text-[#111111]">{stat.title}</h3>
                     <h2 className="mt-2 text-[29px] font-normal text-[#111111]">{loading ? '...' : stat.value}</h2>
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

        <div className="mb-10 grid grid-cols-1 gap-3 rounded-[10px] bg-white/75 p-3 shadow-sm md:grid-cols-3 md:gap-8">
           <Link to="/admin/users" className="block w-full">
             <button className="w-full rounded-full border border-slate-300 bg-white px-6 py-2.5 text-[14px] font-semibold text-[#111111] shadow-sm transition-colors hover:bg-slate-50">
               User Management
             </button>
           </Link>
           <Link to="/admin/listings" className="block w-full">
             <button className="w-full rounded-full border border-green-200 bg-[#D7FDE1] px-6 py-2.5 text-[14px] font-semibold text-[#065F46] shadow-sm">
               Approve Listings
             </button>
           </Link>
           <Link to="/admin/ads" className="block w-full">
             <button className="w-full rounded-full border border-slate-300 bg-white px-6 py-2.5 text-[14px] font-semibold text-[#111111] shadow-sm transition-colors hover:bg-slate-50">
               Manage Ads
             </button>
           </Link>
        </div>

        <div className="mb-12 flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-[540px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, provider, or location"
              className="block h-[42px] w-full rounded-full border border-slate-300 bg-white pl-12 pr-4 text-[13px] leading-5 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <label className="relative">
              <span className="sr-only">Sort listings by date</span>
              <FiSliders className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <select
                value={sortOrder}
                onChange={(event) => {
                  setSortOrder(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-[42px] min-w-[166px] appearance-none rounded-full border border-slate-300 bg-white py-2 pl-10 pr-9 text-[13px] font-medium text-[#111111] shadow-sm outline-none focus:ring-2 focus:ring-[#1877F2]"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
              </select>
            </label>
            <label className="relative">
              <span className="sr-only">Filter listings by review priority</span>
              <select
                value={priorityFilter}
                onChange={(event) => {
                  setPriorityFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-[42px] min-w-[166px] appearance-none rounded-full border border-slate-300 bg-white px-5 py-2 text-[13px] font-medium text-[#111111] shadow-sm outline-none focus:ring-2 focus:ring-[#1877F2]"
              >
                <option value="all">Priority: All</option>
                <option value="Pending">Pending review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>
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
          <div className="mb-10 flex flex-col gap-12">
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
          <div className="flex flex-wrap items-center justify-end gap-2 pb-8">
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
      </section>

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
