import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2, FiPlus, FiTrendingUp, FiTrendingDown, FiDollarSign, FiMousePointer, FiBarChart2, FiUsers, FiCalendar } from 'react-icons/fi';

const ManageAds = () => {
  const statCards = [
    { id: 1, title: 'Total Budget', value: '$6570', trend: '+12.5%', isUp: true, icon: <FiDollarSign size={20} className="text-[#1877F2]" /> },
    { id: 2, title: 'Total Clicks', value: '16,570', trend: '+4.2%', isUp: true, icon: <FiMousePointer size={20} className="text-[#1877F2]" /> },
    { id: 3, title: 'Total Impressions', value: '158,568', trend: '-1.5%', isUp: false, icon: <FiBarChart2 size={20} className="text-[#1877F2]" /> },
    { id: 4, title: 'Average CTR', value: '3.15%', trend: '+0.4%', isUp: true, icon: <FiUsers size={20} className="text-[#1877F2]" /> },
  ];

  const adsData = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1544473244-f6895e69ce8d?w=800&q=80',
      title: 'Ella Adventure Experience',
      badge: '- Book Now',
      badgeColor: 'text-red-500',
      duration: '5 Days | Scenic Train & Hiking',
      description: 'Explore the beauty of Ella including Nine Arches Bridge, Little Adam\'s Peak, and scenic train rides with expert travel guides.',
      date: 'May 5, 2026 - Jul 20, 2026',
      price: '$400',
      clicks: '6853',
      impressions: '43675',
      ctr: '3.5%'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1588598198321-16d1d07ec682?w=800&q=80',
      title: 'Sigiriya Rock Adventure',
      badge: '- 20% Off',
      badgeColor: 'text-[#1877F2]',
      duration: '3 Days | Scenic Train & Hiking',
      description: 'Explore Sigiriya Rock with our discounted tour. Enjoy guided climbing, rich history, and stunning views. Limited-time offer!',
      date: 'May 5, 2026 - Jul 20, 2026',
      price: '$560',
      clicks: '4589',
      impressions: '28685',
      ctr: '2.5%'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1586861115462-817abdc16c73?w=800&q=80',
      title: 'Mirissa Whale Watching Tour',
      badge: '',
      badgeColor: '',
      duration: '2 Days | Marine Safari',
      description: 'Join our unforgettable whale watching tour in Mirissa and experience the beauty of Sri Lanka\'s marine wildlife.',
      date: 'Apr 10, 2026 - Aug 10, 2026',
      price: '$150',
      clicks: '5682',
      impressions: '71245',
      ctr: '3.1%'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      title: 'Tropical Beach Escape',
      badge: '- 20% Off',
      badgeColor: 'text-[#1877F2]',
      duration: '1 Days | Cultural & Heritage Package',
      description: 'Experience luxury beachfront stays, guided tours, and unforgettable ocean views.',
      date: 'Apr 15, 2026 - Aug 10, 2026',
      price: '$280',
      clicks: '2705',
      impressions: '13030',
      ctr: '1.8%'
    }
  ];

  return (
    <div className="font-inter w-full bg-[#EBF4FF] min-h-screen pb-12">
      
      {/* Hero Section */}
      <div 
        className="relative w-full h-[350px] bg-cover bg-center flex items-center px-6 md:px-16"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544085311-11a028465b03?w=1600&q=80')` }}
      >
        <div className="absolute inset-0 bg-black/10"></div> 
        <div className="relative z-10 text-[#111111] drop-shadow-sm max-w-7xl mx-auto w-full">
          <h1 className="text-[36px] font-bold mb-2 text-[#111111]">Advertisement Management</h1>
          <p className="text-[16px] font-medium text-gray-800">Create and manage promotional campaigns</p>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-7xl mx-auto -mt-16 relative z-20">
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.id} className="bg-gradient-to-br from-white to-[#F8FAFC] p-6 rounded-[12px] shadow-sm border border-white flex flex-col justify-between">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-[#EBF4FF] rounded-lg">
                    {stat.icon}
                  </div>
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

        {/* Navigation Tabs */}
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

        {/* Action Bar */}
        <div className="flex justify-end mb-6">
          <Link to="/create-ad"> {/* Will link to Create Ad page later */}
            <button className="flex items-center justify-center gap-2 bg-[#1877F2] text-white px-6 py-3 rounded-[8px] font-medium hover:bg-blue-600 transition-colors shadow-sm">
              <FiPlus size={20} /> Create Advertisement
            </button>
          </Link>
        </div>

        {/* Ad Listings */}
        <div className="flex flex-col gap-6 mb-12">
          {adsData.map((ad) => (
            <div key={ad.id} className="bg-white rounded-[12px] shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow">
              
              <div className="md:w-1/3 h-56 md:h-auto">
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
              </div>

              <div className="md:w-2/3 p-6 flex flex-col justify-between">
                
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-[20px] font-bold text-[#111111]">
                      {ad.title} <span className={ad.badgeColor}>{ad.badge}</span>
                    </h2>
                    <div className="flex items-center gap-2 text-gray-400">
                      <button className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 hover:text-[#1877F2] transition-colors"><FiEye size={16}/></button>
                      <button className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 hover:text-green-600 transition-colors"><FiEdit size={16}/></button>
                      <button className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 hover:text-red-500 transition-colors"><FiTrash2 size={16}/></button>
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
                  <div>
                    <p className="text-[12px] text-[#1877F2] font-medium mb-1">Clicks</p>
                    <p className="text-[14px] font-bold text-[#111111]">{ad.clicks}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#1877F2] font-medium mb-1">Impressions</p>
                    <p className="text-[14px] font-bold text-[#111111]">{ad.impressions}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#1877F2] font-medium mb-1">CTR</p>
                    <p className="text-[14px] font-bold text-[#111111]">{ad.ctr}</p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 pb-8">
           <button className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
             &lt;
           </button>
           <button className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-[#A855F7] text-white font-medium shadow-sm">
             1
           </button>
           <button className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
             2
           </button>
           <button className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
             3
           </button>
           <button className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
             &gt;
           </button>
        </div>

      </div>
    </div>
  );
};

export default ManageAds;