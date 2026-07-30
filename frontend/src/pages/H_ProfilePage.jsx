import React, { useState } from 'react';
import { apiClient } from '../api/apiClient';

// Assuming you have these images in your src/assets folder
import bgHero from '../assets/HOP1.png';
import heroTitle from '../assets/SubLogo.png';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    fullName: 'Haritha Prageeth',
    email: 'harithaprageeth@gmail.com',
    password: '',
    currentPassword: '',
    confirmPassword: '',
    contactNumber: '',
    hotelName: '',
    hotelPosition: '',
    officialAddress: '',
    hotelRegisterName: '',
    hotelRegisterNo: '',
    officialWebsite: ''
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Update auth profile (fullName, contactNumber, profileImage)
      const authFormData = new FormData();
      if (formData.fullName) authFormData.append('fullName', formData.fullName);
      if (formData.contactNumber) authFormData.append('contactNumber', formData.contactNumber);
      if (profileImage) authFormData.append('profileImage', profileImage);
      await apiClient.upload('/auth/update', authFormData);

      // Change password if provided
      if (formData.password) {
        await apiClient.put('/auth/change-password', {
          currentPassword: formData.currentPassword,
          newPassword: formData.password
        });
      }

      // Update hotel-specific profile
      await apiClient.put('/hotel', {
        hotelInfo: {
          hotelName: formData.hotelName,
          hotelPosition: formData.hotelPosition,
          officialAddress: formData.officialAddress,
          hotelRegisterName: formData.hotelRegisterName,
          hotelRegisterNo: formData.hotelRegisterNo,
          officialWebsite: formData.officialWebsite
        }
      });

      setMessage('Profile saved successfully!');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage(error.message || 'Error saving profile');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-700">
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[600px] bg-gradient-to-b from-blue-100 to-white overflow-hidden">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={bgHero} 
            alt="Sri Lanka Background" 
            className="w-full h-full object-cover opacity-90"
          />
          
          {/* Overlay Graphics (Simulated to blend with the image) */}
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
          <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
        </div>

        {/* Hero Title Image */}
        <div className="absolute top-16 right-10 z-10 w-1/3 max-w-md">
          <img 
            src={heroTitle} 
            alt="Sri Lankan's Hotel" 
            className="w-full h-auto object-contain drop-shadow-lg"
          />
        </div>
        
        {/* Central Art REMOVED */}
        
      </div>

      {/* 2. PROFILE HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Setting Your Profile</h2>
            <p className="text-slate-500 mt-2">Set up your Hotel And Change Profile</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            {/* Notification Button */}
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition shadow-lg shadow-blue-200">
              + Add New Property
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* 3. PROFILE DETAILS CARD */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-16">
            <div className="flex flex-col md:flex-row gap-8">
                
                {/* Left: Avatar */}
                <div className="flex flex-col items-center gap-3 w-full md:w-1/4 border-r border-slate-100 pr-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 shadow-md relative">
                        <img 
                          src={profileImage ? URL.createObjectURL(profileImage) : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"} 
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                    </div>
                    
                    {/* Image Upload */}
                    <div className="relative">
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button className="bg-blue-100 p-2 rounded-full text-blue-600 hover:bg-blue-200 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                      </button>
                    </div>
                    <h3 className="font-semibold text-slate-700 text-lg mt-2">Profile Details</h3>
                </div>

                {/* Right: Form Info */}
                <div className="w-full md:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                        <div></div>
                        <button className="text-blue-600 font-medium hover:underline">Save Changes</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800">{formData.fullName}</div>
                        </div>
                        
                        {/* Language */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Language</label>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-2 text-slate-800">
                                <span className="text-xl">🇬🇧</span> English UK
                            </div>
                        </div>

                        {/* Contact Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Contact Email</label>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800">{formData.email}</div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Phone Number</label>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-2 text-slate-800">
                                <span className="text-xl">🇱🇰</span> {formData.contactNumber || '+94'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 4. TWO COLUMN FORM SECTION */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Left Column: Personal/Hotel Info */}
              <div className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
                  {/* Decorative Gradient */}
                  <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-2xl"></div>

                  <div className="space-y-6 relative z-10">
                      {/* Full Name */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Full Name</label>
                          <input 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                      {/* Email Address */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Email Address</label>
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                      {/* Password */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Password</label>
                          <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                      {/* Confirm Password */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Confirmed Password</label>
                          <input 
                            type="password" 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                       {/* Contact Number */}
                       <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Contact Number</label>
                          <div className="flex gap-2">
                               <select className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                                  <option>🇱🇰 +94</option>
                               </select>
                               <input 
                                 type="text" 
                                 name="contactNumber"
                                 value={formData.contactNumber}
                                 onChange={handleInputChange}
                                 className="flex-1 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                               />
                          </div>
                      </div>

                      {/* UPDATE BUTTON - Left Column */}
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-[30px_5px_30px_5px] mt-4 shadow-md shadow-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Updating...' : 'Update'}
                      </button>
                  </div>
              </div>

              {/* Right Column: Hotel Specific Info */}
              <div className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
                   {/* Decorative Gradient */}
                   <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-50 rounded-full blur-2xl"></div>

                  <div className="space-y-6 relative z-10">
                      {/* Hotel Name */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Hotel Name</label>
                          <input 
                            type="text" 
                            name="hotelName"
                            value={formData.hotelName}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                      {/* Hotel Position */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Hotel Position</label>
                          <input 
                            type="text" 
                            name="hotelPosition"
                            value={formData.hotelPosition}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                      {/* Official Address */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Official Address of the hotel</label>
                          <input 
                            type="text" 
                            name="officialAddress"
                            value={formData.officialAddress}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                      {/* Hotel Register Name */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Hotel Register Name</label>
                          <input 
                            type="text" 
                            name="hotelRegisterName"
                            value={formData.hotelRegisterName}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                       {/* Hotel Register No */}
                       <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Hotel Register No</label>
                          <input 
                            type="text" 
                            name="hotelRegisterNo"
                            value={formData.hotelRegisterNo}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                      {/* Official Website */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Official Website (Optional)</label>
                          <input 
                            type="text" 
                            name="officialWebsite"
                            value={formData.officialWebsite}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                      {/* UPDATE BUTTON - Right Column */}
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-[30px_5px_30px_5px] mt-4 shadow-md shadow-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Updating...' : 'Update'}
                      </button>
                  </div>
              </div>

          </div>
        </form>

      </div>
    </div>
  );
};

export default ProfilePage;