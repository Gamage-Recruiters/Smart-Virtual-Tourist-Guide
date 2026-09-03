// import { Link, } from 'react-router-dom'; // Add this import

// // Import images from your assets folder
// import lotusFlower from '../assets/LandingPage/fbg1.png';
// import mandalaPattern from '../assets/LandingPage/fbg2.png';
// import logoImage from '../assets/LandingPage/logo.png';
// import sriLankaFlag from '../assets/LandingPage/SLFF.jpg'; // Add your flag image

// const Footer = () => {
//   return (
//     <footer className="relative w-full pt-12 pb-6 overflow-hidden font-sans" 
//             style={{ 
//               background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(160, 219, 255, 0.8))'
//             }}>
      
//       {/* --- DECORATIVE BACKGROUND IMAGES --- */}
      
//       {/* Bottom Left Lotus Flower Image - 90% opacity */}
//       <div className="absolute bottom-0 left-0 pointer-events-none select-none z-0">
//         <img 
//           src={lotusFlower} 
//           alt="Lotus Flower" 
//           className="w-auto h-auto object-contain opacity-90 max-h-[400px]"
//         />
//       </div>

//       {/* Bottom Right Mandala Pattern Image - 90% opacity */}
//       <div className="absolute bottom-0 right-0 pointer-events-none select-none z-0">
//         <img 
//           src={mandalaPattern} 
//           alt="Mandala Pattern" 
//           className="w-auto h-auto object-contain opacity-90 max-h-[400px]"
//         />
//       </div>

//       {/* MAIN CONTENT CONTAINER - z-10 to stay above images */}
//       <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10 max-w-7xl">
        
//         {/* --- COLUMN 1: BRAND & DESCRIPTION --- */}
//         <div className="lg:col-span-1 flex flex-col items-start">
//           {/* Logo Image */}
//           <div className="mb-3">
//             <img 
//               src={logoImage} 
//               alt="Sri Lanka Tourism Logo" 
//               className="w-20 h-auto object-contain mb-1"
//             />
//           </div>
          
//           <h2 className="text-gray-800 font-bold text-base mb-0.5">Smart Virtual Tourism Guide</h2>
          
//           <div className="mb-2 relative">
//             <h1 
//               className="text-2xl font-bold tracking-tight"
//               style={{
//                 backgroundImage: `url(${sriLankaFlag})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 WebkitBackgroundClip: 'text',
//                 backgroundClip: 'text',
//                 color: 'transparent',
//                 position: 'relative'
//               }}>
//               Sri Lanka
//             </h1>
//             {/* Blue overlay on top of the text */}
//             <h1 
//               className="text-2xl font-bold tracking-tight absolute top-0 left-0 pointer-events-none"
//               style={{
//                 color: 'rgba(30, 58, 138, 0.2)',
//                 mixBlendMode: 'multiply'
//               }}>
//               Sri Lanka
//             </h1>
//           </div>

//           <p className="text-xs text-gray-700 leading-relaxed max-w-[220px] mb-4">
//             Ai-powered travel planning platform design to help you explore Sri Lanka safety, smartly and efficiently
//           </p>

//           {/* Social Icons - Bottom left */}
//           <div className="flex space-x-3 mt-auto">
//             <a href="#" className="bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition">
//               <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
//             </a>
//             <a href="#" className="bg-pink-600 text-white rounded-full p-1 hover:bg-pink-700 transition">
//                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
//             </a>
//             <a href="#" className="text-black hover:text-gray-700 transition">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
//             </a>
//           </div>
//         </div>

//         {/* --- COLUMN 2: QUICK LINKS --- */}
//         <div className="lg:col-span-1">
//           <h3 className="font-bold text-black mb-3 text-sm">Quick Links</h3>
//           <ul className="text-xs text-black space-y-1.5">
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> Home</a></li>
//             <li>
//               <Link to="/about" className="hover:text-[#3CB4FF] flex items-center">
//                 <span className="mr-1">•</span> About Us
//               </Link>
//             </li>
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> Destinations</a></li>
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> How it Works</a></li>
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> Safety</a></li>
//           </ul>
//         </div>

//         {/* --- COLUMN 3: DESTINATIONS --- */}
//         <div className="lg:col-span-1">
//           <h3 className="font-bold text-black mb-3 text-sm">Destinations</h3>
//           <ul className="text-xs text-black space-y-1.5">
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> Sigiriya</a></li>
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> Ella</a></li>
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> Galle</a></li>
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> Yala National Park</a></li>
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> Colombo</a></li>
//           </ul>
//         </div>

