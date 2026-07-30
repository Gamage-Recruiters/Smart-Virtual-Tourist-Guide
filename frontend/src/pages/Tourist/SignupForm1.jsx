import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaFacebook, FaGoogle, FaApple } from 'react-icons/fa'
import { IoMdArrowForward } from 'react-icons/io'
import { getNames } from 'country-list'
import { userAPI } from '../../services/api'
import useGoogleAuth from '../../hooks/useGoogleAuth'
import Header from '../../components/Tourist/Header'
import Footer from '../../components/Tourist/Footer'
import image1 from '../../assets/Tourist/bg1.png'
import image2 from '../../assets/Tourist/bg2.png'
import image3 from '../../assets/Tourist/bg3.png'
import image4 from '../../assets/Tourist/bg4.png'
import formBgImage from '../../assets/Tourist/form back.jpg'

// Import social icons from assets (SVG files)
import facebookIcon from '../../assets/HotelOwner/svg/FB.svg';
import googleIcon from '../../assets/HotelOwner/svg/google.svg';
import appleIcon from '../../assets/HotelOwner/svg/apple.svg';

const countriesList = getNames();

const SignupForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Google auth — tourists go to /travel-safety after Google signup
  const { handleGoogleAuth, googleLoading, googleError } = useGoogleAuth(navigate, 'tourist_user', '/travel-safety');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmedPassword: '',
    gender: 'Male',
    country: 'Sri Lanka',
    customCountry: '',
    travelType: 'Solo'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRadioChange = (e) => {
    setFormData(prev => ({
      ...prev,
      travelType: e.target.value
    }))
  }

  // The handleSubmit function is already correct, but add loading state
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
      const finalCountry = formData.country === 'Other' ? formData.customCountry : formData.country;
      const response = await userAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        country: finalCountry,
        travelType: formData.travelType
      });

      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      localStorage.setItem('signupData', JSON.stringify(formData));

      // Navigate to travel safety page
      navigate('/travel-safety');
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <Header />

      {/* Page content area - relative so bg images are scoped here */}
      <div className="flex-1 relative">

        {/* Background Images - scoped to content area only */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-0 top-0 hidden lg:block" style={{ zIndex: 0, width: '66.666%', height: '100%' }}>
            <img src={image1} alt="" className="w-full h-full object-cover opacity-30" />
          </div>
          <div className="absolute left-0 bottom-0 hidden lg:block" style={{ zIndex: 0, width: '30%', height: '70%' }}>
            <img src={image2} alt="" className="w-full h-full object-cover opacity-100" />
          </div>
          <div className="absolute hidden lg:block" style={{ zIndex: 0, width: '30%', height: '20%', left: '13%', top: '5%' }}>
            <img src={image3} alt="" className="w-full h-full object-cover opacity-100" />
          </div>
          <div className="absolute top-0 right-0 hidden lg:block" style={{ zIndex: 0, width: '20%', height: '20%' }}>
            <img src={image4} alt="" className="w-full h-full object-cover opacity-100" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block lg:w-1/2" />
            <div className="w-full lg:w-1/2">
              <div className="pl-0 lg:pl-12">
                <div className="relative overflow-hidden" style={{ borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(60, 180, 255, 0.2), 0 8px 10px -6px rgba(60, 180, 255, 0.1)' }}>
                  <div className="absolute inset-0 z-0">
                    <img src={formBgImage} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-white/70" />
                  </div>
                  <div className="relative z-10 p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Create Your Account</h2>
                    <p className="text-gray-500 mb-6 text-center">Set up your profile let AI plan your journey</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                          placeholder="Full Name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                          placeholder="Email Address" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                          placeholder="Min. 8 characters" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmed Password</label>
                        <input type="password" name="confirmedPassword" value={formData.confirmedPassword} onChange={handleChange} required minLength={8}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                          placeholder="Min. 8 characters" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <div className="flex gap-6 mb-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} className="w-4 h-4 text-[#3CB4FF] focus:ring-[#3CB4FF]" />
                            <span className="text-gray-700">Male</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} className="w-4 h-4 text-[#3CB4FF] focus:ring-[#3CB4FF]" />
                            <span className="text-gray-700">Female</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <select name="country" value={formData.country} onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition appearance-none bg-white/90"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374851'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5rem' }}>
                          {countriesList.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      {formData.country === 'Other' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Specify Country</label>
                          <input type="text" name="customCountry" value={formData.customCountry} onChange={handleChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                            placeholder="Enter your country name" />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Travel Type</label>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="travelType" value="Solo" checked={formData.travelType === 'Solo'} onChange={handleRadioChange} className="w-4 h-4 text-[#3CB4FF] focus:ring-[#3CB4FF]" />
                            <span className="text-gray-700">Solo</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="travelType" value="Family" checked={formData.travelType === 'Family'} onChange={handleRadioChange} className="w-4 h-4 text-[#3CB4FF] focus:ring-[#3CB4FF]" />
                            <span className="text-gray-700">Family</span>
                          </label>
                        </div>
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full bg-gradient-to-r from-[#3CB4FF] to-blue-500 text-white py-3 font-semibold hover:from-[#2ea0e6] hover:to-blue-600 transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl disabled:opacity-50"
                        style={{ borderRadius: '50px 5px 50px 5px' }}>
                        {loading ? 'Creating...' : 'Next Step'}
                        <IoMdArrowForward className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>

                      {/* Social Sign In */}
                      <div className="mt-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white/95 text-gray-500">Sign in With</span>
                          </div>
                        </div>
                        {googleError && (
                          <div className="text-red-500 text-xs text-center mt-2 bg-red-50 p-1 rounded">
                            {googleError}
                          </div>
                        )}
                        <div className="mt-4 flex justify-center gap-6">
                          <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full">
                            <img src={facebookIcon} alt="Facebook" className="w-6 h-6 object-contain" />
                          </div>
                          <div
                            className={`cursor-pointer hover:bg-gray-100 p-2 rounded-full transition ${googleLoading ? 'opacity-50 pointer-events-none' : ''}`}
                            onClick={handleGoogleAuth}
                            title="Sign up with Google"
                          >
                            <img src={googleIcon} alt="Google" className="w-6 h-6 object-contain" />
                          </div>
                          <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full">
                            <img src={appleIcon} alt="Apple" className="w-6 h-6 object-contain" />
                          </div>
                        </div>
                        <p className="text-center mt-6 text-gray-600">
                          Already have an account? <a href="/" className="text-[#3CB4FF] font-semibold hover:underline">Sign in</a>
                        </p>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SignupForm

