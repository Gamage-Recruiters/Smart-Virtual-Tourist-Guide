// import React, { useState } from 'react';
// // IMPORT YOUR FLAG IMAGE HERE
// import sriLankaFlag from '../../assets/HotelOwner/SLFH.jpg'; 
// import logoImage from '../../assets/HotelOwner/logo.png'; 
// import bg4Image from '../../assets/HotelOwner/bg4.png'; 

// const Header = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const closeSidebar = () => {
//     setIsSidebarOpen(false);
//   };

//   return (
//     <>
//       <header className="w-full bg-white border-b border-gray-100 py-2 relative z-50">
//         <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between">
          
//           {/* --- Background Image on Right Side --- */}
//           <div 
//             className="absolute right-0 top-0 bottom-0 w-1/3 lg:w-1/4 pointer-events-none hidden lg:block"
//             style={{
//               backgroundImage: `url(${bg4Image})`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'right center',
//               backgroundRepeat: 'no-repeat',
//               opacity: 1,
//             }}
//           ></div>

//           {/* --- Left: Logo & Title --- */}
//           <div className="flex items-center gap-3 relative z-10">
//             {/* Logo Image - Imported from assets */}
//             <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
//               <img 
//                 src={logoImage} 
//                 alt="Sri Lanka Logo" 
//                 className="w-full h-full object-contain"
//               />
//             </div>

//             {/* Text Area */}
//             <div className="flex flex-col items-start">
//               {/* Small Tagline */}
//               <span className="text-[8px] md:text-xs font-bold text-gray-700 tracking-wide mb-0.5">
//                 Smart Virtual Tourism Guide
//               </span>
              
//               {/* Main Title with Sri Lankan Flag Mask */}
//               <div className="relative">
//                 <h1 
//                   className="text-lg md:text-2xl lg:text-3xl font-extrabold tracking-[0.15em] leading-none text-transparent bg-clip-text"
//                   style={{
//                     backgroundImage: `url(${sriLankaFlag})`,
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                     WebkitBackgroundClip: 'text',
//                     backgroundClip: 'text',
//                   }}
//                 >
//                   Sri Lanka
//                 </h1>
//               </div>
//             </div>
//           </div>

//           {/* --- Center: Navigation Links (Desktop) --- */}
//           <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 relative z-10">
//             <a href="#" className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors">
//               Add Rooms & Packages
//             </a>
//             <a href="#" className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors">
//               Calendar
//             </a>
//             <a href="#" className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors">
//               Manage Availability
//             </a>
//             <a href="#" className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors">
//               View Bookings
//             </a>
//             <a href="#" className="text-gray-800 font-semibold text-sm lg:text-base hover:text-[#3CB4FF] transition-colors">
//               Revenue Analyze
//             </a>
//           </nav>

//           {/* --- Right: Actions --- */}
//           <div className="flex items-center gap-3 relative z-10">
//             {/* Language Selector */}
//             <div className="flex items-center text-gray-700 cursor-pointer hover:text-gray-900 gap-1 text-sm font-medium hidden sm:flex">
//               <span>EN</span>
//               <svg 
//                 xmlns="http://www.w3.org/2000/svg" 
//                 className="h-3 w-3" 
//                 fill="none" 
//                 viewBox="0 0 24 24" 
//                 stroke="currentColor" 
//                 strokeWidth={2}
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//               </svg>
//             </div>

//             {/* Mobile Menu Button */}
//             <button 
//               onClick={toggleSidebar}
//               className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#3CB4FF] hover:bg-gray-100 transition-colors"
//             >
//               <svg 
//                 xmlns="http://www.w3.org/2000/svg" 
//                 className="h-6 w-6" 
//                 fill="none" 
//                 viewBox="0 0 24 24" 
//                 stroke="currentColor" 
//                 strokeWidth={2}
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//           </div>

//         </div>
//       </header>

//       {/* --- Mobile Sidebar --- */}
//       <div 
//         className={`fixed inset-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
//       >
//         {/* Overlay */}
//         <div 
//           className="absolute inset-0 bg-black bg-opacity-50"
//           onClick={closeSidebar}
//         ></div>

//         {/* Sidebar Content */}
//         <div className="relative w-64 max-w-[80%] h-full bg-white shadow-xl overflow-y-auto">
//           {/* Sidebar Header */}
//           <div className="flex items-center justify-between p-4 border-b border-gray-200">
//             <div className="flex items-center gap-2">
//               <img 
//                 src={logoImage} 
//                 alt="Sri Lanka Logo" 
//                 className="w-8 h-8 object-contain"
//               />
//               <span className="font-bold text-gray-800 text-sm">Sri Lanka</span>
//             </div>
//             <button 
//               onClick={closeSidebar}
//               className="p-1 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 transition-colors"
//             >
//               <svg 
//                 xmlns="http://www.w3.org/2000/svg" 
//                 className="h-6 w-6" 
//                 fill="none" 
//                 viewBox="0 0 24 24" 
//                 stroke="currentColor" 
//                 strokeWidth={2}
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {/* Sidebar Navigation Links */}
//           <nav className="flex flex-col py-2">
//             <a href="#" className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50" onClick={closeSidebar}>
//               Add Rooms & Packages
//             </a>
//             <a href="#" className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50" onClick={closeSidebar}>
//               Calendar
//             </a>
//             <a href="#" className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50" onClick={closeSidebar}>
//               Manage Availability
//             </a>
//             <a href="#" className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50" onClick={closeSidebar}>
//               View Bookings
//             </a>
//             <a href="#" className="px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#3CB4FF] transition-colors border-b border-gray-50" onClick={closeSidebar}>
//               Revenue Analyze
//             </a>
//           </nav>

//           {/* Sidebar Actions */}
//           <div className="p-4 border-t border-gray-200">
//             <div className="flex items-center justify-center text-gray-700 cursor-pointer hover:text-gray-900 gap-1 text-sm font-medium">
//               <span>EN</span>
//               <svg 
//                 xmlns="http://www.w3.org/2000/svg" 
//                 className="h-3 w-3" 
//                 fill="none" 
//                 viewBox="0 0 24 24" 
//                 stroke="currentColor" 
//                 strokeWidth={2}
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };


// export default Header;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Import your logo images
import logoIcon from '../../assets/Tourist/logo.png';
import logoText from '../../assets/Tourist/name.png';
import navBg from '../../assets/Tourist/Headder.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50">
      <nav className="relative">
        {/* Background Image for Navigation Bar */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${navBg})`,
          }}
        />

        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-white/90" />

        {/* Navigation Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">

            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <img
                src={logoIcon}
                alt="Logo"
                className="h-30 w-auto object-contain pt-3 cursor-pointer"
                onClick={() => navigate('/')}
              />

              <img
                src={logoText}
                alt="Smart Virtual Tourism Guide Sri Lanka"
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Desktop Login Button */}
            <div className="hidden md:flex items-center">
              <button
                className="px-6 py-2 bg-[#0075FF] hover:bg-[#0059CC] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-xl"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-slideDown">
              <button
                className="w-full px-4 py-3 bg-[#0075FF] hover:bg-[#0059CC] text-white font-semibold rounded-lg transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;
