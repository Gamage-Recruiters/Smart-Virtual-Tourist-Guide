import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2, FiPlus, FiTrendingUp, FiTrendingDown, FiDollarSign, FiMousePointer, FiBarChart2, FiUsers, FiCalendar, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import apiClient from '../services/api'; 

const ManageAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; 

  const totalBudget = ads.reduce((sum, ad) => sum + ad.rawBudget, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.rawClicks, 0);
  const totalImpressions = ads.reduce((sum, ad) => sum + ad.rawImpressions, 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;

  const statCards = [
    { id: 1, title: 'Total Budget', value: `$${totalBudget}`, trend: 'Live', isUp: true, icon: <FiDollarSign size={20} className="text-[#1877F2]" /> },
    { id: 2, title: 'Total Clicks', value: totalClicks.toString(), trend: 'Live', isUp: true, icon: <FiMousePointer size={20} className="text-[#1877F2]" /> },
    { id: 3, title: 'Total Impressions', value: totalImpressions.toString(), trend: 'Live', isUp: true, icon: <FiBarChart2 size={20} className="text-[#1877F2]" /> },
    { id: 4, title: 'Average CTR', value: `${avgCtr}%`, trend: 'Live', isUp: true, icon: <FiUsers size={20} className="text-[#1877F2]" /> },
  ];

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/ads');
        
        if (response && response.success && response.data.length > 0) {
          const formattedAds = response.data.map(ad => ({
            id: ad._id,
            image: ad.imageUrl || 'https://images.unsplash.com/photo-1544473244-f6895e69ce8d?w=800&q=80',
            title: ad.title,
            badge: ad.status === 'Active' ? '- Active' : '- Paused',
            badgeColor: ad.status === 'Active' ? 'text-green-500' : 'text-red-500',
            duration: 'Campaign Duration',
            description: `Company: ${ad.companyName}`,
            date: `${new Date(ad.startDate).toLocaleDateString()} - ${new Date(ad.endDate).toLocaleDateString()}`,
            price: `$${ad.budget}`,
            clicks: ad.clicks.toString(),
            impressions: ad.impressions.toString(),
            ctr: ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) + '%' : '0%',
            rawBudget: ad.budget,
            rawClicks: ad.clicks,
            rawImpressions: ad.impressions
          }));
          setAds(formattedAds);
        } else {
          setAds([]); 
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  const handleView = (id) => navigate(`/view-ad/${id}`);
  const handleEdit = (id) => navigate(`/edit-ad/${id}`);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to completely remove this advertisement? This action cannot be undone.")) {
      try {
        const response = await apiClient.delete(`/admin/ads/${id}`);
        if (response && response.success) {
          setAds(ads.filter(ad => ad.id !== id));
        }
      } catch (error) {
        alert("Failed to delete advertisement. Please check your connection.");
      }
    }
  };

  // --- Search & Pagination Logic ---
  const filteredAds = ads.filter(ad => 
    ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAds = filteredAds.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="font-inter w-full bg-[#EBF4FF] min-h-screen pb-12">
      
      <div 
        className="relative w-full h-[400px] bg-cover bg-center flex items-center mb-8"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544085311-11a028465b03?w=1600&q=80')` }}
      >
        <div className="absolute inset-0 bg-black/10"></div> 
        <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <h1 className="text-[36px] font-bold mb-2 text-white">Advertisement Management</h1>
          <p className="text-[16px] font-medium text-white/90">Create and manage promotional campaigns</p>
        </div>
      </div>

      <div className="font-inter px-6 md:px-12 max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.id} className="bg-gradient-to-br from-white to-[#F8FAFC] p-6 rounded-[12px] shadow-sm border border-white flex flex-col justify-between">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-[#EBF4FF] rounded-lg">{stat.icon}</div>
                  <span className={`text-[12px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${stat.isUp ? 'text-green-600 bg-green-100' : 'text-red-500 bg-red-100'}`}>
                    {stat.isUp ? <FiTrendingUp size={12}/> : <FiTrendingDown size={12}/>} {stat.trend}
                  </span>
               </div>
               <div className="flex flex-col">
                  <h3 className="text-[13px] font-medium text-gray-500 mb-1">{stat.title}</h3>
                  <h2 className="text-[28px] font-bold text-[#111111]">{stat.value}</h2>
               </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-[#D3E8FA] p-6 rounded-[12px]">
           <Link to="/user-management" className="block w-full">
             <button className="bg-white border border-gray-200 text-[#111111] font-medium py-3 px-6 rounded-full shadow-sm hover:bg-gray-50 transition-colors w-full">
               User Management
             </button>
           </Link>
           <Link to="/approve-listings" className="block w-full">
             <button className="bg-white border border-gray-200 text-[#111111] font-medium py-3 px-6 rounded-full shadow-sm hover:bg-gray-50 transition-colors w-full">
               Approve Listings
             </button>
           </Link>
           <Link to="/manage-ads" className="block w-full">
             <button className="bg-[#D1FAE5] border border-green-200 text-[#065F46] font-medium py-3 px-6 rounded-full shadow-sm transition-colors w-full">
               Manage Ads
             </button>
           </Link>
        </div>

        {/* Working Search and Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search advertisements..." 
              className="block w-full pl-12 pr-3 py-3 border border-gray-200 rounded-full leading-5 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1877F2] sm:text-sm transition-colors"
            />
          </div>
          <Link to="/create-ad" className="w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 bg-[#1877F2] w-full md:w-auto text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors shadow-sm">
              <FiPlus size={20} /> Create Advertisement
            </button>
          </Link>
        </div>

        {/* Render Ad Listings */}
        <div className="flex flex-col gap-6 mb-8">
          {loading ? (
             <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-12 text-center text-gray-500 font-medium">Loading advertisements...</div>
          ) : currentAds.length === 0 ? (
             <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
               <h3 className="text-[20px] font-bold text-[#111111] mb-2">No Advertisements Found</h3>
               <p className="text-[15px] text-gray-500 mb-6">{searchTerm ? "No ads match your search criteria." : "There are no active campaigns in the database right now."}</p>
             </div>
          ) : (
            currentAds.map((ad) => (
              <div key={ad.id} className="bg-white rounded-[12px] shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow">
                <div className="md:w-1/3 h-56 md:h-auto">
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                </div>
                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-[20px] font-bold text-[#111111]">
                        {ad.title} <span className={`text-[14px] ${ad.badgeColor}`}>{ad.badge}</span>
                      </h2>
                      <div className="flex items-center gap-2 text-gray-400">
                        <button onClick={() => handleView(ad.id)} className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 hover:text-[#1877F2] transition-colors"><FiEye size={16}/></button>
                        <button onClick={() => handleEdit(ad.id)} className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 hover:text-green-600 transition-colors"><FiEdit size={16}/></button>
                        <button onClick={() => handleDelete(ad.id)} className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 hover:text-red-500 transition-colors"><FiTrash2 size={16}/></button>
                      </div>
                    </div>
                    <p className="text-[14px] font-medium text-gray-700 mb-2">{ad.duration}</p>
                    <p className="text-[13px] text-gray-500 line-clamp-2 mb-4">{ad.description}</p>
                    <div className="flex items-center gap-4 text-[13px] font-medium text-[#111111] mb-6">
                      <span className="flex items-center gap-2"><FiCalendar className="text-gray-400"/> {ad.date}</span>
                      <span>{ad.price}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 text-center md:text-left">
                    <div><p className="text-[12px] text-[#1877F2] font-medium mb-1">Clicks</p><p className="text-[14px] font-bold text-[#111111]">{ad.clicks}</p></div>
                    <div><p className="text-[12px] text-[#1877F2] font-medium mb-1">Impressions</p><p className="text-[14px] font-bold text-[#111111]">{ad.impressions}</p></div>
                    <div><p className="text-[12px] text-[#1877F2] font-medium mb-1">CTR</p><p className="text-[14px] font-bold text-[#111111]">{ad.ctr}</p></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Working Pagination */}
        {!loading && filteredAds.length > 0 && totalPages > 1 && (
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
    </div>
  );
};

export default ManageAds;