import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiClock, FiCheckCircle, FiXCircle, FiShield, FiMapPin, FiFileText, FiEye, FiCheck, FiX, FiStar } from 'react-icons/fi';

const ApproveListings = () => {
  const statCards = [
    { id: 1, title: 'Pending Review', value: '6', subText: '3 high priority', subTextColor: 'text-yellow-600', icon: <FiClock size={20} className="text-yellow-500" /> },
    { id: 2, title: 'Rejected', value: '1', subText: 'This month', subTextColor: 'text-red-500', icon: <FiXCircle size={20} className="text-gray-700" /> },
    { id: 3, title: 'Approved', value: '1', subText: 'Needs revision', subTextColor: 'text-red-500', icon: <FiCheckCircle size={20} className="text-red-500" /> },
    { id: 4, title: 'Avg Verification', value: '90%', subText: 'Quality score', subTextColor: 'text-blue-500', icon: <FiShield size={20} className="text-blue-500" /> },
  ];

  const listingsData = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
      title: 'Premium Island Tours & Transfers',
      rating: '4.9',
      providerInitial: 'K',
      providerName: 'KumaraTransport Services',
      since: 'Since 2018',
      description: 'Professional, licensed driver with 15+ years experience. Air-conditioned luxury vehicles, English speaking, island-wide tours available. Specializing in airport transfers and multi-day tours.',
      location: 'Negombo - Island Wide Service',
      price: '$50 - $120 per day',
      submittedDate: 'Submitted 2026-03-02',
      verification: '92% Verified',
      tags: ['AC', 'WiFi Hotspot', 'Guide', '+1 more']
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      title: 'Cinnamon Grand Colombo',
      rating: '4.9',
      providerInitial: 'C',
      providerName: 'Cinnamon Hotels & Resorts',
      since: 'Since 2015',
      description: 'Luxury 5-star hotel in the heart of Colombo with world-class amenities, spa facilities, and multiple dining options. Award-winning hospitality with modern rooms and exceptional service.',
      location: 'Colombo 03, Western Province',
      price: '$150 - $400 per night',
      submittedDate: 'Submitted 2024-03-01',
      verification: '95% Verified',
      tags: ['Infinity Pool', 'Spa & Wellness', 'Fitness Center', '+4 more']
    },
    {
      id: 3,
      image: 'https://res.klook.com/image/upload/activities/h5zeuyszyjq28q9yprwq.jpg',
      title: 'Sigiriya Rock Fortress Heritage Tour',
      rating: '4.8',
      providerInitial: 'C',
      providerName: 'Cultural Heritage Tours Lanka',
      since: 'Since 2016',
      description: 'Expert-guided tour of the UNESCO World Heritage Site, Sigiriya Rock Fortress. Includes entrance fees, professional archaeologist guide, and photography assistance.',
      location: 'Sigiriya, Central Province',
      price: '$45 per person (min 2 people)',
      submittedDate: 'Submitted 2026-02-10',
      verification: '88% Verified',
      tags: ['Entrance Fees Included', 'Professional Archaeologist Guide', 'Photography Spots', '+1 more']
    }
  ];

  return (
    <div className="font-inter w-full bg-[#EBF4FF] min-h-screen pb-12">
      
      {/* 1. Page Specific Hero Section */}
      <div 
        className="relative w-full h-[300px] bg-cover bg-center flex items-center px-6 md:px-16"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544085311-11a028465b03?w=1600&q=80')` }}
      >
        <div className="absolute inset-0 bg-black/10"></div> 
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
                     <h2 className="text-[32px] font-medium text-[#111111] mt-1">{stat.value}</h2>
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
          <div className="flex gap-4 w-full md:w-auto">
             <button className="flex-1 md:flex-none bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full text-[14px] font-medium shadow-sm flex items-center justify-between gap-4">
               Sort: Date <span className="text-gray-400">▼</span>
             </button>
             <button className="flex-1 md:flex-none bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full text-[14px] font-medium shadow-sm flex items-center justify-between gap-4">
               Priority <span className="text-gray-400">▼</span>
             </button>
          </div>
        </div>

        {/* 5. Listing Cards */}
        <div className="flex flex-col gap-6 mb-12">
          {listingsData.map((listing) => (
            <div key={listing.id} className="bg-white rounded-[12px] shadow-sm border border-gray-100 flex flex-col lg:flex-row overflow-hidden hover:shadow-md transition-shadow">
              
              {/* Image Section */}
              <div className="lg:w-2/5 h-64 lg:h-auto">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
              </div>

              {/* Content Section */}
              <div className="lg:w-3/5 p-6 flex flex-col justify-between">
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-[22px] font-bold text-[#111111] leading-tight">{listing.title}</h2>
                    <div className="flex items-center gap-1 text-[14px] font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded-md">
                      <FiStar className="text-yellow-400 fill-current" /> {listing.rating}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-[14px]">
                        {listing.providerInitial}
                      </div>
                      <span className="text-[14px] font-medium text-[#111111]">{listing.providerName}</span>
                    </div>
                    <span className="text-[12px] font-medium text-gray-500">{listing.since}</span>
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
                        <FiFileText className="text-gray-500" size={16} /> {listing.submittedDate}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end gap-3">
                      <span className="text-[14px] font-bold text-[#111111]">{listing.price}</span>
                      <span className="text-[13px] font-medium text-[#1877F2]">{listing.verification}</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-gray-100 pt-6">
                    
                    <div className="flex flex-wrap gap-2">
                      {listing.tags.map((tag, index) => (
                        <span key={index} className="bg-[#EBF4FF] text-[#1877F2] px-3 py-1.5 rounded-[6px] text-[12px] font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-[#111111] rounded-[6px] text-[13px] font-medium hover:bg-gray-50 transition-colors">
                        <FiEye size={16} /> View Full Details
                      </button>
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-[#1877F2] text-white rounded-[6px] text-[13px] font-medium hover:bg-blue-600 transition-colors">
                        <FiCheck size={16} /> Approve
                      </button>
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-[#6A994E] text-white rounded-[6px] text-[13px] font-medium hover:bg-[#5a8342] transition-colors">
                        <FiX size={16} /> Reject
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* 6. Pagination */}
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

export default ApproveListings;