import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaGlobe, FaAward, FaMapMarkerAlt } from 'react-icons/fa';

const defaultGuidesData = [
  {
    name: 'Kasun Jayawardena',
    title: 'National Tourist Guide (10+ Yrs)',
    price: '9,500',
    priceUnit: 'day',
    rating: 4.9,
    isVerified: true,
    isOnline: true,
    badge: 'Elite Guide',
    languages: ['English', 'Japanese'],
    specialties: ['Cultural Triangle', 'Hiking', 'Wildlife'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Elena Rostova',
    title: 'Chauffeur Guide & History Expert',
    price: '7,800',
    priceUnit: 'day',
    rating: 5.0,
    badge: 'Gold Badge',
    languages: ['English', 'Russian'],
    specialties: ['Galle Fort', 'Archaeology', 'Art'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Niresh Kumar',
    title: 'Adventure & Nature Specialist',
    price: '8,000',
    priceUnit: 'day',
    rating: 4.8,
    isVerified: true,
    languages: ['English', 'Tamil', 'Hindi'],
    specialties: ['Ella Rock', 'Camping', 'Tea Estates'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Thusitha Perera',
    title: 'Wildlife & Safari Naturalist',
    price: '11,000',
    priceUnit: 'day',
    rating: 4.9,
    isOnline: true,
    languages: ['English', 'German'],
    specialties: ['Yala Safari', 'Bird Watching', 'Photography'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Aisha Ameer',
    title: 'Cultural Heritage Guide',
    price: '6,500',
    priceUnit: 'trip',
    rating: 4.7,
    languages: ['English', 'Arabic'],
    specialties: ['Kandy Temple', 'Local Food', 'Shopping'],
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Saman Kumara',
    title: 'Site Guide - Sigiriya',
    price: '5,000',
    priceUnit: 'trip',
    rating: 5.0,
    isVerified: true,
    badge: 'Local Expert',
    languages: ['English', 'French', 'Sinhala'],
    specialties: ['Sigiriya Rock', 'History', 'Ancient Arts'],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'
  }
];

const Guides_Card = () => {
  const [guidesData, setGuidesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/guides');
        const data = await response.json();
        if (data.success) {
          setGuidesData(data.data);
        } else {
          setGuidesData(defaultGuidesData); // fallback
        }
      } catch (error) {
        console.error('Error fetching guides:', error);
        setGuidesData(defaultGuidesData); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#EBF1FF] flex items-center justify-center">Loading guides...</div>;
  }

  return (
    <div className="min-h-screen bg-[#EBF1FF] font-sans text-gray-800 p-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6"> 
        
        {/* SIDEBAR */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Budget Guardian Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2 text-[#1E40AF] font-bold text-xs uppercase tracking-wider mb-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944a11.954 11.954 0 007.834 3.056 11.95 11.95 0 01-1.6 5.944 11.95 11.95 0 01-6.234 4.944 11.954 11.954 0 01-6.234-4.944 11.95 11.95 0 01-1.6-5.944zm8.92 4.71a1 1 0 10-1.414-1.414L8 9.586 7.328 8.914a1 1 0 00-1.414 1.414l1.383 1.383a1 1 0 001.414 0l2.374-2.374z" clipRule="evenodd" />
              </svg>
              <span>Budget Guardian</span>
            </div>
            <span className="text-gray-400 text-[10px] block font-bold tracking-wider">GUIDE BUDGET AVAILABLE</span>
            <div className="flex items-baseline space-x-1 mb-4">
              <span className="text-2xl font-black text-gray-900">145,000</span>
              <span className="text-xs font-bold text-gray-700">LKR</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-500">Trip Progress</span>
                <span className="text-[#1E40AF]">65% Used</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#1E40AF] h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <button className="w-full border-2 border-[#1E40AF] text-[#1E40AF] font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider hover:bg-blue-50 transition-colors">
              Manage Budget
            </button>
          </div>

          {/* Filters Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
              <button className="text-xs font-bold text-blue-600 hover:underline">Reset</button>
            </div>
            
            {/* Price Filter */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Price Range (LKR)</label>
              <div className="h-1 bg-gray-200 rounded-lg relative mb-2 mt-4">
                <div className="absolute h-1 bg-blue-600 rounded-lg left-0 right-0"></div>
                <div className="absolute w-4 h-4 bg-white border-2 border-blue-600 rounded-full -top-1.5 left-0"></div>
                <div className="absolute w-4 h-4 bg-white border-2 border-blue-600 rounded-full -top-1.5 right-0"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-bold">
                <span>3k</span>
                <span>30k+</span>
              </div>
            </div>

            {/* Languages Filter */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Languages</label>
              <div className="space-y-2">
                {['English', 'German', 'Russian', 'Japanese'].map((lang) => (
                  <label key={lang} className="flex items-center space-x-2 text-xs font-medium text-gray-600 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600 w-4 h-4" />
                    <span>{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Rating</label>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-medium text-gray-600 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 w-4 h-4" />
                    <span className="text-yellow-400 text-sm">★★★★★</span>
                  </div>
                  <span className="text-gray-400">(94)</span>
                </label>
                <label className="flex items-center justify-between text-xs font-medium text-gray-600 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-blue-600 w-4 h-4" />
                    <span className="text-yellow-400 text-sm">★★★★☆</span>
                  </div>
                  <span className="text-gray-400">(42)</span>
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-6">  
          
          {/* Blue Hero Banner */}
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl p-6 md:p-8 relative overflow-hidden text-white flex flex-col md:flex-row md:items-center justify-between min-h-[14rem] shadow-sm">
            <div className="max-w-xs sm:max-w-md z-10 pr-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">
                Expert Tour Guides For You
              </h2>
              <p className="text-blue-100 text-xs leading-relaxed mb-4 md:mb-6 font-normal opacity-90">
                Transform your journey with certified local experts, historians, and multi-lingual guides approved by SV Guide.
              </p>
              <button className="bg-white text-blue-700 font-bold text-xs px-5 py-3 rounded-xl flex items-center space-x-2 shadow-md uppercase tracking-wider hover:bg-blue-50 transition-colors w-fit">
                <span>Find by Attraction</span>
                <span>→</span>
              </button>
            </div>

            {/* Background Graphics / Fallback image container */}
            <div className="absolute right-0 bottom-0 top-0 w-1/3 md:w-1/2 z-0 flex items-center justify-end">
              <div className="text-white/10 text-[10rem] font-black select-none mr-[-2rem] hidden md:block">
                GUIDE
              </div>
            </div>
          </div>

          {/* Internal Tabs Filters */}
          <div className="flex space-x-2 text-xs font-bold">
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-sm">All Guides</button>
            <button className="bg-white text-gray-400 border border-gray-100 px-5 py-2.5 rounded-xl hover:bg-gray-50">Custom Offers (2)</button>
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {guidesData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((guide, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                
                {/* Guide Card Header/Image */}
                <div className="relative h-52 bg-gray-50">
                  <img src={guide.image} alt={guide.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  
                  {/* Bottom Image Badges */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                    {guide.isVerified && <span className="bg-blue-600 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shadow-xs">SLTDA Certified</span>}
                    {guide.isOnline && <span className="bg-green-500 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shadow-xs">Available</span>}
                    {guide.badge && <span className="bg-amber-500 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shadow-xs">{guide.badge}</span>}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center space-x-1 shadow-xs">
                    <FaStar className="text-amber-400 text-xs" />
                    <span className="text-xs font-black text-gray-800">{guide.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Guide Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 text-base">{guide.name}</h4>
                      <div className="text-right flex items-baseline justify-end">
                        <span className="text-lg font-black text-blue-600">{guide.price}</span>
                        <span className="text-[10px] font-bold text-gray-400 ml-0.5">/{guide.priceUnit}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs font-semibold mb-3 flex items-center">
                      <FaAward className="text-blue-500 mr-1 shrink-0" />
                      {guide.title}
                    </p>
                    
                    {/* Languages Spoken */}
                    <div className="flex items-center text-gray-400 text-[11px] font-medium mb-3">
                      <FaGlobe className="text-gray-400 mr-1.5 shrink-0" />
                      <span className="truncate">{guide.languages?.join(', ')}</span>
                    </div>
                    
                    <hr className="border-gray-100 my-2" />
                    
                    {/* Specialties / Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {guide.specialties?.map((spec, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-600 text-[9px] font-bold uppercase px-2 py-1 rounded-md tracking-wider">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/guide-booking/${guide._id}`, { state: { guide } })}
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition-colors shadow-xs mt-2"
                  >
                    Hire Guide
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          {(() => {
            const totalPages = Math.ceil(guidesData.length / itemsPerPage);
            return totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 pt-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-40"
                >
                  &lt;
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center border ${
                      currentPage === i + 1 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-500 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-40"
                >
                  &gt;
                </button>
              </div>
            );
          })()}
        </div> 

      </div> 
    </div>
  );
};

export default Guides_Card;