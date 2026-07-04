import React from 'react';
import { 
  Instagram, 
  MapPin, 
  Globe, 
  Navigation, 
  Edit2
} from 'lucide-react';

// IMPORT THE IMAGE FROM ASSETS
// Make sure you have a file named 'hero-bg.jpg' in your src/assets folder
import heroImage from '../assets/Rest.jpg'; 

const RestaurantProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[400px] overflow-hidden">
        {/* Background Image using imported asset */}
        <img 
          src={heroImage} 
          alt="Restaurant Interior" 
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        
        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-black/70 to-transparent text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-full border border-white/30">
                TOP RATED
              </span>
              <span className="text-xs text-gray-300">4.9 (126 Reviews)</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">Ceylon Harvest</h1>
            <p className="text-gray-300 text-sm flex items-center gap-1">
              <MapPin size={14} /> 35 Marine Drive, Colombo 03, Sri Lanka
            </p>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Restaurant Profile Settings</h2>
            <p className="text-gray-500 text-sm mt-1 max-w-xl">
              Configure your establishment's public persona. High-quality imagery and accurate operational hours ensure a premium customer experience.
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
            + Add New Property
          </button>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* === LEFT COLUMN (Forms) === */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Establishment Identity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Establishment Identity</h3>
              
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1">RESTAURANT NAME</label>
                <input 
                  type="text" 
                  defaultValue="Ceylon Harvest"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">BIO / DESCRIPTION</label>
                <textarea 
                  rows="4"
                  defaultValue="An intimate dining experience combining traditional Gaelic techniques with contemporary seasonal ingredients."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Contact & Location</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">PHONE NUMBER</label>
                  <input 
                    type="text" 
                    defaultValue="+94 757418433"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">PUBLIC EMAIL</label>
                  <input 
                    type="email" 
                    defaultValue="reservations@lmalon.com"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">PHYSICAL ADDRESS</label>
                <input 
                  type="text" 
                  defaultValue="No. 12, Marine Drive, Kollupitiya, Colombo 03"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Social Media Connectivity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Social Media Connectivity</h3>
              
              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Globe size={16}/></span>
                  <input 
                    type="text" 
                    defaultValue="https://ceylonharvest.com"
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Instagram size={16}/></span>
                  <input 
                    type="text" 
                    defaultValue="@ceylon_harvest"
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><span className="font-bold text-[10px]">t</span></span>
                  <input 
                    type="text" 
                    defaultValue="TikTok Username"
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Discard changes
              </button>
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2">
                Save Profile
              </button>
            </div>

          </div>

          {/* === RIGHT COLUMN (Map & Hours) === */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Location Map */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Location</h3>
              <div className="h-40 w-full bg-blue-100 rounded-lg mb-3 relative overflow-hidden">
                 {/* Placeholder Map Image */}
                 <img 
                   src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-79.94,6.93,13,0/400x200?access_token=pk.placeholder" 
                   alt="Map" 
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <MapPin className="text-blue-600 fill-blue-100 w-8 h-8" />
                 </div>
              </div>
              <p className="text-[10px] text-gray-500 mb-3">No. 12, Marine Drive, Kollupitiya, Colombo 03</p>
              <button className="w-full border border-gray-300 text-gray-700 font-medium text-sm py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 transition-colors">
                <Navigation size={16} /> Get Directions
              </button>
            </div>

            {/* Operating Hours */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Operating Hours</h3>
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Monday</span>
                  <span className="text-gray-700">17:00 — 23:00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Tuesday</span>
                  <span className="text-gray-700">17:00 — 23:00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Wednesday</span>
                  <span className="text-gray-700">17:00 — 23:00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Thursday</span>
                  <span className="text-gray-700">17:00 — 23:00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Friday</span>
                  <span className="text-gray-700">12:00 — 15:00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Saturday</span>
                  <span className="text-gray-700">12:00 — 15:00</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500 font-medium">Sunday</span>
                  <span className="text-gray-700">12:00 — 15:00</span>
                </div>
              </div>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                <Edit2 size={14} /> Edit Seasonal Hours
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RestaurantProfile;