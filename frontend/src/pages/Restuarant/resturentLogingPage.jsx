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
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Invalid email or password.')
        return
      }

      // Store JWT and user info
      localStorage.setItem('token', data.token)
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

      {/* Auth Section */}
      <main className="relative mt-[-2.2rem] px-4 py-12 md:py-0">
        <section className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-12" aria-label="Restaurant sign in form">
          <h2 className="m-0 text-3xl md:text-4xl font-bold text-center">
            Sign In
          </h2>
          <p className="mt-1 mb-6 text-center text-gray-600 text-sm">
            Start managing your restaurant with professional precision.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <label htmlFor="email" className="block mb-1 text-xs text-slate-700 font-medium">
              Official Email Address of the Restaurant
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@restaurant.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-9 px-3 mb-4 text-sm bg-blue-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-400 focus:outline-none transition-colors"
            />

            <label htmlFor="password" className="block mb-1 text-xs text-slate-700 font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-9 px-3 mb-6 text-sm bg-blue-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-400 focus:outline-none transition-colors"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 mt-2 text-white text-sm font-semibold rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
            You Don&apos;t have an account yet?
          </p>

          <button
            onClick={() => navigate('/resturent/register')}
            type="button"
            className="w-full max-w-md mx-auto block h-9 mt-2 text-white text-sm font-semibold rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Register Now <span aria-hidden="true">&rarr;</span>
          </button>

          <p className="m-0 mt-6 text-center text-xs text-gray-500">
            By signing in, you agree to our <a href="#" className="text-blue-700 no-underline hover:underline">Terms of Service</a> and <a href="#" className="text-blue-700 no-underline hover:underline">Privacy Policy</a>.
          </p>
        </section>
      </main>
    </div>
  )
}

export default ResturentLogingPage