//         {/* --- COLUMN 4: SUPPORT --- */}
//         <div className="lg:col-span-1">
//           <h3 className="font-bold text-black mb-3 text-sm">Support</h3>
//           <ul className="text-xs text-black space-y-1.5">
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> Help Center</a></li>
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> Privacy Policy</a></li>
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> Terms & Condition</a></li>
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> FAQ</a></li>
//             <li><a href="#" className="hover:text-[#3CB4FF] flex items-center"><span className="mr-1">•</span> Travel Safety Guidelines</a></li>
//           </ul>
//         </div>

//         {/* --- COLUMN 5: CONTACT US --- */}
//         <div className="lg:col-span-1">
//           <h3 className="font-bold text-black mb-4 text-sm">Contact Us.</h3>
//           <ul className="text-xs text-black space-y-3">
//             <li className="flex items-start">
//                <svg className="w-3.5 h-3.5 text-red-500 mt-0.5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
//                <span>Colombo, Sri Lanka</span>
//             </li>
//             <li className="flex items-start">
//                <svg className="w-3.5 h-3.5 text-red-500 mt-0.5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
//                <span>+91 9876543210</span>
//             </li>
//             <li className="flex items-start">
//                <svg className="w-3.5 h-3.5 text-blue-400 mt-0.5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
//                <span>support@svgt.lk</span>
//             </li>
//           </ul>
//         </div>

//       </div>

//       {/* --- BOTTOM COPYRIGHT --- */}
//       <div className="text-center mt-6 relative z-10">
//         <p className="text-[#3CB4FF] font-medium text-xs">svtg@2026 all right reserve</p>
//       </div>

//     </footer>
//   );
// };

// export default Footer;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import images from your assets folder
import lotusFlower from '../assets/LandingPage/fbg1.png';
import mandalaPattern from '../assets/LandingPage/fbg2.png';
import logoImage from '../assets/LandingPage/logo.png';
import sriLankaFlag from '../assets/LandingPage/SLFF.jpg';

const fallbackDestinations = [
  { _id: 'fb-1', title: 'Sigiriya Cultural Heritage', location: 'Sigiriya' },
  { _id: 'fb-2', title: 'Ella Mountain Trails', location: 'Ella' },
  { _id: 'fb-3', title: 'Galle Dutch Fort', location: 'Galle' },
  { _id: 'fb-4', title: 'Yala Wildlife Safari', location: 'Yala National Park' },
  { _id: 'fb-5', title: 'Colombo City Experience', location: 'Colombo' },
];

