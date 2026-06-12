import React, { useState } from 'react';
import { 
  FaSearch, FaBuilding, FaPlus, FaCloudUploadAlt, FaMapMarkerAlt, 
  FaBold, FaItalic, FaUnderline, FaCode, FaListUl, FaListOl, 
  FaRegCommentDots, FaEraser 
} from 'react-icons/fa';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function AddRoomPage() {
  const [roomTypeOpen, setRoomTypeOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState('Select Room Type');

  // Amenities list matching your screenshot
  const amenitiesList = [
    { id: 'terrace', label: 'Terrace', defaultChecked: true },
    { id: 'gardenView', label: 'Garden View', defaultChecked: false },
    { id: 'wifi', label: 'Free WiFi', defaultChecked: false },
    { id: 'ac', label: 'Air Conditions', defaultChecked: true },
    { id: 'breakfast', label: 'Breakfast Included', defaultChecked: true },
    { id: 'pool', label: 'Swimming Pool', defaultChecked: false },
    { id: 'roomService', label: 'Room Service', defaultChecked: false },
    { id: 'parking', label: 'Free Parking', defaultChecked: false },
    { id: 'coffee', label: 'Tea Coffee Maker', defaultChecked: true },
  ];

  const handleRoomTypeSelect = (type) => {
    setSelectedRoomType(type);
    setRoomTypeOpen(false);
  };

  return (
    <div className="w-full bg-linear-to-b from-white to-[#A0DBFF] min-h-screen">
      <div>
        <Header />
      </div>
      {/* 1. HERO BANNER SECTION */}
      <section 
        className="relative h-112.5 w-full flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600')` 
        }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Add Rooms of Accomodations
        </h1>
        <p className="text-base md:text-lg text-slate-800 font-medium mb-8">
          Fill in the Details to Create a New Room for <span className="font-bold">Your</span> Hotel!
        </p>
        
        {/* Explore Search Bar */}
        <div className="relative w-full max-w-md shadow-md rounded-full">
          <input 
            type="text" 
            placeholder="Explore Room" 
            className="w-full px-6 py-3.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none pr-12"
          />
          <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
        </div>
      </section>

      {/* 2. MAIN INPUT DASHBOARD CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-6 md:p-10">
          
          {/* Header Indicator */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-8">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <FaBuilding className="text-xl text-slate-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Room Details</h2>
          </div>

          {/* Core Two-Column Form Split Layout */}
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8" onSubmit={(e) => e.preventDefault()}>
            
            {/* ================= LEFT COLUMN ================= */}
            <div className="space-y-6">
              
              {/* Room Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Room Name:</label>
                <input 
                  type="text" 
                  placeholder="Deluxe Double Room"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-800 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Room Type Custom Dropdown Selector */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 mb-2">Room Type</label>
                <button
                  type="button"
                  onClick={() => setRoomTypeOpen(!roomTypeOpen)}
                  className="w-full text-left flex justify-between items-center px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-600 bg-white"
                >
                  <span>{selectedRoomType}</span>
                  <span className="text-xs transition-transform duration-200">▼</span>
                </button>
                {roomTypeOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 overflow-hidden">
                    {['Standard Room', 'Deluxe Room', 'Family Suite'].map((type) => (
                      <div
                        key={type}
                        onClick={() => handleRoomTypeSelect(type)}
                        className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                          selectedRoomType === type ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Room Size & Measure Type Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Room Size</label>
                  <select className="w-full px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-600 bg-white focus:outline-none">
                    <option>55</option>
                    <option>75</option>
                    <option>100</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Measure type</label>
                  <select className="w-full px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-600 bg-white focus:outline-none">
                    <option>sqm</option>
                    <option>sqft</option>
                  </select>
                </div>
              </div>

              {/* Amenities List Checklist with Actions Button */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-700">Select Amenities</label>
                  <button type="button" className="flex items-center gap-1.5 bg-[#007bff] hover:bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-md shadow-sm transition-colors">
                    <FaPlus className="text-[9px]" /> Add more
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 max-h-40 overflow-y-auto pr-2">
                  {amenitiesList.map((amenity) => (
                    <label key={amenity.id} className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        defaultChecked={amenity.defaultChecked}
                        className="w-3.5 h-3.5 accent-[#007bff] border-slate-300 rounded"
                      />
                      {amenity.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Rich-Text Description Box Editor Simulation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Description</label>
                <div className="border border-slate-300 rounded-md overflow-hidden">
                  {/* Fake rich-text action header bar layout */}
                  <div className="flex items-center gap-4 px-3 py-2 bg-slate-50 border-b border-slate-200 text-slate-500 text-xs">
                    <FaBold className="cursor-pointer hover:text-slate-800" />
                    <FaItalic className="cursor-pointer hover:text-slate-800" />
                    <FaUnderline className="cursor-pointer hover:text-slate-800" />
                    <FaCode className="cursor-pointer hover:text-slate-800" />
                    <span className="text-slate-300">|</span>
                    <FaListUl className="cursor-pointer hover:text-slate-800" />
                    <FaListOl className="cursor-pointer hover:text-slate-800" />
                    <span className="text-slate-300">|</span>
                    <FaRegCommentDots className="cursor-pointer hover:text-slate-800" />
                    <FaEraser className="cursor-pointer hover:text-slate-800" />
                  </div>
                  <textarea 
                    rows={4}
                    defaultValue="Experience luxury and comfort in our spacious Deluxe Double Room, featuring a king-sized bed, a private balcony with stunning garden views, and modern amenities to ensure a memorable stay."
                    className="w-full p-3 text-xs text-slate-600 leading-relaxed focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Contact Information Sub-block */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-[10px]">📇</span>
                  Contact Information
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Contact Name:</label>
                  <input type="text" defaultValue="Miss.Thilini Harshani Jayasundara" className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-700 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Contact Number</label>
                  <div className="flex bg-white border border-slate-200 rounded overflow-hidden">
                    <div className="flex items-center gap-1 bg-slate-50 px-2.5 border-r border-slate-200 text-xs">
                      <span>🇱🇰</span> <span className="text-slate-600 font-medium">+94</span>
                    </div>
                    <input type="text" defaultValue="778978346" className="w-full px-3 py-2 text-xs text-slate-700 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Contact E mail:</label>
                  <input type="email" defaultValue="thiliniharshani2002@gmail.com" className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-700 focus:outline-none" />
                </div>
              </div>

            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="space-y-6">
              
              {/* Main Room Image Grid View Canvas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Uploaded Room Images</label>
                <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600" 
                    alt="Uploaded preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Dynamic Subgrid: Add Images Selectors */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Add Images of the Room</label>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index} className="aspect-square bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 cursor-pointer flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors">
                      <span className="text-lg font-light">+</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drag and Drop Box Block Container */}
              <div className="bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <FaCloudUploadAlt className="text-3xl text-blue-500 mb-2" />
                  <p className="text-xs font-bold text-slate-700 mb-1">Drag & Drop or Browse to upload the images</p>
                  <p className="text-[10px] text-slate-400 space-y-0.5">
                    <span>Upload high quality images (.JPG, .PNG, .JPEG)</span> <br />
                    <span>Max Image size 5MB</span> <br />
                    <span>Recommended image size 1400px * 900px</span>
                  </p>
                </div>
              </div>

              {/* Location & Pricing Content Wrapper Box */}
              <div className="border border-slate-300 rounded-xl p-5 bg-white space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                  <FaMapMarkerAlt className="text-blue-500 text-sm" />
                  Location & Pricing
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">About the Location</label>
                  <textarea 
                    rows={3} 
                    defaultValue="Situated in a prime coastal location in Sri Lanka, the hotel offers breathtaking ocean views and quick access to beaches, cultural sites, and local dining experiences."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded text-xs text-slate-600 leading-relaxed focus:outline-none resize-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Base Price(per night)</label>
                  <div className="flex border border-slate-200 rounded overflow-hidden">
                    <div className="flex items-center bg-slate-50 px-3 text-xs text-slate-500 font-medium">$</div>
                    <input type="text" defaultValue="150" className="w-full px-3 py-2 text-xs text-slate-700 focus:outline-none" />
                    <select className="bg-slate-50 px-2 text-xs font-medium text-slate-600 border-l border-slate-200 focus:outline-none">
                      <option>USD</option>
                      <option>LKR</option>
                    </select>
                  </div>
                </div>

                {/* Payment Options Checkboxes */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-2">Payment Options</label>
                  <div className="space-y-1.5 pl-1">
                    {['Card Payment', 'Online Payment', 'Cash Payment(Pay at Hotel)'].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                        <input type="checkbox" defaultChecked={true} className="w-3.5 h-3.5 accent-[#007bff] border-slate-300 rounded" />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Legal and Terms Checkbox Link row */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="flex items-start gap-2 text-[11px] font-medium text-slate-600 cursor-pointer">
                    <input type="checkbox" defaultChecked={true} className="mt-0.5 w-3.5 h-3.5 accent-[#007bff] border-slate-300 rounded shrink-0" />
                    <span>
                      I agreed <span className="text-blue-500 hover:underline cursor-pointer">Terms of Services</span> and <span className="text-blue-500 hover:underline cursor-pointer">Privacy Policy</span>
                    </span>
                  </label>
                </div>

              </div>

            </div>
          </form>

        </div>
      </main>
      <Footer />
    </div>

  );
}