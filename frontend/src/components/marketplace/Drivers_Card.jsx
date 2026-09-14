import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaStar 
} from 'react-icons/fa';
import D0 from '../../assets/dirvercard/D0.png';
import { useTranslation } from 'react-i18next';

// Default Drivers Dummy Data (Fallback)
const defaultDriversData = [
  {
    name: 'Amila Perera',
    title: '12+ Years Experience',
    price: '8,500',
    priceUnit: 'day',
    rating: 4.9,
    isVerified: true,
    isOnline: true,
    tags: ['English', 'SUV Expert', 'Kandy Local'],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Sarah Wickramage',
    title: 'History Specialist',
    price: '6,200',
    priceUnit: 'trip',
    rating: 5.0,
    badge: 'Gold Badge',
    tags: ['German', 'History', 'Archaeology'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Fernando Tours',
    title: 'History Specialist',
    price: '6,200',
    priceUnit: 'trip',
    rating: 4.7,
    tags: ['German', 'History', 'Archaeology'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dilan Subasinha',
    title: '4+ Years Experience',
    price: '7,500',
    priceUnit: 'day',
    rating: 4.9,
    isVerified: true,
    isOnline: true,
    tags: ['English', 'SUV Expert', 'Kandy Local'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Ranjith Kulathunga',
    title: 'History Specialist',
    price: '8,300',
    priceUnit: 'trip',
    rating: 5.0,
    badge: 'Gold Badge',
    tags: ['German', 'History', 'Archaeology'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Ishan Gunarathna',
    title: 'History Specialist',
    price: '9,200',
    priceUnit: 'trip',
    rating: 4.7,
    tags: ['German', 'History', 'Archaeology'],
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300'
  },
];

const Drivers_Card = () => {
  const { t } = useTranslation();
  const [allDrivers, setAllDrivers] = useState([]);
  const [driversData, setDriversData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [budget, setBudget] = useState(20000);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/drivers');
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setAllDrivers(data.data);
          setDriversData(data.data);
        } else {
          setAllDrivers(defaultDriversData);
          setDriversData(defaultDriversData);
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setAllDrivers(defaultDriversData);
        setDriversData(defaultDriversData);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Dynamic filter effect
  useEffect(() => {
    let filtered = allDrivers;

    if (budget > 0) {
      filtered = filtered.filter((driver) => {
        const numPrice = typeof driver.price === 'number'
          ? driver.price
          : Number(String(driver.price || '0').replace(/[^0-9]/g, ''));
        return numPrice === 0 || numPrice <= budget;
      });
    }

    if (selectedRatings.length > 0) {
      filtered = filtered.filter((driver) => {
        const ratingFloor = Math.floor(driver.rating || 5);
        return selectedRatings.includes(ratingFloor);
      });
    }

    setDriversData(filtered);
    setCurrentPage(1);
  }, [budget, selectedRatings, allDrivers]);

  const handleRatingToggle = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const handleReset = () => {
    setBudget(20000);
    setSelectedRatings([]);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#EBF1FF] flex items-center justify-center">Loading drivers...</div>;
  }

  const budgetPercentage = Math.min(Math.max(((budget - 3000) / 17000) * 100, 0), 100);

  return (
    <div className="min-h-screen bg-[#EBF1FF] font-sans text-gray-800 p-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6"> 
        
        {/*  SIDEBAR  */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Budget Guardian Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2 text-[#1E40AF] font-bold text-xs uppercase tracking-wider mb-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944a11.954 11.954 0 007.834 3.056 11.95 11.95 0 01-1.6 5.944 11.95 11.95 0 01-6.234 4.944 11.954 11.954 0 01-1.6-5.944zm8.92 4.71a1 1 0 10-1.414-1.414L8 9.586 7.328 8.914a1 1 0 00-1.414 1.414l1.383 1.383a1 1 0 001.414 0l2.374-2.374z" clipRule="evenodd" />
              </svg>
              <span>{t("sidebar.budgetGuardian")}</span>
            </div>
            <span className="text-gray-400 text-[10px] block font-bold tracking-wider">{t("sidebar.availableFunds")}</span>
            <div className="flex flex-col mb-4 mt-1">
              <div className="flex items-baseline space-x-1 mb-2">
                <span className="text-2xl font-black text-gray-900">{budget.toLocaleString()}</span>
                <span className="text-xs font-bold text-gray-700">LKR</span>
              </div>
              <input 
                type="range" 
                min="3000" 
                max="20000" 
                step="500"
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#1E40AF]"
                style={{ background: `linear-gradient(to right, #1E40AF ${budgetPercentage}%, #E5E7EB ${budgetPercentage}%)` }}
              />
              <div className="flex justify-between text-xs text-gray-400 font-bold mt-2">
                <span>3k</span>
                <span>20k</span>
              </div>
            </div>
            <button 
              onClick={handleReset}
              className="w-full border-2 border-[#1E40AF] text-[#1E40AF] font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider hover:bg-blue-50 transition-colors"
            >
              {t("sidebar.manageBudget")}
            </button>
          </div>

          {/* Filters Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 text-sm">{t("sidebar.filters")}</h3>
              <button onClick={handleReset} className="text-xs font-bold text-blue-600 hover:underline">{t("sidebar.reset")}</button>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">{t("sidebar.rating")}</label>
              <div className="space-y-2">
                {[5, 4].map((star) => (
                  <label key={star} className="flex items-center justify-between text-xs font-medium text-gray-600 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={selectedRatings.includes(star)}
                        onChange={() => handleRatingToggle(star)}
                        className="rounded text-blue-600 w-4 h-4" 
                      />
                      <span className="text-yellow-400 text-sm">
                        {star === 5 ? '★★★★★' : '★★★★☆'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/*  MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-6">  
          
          {/* Blue Hero Banner */}
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl p-6 md:p-8 relative overflow-hidden text-white flex flex-col md:flex-row md:items-center justify-between min-h-[14rem] shadow-sm">
          
            <div className="max-w-xs sm:max-w-md z-10 pr-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">
                Recommended Drivers for You
              </h2>
              <p className="text-blue-100 text-xs leading-relaxed mb-4 md:mb-6 font-normal opacity-90">
                Top-rated professional drivers with multi-language support and deep local knowledge. Verified by SV Guide.
              </p>
              <button className="bg-white text-blue-700 font-bold text-xs px-5 py-3 rounded-xl flex items-center space-x-2 shadow-md uppercase tracking-wider hover:bg-blue-50 transition-colors w-fit">
                <span>Explore Destinations</span>
                <span>→</span>
              </button>
            </div>

            <div className="absolute right-0 bottom-0 top-0 w-1/3 md:w-1/2 z-0">
              <img 
                src={D0}
                alt="Recommended Travel Drivers" 
                className="object-cover -mt-8 w-full h-auto object-right pointer-events-none"
              />
            </div>
          </div>

          {/* Internal Tabs Filters */}
          <div className="flex space-x-2 text-xs font-bold">
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-sm">List View</button>
            <button className="bg-white text-gray-400 border border-gray-100 px-5 py-2.5 rounded-xl hover:bg-gray-50">Active Bids (3)</button>
          </div>

          {/* Drivers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {driversData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((driver, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                {/* Driver Card Header/Image */}
                <div className="relative h-48 bg-gray-50">
                  <img src={driver.image} alt={driver.name} className="w-full h-full object-cover" />
                  
                  {/* Bottom Image Badges */}
                  <div className="absolute bottom-3 left-3 flex space-x-1">
                    {driver.isVerified && <span className="bg-blue-600 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">Verified</span>}
                    {driver.isOnline && <span className="bg-green-500 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">Online</span>}
                    {driver.badge && <span className="bg-amber-500 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">{driver.badge}</span>}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center space-x-1 shadow-xs">
                    <FaStar className="text-amber-400 text-xs" />
                    <span className="text-xs font-black text-gray-800">{driver.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Driver Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 text-base">{driver.driverName || driver.name}</h4>
                      <div className="text-right flex items-baseline justify-end space-x-0.5">
                        <span className="text-lg font-black text-blue-600">{driver.price}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs font-bold mb-3">{driver.title}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {driver.tags.map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-500 text-[9px] font-bold uppercase px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/driver-booking/${driver._id}`, { state: { driver } })}
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          {(() => {
            const totalPages = Math.ceil(driversData.length / itemsPerPage);
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

export default Drivers_Card;