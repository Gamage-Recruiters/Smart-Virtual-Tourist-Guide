import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DestinationDetails from './DestinationDetails';

// Import background and foreground images from assets
import heroBgImage from '../assets/LandingPage/HHPP1.jpg'; 
import heroFrontImage from '../assets/LandingPage/HP2.png';
import sriLankaFlag from '../assets/LandingPage/SLFH.jpg'; 
import coupleImage from '../assets/LandingPage/HP6.png'; 
import signboardsImage from '../assets/LandingPage/HP5.png'; 

// --- IMPORT 4 CATEGORY IMAGES ---
import catBeach from '../assets/LandingPage/HP7.jpg'; 
import catBirds from '../assets/LandingPage/HP8.png'; 
import catCultural from '../assets/LandingPage/HP9.png'; 
import catMountains from '../assets/LandingPage/HP10.png'; 

// --- IMPORT FALLBACK DESTINATION IMAGES ---
import destYala from '../assets/LandingPage/Yala.jpg'; 
import destSigiriya from '../assets/LandingPage/Sigiriya.jpg'; 
import destMirissa from '../assets/LandingPage/mirissa.jpg'; 

const fallbackDestinations = [
  {
    _id: 'fb-1',
    title: 'Yala Wildlife Safari',
    heroImage: destYala,
    priceDisplay: 'Rs. 32,000 / Per Person',
    price: 32000,
    durationDisplay: '2 Days',
    duration: 2,
    travelersDisplay: '12+ Travelers',
    travelersCount: 12,
    rating: 4.8,
    reviewCount: 128,
    location: 'Yala National Park',
    shortDescription: 'Explore the wildlife wonderland of Yala National Park with leopards, elephants, and exotic flora.',
    features: ['Game Drives', 'Camp Accommodations', 'Professional Naturalist', 'All Park Fees Included']
  },
  {
    _id: 'fb-2',
    title: 'Sigiriya Cultural Heritage Tour',
    heroImage: destSigiriya,
    priceDisplay: 'Rs. 18,500 / Per Person',
    price: 18500,
    durationDisplay: '2 Days',
    duration: 2,
    travelersDisplay: '10+ Travelers',
    travelersCount: 10,
    rating: 4.9,
    reviewCount: 95,
    location: 'Sigiriya',
    shortDescription: 'Climb the ancient Lion Rock fortress and experience the rich cultural marvels of Sri Lanka.',
    features: ['Guided Rock Climb', 'Frescoes Viewing', 'Village Experience', 'Authentic Sri Lankan Lunch']
  },
  {
    _id: 'fb-3',
    title: 'Mirissa Beach Escape',
    heroImage: destMirissa,
    priceDisplay: 'Rs. 32,000 / Per Person',
    price: 32000,
    durationDisplay: '2 Days',
    duration: 2,
    travelersDisplay: '15+ Travelers',
    travelersCount: 15,
    rating: 4.7,
    reviewCount: 110,
    location: 'Mirissa',
    shortDescription: 'Relax on golden sands, enjoy whale watching, and experience vibrant coastal life in Mirissa.',
    features: ['Whale Watching Cruise', 'Surfing Lessons', 'Beachfront Stays', 'Sunset Dining']
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Fetch the first 3 destinations added to the database (oldest / 1st added)
  useEffect(() => {
    const fetchFirstAddedDestinations = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/destinations');
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // Sort ascending by creation time to get the 3 destinations that were added 1st
          const firstThree = response.data
            .slice()
            .sort((a, b) => new Date(a.createdAt || a._id) - new Date(b.createdAt || b._id))
            .slice(0, 3);
          setDestinations(firstThree);
        } else {
          setDestinations(fallbackDestinations);
        }
      } catch (error) {
        console.error('Error fetching destinations from backend, using fallback data:', error);
        setDestinations(fallbackDestinations);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstAddedDestinations();
  }, []);

  const displayDestinations = destinations.length > 0 ? destinations : fallbackDestinations;

  // If a destination was clicked, show DestinationDetails
  if (selectedDestination) {
    return (
      <DestinationDetails
        destination={selectedDestination}
        onBack={() => setSelectedDestination(null)}
      />
    );
  }

  return (
    <div className="bg-white text-gray-800 min-h-screen relative overflow-x-hidden pb-20">
      
      {/* --- HERO SECTION (FULL SCREEN) --- */}
      <section 
        className="relative w-full min-h-screen flex items-center px-4 md:px-8 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroBgImage})`,
          backgroundColor: '#f0f9ff' // Fallback color
        }}
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-center gap-12 relative z-10 pt-20 pb-10">
          
          {/* Left Text */}
          <div className="w-full lg:w-[45%] space-y-6 relative">
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span 
                className="bg-clip-text text-transparent bg-cover bg-center drop-shadow-md"
                style={{ 
                  backgroundImage: `url(${sriLankaFlag})`,
                }}
              >
                Explore Sri Lanka
              </span>
              <span className="text-[#145BDA] drop-shadow-lg">
                {' '}Smartly
              </span>
            </h1>
            
            <p className="text-black text-lg max-w-md drop-shadow-sm">
              Your AI-powered travel companion for planning, budgeting, and safe exploration.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/login">
                <button className="bg-[#00AAFF] text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:bg-[#145BDA] transition cursor-pointer">
                  Start Your Journey
                </button>
              </Link>
              <Link to="/destinations">
                <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:bg-gray-50 transition cursor-pointer">
                  Discover Destination
                </button>
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="w-full lg:w-[55%] relative flex justify-center mt-8 lg:mt-0">
            <img 
              src={heroFrontImage} 
              alt="Smart Sri Lanka Travel" 
              className="relative z-10 w-[1000px] md:w-[1200px] h-auto object-contain transform rotate-[-8deg] drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE SECTION --- */}
      <section className="py-16 relative px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center relative">
           <div className="absolute -top-10 right-10 md:right-20 transform rotate-12 hidden md:block">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
           </div>
           <div className="absolute right-0 top-10 w-32 h-32 border border-dashed border-gray-300 rounded-full opacity-50 hidden md:block"></div>

           <div className="inline-block relative">
             <h2 className="text-3xl md:text-4xl font-bold mb-2 inline-block border-b-4 border-[#145BDA] pb-1">
               Why Choose <span className="text-primary">Smart virtual Tourist Guide</span>?
             </h2>
           </div>

           <p className="text-gray-500 max-w-2xl mx-auto mt-8 leading-relaxed">
             Experience the power of AI-driven travel planning designed to make your Sri Lanka journey smooth, safe, and stress-free. From smart budgeting to real-time guidance, our platform ensures every step of your adventure is carefully optimized for comfort and confidence.
           </p>
        </div>
      </section>

      {/* --- LET'S CREATE MEMORABLE JOURNEY --- */}
      <section className="py-10 relative px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative">
          
          <div className="lg:w-1/2 relative z-10 flex flex-col items-center text-center">
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Let's Create<br />
              Memorable<br />
              Journey
            </h2>
            
            <div className="relative w-full max-w-sm">
              <img 
                src={coupleImage} 
                alt="Traveling Couple" 
                className="w-full h-auto object-contain" 
              />
            </div>
          </div>

          <div className="lg:w-1/3 flex flex-col items-center lg:items-end justify-center transform -rotate-6 relative z-10">
            <img 
              src={signboardsImage} 
              alt="Sri Lanka Destination Signs" 
              className="w-full max-w-sm h-auto object-contain drop-shadow-xl"
            />
          </div>

           <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0 opacity-30 hidden" viewBox="0 0 800 400" fill="none">
             <path d="M 100 300 C 200 150, 400 100, 500 200 C 600 300, 700 150, 800 200" stroke="#475569" strokeWidth="2" strokeDasharray="8 8"/>
           </svg>
        </div>
      </section>

      {/* --- OUR POPULAR DESTINATION (FIRST 3 ADDED DESTINATIONS) --- */}
      <section className="py-16 px-4 md:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10 relative">
            <div className="flex items-center gap-4">
              <div className="text-gray-400 transform rotate-45 hidden md:block">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Our <span className="text-primary">Popular Destinations</span>
              </h2>
            </div>

            <Link 
              to="/destinations" 
              className="text-[#145BDA] hover:text-blue-700 font-semibold text-sm sm:text-base flex items-center gap-1.5 transition"
            >
              View All 
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl p-4 shadow-lg animate-pulse h-96">
                  <div className="w-full h-64 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {displayDestinations.slice(0, 3).map((dest, idx) => {
                const cardImg =
                  dest.heroImage ||
                  dest.thumbnailImage ||
                  (dest.images && dest.images[0]) ||
                  dest.image ||
                  destYala;

                const cardPrice =
                  dest.priceDisplay ||
                  (dest.price ? `Rs. ${dest.price.toLocaleString()} / Per Person` : 'Contact for Price');

                const cardDuration =
                  dest.durationDisplay ||
                  (dest.duration ? `${dest.duration} Days` : '2 Days');

                const cardTravelers =
                  dest.travelersDisplay ||
                  (dest.travelersCount ? `${dest.travelersCount}+ Travelers` : '10+ Travelers');

                const cardRating = dest.rating || 4.8;
                const cardReviews = dest.reviewCount ?? dest.reviews ?? 100;

                return (
                  <div 
                    key={dest._id || idx}
                    onClick={() => setSelectedDestination(dest)}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 relative cursor-pointer transform hover:-translate-y-1.5 flex flex-col justify-between h-full border border-gray-100"
                  >
                    <div className="relative h-60 sm:h-64 overflow-hidden shrink-0">
                      <img 
                        src={cardImg} 
                        alt={dest.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1">
                        ⭐ {cardRating} ({cardReviews} Reviews)
                      </div>
                    </div>
                    
                    <div className="p-5 text-center flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-1 group-hover:text-[#145BDA] transition-colors">
                          {dest.title}
                        </h3>
                        <div className="text-gray-600 font-semibold text-sm mt-1.5">
                          {cardPrice}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-50 flex flex-col gap-1.5">
                        <div className="text-xs text-gray-500 flex justify-center items-center gap-4">
                          <span>⏱ {cardDuration}</span>
                          <span>👥 {cardTravelers}</span>
                        </div>
                        <div className="text-xs text-gray-400 font-medium line-clamp-1">
                          {dest.location || 'Sri Lanka'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Attraction Accent Dots */}
          <div className="flex justify-center items-center mt-10 gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"></div>
          </div>
        </div>
      </section>

      {/* --- EXPLORE BY CATEGORY (CONNECTED TO CATEGORY SEARCH) --- */}
      <section className="py-16 px-4 md:px-8 bg-white relative">
         <div className="max-w-7xl mx-auto relative">
             <svg className="absolute right-0 -top-20 w-40 h-40 pointer-events-none z-0 hidden" viewBox="0 0 100 100">
                <path d="M 100 0 C 50 50, 0 20, 10 100" stroke="gray" strokeWidth="1" strokeDasharray="3 3" fill="none"/>
             </svg>
             <div className="absolute right-10 top-0 text-gray-600 transform rotate-45 hidden md:block">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
             </div>

             <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
               Explore <span className="text-primary">Sri Lanka by Category</span>
             </h2>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[400px] md:h-[500px]">
                {/* Card 1: Beach */}
                <div 
                  onClick={() => navigate('/results?category=Beaches')}
                  className="rounded-2xl overflow-hidden shadow-lg relative group h-full cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                   <img src={catBeach} alt="Beach" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col items-center justify-end pb-8">
                      <span className="text-white font-bold text-xl drop-shadow-md">Beach</span>
                      <span className="text-white/90 text-xs mt-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Explore Destinations →</span>
                   </div>
                </div>

                {/* Card 2: Wildlife */}
                <div 
                  onClick={() => navigate('/results?category=Wildlife')}
                  className="rounded-2xl overflow-hidden shadow-lg relative group h-full cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                   <img src={catBirds} alt="Wildlife" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col items-center justify-end pb-8">
                      <span className="text-white font-bold text-xl drop-shadow-md">Wildlife</span>
                      <span className="text-white/90 text-xs mt-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Explore Destinations →</span>
                   </div>
                </div>

                {/* Card 3: Cultural */}
                <div 
                  onClick={() => navigate('/results?category=Cultural')}
                  className="rounded-2xl overflow-hidden shadow-lg relative group h-full cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                   <img src={catCultural} alt="Cultural" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col items-center justify-end pb-8">
                      <span className="text-white font-bold text-xl drop-shadow-md">Cultural</span>
                      <span className="text-white/90 text-xs mt-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Explore Destinations →</span>
                   </div>
                </div>

                {/* Card 4: Mountains */}
                <div 
                  onClick={() => navigate('/results?category=Mountains')}
                  className="rounded-2xl overflow-hidden shadow-lg relative group h-full cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                   <img src={catMountains} alt="Mountains" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col items-center justify-end pb-8">
                      <span className="text-white font-bold text-xl drop-shadow-md">Mountains</span>
                      <span className="text-white/90 text-xs mt-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Explore Destinations →</span>
                   </div>
                </div>
             </div>
         </div>
      </section>

      {/* --- DECORATIVE ELEMENTS (Bottom lotus) --- */}
      <div className="absolute bottom-0 left-0 opacity-20 pointer-events-none -z-10 hidden">
          <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
             <path d="M50 0 C30 30, 10 40, 10 70 C10 90, 30 100, 50 100 C70 100, 90 90, 90 70 C90 40, 70 30, 50 0 Z" fill="#eab308"/>
             <path d="M50 40 C40 50, 35 60, 35 75 L65 75 C65 60, 60 50, 50 40 Z" fill="#fde047"/>
          </svg>
      </div>
      
    </div>
  );
};

export default Home;