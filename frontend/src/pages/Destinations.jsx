// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// // --- IMPORT THE IMAGE FROM ASSETS ---
// import heroBg from '../assets/LandingPage/Destination.png'; 

// // --- SVGs for Icons ---
// const SearchIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
//   </svg>
// );

// const StarIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
//     <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
//   </svg>
// );

// const ClockIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const UserIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
//   </svg>
// );

// const BeachIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a9 9 0 01.813 17.95C8.39 19.3 3.75 15.2 3.75 9.75c0-4.14 3.34-7.5 7.5-7.5z" />
//     <path strokeLinecap="round" strokeLinejoin="round" d="M6.64 15.433a7.5 7.5 0 005.313 3.473" />
//   </svg>
// );

// const MountainIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
//   </svg>
// );

// const LeafIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 2.12-1.1 4.05-2.8 5.2" />
//   </svg>
// );

// const HistoricalIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
//   </svg>
// );

// const WaterfallIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-500">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
//     <path strokeLinecap="round" strokeLinejoin="round" d="M3 15h3c.5 0 1-.5 1-1s-.5-1-1-1H3" />
//     <path strokeLinecap="round" strokeLinejoin="round" d="M18 15h3c.5 0 1-.5 1-1s-.5-1-1-1h-3" />
//   </svg>
// );

// const CityIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
//   </svg>
// );

// // --- Destination Card Component ---
// const DestinationCard = ({ image, title, rating, reviews, price, days, travelers, location }) => {
//   return (
//     <div className="w-[320px] md:w-[380px] h-full flex flex-col bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden hover:shadow-lg transition-shadow duration-300">
//       <div className="relative shrink-0">
//         <img 
//           src={image} 
//           alt={title} 
//           className="w-full h-64 object-cover"
//         />
//         <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
//           <StarIcon />
//           <span className="text-sm font-medium text-gray-800">{rating} ({reviews} Reviews)</span>
//         </div>
//       </div>
//       <div className="p-6 text-center flex flex-col flex-1">
//         <h4 className="text-2xl font-bold text-gray-800 mb-3">{title}</h4>
//         <div className="flex flex-col items-center gap-1 mt-auto">
//           <div className="text-lg font-semibold text-gray-700">{price}</div>
//           <div className="flex items-center gap-2 text-gray-600">
//             <ClockIcon />
//             <span>{days}</span>
//           </div>
//           <div className="flex items-center gap-2 text-gray-600">
//             <UserIcon />
//             <span>{travelers}</span>
//           </div>
//           <div className="text-gray-600 text-sm mt-1">{location}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function App() {
//   const [destinations, setDestinations] = useState([]);

//   // --- Slideshow State ---
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const slideshowImages = [
//   //   "https://images.unsplash.com/photo-1596707328637-67c944ebc37b?q=80&w=2070&auto=format&fit=crop",
//   //   "https://images.unsplash.com/photo-1589835278742-445cac9c73d4?q=80&w=2070&auto=format&fit=crop",
//   //   "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=2070&auto=format&fit=crop",
//   //   "https://images.unsplash.com/photo-1563911302283-d2bc129e7c1f?q=80&w=2070&auto=format&fit=crop",
//   //   "https://images.unsplash.com/photo-1589391886645-d51941b1ee7b?q=80&w=2070&auto=format&fit=crop",
//   //   "https://images.unsplash.com/photo-1510552424083-412f8eb10053?q=80&w=2070&auto=format&fit=crop"
//   // ];
//     "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=2070&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=2070&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=2070&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=2070&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=2070&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=2070&auto=format&fit=crop",

//   ];

//   // --- Auto-play logic ---
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev === slideshowImages.length - 1 ? 0 : prev + 1));
//     }, 4000); // Changes every 4 seconds

//     return () => clearInterval(timer);
//   }, [slideshowImages.length]);