const Footer = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchFirstFiveDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/destinations');
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // Sort ascending by creation time to get the 1st inserted (oldest) 5 destinations
          const firstFive = response.data
            .slice()
            .sort((a, b) => new Date(a.createdAt || a._id) - new Date(b.createdAt || b._id))
            .slice(0, 5);
          setDestinations(firstFive);
        }
      } catch (error) {
        console.error('Error fetching destinations for footer:', error);
      }
    };

    fetchFirstFiveDestinations();
  }, []);

  const displayDestinations = destinations.length > 0 ? destinations : fallbackDestinations;

  const handleDestinationClick = (dest) => {
    navigate('/destination-detail', { state: { destination: dest } });
  };

  return (
    <footer
      className="relative w-full pt-12 pb-6 overflow-hidden font-sans"
      style={{
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(160, 219, 255, 0.8))'
      }}
    >
      {/* --- DECORATIVE BACKGROUND IMAGES --- */}

      {/* Bottom Left Lotus Flower Image - 90% opacity */}
      <div className="absolute bottom-0 left-0 pointer-events-none select-none z-0">
        <img
          src={lotusFlower}
          alt="Lotus Flower"
          className="w-auto h-auto object-contain opacity-90 max-h-[400px]"
        />
      </div>

      {/* Bottom Right Mandala Pattern Image - 90% opacity */}
      <div className="absolute bottom-0 right-0 pointer-events-none select-none z-0">
        <img
          src={mandalaPattern}
          alt="Mandala Pattern"
          className="w-auto h-auto object-contain opacity-90 max-h-[400px]"
        />
      </div>

      {/* MAIN CONTENT CONTAINER - z-10 to stay above images */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10 max-w-7xl">

        {/* --- COLUMN 1: BRAND & DESCRIPTION --- */}
        <div className="lg:col-span-1 flex flex-col items-start">
          {/* Logo Image */}
          <div className="mb-3">
            <img
              src={logoImage}
              alt="Sri Lanka Tourism Logo"
              className="w-20 h-auto object-contain mb-1"
            />
          </div>

          <h2 className="text-gray-800 font-bold text-base mb-0.5">Smart Virtual Tourism Guide</h2>

          <div className="mb-2 relative">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{
                backgroundImage: `url(${sriLankaFlag})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                position: 'relative'
              }}
            >
              Sri Lanka
            </h1>
            {/* Blue overlay on top of the text */}
            <h1
              className="text-2xl font-bold tracking-tight absolute top-0 left-0 pointer-events-none"
              style={{
                color: 'rgba(30, 58, 138, 0.2)',
                mixBlendMode: 'multiply'
              }}
            >
              Sri Lanka
            </h1>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed max-w-[220px] mb-4">
            AI-powered travel planning platform designed to help you explore Sri Lanka safely, smartly and efficiently
          </p>

          {/* Social Icons - Bottom left */}
          <div className="flex space-x-3 mt-auto">
            <a href="#" className="bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" className="bg-pink-600 text-white rounded-full p-1 hover:bg-pink-700 transition">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="#" className="text-black hover:text-gray-700 transition">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* --- COLUMN 2: QUICK LINKS --- */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-black mb-3 text-sm">Quick Links</h3>
          <ul className="text-xs text-black space-y-1.5">
            <li>
              <Link to="/" className="hover:text-[#3CB4FF] flex items-center transition-colors">
                <span className="mr-1">•</span> Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#3CB4FF] flex items-center transition-colors">
                <span className="mr-1">•</span> About Us
              </Link>
            </li>
            <li>
              <Link to="/destinations" className="hover:text-[#3CB4FF] flex items-center transition-colors">
                <span className="mr-1">•</span> Destinations
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-[#3CB4FF] flex items-center transition-colors">
                <span className="mr-1">•</span> How it Works
              </Link>
            </li>
            <li>
              <Link to="/travel-safety" className="hover:text-[#3CB4FF] flex items-center transition-colors">
                <span className="mr-1">•</span> Safety
              </Link>
            </li>
          </ul>
        </div>

        {/* --- COLUMN 3: DESTINATIONS --- */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-black mb-3 text-sm">Destinations</h3>
          <ul className="text-xs text-black space-y-1.5">
            {displayDestinations.map((dest, index) => {
              const rawLocation = dest.location || dest.title || '';
              const locationText = rawLocation.replace(/,\s*sri\s*lanka/i, '').trim() || rawLocation;
              return (
                <li key={dest._id || index}>
                  <button
                    onClick={() => handleDestinationClick(dest)}
                    className="hover:text-[#3CB4FF] flex items-center transition-colors text-left cursor-pointer bg-transparent border-0 p-0 text-xs text-black"
                  >
                    <span className="mr-1">•</span> {locationText}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* --- COLUMN 4: SUPPORT --- */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-black mb-3 text-sm">Support</h3>
          <ul className="text-xs text-black space-y-1.5">
            <li>
              <a href="#" className="hover:text-[#3CB4FF] flex items-center transition-colors">
                <span className="mr-1">•</span> Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3CB4FF] flex items-center transition-colors">
                <span className="mr-1">•</span> Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3CB4FF] flex items-center transition-colors">
                <span className="mr-1">•</span> Terms & Condition
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3CB4FF] flex items-center transition-colors">
                <span className="mr-1">•</span> FAQ
              </a>
            </li>
            <li>
              <Link to="/travel-safety" className="hover:text-[#3CB4FF] flex items-center transition-colors">
                <span className="mr-1">•</span> Travel Safety Guidelines
              </Link>
            </li>
          </ul>
        </div>

        {/* --- COLUMN 5: CONTACT US --- */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-black mb-4 text-sm">Contact Us.</h3>
          <ul className="text-xs text-black space-y-3">
            <li className="flex items-start">
              <svg className="w-3.5 h-3.5 text-red-500 mt-0.5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>Colombo, Sri Lanka</span>
            </li>
            <li className="flex items-start">
              <svg className="w-3.5 h-3.5 text-red-500 mt-0.5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>+91 9876543210</span>
            </li>
            <li className="flex items-start">
              <svg className="w-3.5 h-3.5 text-blue-400 mt-0.5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>support@svgt.lk</span>
            </li>
          </ul>
        </div>

      </div>

      {/* --- BOTTOM COPYRIGHT --- */}
      <div className="text-center mt-6 relative z-10">
        <p className="text-[#3CB4FF] font-medium text-xs">svtg@2026 all right reserve</p>
      </div>

    </footer>
  );
};

export default Footer;
