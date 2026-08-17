import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import { FaStar, FaCar, FaPhoneAlt, FaMapMarkerAlt, FaRegIdCard } from "react-icons/fa";
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

export default function Driver_Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[600px] mt-[80px]">
        {/* Placeholder for Ambuluwawa Tower Image */}
        <img 
          src="https://images.unsplash.com/photo-1588096344392-4114d59a7213?auto=format&fit=crop&q=80&w=2000" 
          alt="Ambuluwawa Tower" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4 tracking-wide flex items-center justify-center gap-4">
            Welcome Mendaka !
            <button 
              onClick={() => navigate('/driver-details')}
              className="text-sm bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors shadow-sm"
              title="Edit Profile"
            >
              ✏️
            </button>
          </h1>
          <p className="text-lg md:text-xl font-medium text-slate-700 drop-shadow-sm mb-8">
            Now you can book your driver...
          </p>
          <button 
            onClick={() => navigate('/driver-request')}
            className="bg-white/70 hover:bg-white/90 backdrop-blur-md border border-slate-300 text-slate-800 px-8 py-3 rounded-md font-semibold transition-all relative"
          >
            Explore More...
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
              New Request
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area with Map Background */}
      <div className="relative w-full py-16 px-4 md:px-8">
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
            <div 
              className="bg-[#D9EAFD] py-8 px-6 rounded-2xl shadow-sm text-center cursor-pointer hover:bg-blue-200 transition-colors"
              onClick={() => navigate('/driver-earnings')}
            >
              <h2 className="text-2xl font-bold text-slate-800">Today Earnings</h2>
            </div>
            <div className="bg-[#D9EAFD] py-8 px-6 rounded-2xl shadow-sm text-center">
              <h2 className="text-2xl font-bold text-slate-800">Availability</h2>
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
            
            {/* Left Side: Driver Details */}
            <div className="flex-1 space-y-6">
              
              {/* Header */}
              <div className="flex items-center gap-3">
                <img src={drivers[1].image} alt="Driver" className="w-10 h-10 rounded-full object-cover" />
                <h2 className="font-bold text-lg text-slate-800">Thathsara Theeninda</h2>
              </div>

              {/* Progress Map Graphic */}
              <div className="bg-[#F8FBFF] border border-blue-100 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-700 mb-4">In progress</p>
                <div className="flex items-center justify-between relative mb-2">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mb-1"></div>
                    <span className="text-[10px] text-slate-500 text-center max-w-[80px]">135 Summit Ridge</span>
                  </div>
                  
                  {/* Line */}
                  <div className="flex-1 h-0.5 bg-blue-200 mx-2 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-yellow-400 p-1 rounded-sm shadow-sm">
                      <FaCar className="text-slate-800 text-[10px]" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mb-1"></div>
                    <span className="text-[10px] text-slate-500 text-center max-w-[80px]">7633 Meadowcroft Drive</span>
                  </div>
                </div>
                {/* Embedded dummy map image */}
                <div className="mt-4 h-40 bg-gray-200 rounded-xl overflow-hidden relative">
                   <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60" alt="Map" />
                </div>
              </div>

              {/* Driver Stats */}
              <div className="bg-[#F8FBFF] border border-blue-100 rounded-2xl p-4 flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
                <div className="flex items-center gap-4">
                  <img src={drivers[1].image} alt="Driver" className="w-16 h-16 rounded-full object-cover shadow-sm" />
                  <div>
                    <h3 className="font-bold text-slate-800">Thathsara Theeninda</h3>
                    <p className="text-xs text-slate-500">experience <span className="font-bold text-slate-700">2 Years</span></p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-xs font-bold">★ On the field</div>
                  <div className="flex items-center text-amber-400 font-bold text-sm">
                    ★ 4.8
                  </div>
                </div>
              </div>

              {/* Driver Info Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start justify-between">
                  <span className="text-xs text-slate-400 w-20">Address</span>
                  <span className="text-xs font-medium text-slate-700 text-right flex-1">Meegoda, R.T. Estate... <span className="text-[10px] text-slate-400 block">road</span></span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-xs text-slate-400 w-20">Ph.no</span>
                  <span className="text-xs font-medium text-slate-700 text-right flex-1">0714228432</span>
                </div>
                
                {/* Bank Card Graphic */}
                <div className="md:col-span-2 flex justify-end mt-2">
                  <div className="bg-[#3478F6] text-white p-3 rounded-xl shadow-md w-[200px] relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
                    <div className="text-[10px] opacity-80 mb-1">HNB Bank</div>
                    <div className="font-mono text-sm tracking-widest">7812 3739 0023 2345</div>
                  </div>
                </div>
              </div>

              {/* Vehicle & Documents */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-[#F8FBFF] border border-blue-100 rounded-2xl p-4 flex items-center justify-center">
                  {/* Car Placeholder Image */}
                  <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=300" className="w-full h-auto object-cover rounded-lg" alt="Car" />
                </div>
                <div className="bg-[#F8FBFF] border border-blue-100 rounded-2xl p-4 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 mb-2">Documents</span>
                  {/* Document Placeholder Image */}
                  <div className="flex-1 bg-white border border-slate-200 rounded-lg overflow-hidden relative">
                     <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover opacity-80" alt="ID Card" />
                     <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply"></div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side: Passengers */}
            <div className="lg:w-[400px] flex flex-col">
              <h3 className="font-bold text-slate-800 mb-4 text-sm">Passengers</h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {passengers.map((passenger, index) => (
                  <div key={index} className="bg-[#F8FBFF] border border-blue-100 rounded-2xl p-4 relative">
                    <div className="absolute top-4 right-4 w-6 h-6 bg-blue-100 rounded-full"></div>
                    <div className="flex items-center gap-3 mb-3">
                      <img src={passenger.image} alt={passenger.name} className="w-10 h-10 rounded-full object-cover" />
                      <h4 className="font-bold text-sm text-slate-800">{passenger.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-3 font-medium">
                      <HiOutlineLocationMarker className="text-slate-400" />
                      <span>{passenger.from}</span>
                      <span>→</span>
                      <HiOutlineLocationMarker className="text-slate-400" />
                      <span>{passenger.to}</span>
                    </div>
                    <p className="text-xs text-slate-600 italic mb-3">"{passenger.review}"</p>
                    <div className="flex text-amber-400 text-[10px]">
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
