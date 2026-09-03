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
    district: '',
    amenities: [],
    bannerImage: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (apiError) setApiError('')
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setUploading(true)
    setApiError('')

    const uploadData = new FormData()
    uploadData.append('image', file)

    try {
    } catch (err) {
      setApiError('Image upload failed.')
    } finally {
      setUploading(false)
    }
  }

  // We will store the local file in a separate state
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const handleFileSelected = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
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
    if (!formData.district) newErrors.district = 'District is required'
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
        setLoading(false)
        return
      }

      // Store token from registration (use 'restaurantToken' to match what dashboard pages read)
      const token = authData.token
      localStorage.setItem('restaurantToken', token)
      localStorage.setItem('restaurantUser', JSON.stringify(authData.user))

      // Step 1.5: If a file is selected, upload it to Cloudinary using the new token
      let bannerImageUrl = ''
      if (selectedFile) {
        setUploading(true)
        const uploadData = new FormData()
        uploadData.append('image', selectedFile)
        
        const uploadRes = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadData
        })
        const uploadResult = await uploadRes.json()
        if (uploadRes.ok && uploadResult.success) {
          bannerImageUrl = uploadResult.imageUrl
        }
        setUploading(false)
      }

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
          district: formData.district,
          amenities: formData.amenities,
          bannerImage: bannerImageUrl,
          tables: {
            ethereal: {
              name: "The ethereal (full luxury experience)",
              pricePerPerson: 285,
              limit: 500
            },
            obsidian: {
              name: "Obsidian terrace (open air sunset dinning)",
              pricePerPerson: 195,
              limit: 500
            }
          }
        }),
      })


      if (!profileRes.ok) {
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
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 py-12">
      {/* Background Image with blur & dark overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />

      {/* Main Premium Card Container */}
      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-[1fr_1.5fr] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md">
        
        {/* Left Side: Branding / Hero info text */}
        <div className="p-8 md:p-12 flex flex-col justify-between text-white bg-gradient-to-br from-blue-600/20 via-sky-500/10 to-transparent border-r border-white/5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">Smart Virtual Tourist Guide</span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight">
              Join Our <br />
              Dine Network
            </h1>
            <p className="mt-6 text-sm text-slate-300 leading-relaxed max-w-sm">
              Publish your menu cards, showcase traditional Sri Lankan cuisine, and run active promo campaigns targeted at global tourists.
            </p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-[10px] text-slate-400">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="bg-white p-8 md:p-12 lg:px-16 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Create Partner Account</h2>
            <p className="mt-1.5 text-xs text-slate-500">Provide details to list your restaurant on the tourist guide.</p>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600 font-medium animate-shake">
              {apiError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="restaurantName" className="block mb-1 text-[10px] font-bold uppercase text-slate-700 tracking-wider">
                  Restaurant Name
                </label>
                <input
                  id="restaurantName"
                  name="restaurantName"
                  type="text"
                  placeholder="e.g. Royal Taste"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  className={`w-full h-9 px-3 text-sm bg-slate-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.restaurantName ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'}`}
                />
                {errors.restaurantName && <p className="text-[10px] text-red-500 mt-1">{errors.restaurantName}</p>}
              </div>

              <div>
                <label htmlFor="ownerName" className="block mb-1 text-[10px] font-bold uppercase text-slate-700 tracking-wider">
                  Owner Full Name
                </label>
                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className={`w-full h-9 px-3 text-sm bg-slate-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.ownerName ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'}`}
                />
                {errors.ownerName && <p className="text-[10px] text-red-500 mt-1">{errors.ownerName}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="registrationNo" className="block mb-1 text-[10px] font-bold uppercase text-slate-700 tracking-wider">
                  Registration No
                </label>
                <input
                  id="registrationNo"
                  name="registrationNo"
                  type="text"
                  placeholder="e.g. Reg-77382"
                  value={formData.registrationNo}
                  onChange={handleChange}
                  className={`w-full h-9 px-3 text-sm bg-slate-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.registrationNo ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'}`}
                />
                {errors.registrationNo && <p className="text-[10px] text-red-500 mt-1">{errors.registrationNo}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block mb-1 text-[10px] font-bold uppercase text-slate-700 tracking-wider">
                  Official Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@restaurant.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full h-9 px-3 text-sm bg-slate-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'}`}
                />
                {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block mb-1 text-[10px] font-bold uppercase text-slate-700 tracking-wider">
                  Contact Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="e.g. 0774659824"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full h-9 px-3 text-sm bg-slate-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.phone ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'}`}
                />
                {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="district" className="block mb-1 text-[10px] font-bold uppercase text-slate-700 tracking-wider">
                  District
                </label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className={`w-full h-9 px-3 text-sm bg-slate-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.district ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'}`}
                >
                  <option value="">-- Choose District --</option>
                  {[
                    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", 
                    "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", 
                    "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara", 
                    "Kurunegegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", 
                    "Monaragala", "Ratnapura", "Kegalle"
                  ].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.district && <p className="text-[10px] text-red-500 mt-1">{errors.district}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block mb-1 text-[10px] font-bold uppercase text-slate-700 tracking-wider">
                Full Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="123 Restaurant Street, Colombo"
                value={formData.address}
                onChange={handleChange}
                className={`w-full h-9 px-3 text-sm bg-slate-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.address ? 'border-red-400' : 'border-transparent focus:border-blue-400'}`}
              />
              {errors.address && <p className="text-[10px] text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="block mb-1 text-[10px] font-bold uppercase text-slate-700 tracking-wider">
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
                  className={`w-full h-9 px-3 text-sm bg-slate-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.password ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'}`}
                />
                {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-1 text-[10px] font-bold uppercase text-slate-700 tracking-wider">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={`w-full h-9 px-3 text-sm bg-slate-50 border rounded-lg focus:bg-white focus:outline-none transition-colors ${errors.confirmPassword ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'}`}
                />
                {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label className="block mb-1 text-[10px] font-bold uppercase text-slate-700 tracking-wider">
                Banner Photo / Profile picture
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelected}
                  className="hidden"
                  id="profile-pic-upload"
                />
                <label
                  htmlFor="profile-pic-upload"
                  className="cursor-pointer rounded-lg bg-blue-50 border border-blue-200 px-4 py-2 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  Choose Photo
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-10 w-16 object-cover rounded-lg border border-slate-200"
                  />
                )}
              </div>
            </div>

            {/* Amenities */}
            <fieldset>
              <legend className="mb-2 block text-[10px] font-bold uppercase text-slate-700 tracking-wider">Amenities Provided</legend>
              <div className="grid gap-3 rounded-xl bg-slate-50 p-4 border border-slate-200 sm:grid-cols-2">
                {AMENITY_OPTIONS.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-3 text-white text-xs font-bold uppercase tracking-wider rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Partner Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                type="button"
                className="text-blue-600 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ResturentRegistrationPage