//   // --- Fetch Destinations ---
//   useEffect(() => {
//     const fetchDestinations = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/destinations');
//         setDestinations(response.data);
//       } catch (error) {
//         console.error('Error fetching destinations:', error);
//       }
//     };
//     fetchDestinations();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#fbfcfd] text-gray-800 pb-20">

//       {/* --- Hero Section --- */}
//       <div className="relative w-full h-[450px]">
//         <div 
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//           style={{ backgroundImage: `url(${heroBg})` }}
//         >
//           <div className="absolute inset-0 bg-black/20"></div>
//         </div>
//         <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
//           <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-wide drop-shadow-md">
//             DESTINATIONS
//           </h1>
//           <div className="mt-4 text-2xl md:text-3xl font-bold text-white drop-shadow-md">
//             Discover the Best of <span className="text-primary-orange">Sri Lanka</span>
//           </div>
//         </div>
//       </div>

//       {/* --- Main Content Container --- */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

//         {/* Tagline */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
//             Find your next <span className="text-[#5BA3F5]">destination</span><br />
//             and <span className="text-[#5BA3F5]">experience</span> the beauty of<br />
//             <span className="text-primary-orange">Sri Lanka</span> with confidence.
//           </h2>
//         </div>

//         {/* --- Two Column Layout --- */}
//         <div className="flex flex-col lg:flex-row gap-12">

//           {/* --- Left Column: Popular Destinations --- */}
//           <div className="flex-1 min-w-0">
//             <h3 className="text-2xl font-semibold text-gray-700 mb-6">Our Popular Destination</h3>

//             {/* --- Horizontal Scrollable Container --- */}
//             <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth hide-scrollbar items-stretch">

//               {destinations.length > 0 ? (
//                 destinations.map((dest) => (
//                   <div className="snap-start flex h-auto" key={dest._id}>
//                     <DestinationCard 
//                       image={dest.thumbnailImage}
//                       title={dest.title}
//                       rating={dest.rating}
//                       reviews={dest.reviewCount}
//                       price={`Rs. ${dest.price} / Per Person`}
//                       days={`${dest.duration} Days`}
//                       travelers={`${dest.travelersCount}+ Travelers`}
//                       location={dest.location}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-gray-500">No destinations available. Add some using the Add Destination button!</div>
//               )}

//             </div>
//           </div>

//           {/* --- Right Column: Sidebar --- */}
//           <div className="w-full lg:w-[340px] flex flex-col gap-6">

//             {/* Search Bar */}
//             <div className="relative bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-1.5 flex items-center">
//               <input 
//                 type="text" 
//                 placeholder="Search" 
//                 className="flex-1 px-4 py-2 outline-none text-gray-600 placeholder-gray-400 bg-transparent"
//               />
//               <button className="bg-[#5BA3F5] hover:bg-[#4a92e4] rounded-full p-3 flex items-center justify-center transition-colors">
//                 <SearchIcon />
//               </button>
//             </div>

//             {/* Filters Section */}
//             <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-6">
//               <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">Filters</h4>
//               <div className="flex flex-wrap gap-2">
//                 <FilterButton label="Province" />
//                 <FilterButton label="Adventure Level" />
//                 <FilterButton label="Family Friendly" />
//                 <FilterButton label="Solo Travel" />
//                 <FilterButton label="Best Season" />
//                 <FilterButton label="Couple Friendly" />
//               </div>
//             </div>

//             {/* Explore Category Section */}
//             <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-6">
//               <h4 className="text-xl font-semibold text-gray-800 mb-4">Explore by Category</h4>
//               <div className="space-y-3">
//                 <CategoryButton icon={<BeachIcon />} label="Beaches" />
//                 <CategoryButton icon={<MountainIcon />} label="Mountains" />
//                 <CategoryButton icon={<LeafIcon />} label="National Parks" />
//                 <CategoryButton icon={<HistoricalIcon />} label="Historical" />
//                 <CategoryButton icon={<WaterfallIcon />} label="Waterfalls" />
//                 <CategoryButton icon={<CityIcon />} label="Cities" />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* --- UPDATED: Destinations View Section (Slideshow) --- */}
//         <div className="mt-16">
//           <h3 className="text-2xl font-semibold text-gray-700 mb-6">Destinations View</h3>

