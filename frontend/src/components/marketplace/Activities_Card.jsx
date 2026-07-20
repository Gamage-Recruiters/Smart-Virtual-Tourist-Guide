import React, { useState, useEffect } from 'react';
import { 
  FaStar, FaMapMarkerAlt, FaClock, FaRunning, 
  FaCalendarAlt, FaCheckCircle, FaUserFriends 
} from 'react-icons/fa';

// Default Activities Dummy Data
const defaultActivitiesData = [
  {
    title: 'Kitulgala White Water Rafting',
    location: 'Kitulgala, Sri Lanka',
    category: 'Adventure, Water Sports',
    duration: '3 Hours',
    groupSize: 'Max 8 People',
    rating: 4.8,
    reviews: 950,
    price: 4500, // LKR per person
    hasFreeCancellation: true,
    isInstantBooking: true,
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Sigiriya Rock Fortress Guided Tour',
    location: 'Sigiriya, Matale',
    category: 'History, Cultural',
    duration: '4 Hours',
    groupSize: 'Private Tour',
    rating: 4.9,
    reviews: 2410,
    price: 3500,
    hasFreeCancellation: true,
    isInstantBooking: false,
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Ella Rock Sunrise Trekking',
    location: 'Ella, Badulla',
    category: 'Hiking, Nature',
    duration: '5 Hours',
    groupSize: 'Max 12 People',
    rating: 4.7,
    reviews: 680,
    price: 2800,
    hasFreeCancellation: false,
    isInstantBooking: true,
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Mirissa Whale Watching Cruise',
    location: 'Mirissa, Matara',
    category: 'Wildlife, Boat Tour',
    duration: '4-6 Hours',
    groupSize: 'Shared Boat',
    rating: 4.6,
    reviews: 1820,
    price: 8500,
    hasFreeCancellation: true,
    isInstantBooking: true,
    image: 'https://images.unsplash.com/photo-1568444438385-ecef1a33b544?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Udawalawe National Park Safari',
    location: 'Udawalawe',
    category: 'Wildlife, 4x4 Safari',
    duration: '3 Hours',
    groupSize: 'Max 6 Per Jeep',
    rating: 4.8,
    reviews: 1430,
    price: 6000,
    hasFreeCancellation: true,
    isInstantBooking: true,
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Surf Lessons in Weligama Bay',
    location: 'Weligama, Matara',
    category: 'Water Sports, Lessons',
    duration: '2 Hours',
    groupSize: '1-on-1 or Groups',
    rating: 4.5,
    reviews: 390,
    price: 3000,
    hasFreeCancellation: true,
    isInstantBooking: false,
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=600'
  }
];

