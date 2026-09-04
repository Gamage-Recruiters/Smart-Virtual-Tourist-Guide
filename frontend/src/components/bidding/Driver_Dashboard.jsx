import React, { useState, useEffect } from "react";
import Header from "./DriverHeader";
import Footer from "../Footer";
import { FaStar, FaCar, FaPhoneAlt, FaMapMarkerAlt, FaRegIdCard } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import bImage from "../../assets/B.png";

export default function Driver_Dashboard() {
  const [drivers, setDrivers] = useState([]);
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dRes = await fetch("/api/drivers");
        const dData = await dRes.json();
        if (dData.success && dData.drivers) {
          const formattedDrivers = dData.drivers.map(d => ({
            name: d.name || "Driver",
            car: `${d.vehicleModel || "Car"} - ${d.vehicleNumber || ""}`,
            phone: d.contactNumber || "N/A",
            location: d.city || "Sri Lanka",
            rating: 4.5,
            reviews: "1.2k",
            image: d.image || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
          }));
          setDrivers(formattedDrivers);
        }

        const pRes = await fetch("/api/bookings/type/driver");
        const pData = await pRes.json();
        if (pData.success && pData.bookings) {
          const uniqueCustomers = [];
          const customerIds = new Set();
          
          pData.bookings.forEach(b => {
            if (b.customer && b.customer._id && !customerIds.has(b.customer._id)) {
              customerIds.add(b.customer._id);
              uniqueCustomers.push({
                name: `${b.customer.firstName || ""} ${b.customer.lastName || ""}`.trim() || "Customer",
                from: b.pickupLocation || "Unknown",
                to: b.destination || "Unknown",
                review: "It was a very good trip and I was satisfied with his driving",
                image: b.customer.profileImage || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100"
              });
            }
          });
          setPassengers(uniqueCustomers);
        }
      } catch (err) {
        console.error("Fetch data error:", err);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: "HNB Bank",
    accountHolder: "Thathsara Theeninda",
    accountNumber: "001-1-7812345-6",
    branch: "Nugegoda",
    accountType: "Savings"
  });
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[600px] mt-16">
        <img 
          src={bImage} 
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
            Find and accept new ride requests...
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {/* Earnings */}
            <div 
              className="bg-white hover:bg-blue-50 border border-blue-100 py-6 px-6 rounded-2xl shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              onClick={() => navigate('/driver-earnings')}
            >
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">💰</div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Today Earnings</h2>
              <p className="text-2xl font-extrabold text-slate-800">LKR 4,500</p>
            </div>

            {/* Availability */}
            <div 
              className={`py-6 px-6 rounded-2xl shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center gap-2 border ${
                isAvailable ? 'bg-green-50 hover:bg-green-100 border-green-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300'
              }`}
              onClick={() => setIsAvailable(!isAvailable)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${isAvailable ? 'bg-green-200 text-green-700' : 'bg-slate-300 text-slate-600'}`}>
                {isAvailable ? '🟢' : '⚫'}
              </div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Availability</h2>
              <p className={`text-xl font-extrabold ${isAvailable ? 'text-green-700' : 'text-slate-600'}`}>
                {isAvailable ? 'Online' : 'Offline'}
              </p>
            </div>

            {/* Trips Today */}
            <div 
              className="bg-white hover:bg-blue-50 border border-blue-100 py-6 px-6 rounded-2xl shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              onClick={() => navigate('/driver-request')}
            >
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">🚗</div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Trips Today</h2>
              <p className="text-2xl font-extrabold text-slate-800">3 Trips</p>
            </div>

            {/* Driver Rating */}
            <div 
              className="bg-white hover:bg-blue-50 border border-blue-100 py-6 px-6 rounded-2xl shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              onClick={() => navigate('/driver-details')}
            >
              <div className="w-10 h-10 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">⭐</div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Driver Rating</h2>
              <p className="text-2xl font-extrabold text-slate-800">4.8 <span className="text-sm text-slate-400 font-medium">/5</span></p>
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
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F8FBFF] border border-blue-100 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 font-medium block mb-1">Address</span>
                  <span className="text-xs font-semibold text-slate-700">Meegoda, R.T. Estate</span>
                  <span className="text-[10px] text-slate-400 block">road</span>
                </div>
                <div className="bg-[#F8FBFF] border border-blue-100 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 font-medium block mb-1">Phone No</span>
                  <span className="text-xs font-semibold text-slate-700">0714 228 432</span>
                </div>
                
                {/* Bank Account Details */}
                {/* Bank Account Details */}
                <div className="md:col-span-2 mt-3">
                  <div className="bg-[#F8FBFF] border border-blue-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bank Account Details</span>
                      {!isEditingBank ? (
                        <button onClick={() => setIsEditingBank(true)} className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                          ✏️ Edit
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => setIsEditingBank(false)} className="text-[10px] text-slate-500 hover:text-slate-700 font-bold bg-slate-100 px-2 py-1 rounded-md">
                            Cancel
                          </button>
                          <button onClick={() => setIsEditingBank(false)} className="text-[10px] text-white font-bold bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md">
                            Save
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Bank Name</span>
                      {isEditingBank ? (
                        <input type="text" value={bankDetails.bankName} onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})} className="text-xs font-semibold text-slate-700 text-right bg-white border border-blue-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500" />
                      ) : (
                        <span className="text-xs font-semibold text-slate-700">{bankDetails.bankName}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Account Holder</span>
                      {isEditingBank ? (
                        <input type="text" value={bankDetails.accountHolder} onChange={(e) => setBankDetails({...bankDetails, accountHolder: e.target.value})} className="text-xs font-semibold text-slate-700 text-right bg-white border border-blue-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500" />
                      ) : (
                        <span className="text-xs font-semibold text-slate-700">{bankDetails.accountHolder}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Account Number</span>
                      {isEditingBank ? (
                        <input type="text" value={bankDetails.accountNumber} onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})} className="text-xs font-semibold text-slate-700 text-right bg-white border border-blue-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500" />
                      ) : (
                        <span className="text-xs font-semibold text-slate-700">{bankDetails.accountNumber}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Branch</span>
                      {isEditingBank ? (
                        <input type="text" value={bankDetails.branch} onChange={(e) => setBankDetails({...bankDetails, branch: e.target.value})} className="text-xs font-semibold text-slate-700 text-right bg-white border border-blue-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500" />
                      ) : (
                        <span className="text-xs font-semibold text-slate-700">{bankDetails.branch}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Account Type</span>
                      {isEditingBank ? (
                        <select value={bankDetails.accountType} onChange={(e) => setBankDetails({...bankDetails, accountType: e.target.value})} className="text-xs font-semibold text-slate-700 text-right bg-white border border-blue-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500">
                          <option>Savings</option>
                          <option>Current</option>
                        </select>
                      ) : (
                        <span className="text-xs font-semibold text-slate-700">{bankDetails.accountType}</span>
                      )}
                    </div>
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