//           <div className="relative w-full bg-white rounded-[32px] shadow-[0_4px_20px_rgb(0,0,0,0.05)] overflow-hidden h-[350px] md:h-[400px]">
//             {/* Slides Wrapper */}
//             <div 
//               className="flex h-full transition-transform duration-700 ease-in-out"
//               style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//             >
//               {slideshowImages.map((img, index) => (
//                 <div key={index} className="min-w-full h-full">
//                   <img 
//                     src={img} 
//                     alt={`Destination ${index + 1}`} 
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* --- Manual Navigation Arrows (Optional) --- */}
//             <button 
//               onClick={() => setCurrentSlide((prev) => prev === 0 ? slideshowImages.length - 1 : prev - 1)}
//               className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
//               </svg>
//             </button>
//             <button 
//               onClick={() => setCurrentSlide((prev) => prev === slideshowImages.length - 1 ? 0 : prev + 1)}
//               className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
//               </svg>
//             </button>

//             {/* --- Navigation Dots --- */}
//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
//               {slideshowImages.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentSlide(index)}
//                   className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                     currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
//                   }`}
//                 />
//               ))}
//             </div>

//           </div>

//         </div>
//         <div className='flex justify-center mt-6'>
//           <Link to="/add-destination"><button  className='bg-red-500 text-white px-4 py-2 rounded-full'>Add Destination</button>
//           </Link>
//         </div>

//       </div>
//     </div>
//   );
// }

// // Helper Components
// const FilterButton = ({ label }) => (
//   <button className="border border-gray-200 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors">
//     {label}
//   </button>
// );

// const CategoryButton = ({ icon, label }) => (
//   <button className="w-full flex items-center gap-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl px-4 py-3 transition-colors">
//     <div className="w-8 flex justify-center">
//       {icon}
//     </div>
//     <span className="text-base font-medium text-gray-700">{label}</span>
//   </button>
// );

// export default App;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DestinationDetails from './DestinationDetails';

// --- IMPORT THE IMAGE FROM ASSETS ---
import heroBg from '../assets/LandingPage/Destination.png';

// --- SVGs for Icons ---
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 text-yellow-400"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

