import React, { useState } from 'react';
import { 
  FaSearch, FaBoxOpen, FaPlus, FaCloudUploadAlt, FaMapMarkerAlt, 
  FaBold, FaItalic, FaUnderline, FaCode, FaListUl, FaListOl, 
  FaRegCommentDots, FaEraser, FaChevronLeft, FaChevronRight, FaTag
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AddSpecialPackages() {
  const [roomTypeOpen, setRoomTypeOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState('Deluxe Room');

  const amenitiesList = [
    { id: 'terrace', label: 'Terrace', defaultChecked: true },
    { id: 'gardenView', label: 'Garden View', defaultChecked: true },
    { id: 'wifi', label: 'Free WiFi', defaultChecked: true },
    { id: 'ac', label: 'Air Conditions', defaultChecked: true },
    { id: 'breakfast', label: 'Breakfast Included', defaultChecked: true },
    { id: 'pool', label: 'Swimming Pool', defaultChecked: true },
    { id: 'roomService', label: 'Room Service', defaultChecked: true },
    { id: 'parking', label: 'Free Parking', defaultChecked: true },
    { id: 'coffee', label: 'Tea Coffee Maker', defaultChecked: true },
    { id: 'jacuzzi', label: 'Jacuzzi', defaultChecked: true },
  ];

  return (
    <div className="w-full bg-linear-to-b from-white to-[#A0DBFF] min-h-screen">
      <Header />
      {/* 1. HERO BANNER SECTION */}
      <section 
        className="relative h-120 w-full flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)), url('https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1600')` 
        }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Add Special Packages
        </h1>
        <p className="text-base md:text-lg text-slate-800 font-medium mb-8">
          Fill in the Details to Create a New Special Packages of <span className="font-bold">Your</span> Hotel!
        </p>
        
        <div className="relative w-full max-w-md shadow-lg rounded-full">
          <input 
            type="text" 
            placeholder="Explore Packages" 
            className="w-full px-6 py-3.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none pr-12"
          />
          <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
        </div>
      </section>

      {/* 2. MAIN FORM CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-6 md:p-12">
          
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-10">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <FaBoxOpen className="text-2xl text-slate-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Package Details</h2>
          </div>

          <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10" onSubmit={(e) => e.preventDefault()}>
            
            {/* ================= LEFT COLUMN ================= */}
            <div className="space-y-8">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Package Name:</label>
                <input type="text" placeholder="Special Anniversary Package" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-1 focus:ring-blue-400 focus:outline-none transition-all" />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 mb-2">Room Type of Included in the Package</label>
                <button type="button" onClick={() => setRoomTypeOpen(!roomTypeOpen)} className="w-full text-left flex justify-between items-center px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-600 bg-white">
                  <span>{selectedRoomType}</span>
                  <span className="text-xs">▼</span>
                </button>
                {roomTypeOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-30 overflow-hidden">
                    {['Standard Room', 'Deluxe Room', 'King Bed Room'].map((type) => (
                      <div key={type} onClick={() => {setSelectedRoomType(type); setRoomTypeOpen(false);}} className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${selectedRoomType === type ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}>
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Room Size</label>
                  <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-600 bg-white focus:outline-none"><option>65</option></select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Measure type</label>
                  <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-600 bg-white focus:outline-none"><option>sqm</option></select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-700">Select Amenities</label>
                  <button type="button" className="flex items-center gap-1.5 bg-[#007bff] hover:bg-blue-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-md transition-all">
                    <FaPlus className="text-[9px]" /> Add more
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-6 max-h-45 overflow-y-auto pr-3 scrollbar-hide">
                  {amenitiesList.map((amenity) => (
                    <label key={amenity.id} className="flex items-center gap-2.5 text-xs font-medium text-slate-600 cursor-pointer select-none">
                      <input type="checkbox" defaultChecked={amenity.defaultChecked} className="w-4 h-4 accent-[#007bff] border-slate-300 rounded" />
                      {amenity.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Description of the Package</label>
                <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                  <div className="flex items-center gap-5 px-4 py-3 bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                    <FaBold className="cursor-pointer hover:text-blue-600" /><FaItalic className="cursor-pointer hover:text-blue-600" /><FaUnderline className="cursor-pointer hover:text-blue-600" /><FaCode className="cursor-pointer hover:text-blue-600" />
                    <span className="text-slate-300">|</span>
                    <FaListUl className="cursor-pointer hover:text-blue-600" /><FaListOl className="cursor-pointer hover:text-blue-600" />
                    <span className="text-slate-300">|</span>
                    <FaRegCommentDots className="cursor-pointer hover:text-blue-600" /><FaEraser className="cursor-pointer hover:text-blue-600" />
                  </div>
                  <textarea rows={5} defaultValue="Celebrate love with our exclusive Valentine's Romantic Escape Package, designed to create unforgettable moments for couples. Enjoy a beautifully decorated room with romantic bed arrangements, fresh flowers, and soft candlelight ambience." className="w-full p-4 text-xs text-slate-600 leading-relaxed focus:outline-none resize-none" />
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs">📇</span>
                  Contact Information
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Contact Name:</label>
                  <input type="text" defaultValue="Miss.Thilini Harshani Jayasundara" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Contact Number</label>
                  <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 border-r border-slate-200 text-xs">
                      <span>🇱🇰</span> <span className="text-slate-600 font-bold">+94</span>
                    </div>
                    <input type="text" defaultValue="778978346" className="w-full px-4 py-2.5 text-xs text-slate-700 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Contact E mail:</label>
                  <input type="email" defaultValue="thiliniharshani2002@gmail.com" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none shadow-sm" />
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="space-y-8">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-3">Uploaded Room Images</label>
                <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-lg group relative">
                  <img src="https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=600" alt="Package" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-3">Add Images of the Room</label>
                <div className="grid grid-cols-4 gap-4">
                  <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=150" className="aspect-square object-cover rounded-xl border border-slate-200" alt="Sub 1" />
                  <img src="https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?q=80&w=150" className="aspect-square object-cover rounded-xl border border-slate-200" alt="Sub 2" />
                  <img src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=150" className="aspect-square object-cover rounded-xl border border-slate-200" alt="Sub 3" />
                  <div className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-blue-500 cursor-pointer transition-all">
                    <FaPlus />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/40 border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center hover:bg-blue-50 transition-all cursor-pointer">
                <FaCloudUploadAlt className="text-4xl text-blue-500 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-800 mb-1">Drag & Drop or Browse to upload the images</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Upload high quality images (.JPG,.PNG,.JPEG) | Max Image size 5MB <br /> Recommended image size 1400px * 900px
                </p>
              </div>

              {/* CALENDAR SECTION */}
              <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Available Dates of Valid Discount</h3>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-50">
                   <div className="flex justify-between items-center mb-4 px-2">
                      <span className="text-sm font-bold text-slate-800">March 2026</span>
                      <div className="flex gap-4 text-slate-400">
                        <FaChevronLeft className="cursor-pointer hover:text-slate-700" />
                        <FaChevronRight className="cursor-pointer hover:text-slate-700" />
                      </div>
                   </div>
                   <div className="grid grid-cols-7 text-center gap-y-2">
                      {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d} className="text-[10px] font-bold text-slate-400 mb-2">{d}</span>)}
                      {[...Array(31)].map((_, i) => {
                        const day = i + 1;
                        const isSelected = day >= 14 && day <= 27;
                        return (
                          <div key={i} className={`text-[11px] py-1.5 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            {day}
                          </div>
                        );
                      })}
                   </div>
                </div>
              </div>

              {/* LOCATION & SPECIAL DISCOUNT BOXES */}
              <div className="grid grid-cols-1 gap-6">
                <div className="border border-slate-300 rounded-2xl p-6 bg-white space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800"><FaMapMarkerAlt className="text-blue-500" /> Location & Pricing</div>
                  <textarea rows={3} defaultValue="Situated in a prime coastal location in Sri Lanka, the hotel offers breathtaking ocean views and quick access to beaches, cultural sites, and local dining experiences." className="w-full p-3 bg-slate-50 border-none rounded-xl text-xs text-slate-600 resize-none focus:outline-none" />
                  <div className="flex bg-slate-50 rounded-xl overflow-hidden">
                    <span className="px-4 flex items-center text-xs text-slate-400">$</span>
                    <input type="text" defaultValue="300" className="w-full bg-transparent p-2.5 text-xs text-slate-700 focus:outline-none" />
                    <select className="bg-transparent px-3 text-xs font-bold text-slate-500 focus:outline-none"><option>USD</option></select>
                  </div>
                  <div className="space-y-2 pt-2">
                    {['Card Payment', 'Online Payment', 'Cash Payment(Pay at Hotel)'].map(p => (
                      <label key={p} className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 border-slate-300" /> {p}
                      </label>
                    ))}
                  </div>
                </div>

                {/* SPECIAL DISCOUNT BLOCK */}
                <div className="border border-slate-300 rounded-2xl p-6 bg-white text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-widest"><FaTag className="text-blue-500" /> Special Discount</div>
                  <p className="text-[10px] text-slate-400 font-bold">Limited Time Offer!</p>
                  <div className="text-red-500 font-black text-xl">15% OFF</div>
                  <p className="text-[10px] text-slate-500 leading-relaxed px-4">Book now and enjoy 15% off your package! Use the promo code below to save on your romantic getaway.</p>
                  <div className="flex justify-center gap-1.5 mb-2">
                    {['4','1','0','5','8'].map((n, i) => (
                      <span key={i} className="w-8 h-10 flex items-center justify-center bg-blue-50 text-blue-700 font-black text-sm rounded-lg border border-blue-100 shadow-sm">{n}</span>
                    ))}
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Valid From 14th of March 2026 TO 27th of March 2026</p>
                  <button className="w-full bg-[#007bff] hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all text-xs">Apply Discount</button>
                </div>
              </div>

            </div>
          </form>

          <div className="mt-12 text-center text-[10px] text-slate-400 font-medium border-t border-slate-50 pt-8">
            <label className="flex items-center justify-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-blue-600" />
              <span>I agreed <span className="text-blue-500 hover:underline">Terms of Services</span> and <span className="text-blue-500 hover:underline">Privacy Policy</span></span>
            </label>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}