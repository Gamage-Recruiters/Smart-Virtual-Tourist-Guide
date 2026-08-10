import React from 'react';
import heroBg from '../assets/abg.jpg';
import flagImg from '../assets/sri lanka flag.png';
import leftImage1 from '../assets/abg0.png';
import leftImage2 from '../assets/abg2.png';
import missionBg from '../assets/mbg.png';
import missionBgRight from '../assets/mbgr.png';

// IMPORT YOUR SVG ICONS HERE
import routingIcon from '../assets/svg/route.svg';
import hotelIcon from '../assets/svg/hotel.svg';
import foodIcon from '../assets/svg/food.svg';
import hiddenIcon from '../assets/svg/location.svg';
import scheduleIcon from '../assets/svg/shedule.svg';
import mobileIcon from '../assets/svg/search.svg';

import { MapPin, Clock, Utensils, Compass, Calendar, Smartphone, Plane, CheckCircle, Phone, Mail, Map } from 'lucide-react';

const NVirtualTourGuide = () => {
  return (
    <div className="bg-white font-sans text-slate-800 w-full overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[250px] sm:min-h-[350px] md:h-[450px] lg:h-[500px] h-[50vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url(${heroBg})` }}
        ></div>
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 drop-shadow-lg">
            About <span className="bg-gradient-to-r from-red-900 to-orange-500 bg-clip-text text-transparent font-bold">SVTG</span> 
            <img 
              src={flagImg} 
              alt="Sri Lanka Flag" 
              className="inline-block w-5 sm:w-6 md:w-7 lg:w-8 h-auto ml-2 align-top"
            />
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold drop-shadow-md max-w-3xl px-2">
            Explore Sri Lanka with Smart Virtual Tourist Guide
          </p>
        </div>
        <div className="absolute bottom-0 w-full z-20">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80 C 240 0, 480 120, 720 60 C 960 0, 1200 100, 1440 80 L 1440 120 L 0 120 Z" fill="#ffffff"/>
          </svg>
        </div>
      </section>

      {/* 2. DISCOVER SECTION - Fully Responsive */}
      <section className="py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-10 bg-[#ffffff] relative overflow-hidden">
        {/* Background Image - Responsive */}
        <div className="absolute top-0 left-0 w-full lg:w-1/2 h-[200px] sm:h-[250px] md:h-[300px] lg:h-full z-0 overflow-hidden">
          <div className="relative w-full h-full">
            <img 
              src={leftImage1} 
              alt="First Image" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center relative z-10">
          {/* Left: Empty space (image is behind) */}
          <div className="h-[180px] sm:h-[220px] md:h-[280px] lg:h-[400px] xl:h-[450px] w-full"></div>
          
          {/* Right: Text */}
          <div className="px-2 sm:px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg border border-white/50">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
                Discover Sri Lanka with <br />
                <span className="text-gray-600">Smart Virtual Tourist Guide</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base">
                Explore beautiful destinations, plan your trips easily, 
                and experience Sri Lanka like never before.
              </p>
              <p className="text-gray-500 leading-relaxed text-xs sm:text-sm md:text-base">
                We aim to provide a smart digital platform that helps travelers plan their journeys, 
                discover beautiful destinations, and access trusted local services all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION SECTION - Fully Responsive */}
      <section className="py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-10 bg-white relative overflow-hidden">
        
        {/* Left Background Image - Responsive */}
        <div 
          className="absolute top-0 left-0 w-full lg:w-1/2 h-[200px] sm:h-[250px] md:h-[300px] lg:h-full z-0"
          style={{ 
            backgroundImage: `url(${missionBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        
        {/* Right Background Image - Responsive */}
        <div 
          className="absolute top-[5%] sm:top-[10%] right-0 w-[25%] sm:w-[20%] md:w-[25%] lg:w-[30%] h-[40%] sm:h-[35%] md:h-[40%] lg:h-[70%] z-0 opacity-50"
          style={{ 
            backgroundImage: `url(${missionBgRight})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 items-center relative z-10">
          
          {/* Left: Empty space (left image is behind) */}
          <div className="w-full lg:w-1/2 h-[180px] sm:h-[220px] md:h-[280px] lg:h-[400px] xl:h-[450px]"></div>

          {/* Right: Mission Text */}
          <div className="w-full lg:w-1/2 pl-0 lg:pl-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
              <p className="text-gray-600 leading-6 sm:leading-7 text-justify mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">
                Our mission is to make traveling in Sri Lanka easier, 
                safer, and more enjoyable for every tourist.
              </p>
              <p className="text-gray-600 leading-6 sm:leading-7 text-justify mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">
                We aim to provide a smart digital platform that helps 
                travelers plan their journeys, discover beautiful 
                destinations, and access trusted local services all in 
                one place.
              </p>
              <p className="text-gray-600 leading-6 sm:leading-7 text-justify text-xs sm:text-sm md:text-base">
                By using modern technology and AI-powered features, 
                we help tourists explore Sri Lanka with confidence 
                while promoting responsible and sustainable tourism.
              </p>
            </div>
          </div>
        </div>
      </section>

            {/* 4. WHAT WE OFFER SECTION - Fully Responsive */}
      <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-[#F0F9FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          
          {/* Section Header */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-12 relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-slate-800">
              What <span className="text-blue-500">We Offer</span>
            </h2>
            <div className="w-12 sm:w-16 md:w-20 h-1 bg-blue-500 mx-auto mt-2"></div>
            
            <div className="absolute left-2 sm:left-10 md:left-40 top-1/2 transform -translate-y-1/2 hidden sm:block">
               <Plane className="w-4 sm:w-5 md:w-6 lg:w-8 h-4 sm:h-5 md:h-6 lg:h-8 text-gray-800 rotate-45" />
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 sm:w-16 md:w-24 h-8 sm:h-10 md:h-12 border-t-2 border-dashed border-gray-400 hidden sm:block"></div>
          </div>

          {/* Cards Grid - Fully Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            
            {/* Card 1 - Routing Planning */}
            <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg shadow-sm border border-gray-100 flex items-start gap-2 sm:gap-3 md:gap-4 hover:shadow-md transition">
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-full text-blue-600 flex-shrink-0">
                <img 
                  src={routingIcon} 
                  alt="Routing" 
                  className="w-4 sm:w-5 md:w-6 lg:w-7 h-4 sm:h-5 md:h-6 lg:h-7 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base md:text-lg text-slate-800">Routing Planning</h3>
                <p className="text-xs sm:text-xs md:text-sm text-gray-500 mt-1 sm:mt-2">
                  Plan your travel route between destinations, saving time and helping you explore more.
                </p>
              </div>
            </div>

            {/* Card 2 - Hotel Suggestions */}
            <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg shadow-sm border border-gray-100 flex items-start gap-2 sm:gap-3 md:gap-4 hover:shadow-md transition">
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-full text-blue-600 flex-shrink-0">
                <img 
                  src={hotelIcon} 
                  alt="Hotel" 
                  className="w-4 sm:w-5 md:w-6 lg:w-7 h-4 sm:h-5 md:h-6 lg:h-7 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base md:text-lg text-slate-800">Hotel Suggestions</h3>
                <p className="text-xs sm:text-xs md:text-sm text-gray-500 mt-1 sm:mt-2">
                  Find hotels based on your preferences, budget, and travel location.
                </p>
              </div>
            </div>

            {/* Card 3 - Food Recommendations */}
            <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg shadow-sm border border-gray-100 flex items-start gap-2 sm:gap-3 md:gap-4 hover:shadow-md transition">
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-full text-blue-600 flex-shrink-0">
                <img 
                  src={foodIcon} 
                  alt="Food" 
                  className="w-4 sm:w-5 md:w-6 lg:w-7 h-4 sm:h-5 md:h-6 lg:h-7 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base md:text-lg text-slate-800">Food Recommendations</h3>
                <p className="text-xs sm:text-xs md:text-sm text-gray-500 mt-1 sm:mt-2">
                  Discover the best local and international cuisine spots, with recommendations tailored for you.
                </p>
              </div>
            </div>

            {/* Card 4 - Hidden Places */}
            <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg shadow-sm border border-gray-100 flex items-start gap-2 sm:gap-3 md:gap-4 hover:shadow-md transition">
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-full text-blue-600 flex-shrink-0">
                <img 
                  src={hiddenIcon} 
                  alt="Hidden Places" 
                  className="w-4 sm:w-5 md:w-6 lg:w-7 h-4 sm:h-5 md:h-6 lg:h-7 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base md:text-lg text-slate-800">Hidden Places</h3>
                <p className="text-xs sm:text-xs md:text-sm text-gray-500 mt-1 sm:mt-2">
                  Explore hidden and less crowded attractions across Sri Lanka for a unique travel experience.
                </p>
              </div>
            </div>

            {/* Card 5 - Trip Scheduling */}
            <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg shadow-sm border border-gray-100 flex items-start gap-2 sm:gap-3 md:gap-4 hover:shadow-md transition">
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-full text-blue-600 flex-shrink-0">
                <img 
                  src={scheduleIcon} 
                  alt="Schedule" 
                  className="w-4 sm:w-5 md:w-6 lg:w-7 h-4 sm:h-5 md:h-6 lg:h-7 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base md:text-lg text-slate-800">Trip Scheduling</h3>
                <p className="text-xs sm:text-xs md:text-sm text-gray-500 mt-1 sm:mt-2">
                  Organize your trip with smart scheduling tools to manage time and activities effectively.
                </p>
              </div>
            </div>

            {/* Card 6 - Mobile Friendly */}
            <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg shadow-sm border border-gray-100 flex items-start gap-2 sm:gap-3 md:gap-4 hover:shadow-md transition">
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-full text-blue-600 flex-shrink-0">
                <img 
                  src={mobileIcon} 
                  alt="Mobile" 
                  className="w-4 sm:w-5 md:w-6 lg:w-7 h-4 sm:h-5 md:h-6 lg:h-7 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base md:text-lg text-slate-800">Mobile Friendly</h3>
                <p className="text-xs sm:text-xs md:text-sm text-gray-500 mt-1 sm:mt-2">
                  Access the platform seamlessly on any device with a fully responsive and user-friendly design.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default NVirtualTourGuide;