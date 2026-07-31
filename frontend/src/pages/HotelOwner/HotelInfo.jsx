import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, CheckCircle } from 'lucide-react';
import { hotelOwnerAPI } from '../../services/api';
import Header from '../../components/HotelOwner/Header';
import Footer from '../../components/HotelOwner/Footer';

import heroImage from '../../assets/HotelOwner/HO1.png';
import titleImage from '../../assets/HotelOwner/SubLogo.png';
import mapImage from '../../assets/HotelOwner/HO2.png';
import bottomImage from '../../assets/HotelOwner/HO3.png';
import formBgImage from '../../assets/HotelOwner/form back.jpg';

import googleIcon from '../../assets/HotelOwner/svg/google.svg';

const HotelInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [formData, setFormData] = useState({
    hotelName: '',
    hotelRegistrationNo: '',
    hotelEmail: '',
    hotelRegisteredYear: new Date().getFullYear().toString(),
    countryCode: '+94',
    hotelPhoneNumber: '',
  });

  // Secure: read owner name from stored user session (set after JWT login/register)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/hotel-owner');
      return;
    }
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    setOwnerName(userData.fullName || '');
  }, [navigate]);

  const countryCodes = [
    { code: '+94', flag: '🇱🇰' }, { code: '+1', flag: '🇺🇸' },
    { code: '+44', flag: '🇬🇧' }, { code: '+61', flag: '🇦🇺' },
    { code: '+91', flag: '🇮🇳' }, { code: '+86', flag: '🇨🇳' },
    { code: '+81', flag: '🇯🇵' }, { code: '+33', flag: '🇫🇷' },
    { code: '+49', flag: '🇩🇪' }, { code: '+39', flag: '🇮🇹' },
    { code: '+55', flag: '🇧🇷' }, { code: '+7', flag: '🇷🇺' },
    { code: '+82', flag: '🇰🇷' }, { code: '+60', flag: '🇲🇾' },
    { code: '+65', flag: '🇸🇬' }, { code: '+63', flag: '🇵🇭' },
    { code: '+66', flag: '🇹🇭' }, { code: '+84', flag: '🇻🇳' },
    { code: '+971', flag: '🇦🇪' }, { code: '+966', flag: '🇸🇦' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => (currentYear - i).toString());

  const buttonBorderRadius = { topLeft: 30, topRight: 0, bottomRight: 30, bottomLeft: 0 };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await hotelOwnerAPI.addHotelInfo({
        hotelName: formData.hotelName,
        hotelRegistrationNo: formData.hotelRegistrationNo,
        hotelEmail: formData.hotelEmail,
        hotelRegisteredYear: formData.hotelRegisteredYear,
        hotelContactNumber: `${formData.countryCode}${formData.hotelPhoneNumber}`,
      });
      navigate('/dashboard-HotelOwner');
    } catch (error) {
      alert(error.message || 'Failed to save hotel information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-x-hidden">
      <Header />
      
      {/* --- TOP BACKGROUND IMAGE --- */}
      <div className="relative w-full flex justify-center bg-gradient-to-b from-green-100 to-white">
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-green-200 via-teal-100 to-blue-100 opacity-40 mix-blend-multiply rounded-full blur-3xl"></div>
          <div className="relative w-full flex items-center justify-center">
            <div className="w-full relative">
              <img 
                src={heroImage} 
                alt="Sri Lanka Travel" 
                className="w-full h-auto object-contain"
                style={{ maskImage: 'radial-gradient(circle, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-7xl mx-auto">
          
          {/* Left Side: Visuals */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-8 sticky top-8">
            <div className="w-full max-w-md">
              <img src={titleImage} alt="Sri Lankan's Hotel" className="w-full h-auto object-contain" />
            </div>
            <div className="w-full max-w-md">
              <img src={mapImage} alt="Map and Plane" className="w-full h-auto object-contain" />
            </div>
            <div className="w-full max-w-md">
              <img src={bottomImage} alt="Bottom Decoration" className="w-full h-auto object-contain" />
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="w-full flex justify-center lg:sticky lg:top-8">
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-[0_0_30px_rgba(60,180,255,0.3)] w-full max-w-lg border relative overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img src={formBgImage} alt="Form Background" className="w-full h-full object-cover opacity-40" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Add Your Hotel Details</h2>
                <p className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8">Set up your hotel information</p>

                <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                  {/* Hotel Name */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Hotel Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="hotelName"
                        value={formData.hotelName}
                        onChange={handleChange}
                        required
                        placeholder="Deer Park Hotel"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50 text-sm"
                      />
                    </div>
                  </div>

                  {/* Hotel Registration NO */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Hotel Registration NO</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="hotelRegistrationNo"
                        value={formData.hotelRegistrationNo}
                        onChange={handleChange}
                        required
                        placeholder="567890456788"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50 text-sm"
                      />
                    </div>
                  </div>

                  {/* Official Email */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Official Email Address Of The Hotel</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        name="hotelEmail"
                        value={formData.hotelEmail}
                        onChange={handleChange}
                        required
                        placeholder="hotel@example.com"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50 text-sm"
                      />
                    </div>
                  </div>

                  {/* Hotel Owner Name - read-only from session */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Hotel Owner Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={ownerName}
                        readOnly
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Hotel Registered Year */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Hotel Registered Year</label>
                    <div className="relative">
                      <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <select
                        name="hotelRegisteredYear"
                        value={formData.hotelRegisteredYear}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50 appearance-none text-sm"
                      >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Official Contact Number */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Official Contact Number</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 border-r pr-2 border-gray-300">
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleChange}
                          className="bg-transparent text-xs sm:text-sm font-bold text-gray-600 focus:outline-none cursor-pointer pr-1"
                        >
                          {countryCodes.map((c, i) => (
                            <option key={i} value={c.code}>{c.flag} {c.code}</option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        name="hotelPhoneNumber"
                        value={formData.hotelPhoneNumber}
                        onChange={handleChange}
                        required
                        placeholder="Enter contact number"
                        className="w-full pl-28 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50 text-sm"
                      />
                    </div>
                  </div>

                  {/* Create Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#3CB4FF] hover:bg-[#2a9fe0] text-white font-bold py-2.5 sm:py-3 shadow-md transition duration-200 mt-2 text-sm sm:text-base disabled:opacity-50"
                    style={{ borderRadius: `${buttonBorderRadius.topLeft}px ${buttonBorderRadius.topRight}px ${buttonBorderRadius.bottomRight}px ${buttonBorderRadius.bottomLeft}px` }}
                  >
                    {loading ? 'Saving...' : 'Create'}
                  </button>

                  {/* Social Sign In */}
                  <div className="mt-4 sm:mt-6 text-center">
                    <p className="text-xs text-gray-400 mb-3">Sign in With</p>
                    <div className="flex justify-center gap-4 sm:gap-6">
                      <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition">
                        <img src={facebookIcon} alt="Facebook" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                      </div>
                      <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition">
                        <img src={googleIcon} alt="Google" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                      </div>
                      <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition">
                        <img src={appleIcon} alt="Apple" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      Already have an account? <span className="text-[#3CB4FF] font-bold cursor-pointer hover:underline" onClick={() => navigate('/')}>Sign in</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HotelInfo;
//     { code: '+94', flag: '🇱🇰' },
//     { code: '+1', flag: '🇺🇸' },
//     { code: '+44', flag: '🇬🇧' },
//     { code: '+61', flag: '🇦🇺' },
//     { code: '+91', flag: '🇮🇳' },
//     { code: '+86', flag: '🇨🇳' },
//     { code: '+81', flag: '🇯🇵' },
//     { code: '+33', flag: '🇫🇷' },
//     { code: '+49', flag: '🇩🇪' },
//     { code: '+39', flag: '🇮🇹' },
//     { code: '+55', flag: '🇧🇷' },
//     { code: '+7', flag: '🇷🇺' },
//     { code: '+82', flag: '🇰🇷' },
//     { code: '+60', flag: '🇲🇾' },
//     { code: '+65', flag: '🇸🇬' },
//     { code: '+63', flag: '🇵🇭' },
//     { code: '+66', flag: '🇹🇭' },
//     { code: '+84', flag: '🇻🇳' },
//     { code: '+971', flag: '🇦🇪' },
//     { code: '+966', flag: '🇸🇦' },
//   ];

//   // Custom border radius values for the button
//   const buttonBorderRadius = {
//     topLeft: 30,
//     topRight: 0,
//     bottomRight: 30,
//     bottomLeft: 0
//   };

//   return (
//     <div className="relative w-full min-h-screen bg-white overflow-x-hidden">
      
//       {/* --- TOP BACKGROUND IMAGE --- */}
//       <div className="relative w-full flex justify-center bg-gradient-to-b from-green-100 to-white">
//         <div className="relative w-full max-w-6xl mx-auto">
//           {/* Background Effect */}
//           <div className="absolute inset-0 bg-gradient-to-r from-green-200 via-teal-100 to-blue-100 opacity-40 mix-blend-multiply rounded-full blur-3xl"></div>
          
//           <div className="relative w-full flex items-center justify-center">
//             <div className="w-full relative">
//               <img 
//                 src={heroImage} 
//                 alt="Sri Lanka Travel" 
//                 className="w-full h-auto object-contain"
//                 style={{
//                   maskImage: 'radial-gradient(circle, black 60%, transparent 100%)', 
//                   WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)'
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- MAIN CONTENT --- */}
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-7xl mx-auto">
          
//           {/* Left Side: Visuals - Hidden on mobile, visible on desktop */}
//           <div className="hidden lg:flex flex-col items-center justify-center space-y-8 sticky top-8">
            
//             {/* Title Image */}
//             <div className="w-full max-w-md">
//               <img 
//                 src={titleImage} 
//                 alt="Sri Lankan's Hotel" 
//                 className="w-full h-auto object-contain"
//               />
//             </div>

//             {/* Map Image */}
//             <div className="w-full max-w-md">
//               <img 
//                 src={mapImage} 
//                 alt="Map and Plane" 
//                 className="w-full h-auto object-contain"
//               />
//             </div>

//             {/* Bottom Image */}
//             <div className="w-full max-w-md">
//               <img 
//                 src={bottomImage} 
//                 alt="Bottom Decoration" 
//                 className="w-full h-auto object-contain"
//               />
//             </div>
//           </div>

//           {/* Right Side: Form Card */}
//           <div className="w-full flex justify-center lg:sticky lg:top-8">
//             <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-[0_0_30px_rgba(60,180,255,0.3)] w-full max-w-lg border relative overflow-hidden">
//               {/* Form Background Image */}
//               <div className="absolute inset-0 z-0">
//                 <img 
//                   src={formBgImage} 
//                   alt="Form Background" 
//                   className="w-full h-full object-cover opacity-40"
//                 />
//               </div>
              
//               {/* Form Content */}
//               <div className="relative z-10">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Add Your Hotel Details</h2>
//                 <p className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8">Set up your Hotel to Add Your Hotel</p>

//                 <form className="space-y-3 sm:space-y-4">
//                   {/* Hotel Name */}
//                   <div>
//                     <label className="text-xs font-semibold text-gray-600 mb-1 block">Hotel Name</label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                       <input 
//                         type="text" 
//                         placeholder="Deer Park Hotel" 
//                         className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50 text-sm" 
//                       />
//                     </div>
//                   </div>

//                   {/* Hotel Registration NO */}
//                   <div>
//                     <label className="text-xs font-semibold text-gray-600 mb-1 block">Hotel Registration NO</label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                       <input 
//                         type="text" 
//                         placeholder="567890456788" 
//                         className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50 text-sm" 
//                       />
//                     </div>
//                   </div>

//                   {/* Official Email Address */}
//                   <div>
//                     <label className="text-xs font-semibold text-gray-600 mb-1 block">Official Email Address Of The Hotel</label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                       <input 
//                         type="email" 
//                         placeholder="Deerpark@hotel.com" 
//                         className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50 text-sm" 
//                       />
//                     </div>
//                   </div>

//                   {/* Hotel Owner Name */}
//                   <div>
//                     <label className="text-xs font-semibold text-gray-600 mb-1 block">Hotel Owner Name</label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                       <input 
//                         type="text" 
//                         placeholder="Prageeth Athukorala" 
//                         className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50 text-sm" 
//                       />
//                     </div>
//                   </div>

//                   {/* Hotel Registered Year */}
//                   <div>
//                     <label className="text-xs font-semibold text-gray-600 mb-1 block">Hotel Registered Year</label>
//                     <div className="relative">
//                       <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                       <select className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50 appearance-none text-sm">
//                         <option value="2002">2002</option>
//                         <option value="2003">2003</option>
//                         <option value="2004">2004</option>
//                         <option value="2005">2005</option>
//                       </select>
//                     </div>
//                   </div>

//                   {/* Official Contact Number */}
//                   <div>
//                     <label className="text-xs font-semibold text-gray-600 mb-1 block">Official Contact Number</label>
//                     <div className="relative flex items-center">
//                       <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 border-r pr-2 border-gray-300">
//                         <select 
//                           className="bg-transparent text-xs sm:text-sm font-bold text-gray-600 focus:outline-none cursor-pointer pr-1"
//                           defaultValue="+94"
//                         >
//                           {countryCodes.map((country, index) => (
//                             <option key={index} value={country.code}>
//                               {country.flag} {country.code}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <input 
//                         type="text" 
//                         className="w-full pl-28 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50 text-sm" 
//                         placeholder="Enter contact number"
//                       />
//                     </div>
//                   </div>

//                   {/* Create Button */}
//                   <button 
//                     className="w-full bg-[#3CB4FF] hover:bg-[#2a9fe0] text-white font-bold py-2.5 sm:py-3 shadow-md transition duration-200 mt-2 text-sm sm:text-base"
//                     style={{
//                       borderRadius: `${buttonBorderRadius.topLeft}px ${buttonBorderRadius.topRight}px ${buttonBorderRadius.bottomRight}px ${buttonBorderRadius.bottomLeft}px`
//                     }}
//                   >
//                     Create
//                   </button>

//                   {/* Social Sign In */}
//                   <div className="mt-4 sm:mt-6 text-center">
//                     <p className="text-xs text-gray-400 mb-3">Sign in With</p>
//                     <div className="flex justify-center gap-4 sm:gap-6">
//                       <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition">
//                         <img 
//                           src={facebookIcon} 
//                           alt="Facebook" 
//                           className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
//                         />
//                       </div>
//                       <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition">
//                         <img 
//                           src={googleIcon} 
//                           alt="Google" 
//                           className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
//                         />
//                       </div>
//                       <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition">
//                         <img 
//                           src={appleIcon} 
//                           alt="Apple" 
//                           className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
//                         />
//                       </div>
//                     </div>
//                     <div className="mt-4 text-xs text-gray-500">
//                       Don't have an account? <span className="text-[#3CB4FF] font-bold cursor-pointer hover:underline">Sign up</span>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );



// export default HotelInfo;