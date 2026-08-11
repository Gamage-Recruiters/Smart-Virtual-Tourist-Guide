import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api.js';
import Header from '../../components/HotelOwner/Header';
import Footer from '../../components/HotelOwner/Footer';

// Assuming you have these images in your src/assets folder
import bgHero from '../../assets/HotelOwner/profileSetting.png';
import heroTitle from '../../assets/HotelOwner/SubLogo.png';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    currentPassword: '',
    confirmPassword: '',
    contactNumber: '',
    hotelName: '',
    hotelRegistrationNo: '',
    hotelAddress: '',
    officialEmail: '',
    hotelOwnerName: '',
    hotelRegisterYear: '',
    officialContactNumber: ''
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [hotelMessage, setHotelMessage] = useState('');
  const [hasHotel, setHasHotel] = useState(false);
  const [savedHotel, setSavedHotel] = useState({ hotelName: '', hotelRegistrationNo: '', hotelAddress: '', officialEmail: '', hotelRegisterYear: '', officialContactNumber: '' });
  const [savedProfile, setSavedProfile] = useState({ fullName: '', email: '', contactNumber: '' });
  const [emailError, setEmailError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_RULES = [
    { label: 'At least 8 characters',         test: (p) => p.length >= 8 },
    { label: 'One uppercase letter (A–Z)',     test: (p) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter (a–z)',     test: (p) => /[a-z]/.test(p) },
    { label: 'One number (0–9)',               test: (p) => /[0-9]/.test(p) },
    { label: 'One special character (!@#…)',   test: (p) => /[^A-Za-z0-9]/.test(p) },
  ];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData._id || userData.id;

    if (userId) {
      apiClient.get(`/users/${userId}`)
        .then(data => {
          const profile = { fullName: data.fullName || '', email: data.email || '', contactNumber: data.contactNumber || '' };
          setIsGoogleUser(!!data.googleId);
          setSavedProfile(profile);
          setFormData(prev => ({ ...prev, ...profile, hotelOwnerName: data.fullName || '' }));
        })
        .catch(() => {
          const profile = { fullName: userData.fullName || '', email: userData.email || '', contactNumber: userData.contactNumber || '' };
          setIsGoogleUser(!!userData.googleId);
          setSavedProfile(profile);
          setFormData(prev => ({ ...prev, ...profile }));
        });

      apiClient.get('/users/me')
        .then(data => {
          const h = data.hotels?.[0] || {};
          setHasHotel(Array.isArray(data.hotels) && data.hotels.length > 0);
          const hotel = {
            hotelName: h.hotelName || '',
            hotelRegistrationNo: h.hotelRegistrationNo || '',
            hotelAddress: h.hotelAddress || '',
            officialEmail: h.hotelEmail || '',
            hotelRegisterYear: h.hotelRegisteredYear || '',
            officialContactNumber: h.hotelContactNumber || '',
          };
          setSavedHotel(hotel);
          setFormData(prev => ({ ...prev, ...hotel }));
        })
        .catch(() => {});
    } else {
      const profile = { fullName: userData.fullName || '', email: userData.email || '', contactNumber: userData.contactNumber || '' };
      setIsGoogleUser(!!userData.googleId);
      setSavedProfile(profile);
      setFormData(prev => ({ ...prev, ...profile }));
    }
  }, []);

  const profileChanged = 
    formData.fullName !== savedProfile.fullName ||
    formData.contactNumber !== savedProfile.contactNumber ||
    (!isGoogleUser && formData.email !== savedProfile.email);

  const hotelChanged =
    formData.hotelName !== savedHotel.hotelName ||
    formData.hotelRegistrationNo !== savedHotel.hotelRegistrationNo ||
    formData.hotelAddress !== savedHotel.hotelAddress ||
    formData.officialEmail !== savedHotel.officialEmail ||
    formData.hotelRegisterYear !== savedHotel.hotelRegisterYear ||
    formData.officialContactNumber !== savedHotel.officialContactNumber;

  const handleHotelUpdate = async () => {
    setHotelMessage('');
    setLoading(true);
    try {
      await apiClient.put('/users/hotel', {
        hotelName: formData.hotelName,
        hotelRegistrationNo: formData.hotelRegistrationNo,
        hotelAddress: formData.hotelAddress,
        hotelEmail: formData.officialEmail,
        hotelRegisteredYear: formData.hotelRegisterYear,
        hotelContactNumber: formData.officialContactNumber,
      });
      setSavedHotel({
        hotelName: formData.hotelName,
        hotelRegistrationNo: formData.hotelRegistrationNo,
        hotelAddress: formData.hotelAddress,
        officialEmail: formData.officialEmail,
        hotelRegisterYear: formData.hotelRegisterYear,
        officialContactNumber: formData.officialContactNumber,
      });
      setHotelMessage('Hotel info updated successfully.');
      setTimeout(() => setHotelMessage(''), 4000);
    } catch (error) {
      setHotelMessage(error.message || 'Failed to update hotel info.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setProfileMessage('');
    try {
      await apiClient.put('/users/profile', {
        fullName: formData.fullName,
        contactNumber: formData.contactNumber,
        ...(!isGoogleUser && { email: formData.email }),
      });
      const updated = { fullName: formData.fullName, contactNumber: formData.contactNumber, email: formData.email };
      setSavedProfile(updated);
      setProfileMessage('Profile updated successfully.');
      setTimeout(() => setProfileMessage(''), 4000);
    } catch (error) {
      setProfileMessage(error.message || 'Failed to update profile.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    if (!formData.currentPassword || !formData.password || !formData.confirmPassword) {
      setPasswordMessage('Please fill in all password fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordMessage('Passwords do not match.');
      return;
    }

    try {
      const res = await apiClient.put(`/users/change-password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.password,
      });
      setPasswordMessage(res.message || 'Your password has been changed successfully.');
      setFormData(prev => ({ ...prev, currentPassword: '', password: '', confirmPassword: '' }));
    } catch (error) {
      setPasswordMessage(error.message || 'Failed to change password.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setEmailError(value && !EMAIL_REGEX.test(value) ? 'Please enter a valid email address.' : '');
    }
    if (name === 'password') {
      setPasswordErrors(PASSWORD_RULES.filter(r => !r.test(value)).map(r => r.label));
    }
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
        <Header hasHotel={hasHotel} />
      
 {/* 1. HERO SECTION */}
<div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-white">
  {/* Background Hero Image */}
  <div className="relative h-[900px] md:h-[1000px] lg:h-[1100px] w-full">
    <img
      src={bgHero}
      alt="Hotel hero"
      className="absolute inset-0 h-full w-full object-cover object-[center_45%]"
    />

    {/* Hero Title Image */}
    <div className="absolute top-16 right-24 md:right-32 z-10 w-[180px] md:w-[280px] lg:w-[500px]">
      <img
        src={heroTitle}
        alt="Sri Lankan's Hotel"
        className="w-full h-auto object-contain drop-shadow-lg"
      />
    </div>
  </div>
</div>

      {/* 2. PROFILE HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Setting Your Profile</h2>
            <p className="text-slate-500 mt-2">Set up your Hotel And Change Profile</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
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
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3" />
              </svg>
              Back to Dashboard
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
        <div className="mx-auto w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-16 lg:-translate-x-8">
            <div className="flex flex-col md:flex-row gap-8">
                
                {/* Left: Avatar */}
                <div className="flex flex-col items-center gap-3 w-full md:w-1/4 border-r border-slate-100 pr-8">
                        <h3 className="font-semibold text-slate-700 text-lg mt-2">Profile Details</h3>
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
                </div>

                {/* Right: Form Info */}
                <div className="w-full md:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                        <div></div>
                        <button
                          type="button"
                          onClick={handleProfileSave}
                          disabled={!profileChanged}
                          className="text-blue-600 font-medium hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                        >Save Changes</button>
                    </div>
                    {profileMessage && (
                      <div className={`mb-4 text-sm px-4 py-2 rounded-lg ${
                        profileMessage.includes('successfully')
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>{profileMessage}</div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        
                        {/* Language */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Language</label>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-2 text-slate-800">
                                English UK
                            </div>
                        </div>

                        {/* Contact Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Contact Email</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              readOnly={isGoogleUser}
                              className={`w-full bg-slate-50 border rounded-lg p-3 text-slate-800 outline-none ${
                                isGoogleUser
                                  ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                                  : emailError
                                  ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                                  : 'border-slate-200 focus:ring-2 focus:ring-blue-500'
                              }`}
                            />
                            {emailError && !isGoogleUser && (
                              <p className="mt-1 text-xs text-red-500">{emailError}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Phone Number</label>
                            <div className="flex gap-2">
                              <select className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                                <option>🇱🇰 +94</option>
                              </select>
                              <input
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                              />
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
            <div className={`bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-[0_0_30px_rgba(60,180,255,0.3)] w-full max-w-lg border relative overflow-hidden ${isGoogleUser ? 'opacity-60' : ''}`}>

                  {/* Decorative Gradient */}
                  <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-2xl"></div>

                  {/* Google user notice */}
                  {isGoogleUser && (
                    <div className="relative z-10 mb-4 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      You signed in with Google. Password changes are not available.
                    </div>
                  )}

                  <fieldset disabled={isGoogleUser} className="space-y-6 relative z-10">
                      {/* Full Name */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Full Name</label>
                          <input 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            readOnly
                            className="w-full border border-slate-200 rounded-lg p-3 bg-slate-100 text-slate-400 cursor-not-allowed outline-none" 
                          />
                      </div>

                      {/* Email Address */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Email Address</label>
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            readOnly
                            className="w-full border border-slate-200 rounded-lg p-3 bg-slate-100 text-slate-400 cursor-not-allowed outline-none" 
                          />
                      </div>

                      {/* Current Password */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Current Password</label>
                          <input 
                            type="password" 
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                      {/* New Password */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">New Password</label>
                          <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full border rounded-lg p-3 outline-none ${
                              formData.password && passwordErrors.length > 0
                                ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                                : formData.password && passwordErrors.length === 0
                                ? 'border-green-400 focus:ring-2 focus:ring-green-400'
                                : 'border-slate-200 focus:ring-2 focus:ring-blue-500'
                            }`}
                          />
                          {formData.password && (
                            <ul className="mt-2 space-y-1">
                              {PASSWORD_RULES.map((rule) => {
                                const passed = rule.test(formData.password);
                                return (
                                  <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${
                                    passed ? 'text-green-600' : 'text-red-500'
                                  }`}>
                                    <span>{passed ? '✓' : '✗'}</span>
                                    {rule.label}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
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


                      {/* Password message */}
                      {passwordMessage && (
                        <div className={`text-sm px-4 py-3 rounded-lg ${
                          passwordMessage.includes('successfully')
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {passwordMessage}
                        </div>
                      )}

                      {/* UPDATE BUTTON - Left Column */}
                      <button
                        type="button"
                        onClick={handlePasswordUpdate}
                        disabled={loading || isGoogleUser}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-[30px_5px_30px_5px] mt-4 shadow-md shadow-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Updating...' : 'Update'}
                      </button>
                  </fieldset>
              </div>

              {/* Right Column: Hotel Specific Info */}
            <div className={`bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-[0_0_30px_rgba(60,180,255,0.3)] w-full max-w-lg border relative overflow-hidden ${!hasHotel ? 'opacity-60' : ''}`}>
                   {/* Decorative Gradient */}
                   <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-50 rounded-full blur-2xl"></div>

                  {!hasHotel && (
                    <div className="relative z-10 mb-4 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      You have not added a hotel yet. Please add a hotel first to update hotel details.
                    </div>
                  )}

                  <fieldset disabled={!hasHotel} className="space-y-6 relative z-10">
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
                          <label className="block text-sm font-medium text-slate-600 mb-2">Hotel Registration No</label>
                          <input 
                            type="text" 
                            name="hotelRegistrationNo"
                            value={formData.hotelRegistrationNo}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                      {/* Official Address */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Hotel Address</label>
                          <input 
                            type="text" 
                            name="hotelAddress"
                            value={formData.hotelAddress}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                      {/* Hotel Register Name */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Official Email Address of the hotel</label>
                          <input 
                            type="text" 
                            name="officialEmail"
                            value={formData.officialEmail}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                       {/* Hotel Register No */}
                       <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Hotel Owner Name</label>
                          <input 
                            type="text" 
                            name="hotelOwnerName"
                            value={formData.hotelOwnerName}
                            readOnly
                            placeholder={formData.fullName}
                            className="w-full border border-slate-200 rounded-lg p-3 bg-slate-100 text-slate-400 cursor-not-allowed outline-none" 
                          />
                      </div>

                      {/* Official Website */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Hotel Register Year</label>
                          <input 
                            type="text" 
                            name="hotelRegisterYear"
                            value={formData.hotelRegisterYear}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>

                      {/* Official Contact Number */}
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">Official Contact Number</label>
                          <div className="flex gap-2">
                               <select className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                                  <option>🇱🇰 +94</option>
                               </select>
                               <input 
                                 type="text" 
                                 name="officialContactNumber"
                                 value={formData.officialContactNumber}
                                 onChange={handleInputChange}
                                 className="flex-1 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                               />
                          </div>
                      </div>

                      {hotelMessage && (
                        <div className={`text-sm px-4 py-3 rounded-lg ${
                          hotelMessage.includes('successfully')
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>{hotelMessage}</div>
                      )}

                      {/* UPDATE BUTTON - Right Column */}
                      <button 
                        type="button"
                        onClick={handleHotelUpdate}
                        disabled={!hotelChanged || loading || !hasHotel}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-[30px_5px_30px_5px] mt-4 shadow-md shadow-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Updating...' : 'Edit'}
                      </button>
                  </fieldset>
              </div>

          </div>
        </form>

      </div>
     <Footer />
    </div>
  );
};

export default ProfilePage;