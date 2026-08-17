import React, { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { FaStar, FaCar, FaPhoneAlt, FaMapMarkerAlt, FaRegIdCard, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

// Mock Data
const drivers = [
  {
    name: "Janith Liyanage",
    car: "Premier - White - CBC 1234",
    phone: "0713370045",
    location: "Colombo 7",
    rating: 4.5,
    reviews: "1.2k",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Thathsara Theeninda",
    car: "Mercedes EQE - White - CMB542 91",
    phone: "0714228432",
    location: "Colombo 7",
    rating: 4.8,
    reviews: "2.3k",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Shanith Gunasekara",
    car: "PORSEC - White - BBA 1424",
    phone: "0713532157",
    location: "Colombo",
    rating: 4.8,
    reviews: "1.6k",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Mendaka peiris",
    car: "Premier - White - BBA 1424",
    phone: "0712042245",
    location: "Colombo 7",
    rating: 4.5,
    reviews: "1.6k",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Charuka Wanigasinghe",
    car: "Premier - White - BBA 1424",
    phone: "0712332244",
    location: "Colombo",
    rating: 4.5,
    reviews: "2.9k",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "kavidu basith",
    car: "Premier - White - BBA 1234",
    phone: "0717422157",
    location: "Colombo",
    rating: 4.5,
    reviews: "1.8k",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150"
  }
];

const passengers = [
  {
    name: "Charuka Wanigasinghe",
    from: "Colombo 7",
    to: "Colombo 5",
    review: "It was a very good trip and I was satisfied with her driving",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100"
  },
  {
    name: "Charuka Wanigasinghe",
    from: "Colombo 7",
    to: "Colombo 5",
    review: "It was a very good trip and I was satisfied with her driving",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100"
  },
  {
    name: "Shanith Gunasekara",
    from: "Colombo",
    to: "DOP",
    review: "It was a very good trip and I was satisfied with his driving",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
  },
  {
    name: "Shanith Gunasekara",
    from: "bd cs-Magamta",
    to: "Pablu Gamlar",
    review: "It was a very good trip and I was satisfied with his driving",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
  }
];

export default function Driver_Request() {
  const navigate = useNavigate();

  // Prevent background scrolling so we only have one scrollbar
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col relative">
      
      {/* MODAL OVERLAY */}
      <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4 py-24">
          
          <div className="bg-[#D9EAFD] w-full max-w-xl rounded-[40px] shadow-2xl relative flex flex-col p-8 pt-20 border-4 border-white/50 mt-12">
            
            {/* Avatar Graphic */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-32 bg-[#E14335] rounded-full flex items-center justify-center shadow-xl border-4 border-white overflow-hidden">
                <img src="https://cdn3d.iconscout.com/3d/premium/thumb/pilot-4996168-4159588.png" alt="Driver" className="w-24 h-24 object-contain drop-shadow-md" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-8 mb-6 mt-4">
              {/* Pickup */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-1">
                  <HiOutlineLocationMarker className="text-blue-500" /> Pickup
                </label>
                <input type="text" placeholder="Select Pickup" className="w-full bg-white rounded-full px-5 py-3 text-sm font-medium text-slate-700 outline-none text-center shadow-sm" />
              </div>
              
              {/* Drop */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-1">
                  <HiOutlineLocationMarker className="text-blue-500" /> Drop
                </label>
                <input type="text" placeholder="Select Drop" className="w-full bg-white rounded-full px-5 py-3 text-sm font-medium text-slate-700 outline-none text-center shadow-sm" />
              </div>

              {/* Distance */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-1">
                  <FaMapMarkerAlt className="text-blue-500" /> Distance
                </label>
                <input type="text" placeholder="Km" className="w-full bg-white rounded-full px-5 py-3 text-sm font-medium text-slate-700 outline-none text-center shadow-sm" />
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-1">
                  <FaRegIdCard className="text-blue-500" /> Price
                </label>
                <input type="text" placeholder="0.00" className="w-full bg-white rounded-full px-5 py-3 text-sm font-medium text-slate-700 outline-none text-center shadow-sm" />
              </div>

              {/* Customer Details Name */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-1">
                  <FaRegIdCard className="text-blue-500" /> Customer details
                </label>
                <input type="text" placeholder="Customer Name" className="w-full bg-white rounded-full px-5 py-3 text-sm font-medium text-slate-700 outline-none text-center shadow-sm" />
              </div>

              {/* Customer Details Phone */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-1">
                  <FaPhoneAlt className="text-blue-500" /> Customer details
                </label>
                <input type="text" placeholder="Customer/Contact number" className="w-full bg-white rounded-full px-5 py-3 text-sm font-medium text-slate-700 outline-none text-center shadow-sm" />
              </div>
            </div>

            {/* Map Graphic */}
            <div className="bg-white rounded-[30px] p-4 shadow-sm mb-8 h-48 relative overflow-hidden flex items-center justify-center border-4 border-white">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" alt="Route Map" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" />
              
              {/* SVG Overlay for Route */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                 <path d="M 80,60 Q 150,50 200,100 T 320,120" fill="transparent" stroke="#EF4444" strokeWidth="3" strokeDasharray="5,5" />
                 <circle cx="80" cy="60" r="4" fill="#EF4444" />
                 <circle cx="320" cy="120" r="4" fill="#EF4444" />
              </svg>

              <div className="absolute top-4 left-[20%] bg-white px-2 py-1 rounded text-[10px] font-bold shadow text-slate-700">Doctor 20</div>
              <div className="absolute top-16 right-[20%] bg-white px-2 py-1 rounded text-[10px] font-bold shadow text-slate-700">1-Tonnigton</div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <button 
                className="bg-[#3478F6] hover:bg-blue-600 text-white rounded-full px-10 py-3 font-bold flex items-center gap-2 shadow-lg transition-all w-full sm:w-40 justify-center"
                onClick={() => navigate('/submit-bids')}
              >
                Accept
                <FaChevronRight className="text-[10px]" />
              </button>
              <button 
                className="bg-[#5C8DFF] hover:bg-blue-500 text-white rounded-full px-10 py-3 font-bold flex items-center gap-2 shadow-lg transition-all w-full sm:w-40 justify-center"
                onClick={() => navigate('/driver-dashboard')}
              >
                <FaChevronLeft className="text-[10px]" />
                Decline
              </button>
            </div>

          </div>
        </div>
      </div>
      {/* END MODAL OVERLAY */}


      {/* Background Dashboard UI (Exactly same as Driver_Dashboard to make the overlay look native) */}
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[600px] mt-[80px] filter blur-[2px] opacity-80 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1588096344392-4114d59a7213?auto=format&fit=crop&q=80&w=2000" 
          alt="Ambuluwawa Tower" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4 tracking-wide">
            Welcome Mendaka !
          </h1>
          <p className="text-lg md:text-xl font-medium text-slate-700 drop-shadow-sm mb-8">
            Now you can book your driver...
          </p>
          <button className="bg-white/70 hover:bg-white/90 backdrop-blur-md border border-slate-300 text-slate-800 px-8 py-3 rounded-md font-semibold transition-all">
            Explore More...
          </button>
        </div>
      </div>

      {/* Main Content Area with Map Background */}
      <div className="relative w-full py-16 px-4 md:px-8 filter blur-[2px] opacity-80 pointer-events-none">
        {/* Placeholder Map Background */}
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')", 
            backgroundSize: "cover", 
            backgroundPosition: "center",
            filter: "grayscale(100%)"
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-12">
          
          {/* Top 4 Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-4xl mx-auto">
            <div className="bg-[#D9EAFD] py-8 px-6 rounded-2xl shadow-sm text-center">
              <h2 className="text-2xl font-bold text-slate-800">Today Earnings</h2>
            </div>
            <div className="bg-[#D9EAFD] py-8 px-6 rounded-2xl shadow-sm text-center">
              <h2 className="text-2xl font-bold text-slate-800">Current Status</h2>
            </div>
            <div className="bg-[#D9EAFD] py-8 px-6 rounded-2xl shadow-sm text-center">
              <h2 className="text-2xl font-bold text-slate-800">Trips Today</h2>
            </div>
            <div className="bg-[#D9EAFD] py-8 px-6 rounded-2xl shadow-sm text-center">
              <h2 className="text-2xl font-bold text-slate-800">Driver Rating</h2>
            </div>
          </div>

          {/* Other Drivers Grid */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-lg border border-slate-100 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.map((driver, index) => (
                <div key={index} className="bg-[#F8FBFF] border border-blue-100 rounded-2xl p-4 flex flex-col relative">
                  <div className="absolute top-4 right-4 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center text-blue-600">
                    →
                  </div>
                  <div className="flex items-start gap-4 mb-4">
                    <img src={driver.image} alt={driver.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">{driver.name}</h3>
                      <div className="flex items-center text-xs text-slate-500 mt-1 space-x-1">
                         <FaCar className="text-slate-400" />
                         <span className="truncate max-w-[150px]">{driver.car}</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-500 mt-1 space-x-1">
                         <FaPhoneAlt className="text-slate-400" />
                         <span>{driver.phone}</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-500 mt-1 space-x-1">
                         <FaMapMarkerAlt className="text-slate-400" />
                         <span>{driver.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex text-amber-400 text-xs">
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-amber-400/50" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{driver.rating} <span className="text-slate-400 font-normal">/ {driver.reviews}</span></span>
                  </div>
                  <button className="w-full bg-[#3478F6] hover:bg-blue-600 text-white text-xs font-semibold py-2.5 rounded-full shadow-md transition-colors">
                    On the way to destination
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Driver Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <img src={drivers[1].image} alt="Driver" className="w-10 h-10 rounded-full object-cover" />
                <h2 className="font-bold text-lg text-slate-800">Thathsara Theeninda</h2>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
