import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, Phone } from 'lucide-react';
import { hotelOwnerAPI } from '../../services/api';
import Header from '../../components/HotelOwner/Header';
import Footer from '../../components/HotelOwner/Footer';
import useGoogleAuth from '../../hooks/useGoogleAuth';

// Import 4 images from assets
import heroImage from '../../assets/HotelOwner/HO1.png';
import titleImage from '../../assets/HotelOwner/SubLogo.png';
import mapImage from '../../assets/HotelOwner/HO2.png';
import bottomImage from '../../assets/HotelOwner/HO3.png';
import formBgImage from '../../assets/HotelOwner/form back.jpg';

// Import social icons from assets (SVG files)
import googleIcon from '../../assets/HotelOwner/svg/google.svg';

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { handleGoogleAuth, googleLoading, googleError } = useGoogleAuth(navigate, 'hotelowner_user', '/hotel-info');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmedPassword: '',
    countryCode: '+94',
    phoneNumber: '',
  });

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

  const buttonBorderRadius = { topLeft: 30, topRight: 0, bottomRight: 30, bottomLeft: 0 };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmedPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const response = await hotelOwnerAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        contactNumber: `${formData.countryCode}${formData.phoneNumber}`,
      });
      if (!response.token) throw { message: response.message || 'Registration failed' };
      localStorage.setItem('token', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      navigate('/hotel-info');
    } catch (error) {
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white">
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
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Left Side: Visuals */}
        <div className="relative flex flex-col items-center justify-center space-y-8">
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
        <div className="w-full flex justify-center lg:sticky lg:top-20">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_0_30px_rgba(60,180,255,0.3)] w-full max-w-lg border relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src={formBgImage} alt="Form Background" className="w-full h-full object-cover opacity-40" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Your Account</h2>
              <p className="text-gray-500 text-sm mb-8">Set up your profile to get started</p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Confirmed Password</label>
                  <div className="relative">
                    <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      name="confirmedPassword"
                      value={formData.confirmedPassword}
                      onChange={handleChange}
                      required
                      minLength={8}
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Contact Number</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 border-r pr-2 border-gray-300">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="bg-transparent text-xs font-bold text-gray-600 focus:outline-none cursor-pointer pr-1"
                      >
                        {countryCodes.map((c, i) => (
                          <option key={i} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter phone number"
                      className="w-full pl-28 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB4FF] bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3CB4FF] hover:bg-[#2a9fe0] text-white font-bold py-3 shadow-md transition duration-200 mt-4 disabled:opacity-50"
                  style={{ borderRadius: `${buttonBorderRadius.topLeft}px ${buttonBorderRadius.topRight}px ${buttonBorderRadius.bottomRight}px ${buttonBorderRadius.bottomLeft}px` }}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>

                {/* Social Sign In */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-400 mb-3">Sign in With</p>
                  {googleError && (
                    <div className="text-red-500 text-xs text-center mb-2 bg-red-50 p-1 rounded max-w-[200px] mx-auto">
                      {googleError}
                    </div>
                  )}
                  <div className="flex justify-center gap-6">
                    <div
                      className={`cursor-pointer hover:bg-gray-100 p-2 rounded-full transition ${googleLoading ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={handleGoogleAuth}
                      title="Sign up with Google"
                    >
                      <img src={googleIcon} alt="Google" className="w-6 h-6 object-contain" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    Already have an account? <span className="text-[#3CB4FF] font-bold cursor-pointer" onClick={() => navigate('/')}>Sign in</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;