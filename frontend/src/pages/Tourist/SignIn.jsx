import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { IoMdArrowForward } from 'react-icons/io'
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

const SignIn = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // When signing in, navigate to dashboard (/dashboard)
  const { handleGoogleAuth, googleLoading, googleError } = useGoogleAuth(navigate, 'tourist_user', '/dashboard');

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (response && response.token) {
        localStorage.setItem('token', response.token);
      }
      
      const user = response.user || {};
      const userId = user._id || user.id || 'dummy_tourist_123';

      localStorage.setItem('userData', JSON.stringify({
        fullName: user.fullName || '',
        email: user.email || '',
        country: user.country || 'Sri Lanka'
      }));
      
      localStorage.setItem('user', JSON.stringify({
        _id: userId,
        fullName: user.fullName || '',
        email: user.email || ''
      }));

      // Try to load profile to see if it exists
      try {
        const profileRes = await userAPI.getProfile();
        if (profileRes && profileRes.success && profileRes.profile) {
          localStorage.setItem('touristProfile', JSON.stringify(profileRes.profile));
          localStorage.setItem('profileCompleted', 'true');
        }
      } catch (err) {
        console.warn('Could not fetch existing profile on login:', err);
      }

      // Navigate to tourist dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <Header />

      <div className="flex-1 relative">
        {/* Background Images */}
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Welcome Back</h2>
                    <p className="text-gray-500 mb-6 text-center">Sign in to your account to continue your journey</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                          placeholder="Email Address" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                          placeholder="Password" />
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full bg-gradient-to-r from-[#3CB4FF] to-blue-500 text-white py-3 font-semibold hover:from-[#2ea0e6] hover:to-blue-600 transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl disabled:opacity-50"
                        style={{ borderRadius: '50px 5px 50px 5px' }}>
                        {loading ? 'Signing in...' : 'Sign In'}
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
                          title="Sign in with Google"
                        >
                          <img src={googleIcon} alt="Google" className="w-6 h-6 object-contain" />
                        </div>
                        <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full">
                          <img src={appleIcon} alt="Apple" className="w-6 h-6 object-contain" />
                        </div>
                      </div>
                      <p className="text-center mt-6 text-gray-600">
                        Don't have an account? <Link to="/signup" className="text-[#3CB4FF] font-semibold hover:underline">Sign up</Link>
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

export default SignIn
