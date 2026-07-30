import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaApple } from 'react-icons/fa'
import bgImage from '../../assets/resturent_bg_login_&_register.jpg'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

function ResturentLogingPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: formData.email.trim().toLowerCase(), // backend uses 'identifier' field
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Invalid email or password.')
        return
      }

      // Guard: only allow restaurant_user role
      if (data.user?.role !== 'restaurant_user') {
        setError('Access denied. This login is for restaurant accounts only.')
        return
      }

      // Store JWT and user info
      localStorage.setItem('restaurantToken', data.token)
      localStorage.setItem('restaurantUser', JSON.stringify(data.user))

      // Redirect to dashboard
      navigate('/resturent/dashboard')
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4">
      {/* Background Image with blur & dark overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />

      {/* Main Premium Card Container */}
      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md">
        
        {/* Left Side: Editorial Branding / Hero text */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between text-white bg-gradient-to-br from-blue-600/20 via-sky-500/10 to-transparent border-r border-white/5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">Smart Virtual Tourist Guide</span>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
              Concierge for <br />
              Restaurant Partners
            </h1>
            <p className="mt-6 text-sm text-slate-300 leading-relaxed max-w-sm">
              Manage menus, track reservations, and promote special dining offers to international travelers and locals with professional ease.
            </p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-xs text-slate-400">
            © {new Date().getFullYear()} SVTG. All rights reserved.
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
            <p className="mt-1.5 text-xs text-slate-500">Access your restaurant panel workspace.</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1.5 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                Official Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@restaurant.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-10 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1.5 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-10 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-2 text-white text-xs font-bold uppercase tracking-wider rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying Credentials...' : 'Sign In'}
            </button>
          </form>

          {/* OR Divider */}
          <div className="my-6 flex items-center justify-center gap-3">
            <span className="h-px bg-slate-100 flex-1" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">OR</span>
            <span className="h-px bg-slate-100 flex-1" />
          </div>

          {/* Social Sign In */}
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="h-9 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <FcGoogle className="text-lg" />
              Google
            </button>
            <button type="button" className="h-9 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <FaApple className="text-base text-black" />
              Apple
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don&apos;t have an account yet?{' '}
              <button
                onClick={() => navigate('/resturent/register')}
                type="button"
                className="text-blue-600 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                Register Now
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ResturentLogingPage
