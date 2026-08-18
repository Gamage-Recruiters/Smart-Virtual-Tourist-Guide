import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2, FiPlus, FiTrendingUp, FiTrendingDown, FiDollarSign, FiMousePointer, FiBarChart2, FiUsers, FiCalendar, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import apiClient from '../services/adminApi';
import AdvertisementManagementBg from '../assets/travel-ads-scaled 1.png';

const ManageAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
        setError('');
        const response = await apiClient.get('/admin/ads');

        if (response && response.success && response.data.length > 0) {
          const formattedAds = response.data.map(ad => ({
            id: ad._id,
            image: ad.imageUrl || AdvertisementManagementBg,
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
      } catch (fetchError) {
        console.error("Error fetching ads:", fetchError);
        setError('Unable to load advertisements. Please check your connection and try again.');
        setAds([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  const handleView = (id) => navigate(`/admin/view-ad/${id}`);
  const handleEdit = (id) => navigate(`/admin/edit-ad/${id}`);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to completely remove this advertisement? This action cannot be undone.")) {
      try {
        const response = await apiClient.delete(`/admin/ads/${id}`);
        if (response && response.success) {
          setAds(ads.filter(ad => ad.id !== id));
        }
      } catch {
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

  return (
    <div className="min-h-screen w-full bg-white font-inter">

      <div
        className="relative flex min-h-[360px] w-full items-start bg-cover bg-center pt-24 sm:min-h-[500px] sm:pt-32 lg:h-[min(50.5vw,727px)] lg:min-h-[620px] lg:pt-[10.5vw]"
        style={{ backgroundImage: `url(${AdvertisementManagementBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent" />
        <div className="relative z-10 w-full px-6 sm:px-8 lg:px-[45px]">
          <h1 className="mb-3 text-[36px] font-extrabold leading-tight text-black sm:text-[40px]">Advertisement Management</h1>
          <p className="text-[18px] font-bold text-black sm:text-[21px] lg:text-[24px]">Create and manage promotional campaigns</p>
        </div>
      </div>

      <section className="bg-gradient-to-b from-[#A0DBFF] via-[#DDF3FF] to-white px-6 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-20">
      <div className="mx-auto w-full max-w-[1298px]">

        <div className="mx-auto mb-10 grid max-w-[1120px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          {statCards.map((stat) => (
            <div key={stat.id} className="flex min-h-[170px] flex-col justify-between rounded-[10px] border border-white bg-gradient-to-br from-white to-[#CFEFFF] p-5 shadow-[0_8px_24px_rgba(46,92,136,0.12)]">
               <div className="mb-3 flex items-start justify-between">
                  <div className="rounded-lg bg-[#F4F9FF] p-2.5">{stat.icon}</div>
                  <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${stat.isUp ? 'text-green-600 bg-green-100' : 'text-red-500 bg-red-100'}`}>
                    {stat.isUp ? <FiTrendingUp size={12}/> : <FiTrendingDown size={12}/>} {stat.trend}
                  </span>
               </div>
               <div className="flex flex-col">
                  <h3 className="mb-1 text-[14px] font-medium text-[#111111]">{stat.title}</h3>
                  <h2 className="text-[21px] font-bold text-[#111111]">{stat.value}</h2>
               </div>
            </div>
          ))}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 rounded-[10px] bg-white/75 p-3 shadow-sm md:grid-cols-3 md:gap-8">
           <Link to="/admin/users" className="block w-full">
             <button className="w-full rounded-full border border-slate-300 bg-white px-6 py-2.5 text-[14px] font-semibold text-[#111111] shadow-sm transition-colors hover:bg-slate-50">
               User Management
             </button>
           </Link>
           <Link to="/admin/listings" className="block w-full">
             <button className="w-full rounded-full border border-slate-300 bg-white px-6 py-2.5 text-[14px] font-semibold text-[#111111] shadow-sm transition-colors hover:bg-slate-50">
               Approve Listings
             </button>
           </Link>
           <Link to="/admin/ads" className="block w-full">
             <button className="w-full rounded-full border border-green-200 bg-[#D7FDE1] px-6 py-2.5 text-[14px] font-semibold text-[#065F46] shadow-sm">
               Manage Ads
             </button>
           </Link>
        </div>

        <div className="mx-auto mb-8 flex max-w-[1080px] flex-col items-center justify-between gap-4 md:flex-row">
          <div className="relative w-full md:max-w-[430px]">
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
              placeholder="Search advertisements..."
              className="block h-[42px] w-full rounded-full border border-slate-300 bg-white pl-12 pr-4 text-[13px] leading-5 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
            />
          </div>
          <Link to="/admin/ads/create" className="w-full md:w-auto">
            <button className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[5px] bg-[#0075FF] px-7 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 md:w-auto">
              <FiPlus size={17} /> Create Advertisement
            </button>
          </Link>
        </div>

        <div className="mb-10 flex flex-col gap-11">
          {loading ? (
             <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-12 text-center text-gray-500 font-medium">Loading advertisements...</div>
          ) : error ? (
             <div className="rounded-[10px] border border-red-100 bg-white p-12 text-center font-medium text-red-500 shadow-sm">{error}</div>
          ) : currentAds.length === 0 ? (
             <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
               <h3 className="text-[20px] font-bold text-[#111111] mb-2">No Advertisements Found</h3>
               <p className="text-[15px] text-gray-500 mb-6">{searchTerm ? "No ads match your search criteria." : "There are no active campaigns in the database right now."}</p>
             </div>
          ) : (
            currentAds.map((ad) => (
              <article key={ad.id} className="mx-auto flex w-full max-w-[1080px] flex-col overflow-hidden rounded-[5px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(46,92,136,0.08)] transition-shadow hover:shadow-md md:h-[270px] md:flex-row">
                <div className="h-56 sm:h-72 md:h-full md:w-[41%]">
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5 md:w-[59%] md:p-6">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-[18px] font-medium text-[#111111] md:text-[21px]">
                        {ad.title} <span className={`text-[13px] font-medium ${ad.badgeColor}`}>{ad.badge}</span>
                      </h2>
                      <div className="flex items-center gap-2 text-gray-400">
                        <button aria-label={`View ${ad.title}`} onClick={() => handleView(ad.id)} className="rounded border border-slate-200 p-1.5 transition-colors hover:bg-slate-50 hover:text-[#1877F2]"><FiEye size={14}/></button>
                        <button aria-label={`Edit ${ad.title}`} onClick={() => handleEdit(ad.id)} className="rounded border border-slate-200 p-1.5 transition-colors hover:bg-slate-50 hover:text-green-600"><FiEdit size={14}/></button>
                        <button aria-label={`Delete ${ad.title}`} onClick={() => handleDelete(ad.id)} className="rounded border border-slate-200 p-1.5 transition-colors hover:bg-slate-50 hover:text-red-500"><FiTrash2 size={14}/></button>
                      </div>
                    </div>
                    <p className="mb-1 text-[12px] font-medium text-slate-700">{ad.duration}</p>
                    <p className="mb-3 line-clamp-2 text-[11px] text-slate-600">{ad.description}</p>
                    <div className="mb-3 flex flex-wrap items-center gap-4 text-[11px] font-medium text-[#111111]">
                      <span className="flex items-center gap-2"><FiCalendar className="text-gray-400"/> {ad.date}</span>
                      <span>{ad.price}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-3 text-center md:text-left">
                    <div><p className="mb-1 text-[11px] font-medium text-[#0075FF]">Clicks</p><p className="text-[11px] font-medium text-[#111111]">{ad.clicks}</p></div>
                    <div><p className="mb-1 text-[11px] font-medium text-[#0075FF]">Impressions</p><p className="text-[11px] font-medium text-[#111111]">{ad.impressions}</p></div>
                    <div><p className="mb-1 text-[11px] font-medium text-[#0075FF]">CTR</p><p className="text-[11px] font-medium text-[#111111]">{ad.ctr}</p></div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {!loading && filteredAds.length > 0 && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-end gap-2 pb-8 lg:pr-[109px]">
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
    </div>
  );
};

export default ManageAds;
