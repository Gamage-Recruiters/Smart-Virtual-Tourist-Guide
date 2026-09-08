import React from 'react';

// Import background and foreground images from assets
import heroBgImage from '../assets/HHPP1.jpg'; 
import heroFrontImage from '../assets/HP2.png';
import sriLankaFlag from '../assets/SLFH.jpg'; 
import coupleImage from '../assets/HP6.png'; 
import signboardsImage from '../assets/HP5.png'; 

// --- IMPORT 4 CATEGORY IMAGES ---
import catBeach from '../assets/HP7.jpg'; 
import catBirds from '../assets/HP8.png'; 
import catCultural from '../assets/HP9.png'; 
import catMountains from '../assets/HP10.png'; 

// --- IMPORT 3 POPULAR DESTINATION IMAGES HERE ---
// Replace these filenames with your actual image names
import destYala from '../assets/Yala.jpg'; 
import destSigiriya from '../assets/Sigiriya.jpg'; 
import destMirissa from '../assets/mirissa.jpg'; 

const App = () => {
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
              <button className="bg-[#00AAFF] text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:bg-[#145BDA] transition">
                Start Your Journey
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition">
                Discover Destination
              </button>
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

      {/* --- OUR POPULAR DESTINATION --- */}
      <section className="py-16 px-4 md:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center md:justify-start items-center gap-4 mb-10 relative">
            <div className="absolute -left-10 top-0 text-gray-400 transform rotate-45 hidden md:block">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-center w-full md:w-auto">Our <span className="text-primary">Popular Destination</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Card 1: Yala - Using local import */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-xl transition relative pb-4">
              <div 
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: `url(${destYala})` }}
              >
                 <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">⭐ 4.8 (128 Reviews)</div>
              </div>
              <div className="p-4 text-center">
                 <h3 className="font-bold text-lg">Yala Wildlife Safari</h3>
                 <div className="text-gray-500 text-sm">Rs. 32,000 / Per Person</div>
                 <div className="mt-2 text-xs text-gray-400 flex justify-center items-center gap-1">
                    <span>⏱ 2 Days</span>
                    <span>👥 12+ Travelers</span>
                 </div>
                 <div className="mt-2 text-xs text-gray-500">Yala National Park</div>
              </div>
            </div>

            {/* Card 2: Sigiriya - Using local import */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-xl transition relative pb-4 transform scale-105 md:z-10 border-2 border-white">
              <div 
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: `url(${destSigiriya})` }}
              >
                 <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">⭐ 4.9 (95 Reviews)</div>
              </div>
              <div className="p-4 text-center">
                 <h3 className="font-bold text-lg">Sigiriya Cultural Heritage Tour</h3>
                 <div className="text-gray-500 text-sm">Rs. 18,500 / Per Person</div>
                 <div className="mt-2 text-xs text-gray-400 flex justify-center items-center gap-1">
                    <span>⏱ 2 Days</span>
                    <span>👥 10+ Travelers</span>
                 </div>
                 <div className="mt-2 text-xs text-gray-500">Sigiriya</div>
              </div>
            </div>

            {/* Card 3: Mirissa - Using local import */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-xl transition relative pb-4">
              <div 
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: `url(${destMirissa})` }}
              >
                 <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">⭐ 4.7 (110 Reviews)</div>
              </div>
              <div className="p-4 text-center">
                 <h3 className="font-bold text-lg">Mirissa Beach Escape</h3>
                 <div className="text-gray-500 text-sm">Rs. 32,000 / Per Person</div>
                 <div className="mt-2 text-xs text-gray-400 flex justify-center items-center gap-1">
                    <span>⏱ 2 Days</span>
                    <span>👥 15+ Travelers</span>
                 </div>
                 <div className="mt-2 text-xs text-gray-500">Mirissa</div>
              </div>
            </div>

            {/* Carousel Arrows (Static) */}
            <button className="absolute -left-4 top-1/2 -translate-y-1/2 bg-primary text-white w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-blue-600 transition z-20 hidden md:flex">
               &lt;
            </button>
            <button className="absolute -right-4 top-1/2 -translate-y-1/2 bg-primary text-white w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-blue-600 transition z-20 hidden md:flex">
               &gt;
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 gap-2">
             <div className="w-2 h-2 rounded-full bg-gray-800"></div>
             <div className="w-2 h-2 rounded-full bg-gray-300"></div>
             <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </section>

      {/* --- EXPLORE BY CATEGORY --- */}
      <section className="py-16 px-4 md:px-8 bg-white relative">
         <div className="max-w-7xl mx-auto relative">
             <svg className="absolute right-0 -top-20 w-40 h-40 pointer-events-none z-0 hidden" viewBox="0 0 100 100">
                <path d="M 100 0 C 50 50, 0 20, 10 100" stroke="gray" strokeWidth="1" strokeDasharray="3 3" fill="none"/>
             </svg>
             <div className="absolute right-10 top-0 text-gray-600 transform rotate-45 hidden md:block">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
             </div>

             <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Explore <span className="text-primary">Sri Lanka by Category</span></h2>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[400px] md:h-[500px]">
                {/* Card 1: Beach */}
                <div className="rounded-2xl overflow-hidden shadow-lg relative group h-full">
                   <img src={catBeach} alt="Beach" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-8">
                      <span className="text-white font-medium text-lg">Beach</span>
                   </div>
                </div>

                {/* Card 2: Birds */}
                <div className="rounded-2xl overflow-hidden shadow-lg relative group h-full">
                   <img src={catBirds} alt="Birds" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-8">
                      <span className="text-white font-medium text-lg">Bird Watching</span>
                   </div>
                </div>

                {/* Card 3: Cultural */}
                <div className="rounded-2xl overflow-hidden shadow-lg relative group h-full">
                   <img src={catCultural} alt="Cultural" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-8">
                      <span className="text-white font-medium text-lg">Cultural</span>
                   </div>
                </div>

                {/* Card 4: Mountains */}
                <div className="rounded-2xl overflow-hidden shadow-lg relative group h-full">
                   <img src={catMountains} alt="Mountains" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-8">
                      <span className="text-white font-medium text-lg">Mountains</span>
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

export default App;