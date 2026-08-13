import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaStar, FaMapMarkerAlt, FaUtensils, FaClock, 
  FaBiking, FaShoppingBag, FaStore 
} from 'react-icons/fa';

// Default Restaurants Dummy Data
const defaultRestaurantsData = [
  {
    name: 'The Lagoon',
    location: 'Cinnamon Grand, Colombo',
    cuisine: 'Seafood, Fine Dining',
    priceLevel: '$$$$',
    userRating: 4.9,
    reviews: 1840,
    isOpen: true,
    features: ['dinein', 'takeaway'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Ministry of Crab',
    location: 'Dutch Hospital, Colombo',
    cuisine: 'Sri Lankan Seafood',
    priceLevel: '$$$$$',
    userRating: 4.8,
    reviews: 3200,
    isOpen: true,
    features: ['dinein'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Baila Fuego & Cafe',
    location: 'Kandy Lake Round',
    cuisine: 'Italian, Fusion, Coffee',
    priceLevel: '$$$',
    userRating: 4.5,
    reviews: 420,
    isOpen: false,
    features: ['dinein', 'takeaway', 'delivery'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Upali’s by Nawaloka',
    location: 'Colombo 07',
    cuisine: 'Authentic Sri Lankan',
    priceLevel: '$$',
    userRating: 4.6,
    reviews: 1450,
    isOpen: true,
    features: ['dinein', 'takeaway', 'delivery'],
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Cafe Chill',
    location: 'Ella Central',
    cuisine: 'Western, Asian, Bar',
    priceLevel: '$$$',
    userRating: 4.7,
    reviews: 2890,
    isOpen: true,
    features: ['dinein', 'takeaway'],
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Pedlar’s Inn Cafe',
    location: 'Galle Fort',
    cuisine: 'Continental, Desserts',
    priceLevel: '$$$',
    userRating: 4.4,
    reviews: 810,
    isOpen: true,
    features: ['dinein', 'takeaway'],
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600'
  }
];

const Restaurants_Card = () => {
  const navigate = useNavigate();
  const [restaurantsData, setRestaurantsData] = useState(defaultRestaurantsData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Filters state
  const [budget, setBudget] = useState(100000);
  const [selectedPriceLevels, setSelectedPriceLevels] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [dineInAvailable, setDineInAvailable] = useState(false);
  const [deliveryOffered, setDeliveryOffered] = useState(false);

  // Filter logic
  const filteredRestaurants = restaurantsData.filter(rest => {
    // Budget Filter (Map price levels to approximate maximum cost)
    const priceLevelMap = {
      '$': 5000,
      '$$': 15000,
      '$$$': 30000,
      '$$$$': 50000,
      '$$$$$': 100000
    };
    if (priceLevelMap[rest.priceLevel] > budget) return false;

    // Price Level Filter
    if (selectedPriceLevels.length > 0 && !selectedPriceLevels.includes(rest.priceLevel.substring(0, selectedPriceLevels[0].length))) {
       // Just doing exact match for simplicity or let's do exact match
       if (!selectedPriceLevels.includes(rest.priceLevel)) {
         return false;
       }
    }
    
    // Cuisine Filter (basic keyword check)
    if (selectedCuisines.length > 0) {
      const match = selectedCuisines.some(cuisine => {
        const lowerRestCuisine = rest.cuisine.toLowerCase();
        if (cuisine === 'Sri Lankan' && lowerRestCuisine.includes('sri lankan')) return true;
        if (cuisine === 'Seafood' && lowerRestCuisine.includes('seafood')) return true;
        if (cuisine === 'Italian / Western' && (lowerRestCuisine.includes('italian') || lowerRestCuisine.includes('western') || lowerRestCuisine.includes('continental'))) return true;
        if (cuisine === 'Cafes & Desserts' && (lowerRestCuisine.includes('cafe') || lowerRestCuisine.includes('coffee') || lowerRestCuisine.includes('dessert'))) return true;
        return false;
      });
      if (!match) return false;
    }

    // Dining Options Filter
    if (dineInAvailable && !rest.features.includes('dinein')) return false;
    if (deliveryOffered && !rest.features.includes('delivery')) return false;

    return true;
  });

  const togglePriceLevel = (level) => {
    setSelectedPriceLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
    setCurrentPage(1);
  };

  const toggleCuisine = (cuisine) => {
    setSelectedCuisines(prev => prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]);
    setCurrentPage(1);
  };

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
            <span className="text-gray-400 text-[10px] block font-bold tracking-wider">FOOD & DINING BUDGET</span>
            <div className="flex flex-col mb-4 mt-1">
              <div className="flex items-baseline space-x-1 mb-2">
                <span className="text-2xl font-black text-gray-900">{budget.toLocaleString()}</span>
                <span className="text-xs font-bold text-gray-700">LKR</span>
              </div>
              <input 
                type="range" 
                min="5000" 
                max="100000" 
                step="5000"
                value={budget} 
                onChange={(e) => {
                  setBudget(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#1E40AF]"
                style={{ background: `linear-gradient(to right, #1E40AF ${((budget - 5000) / 95000) * 100}%, #E5E7EB ${((budget - 5000) / 95000) * 100}%)` }}
              />
              <div className="flex justify-between text-xs text-gray-400 font-bold mt-2">
                <span>5k</span>
                <span>100k</span>
              </div>
            </div>
          </div>

          {/* Filters Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-6">Filters</h3>
            
            {/* Price Level Filter */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Price Level</label>
              <div className="flex space-x-2">
                {['$$', '$$$', '$$$$', '$$$$$'].map((level) => (
                  <button 
                    key={level} 
                    onClick={() => togglePriceLevel(level)}
                    className={`flex-1 py-1.5 border rounded-lg text-xs font-bold transition-colors ${selectedPriceLevels.includes(level) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisine Filter */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Cuisine</label>
              <div className="space-y-2">
                {['Sri Lankan', 'Seafood', 'Italian / Western', 'Cafes & Desserts'].map(type => (
                  <label key={type} className="flex items-center space-x-2 text-xs font-medium text-gray-600 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-blue-600 w-4 h-4" 
                      checked={selectedCuisines.includes(type)}
                      onChange={() => toggleCuisine(type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dining Options */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Dining Options</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-xs font-medium text-gray-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 w-4 h-4" 
                    checked={dineInAvailable}
                    onChange={(e) => { setDineInAvailable(e.target.checked); setCurrentPage(1); }}
                  />
                  <span>Dine-in Available</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-medium text-gray-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 w-4 h-4"
                    checked={deliveryOffered}
                    onChange={(e) => { setDeliveryOffered(e.target.checked); setCurrentPage(1); }}
                  />
                  <span>Delivery Offered</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-6">  
          
          {/* Blue Hero Banner */}
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl p-6 md:p-8 relative overflow-hidden text-white min-h-[12rem] shadow-sm flex items-center">
            <div className="max-w-md z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Discover Best Food Places</h2>
              <p className="text-blue-100 text-xs mb-6 opacity-90">
                From fine dining seafood spots to cozy mountain cafes. Find and reserve tables at top-rated restaurants.
              </p>
              <div className="flex space-x-3">
                <button className="bg-white text-blue-700 font-bold text-[10px] px-5 py-2.5 rounded-xl uppercase tracking-wider shadow-md">Top Rated</button>
                <button className="bg-blue-500/30 backdrop-blur-sm text-white border border-white/20 font-bold text-[10px] px-5 py-2.5 rounded-xl uppercase tracking-wider">Nearby Me</button>
              </div>
            </div>
            {/* Background Graphic Accent */}
            <div className="absolute right-4 bottom-[-1rem] opacity-10 text-[9rem] font-black pointer-events-none select-none">
              FOOD
            </div>
          </div>

          {/* Restaurants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRestaurants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((rest, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all">
                
                {/* Image Section */}
                <div className="relative h-48 bg-gray-100">
                  <img src={rest.image} alt={rest.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex gap-1">
                    {rest.isOpen ? (
                      <span className="bg-green-500 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">Open Now</span>
                    ) : (
                      <span className="bg-red-500 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">Closed</span>
                    )}
                    <span className="bg-gray-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                      {rest.priceLevel}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center space-x-1 shadow-xs">
                    <FaStar className="text-amber-400 text-[11px]" />
                    <span className="text-xs font-black text-gray-800">{rest.userRating}</span>
                  </div>
                </div>

                {/* Body Section */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 text-base leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                      {rest.name}
                    </h4>
                    
                    <p className="text-gray-400 text-[11px] font-bold flex items-center mb-2.5">
                      <FaMapMarkerAlt className="mr-1 text-blue-500 shrink-0" /> {rest.location}
                    </p>

                    <p className="text-gray-600 text-xs font-medium flex items-center mb-3">
                      <FaUtensils className="mr-2 text-gray-400 shrink-0" size={11} />
                      <span className="truncate">{rest.cuisine}</span>
                    </p>

                    <hr className="border-gray-100 my-3" />

                    {/* Service Type Features */}
                    <div className="flex space-x-3 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                      {rest.features.includes('dinein') && (
                        <span className="flex items-center text-blue-600 bg-blue-50/50 px-2 py-1 rounded-md">
                          <FaStore className="mr-1" /> Dine-in
                        </span>
                      )}
                      {rest.features.includes('takeaway') && (
                        <span className="flex items-center text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                          <FaShoppingBag className="mr-1" /> Takeaway
                        </span>
                      )}
                      {rest.features.includes('delivery') && (
                        <span className="flex items-center text-green-600 bg-green-50/50 px-2 py-1 rounded-md">
                          <FaBiking className="mr-1" /> Delivery
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="mt-auto pt-2">
                    <div className="flex justify-between items-center mb-3 text-xs">
                      <span className="text-gray-400 font-medium">Based on {rest.reviews} reviews</span>
                      <span className="text-blue-600 font-bold flex items-center">
                        <FaClock className="mr-1" size={10} /> View Menu
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => navigate('/restaurant-booking', { state: { restaurant: rest } })}
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition-all shadow-xs"
                    >
                      Book a Table
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Load More Footer */}
          <div className="flex justify-center pt-4">
             <button className="bg-white text-gray-600 border border-gray-200 font-bold text-xs px-8 py-3 rounded-xl uppercase tracking-wider hover:bg-gray-50 transition-colors">
               Explore More Restaurants
             </button>
          </div>

        </div> 
      </div> 
    </div>
  );
};

export default Restaurants_Card;