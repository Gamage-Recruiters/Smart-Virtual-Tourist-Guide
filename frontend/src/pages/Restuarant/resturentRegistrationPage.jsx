import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaApple } from 'react-icons/fa'
import bgImage from '../../assets/resturent_bg_login_&_register.jpg'

const AMENITY_OPTIONS = ['Free WiFi', 'Parking', 'Outdoor Seating', 'Live Music']

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

function ResturentRegistrationPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    registrationNo: '',
    email: '',
    phone: '',
    address: '',
    amenities: [],
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (apiError) setApiError('')
  }

  const handleAmenityChange = (amenity) => {
    setFormData(prev => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(item => item !== amenity)
        : [...prev.amenities, amenity]
      return { ...prev, amenities }
    })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.restaurantName.trim()) newErrors.restaurantName = 'Restaurant name is required'
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required'
    if (!formData.registrationNo.trim()) newErrors.registrationNo = 'Registration number is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.phone.trim()) newErrors.phone = 'Contact number is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setApiError('')
    try {
      // Step 1: Register restaurant user account
      const authRes = await fetch(`${API_BASE}/auth/register/restaurant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.ownerName,
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          contactNumber: formData.phone,
        }),
      })

      const authData = await authRes.json()
      if (!authRes.ok) {
        setApiError(authData.message || 'Registration failed. Please try again.')
        return
      }

      // Store token from registration
      const token = authData.token
      localStorage.setItem('token', token)
      localStorage.setItem('restaurantUser', JSON.stringify(authData.user))

      // Step 2: Create restaurant profile
      const profileRes = await fetch(`${API_BASE}/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantName: formData.restaurantName,
          registrationNo: formData.registrationNo,
          ownerName: formData.ownerName,
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone,
          address: formData.address,
          amenities: formData.amenities,
        }),
      })

      if (!profileRes.ok) {
        // Auth succeeded but profile creation failed — still navigate to dashboard
        console.warn('Restaurant profile creation issue:', await profileRes.json())
      }

      // Navigate to dashboard on success
      navigate('/resturent/dashboard')
    } catch (err) {
      setApiError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
      {/* Hero Section */}
      <header className="relative w-full min-h-[370px] overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={bgImage}
          alt="Restaurant dining area"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/[0.02] to-slate-900/[0.08]" />

        {/* Hero Content */}
        <div className="absolute left-6 bottom-6 md:left-16 max-w-[520px] p-6 rounded-2xl bg-white/45">
          <h1 className="m-0 text-2xl md:text-4xl font-bold leading-tight">
            Welcome Smart Virtual Tourist Guide...
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-black/70">
            The definitive editorial concierge for high-end restaurant
            management. Curate your dining experience with professional mastery.
          </p>
        </div>
      </header>

      {/* Registration Section */}
      <main className="relative mt-[-2.2rem] px-4 py-12 md:py-0">
        <section className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-12" aria-label="Restaurant registration form">
          <h2 className="m-0 text-3xl md:text-4xl font-bold text-center">
            Create your account
          </h2>
          <p className="mt-1 mb-6 text-center text-gray-600 text-sm">
            Start managing your restaurant with professional precision.
          </p>

          {/* API Error Alert */}
          {apiError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {apiError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            {/* Restaurant Name */}
            <label htmlFor="restaurantName" className="block mb-1 text-xs text-slate-700 font-medium">
              Restaurant Name
            </label>
            <input
              id="restaurantName"
              name="restaurantName"
              type="text"
              placeholder="Your Restaurant Name"
              value={formData.restaurantName}
              onChange={handleChange}
              className={`w-full h-9 px-3 mb-1 text-sm bg-blue-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.restaurantName ? 'border-red-400' : 'border-transparent focus:border-blue-400'}`}
            />
            {errors.restaurantName && <p className="text-xs text-red-500 mb-4">{errors.restaurantName}</p>}

            {/* Owner Name */}
            <label htmlFor="ownerName" className="block mb-1 text-xs text-slate-700 font-medium">
              Owner Full Name
            </label>
            <input
              id="ownerName"
              name="ownerName"
              type="text"
              placeholder="John Doe"
              value={formData.ownerName}
              onChange={handleChange}
              className={`w-full h-9 px-3 mb-1 text-sm bg-blue-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.ownerName ? 'border-red-400' : 'border-transparent focus:border-blue-400'}`}
            />
            {errors.ownerName && <p className="text-xs text-red-500 mb-4">{errors.ownerName}</p>}

            {/* Registration Number */}
            <label htmlFor="registrationNo" className="block mb-1 text-xs text-slate-700 font-medium">
              Registration Number
            </label>
            <input
              id="registrationNo"
              name="registrationNo"
              type="text"
              placeholder="REG-XXXX-XXXX"
              value={formData.registrationNo}
              onChange={handleChange}
              className={`w-full h-9 px-3 mb-1 text-sm bg-blue-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.registrationNo ? 'border-red-400' : 'border-transparent focus:border-blue-400'}`}
            />
            {errors.registrationNo && <p className="text-xs text-red-500 mb-4">{errors.registrationNo}</p>}

            {/* Email */}
            <label htmlFor="email" className="block mb-1 text-xs text-slate-700 font-medium">
              Official Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@restaurant.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className={`w-full h-9 px-3 mb-1 text-sm bg-blue-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-transparent focus:border-blue-400'}`}
            />
            {errors.email && <p className="text-xs text-red-500 mb-4">{errors.email}</p>}

            {/* Phone */}
            <label htmlFor="phone" className="block mb-1 text-xs text-slate-700 font-medium">
              Contact Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+94-XX-XXX-XXXX"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full h-9 px-3 mb-1 text-sm bg-blue-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.phone ? 'border-red-400' : 'border-transparent focus:border-blue-400'}`}
            />
            {errors.phone && <p className="text-xs text-red-500 mb-4">{errors.phone}</p>}

            {/* Address */}
            <label htmlFor="address" className="block mb-1 text-xs text-slate-700 font-medium">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="123 Restaurant Street, Colombo"
              value={formData.address}
              onChange={handleChange}
              className={`w-full h-9 px-3 mb-1 text-sm bg-blue-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.address ? 'border-red-400' : 'border-transparent focus:border-blue-400'}`}
            />
            {errors.address && <p className="text-xs text-red-500 mb-4">{errors.address}</p>}

            {/* Amenities */}
            <fieldset className="mb-4">
              <legend className="mb-2 block text-xs font-medium text-slate-700">Amenities</legend>
              <div className="grid gap-3 rounded-xl bg-sky-50 p-4 ring-1 ring-blue-100 sm:grid-cols-2">
                {AMENITY_OPTIONS.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="h-4 w-4 rounded border-blue-400 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Password */}
            <label htmlFor="password" className="block mb-1 text-xs text-slate-700 font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className={`w-full h-9 px-3 mb-1 text-sm bg-blue-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.password ? 'border-red-400' : 'border-transparent focus:border-blue-400'}`}
            />
            {errors.password && <p className="text-xs text-red-500 mb-4">{errors.password}</p>}

            {/* Confirm Password */}
            <label htmlFor="confirmPassword" className="block mb-1 text-xs text-slate-700 font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className={`w-full h-9 px-3 mb-6 text-sm bg-blue-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.confirmPassword ? 'border-red-400' : 'border-transparent focus:border-blue-400'}`}
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 mb-4">{errors.confirmPassword}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 mt-2 text-white text-sm font-semibold rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* OR CONTINUE WITH */}
          <div className="my-4 text-center text-xs text-gray-400 tracking-widest">
            OR CONTINUE WITH
          </div>

          {/* Social Buttons */}
          <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-2">
            <button type="button" className="h-8 rounded-lg border border-gray-300 bg-blue-100 text-gray-700 text-xs font-semibold cursor-pointer hover:bg-blue-200 transition-colors">
              <span className="inline-flex items-center gap-2">
                <FcGoogle className="text-lg" />
                Google
              </span>
            </button>
            <button type="button" className="h-8 rounded-lg border border-gray-300 bg-blue-100 text-gray-700 text-xs font-semibold cursor-pointer hover:bg-blue-200 transition-colors">
              <span className="inline-flex items-center gap-2">
                <FaApple className="text-base text-black" />
                Apple
              </span>
            </button>
          </div>

          <p className="mt-7 mb-2 text-center text-xs text-gray-600">
            Already have an account?{' '}
            <button onClick={() => navigate('/resturent/login')} className="text-blue-700 font-semibold hover:underline cursor-pointer bg-transparent border-none p-0">
              Sign in
            </button>
          </p>

          <p className="m-0 text-center text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-blue-700 no-underline hover:underline">Terms of Service</a>{' '}and{' '}
            <a href="#" className="text-blue-700 no-underline hover:underline">Privacy Policy</a>.
          </p>
        </section>
      </main>
    </div>
  )
}

export default ResturentRegistrationPage