const Activities_Card = () => {
  const [activitiesData, setActivitiesData] = useState(defaultActivitiesData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/activities');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          // Map backend data to frontend structure
          const formattedData = result.data.map((act) => ({
            title: act.title,
            location: act.location,
            category: act.category,
            duration: act.duration,
            groupSize: `Max ${act.maxParticipants} People`,
            rating: act.averageRating || 0,
            reviews: act.totalReviews || 0,
            price: act.pricePerPerson,
            hasFreeCancellation: true, // Mock value
            isInstantBooking: true, // Mock value
            image: (act.images && act.images.length > 0) 
              ? act.images[0] 
              : 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&q=80&w=600'
          }));
          setActivitiesData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="min-h-screen bg-[#EBF1FF] font-sans text-gray-800 p-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6"> 
        
        {/* SIDEBAR FILTERS */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Budget Guardian Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2 text-[#1E40AF] font-bold text-xs uppercase tracking-wider mb-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944a11.954 11.954 0 007.834 3.056 11.95 11.95 0 01-1.6 5.944 11.95 11.95 0 01-6.234 4.944 11.954 11.954 0 01-6.234-4.944 11.95 11.95 0 01-1.6-5.944zm8.92 4.71a1 1 0 10-1.414-1.414L8 9.586 7.328 8.914a1 1 0 00-1.414 1.414l1.383 1.383a1 1 0 001.414 0l2.374-2.374z" clipRule="evenodd" />
              </svg>
              <span>Budget Guardian</span>
            </div>
            <span className="text-gray-400 text-[10px] block font-bold tracking-wider">ACTIVITIES BUDGET</span>
            <div className="flex items-baseline space-x-1 mb-4">
              <span className="text-2xl font-black text-gray-900">25,000</span>
              <span className="text-xs font-bold text-gray-700">LKR</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
              <div className="bg-[#1E40AF] h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <button className="w-full border-2 border-[#1E40AF] text-[#1E40AF] font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider hover:bg-blue-50 transition-colors">
              Manage Budget
            </button>
          </div>

          {/* Filters Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-6">Filters</h3>
            
            {/* Activity Category Filter */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Activity Type</label>
              <div className="space-y-2">
                {['Adventure & Sports', 'Cultural & History', 'Nature & Wildlife', 'Water Sports'].map(type => (
                  <label key={type} className="flex items-center space-x-2 text-xs font-medium text-gray-600 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600 w-4 h-4" />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Duration</label>
              <div className="space-y-2">
                {['Under 3 Hours', '3 - 6 Hours', 'Full Day Tours'].map(dur => (
                  <label key={dur} className="flex items-center space-x-2 text-xs font-medium text-gray-600 cursor-pointer">
                    <input type="radio" name="duration" className="text-blue-600 w-4 h-4" />
                    <span>{dur}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Extra Options */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Booking Options</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-xs font-medium text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 w-4 h-4" />
                  <span>Free Cancellation</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-medium text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 w-4 h-4" />
                  <span>Instant Confirmation</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-6">  
          
          {/* Activity Hero Banner */}
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl p-6 md:p-8 relative overflow-hidden text-white min-h-[12rem] shadow-sm flex items-center">
            <div className="max-w-md z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Unforgettable Experiences</h2>
              <p className="text-blue-100 text-xs mb-6 opacity-90">
                Book handpicked day tours, outdoor adventures, and unique cultural experiences across Sri Lanka.
              </p>
              <div className="flex space-x-3">
                <button className="bg-white text-blue-700 font-bold text-[10px] px-5 py-2.5 rounded-xl uppercase tracking-wider shadow-md">Trending Activities</button>
                <button className="bg-blue-500/30 backdrop-blur-sm text-white border border-white/20 font-bold text-[10px] px-5 py-2.5 rounded-xl uppercase tracking-wider">Free Cancellation</button>
              </div>
            </div>
            {/* Background Accent Text */}
            <div className="absolute right-4 bottom-[-1rem] opacity-10 text-[9rem] font-black pointer-events-none select-none">
              DO IT
            </div>
          </div>

          {/* Activities Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activitiesData.map((act, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all">
                
                {/* Image & Badges */}
                <div className="relative h-48 bg-gray-100">
                  <img src={act.image} alt={act.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                  
                  {/* Free Cancellation Badge */}
                  {act.hasFreeCancellation && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-500 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-xs">
                        Free Cancellation
                      </span>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center space-x-1 shadow-xs">
                    <FaStar className="text-amber-400 text-[11px]" />
                    <span className="text-xs font-black text-gray-800">{act.rating}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                      {act.category}
                    </span>
                    <h4 className="font-bold text-gray-900 text-base leading-tight mb-2 group-hover:text-blue-600 transition-colors truncate">
                      {act.title}
                    </h4>
                    
                    <p className="text-gray-400 text-[11px] font-bold flex items-center mb-3">
                      <FaMapMarkerAlt className="mr-1 text-gray-400 shrink-0" /> {act.location}
                    </p>

                    <hr className="border-gray-100 my-3" />

                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 gap-2 text-gray-600 text-xs font-medium">
                      <div className="flex items-center">
                        <FaClock className="mr-1.5 text-gray-400" size={11} />
                        <span>{act.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <FaUserFriends className="mr-1.5 text-gray-400" size={11} />
                        <span className="truncate">{act.groupSize}</span>
                      </div>
                    </div>

                    {/* Instant confirmation status */}
                    {act.isInstantBooking && (
                      <p className="text-green-600 text-[10px] font-bold uppercase flex items-center mt-3">
                        <FaCheckCircle className="mr-1" size={10} /> Instant Confirmation
                      </p>
                    )}
                  </div>

                  {/* Pricing and Action Button */}
                  <div className="mt-auto pt-2 border-t border-gray-50">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <span className="text-gray-400 text-[10px] block font-bold uppercase tracking-wider">From</span>
                        <div className="flex items-baseline space-x-0.5">
                          <span className="text-lg font-black text-gray-900">{act.price.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-gray-500">LKR</span>
                        </div>
                      </div>
                      <span className="text-gray-400 text-[11px] font-medium mb-0.5">Based on {act.reviews} reviews</span>
                    </div>
                    
                    <button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition-all shadow-xs flex items-center justify-center space-x-2">
                      <FaCalendarAlt size={11} />
                      <span>Check Availability</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
          )}

          {/* Load More Section */}
          <div className="flex justify-center pt-4">
             <button className="bg-white text-gray-600 border border-gray-200 font-bold text-xs px-8 py-3 rounded-xl uppercase tracking-wider hover:bg-gray-50 transition-colors">
               View All Activities
             </button>
          </div>

        </div> 
      </div> 
    </div>
  );
};

export default Activities_Card;