// --- Destination Card Component ---
const DestinationCard = ({
  image,
  title,
  rating,
  reviews,
  price,
  days,
  travelers,
  location,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="w-full bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-52 object-cover"
        />

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <StarIcon />
          <span className="text-xs font-medium text-gray-800">
            {rating || 'N/A'} ({reviews || 0})
          </span>
        </div>
      </div>

      <div className="p-5 text-center flex-1 flex flex-col justify-between">
        <h4 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {title}
        </h4>

        <div className="flex flex-col items-center gap-1">
          <div className="text-base font-semibold text-gray-700">
            {price}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon />
            <span>{days}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserIcon />
            <span>{travelers}</span>
          </div>

          <div className="text-gray-500 text-xs mt-1 line-clamp-1">
            {location}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Destination Page ---
const App = () => {
  const navigate = useNavigate();

  // Backend destinations
  const [destinations, setDestinations] = useState([]);

  // Frontend interaction states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState(null);

  // --- Slideshow Images from Assets ---
  const slideImagesModules = import.meta.glob(
    '../assets/LandingPage/DestinationSlideShow/*.{jpg,jpeg,png,webp}',
    { eager: true, import: 'default' }
  );

  const slideshowImages = Object.entries(slideImagesModules)
    .sort(([pathA], [pathB]) => {
      const numA = parseInt(pathA.match(/(\d+)\.[a-zA-Z]+$/)?.[1] || '0', 10);
      const numB = parseInt(pathB.match(/(\d+)\.[a-zA-Z]+$/)?.[1] || '0', 10);
      return numA - numB;
    })
    .map(([_, img]) => img);

  // --- Fetch Latest 8 Destinations from Backend ---
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/destinations'
        );

        // Sort descending by creation date or ID to get latest, then slice top 8
        const sortedData = response.data
          .slice()
          .sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id))
          .slice(0, 8);

        setDestinations(sortedData);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, []);

  // --- Auto-play slideshow ---
  useEffect(() => {
    if (!selectedDestination) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === slideshowImages.length - 1 ? 0 : prev + 1
        );
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [slideshowImages.length, selectedDestination]);

  // --- Destination card click ---
  const handleDestinationClick = (destination) => {
    setSelectedDestination(destination);
  };

  // --- Back from details ---
  const handleBack = () => {
    setSelectedDestination(null);
  };

  // --- Show destination details ---
  if (selectedDestination) {
    return (
      <DestinationDetails
        destination={selectedDestination}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcfd] text-gray-800 pb-20">

      {/* HERO SECTION */}
      <div className="relative w-full h-[450px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-wide drop-shadow-md">
            DESTINATIONS
          </h1>

          <div className="mt-4 text-2xl md:text-3xl font-bold text-white drop-shadow-md">
            Discover the Best of{' '}
            <span className="text-primary-orange">
              Sri Lanka
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Tagline */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            Find your next{' '}
            <span className="text-[#5BA3F5]">
              destination
            </span>
            <br />
            and{' '}
            <span className="text-[#5BA3F5]">
              experience
            </span>{' '}
            the beauty of
            <br />
            <span className="text-primary-orange">
              Sri Lanka
            </span>{' '}
            with confidence.
          </h2>
        </div>

        {/* POPULAR DESTINATIONS GRID (8 Cards - 4 Per Row) */}
        <div className="w-full">
          <h3 className="text-2xl font-semibold text-gray-700 mb-8">
            Our Popular Destinations
          </h3>

          {destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((dest) => (
                <DestinationCard
                  key={dest._id}
                  image={
                    dest.heroImage ||
                    (dest.images && dest.images[0]) ||
                    dest.thumbnailImage ||
                    dest.image
                  }
                  title={dest.title}
                  rating={dest.rating}
                  reviews={dest.reviewCount}
                  price={
                    dest.priceDisplay ||
                    (dest.price ? `Rs. ${dest.price} / Per Person` : 'Price N/A')
                  }
                  days={
                    dest.durationDisplay ||
                    (dest.duration ? `${dest.duration} Days` : 'N/A')
                  }
                  travelers={
                    dest.travelersDisplay ||
                    (dest.travelersCount
                      ? `${dest.travelersCount}+ Travelers`
                      : 'N/A')
                  }
                  location={dest.location}
                  onClick={() => handleDestinationClick(dest)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No destinations available. Add some using the Add Destination button!
            </div>
          )}

          {/* EXPLORE MORE BUTTON */}
          <div className="flex justify-center mt-12">
            <button
              onClick={() => navigate('/results')}
              className="bg-[#5BA3F5] hover:bg-[#4a92e4] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-colors"
            >
              Explore More
            </button>
          </div>
        </div>

        {/* DESTINATIONS VIEW - SLIDESHOW */}
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">
            Destinations View
          </h3>

          <div className="relative w-full bg-white rounded-[32px] shadow-[0_4px_20px_rgb(0,0,0,0.05)] overflow-hidden h-[350px] md:h-[400px]">
            {/* Slides Wrapper */}
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {slideshowImages.map((img, index) => (
                <div key={index} className="min-w-full h-full">
                  <img
                    src={img}
                    alt={`Destination ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Previous Button */}
            <button
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev === 0 ? slideshowImages.length - 1 : prev - 1
                )
              }
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev === slideshowImages.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full max-w-[90%] overflow-x-auto">
              {slideshowImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 shrink-0 ${
                    currentSlide === index
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ADD DESTINATION BUTTON */}
        {/* <div className="flex justify-center mt-10">
          <Link to="/add-destination">
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-full transition-colors font-medium">
              Add Destination
            </button>
          </Link>
        </div> */}

      </div>
    </div>
  );
};

export default App;