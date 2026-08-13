import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaStar, FaMapMarkerAlt, FaWifi, FaSwimmingPool, 
  FaCoffee, FaParking, FaSnowflake 
} from 'react-icons/fa';

// Default Hotels Dummy Data
const defaultHotelsData = [
  {
    name: 'Grand Hyatt Regency',
    location: 'Colombo 03',
    starRating: 5,
    price: '28,500',
    priceUnit: 'night',
    userRating: 4.8,
    reviews: 1240,
    isFeatured: true,
    amenities: ['wifi', 'pool', 'ac', 'parking'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Cinnamon Lakeside',
    location: 'Kandy Central',
    starRating: 4,
    price: '18,200',
    priceUnit: 'night',
    userRating: 4.6,
    reviews: 850,
    isFeatured: false,
    amenities: ['wifi', 'pool', 'coffee', 'ac'],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Heritance Ahungalla',
    location: 'Galle Coastal',
    starRating: 5,
    price: '32,000',
    priceUnit: 'night',
    userRating: 4.9,
    reviews: 2100,
    isFeatured: true,
    amenities: ['wifi', 'pool', 'ac', 'parking', 'coffee'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'The Sigiriya Boutique',
    location: 'Sigiriya',
    starRating: 4,
    price: '14,500',
    priceUnit: 'night',
    userRating: 4.5,
    reviews: 560,
    isFeatured: false,
    amenities: ['wifi', 'ac', 'parking'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: '98 Acres Resort',
    location: 'Ella Rock Area',
    starRating: 5,
    price: '45,000',
    priceUnit: 'night',
    userRating: 5.0,
    reviews: 3200,
    isFeatured: true,
    amenities: ['wifi', 'coffee', 'parking'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Jetwing Blue',
    location: 'Negombo Beach',
    starRating: 4,
    price: '16,800',
    priceUnit: 'night',
    userRating: 4.4,
    reviews: 980,
    isFeatured: false,
    amenities: ['wifi', 'pool', 'ac'],
    image: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&q=80&w=600'
  }
];

const Hotels_Card = () => {
  const navigate = useNavigate();
  const [hotelsData, setHotelsData] = useState(defaultHotelsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [budget, setBudget] = useState(100000);
  const itemsPerPage = 6;

  React.useEffect(() => {
    let filtered = defaultHotelsData;
    
    if (selectedStars.length > 0) {
      filtered = filtered.filter(hotel => selectedStars.includes(hotel.starRating));
    }
    
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(hotel => 
        selectedAmenities.every(a => hotel.amenities.includes(a))
      );
    }
    
    if (budget > 0) {
      filtered = filtered.filter(hotel => {
        const priceNum = Number(hotel.price.replace(/,/g, ''));
        return priceNum <= budget;
      });
    }
    
    setHotelsData(filtered);
    setCurrentPage(1);
  }, [selectedStars, selectedAmenities, budget]);

  const handleStarToggle = (star) => {
    setSelectedStars(prev => 
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const handleAmenityToggle = (amenityDisplay) => {
    let key;
    if (amenityDisplay === 'Swimming Pool') key = 'pool';
    else if (amenityDisplay === 'Free WiFi') key = 'wifi';
    else if (amenityDisplay === 'Air Conditioning') key = 'ac';
    else if (amenityDisplay === 'Breakfast Incl.') key = 'coffee';

    if (!key) return;

    setSelectedAmenities(prev => 
      prev.includes(key) ? prev.filter(a => a !== key) : [...prev, key]
    );
  };

  const getAmenityIcon = (type) => {
    switch(type) {
      case 'wifi': return <FaWifi title="Free WiFi" />;
      case 'pool': return <FaSwimmingPool title="Pool" />;
      case 'ac': return <FaSnowflake title="AC" />;
      case 'coffee': return <FaCoffee title="Breakfast" />;
      case 'parking': return <FaParking title="Parking" />;
      default: return null;
    }
  };

  const budgetPercentage = ((budget - 10000) / 90000) * 100;

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
            <span className="text-gray-400 text-[10px] block font-bold tracking-wider">HOTEL BUDGET</span>
            <div className="flex flex-col mb-4 mt-1">
              <div className="flex items-baseline space-x-1 mb-2">
                <span className="text-2xl font-black text-gray-900">{budget.toLocaleString()}</span>
                <span className="text-xs font-bold text-gray-700">LKR</span>
              </div>
              <input 
                type="range" 
                min="10000" 
                max="100000" 
                step="5000"
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#1E40AF]"
                style={{ background: `linear-gradient(to right, #1E40AF ${budgetPercentage}%, #E5E7EB ${budgetPercentage}%)` }}
              />
              <div className="flex justify-between text-xs text-gray-400 font-bold mt-2">
                <span>10k</span>
                <span>100k</span>
              </div>
            </div>
          </div>

          {/* Filters Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-6">Filters</h3>
            
            {/* Star Rating Filter */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Star Rating</label>
              <div className="space-y-2">
                {[5, 4, 3].map(star => (
                  <label key={star} className="flex items-center space-x-2 text-xs font-medium text-gray-600 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-blue-600" 
                      checked={selectedStars.includes(star)}
                      onChange={() => handleStarToggle(star)}
                    />
                    <div className="flex text-amber-400">
                      {[...Array(star)].map((_, i) => <FaStar key={i} size={10} />)}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities Filter */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Amenities</label>
              <div className="space-y-2">
                {['Swimming Pool', 'Free WiFi', 'Air Conditioning', 'Breakfast Incl.'].map(item => {
                  let key;
                  if (item === 'Swimming Pool') key = 'pool';
                  else if (item === 'Free WiFi') key = 'wifi';
                  else if (item === 'Air Conditioning') key = 'ac';
                  else if (item === 'Breakfast Incl.') key = 'coffee';

                  return (
                    <label key={item} className="flex items-center space-x-2 text-xs font-medium text-gray-600 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600" 
                        checked={selectedAmenities.includes(key)}
                        onChange={() => handleAmenityToggle(item)}
                      />
                      <span>{item}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-6">  
          
          {/* Blue Hero Banner */}
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl p-6 md:p-8 relative overflow-hidden text-white min-h-[12rem] shadow-sm flex items-center">
            <div className="max-w-md z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Book Your Perfect Stay</h2>
              <p className="text-blue-100 text-xs mb-6 opacity-90">
                Explore a handpicked collection of luxury hotels, resorts, and boutiques across Sri Lanka. Best rates guaranteed.
              </p>
              <div className="flex space-x-3">
                <button className="bg-white text-blue-700 font-bold text-[10px] px-4 py-2.5 rounded-lg uppercase tracking-wider shadow-md">Popular Deals</button>
                <button className="bg-blue-500/30 backdrop-blur-sm text-white border border-white/20 font-bold text-[10px] px-4 py-2.5 rounded-lg uppercase tracking-wider">Map View</button>
              </div>
            </div>
            <div className="absolute right-[-2rem] top-[-2rem] opacity-10">
               <svg width="300" height="300" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5 21h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2zM5 5h14v14H5V5z"/></svg>
            </div>
          </div>

          {/* Hotels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {hotelsData.map((hotel, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all">
                
                {/* Image Section */}
                <div className="relative h-48">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {hotel.isFeatured && <span className="bg-blue-600 text-white text-[9px] font-bold uppercase px-2 py-1 rounded">Best Seller</span>}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                    <FaStar className="text-amber-400 text-[10px]" />
                    <span className="text-xs font-black text-gray-800">{hotel.userRating}</span>
                  </div>
                </div>

                {/* Body Section */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="mb-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 text-base leading-tight">{hotel.name}</h4>
                    </div>
                    <p className="text-gray-400 text-[11px] font-bold flex items-center mt-1">
                      <FaMapMarkerAlt className="mr-1 text-blue-500" /> {hotel.location}
                    </p>
                    <div className="flex text-amber-400 mt-1.5">
                      {[...Array(hotel.starRating)].map((_, i) => <FaStar key={i} size={10} />)}
                    </div>
                  </div>

                  {/* Amenities Icons */}
                  <div className="flex space-x-3 text-gray-400 mb-4 border-y border-gray-50 py-3">
                    {hotel.amenities.map((item, i) => (
                      <span key={i} className="text-sm hover:text-blue-500 transition-colors">
                        {getAmenityIcon(item)}
                      </span>
                    ))}
                    <span className="text-[10px] font-bold self-center text-gray-300">+{Math.floor(Math.random()*5)} more</span>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Price per night</p>
                        <p className="text-lg font-black text-blue-600">LKR {hotel.price}</p>
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium">{hotel.reviews} reviews</p>
                    </div>
                    <button 
                      onClick={() => navigate('/hotel-booking', { state: { hotel } })}
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition-all"
                    >
                      View Rooms
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More (Simulated) */}
          <div className="flex justify-center pt-4">
             <button className="bg-white text-gray-600 border border-gray-200 font-bold text-xs px-8 py-3 rounded-xl uppercase tracking-wider hover:bg-gray-50 transition-colors">
               Load More Hotels
             </button>
          </div>

        </div> 
      </div> 
    </div>
  );
};

export default Hotels_Card;