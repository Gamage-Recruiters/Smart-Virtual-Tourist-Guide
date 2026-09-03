import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bgImage from '../../assets/resturent_BG.png'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const StarIcon = ({ filled, size = 'w-3.5 h-3.5' }) => (
  <svg className={`${size} ${filled ? 'text-amber-400' : 'text-slate-200'} shrink-0`} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

const RatingStars = ({ rating, size = 'w-3.5 h-3.5' }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled={i <= rating} size={size} />)}
  </div>
)

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function ResturentDashboardPage() {
  const navigate = useNavigate()
  const [restaurantData, setRestaurantData] = useState(null)
  const [profileNotFound, setProfileNotFound] = useState(false)
  const [menuCount, setMenuCount] = useState(0)
  const [activeOffers, setActiveOffers] = useState(0)
  const [reservations, setReservations] = useState([])
  const [revenueData, setRevenueData] = useState({ totalRevenue: 0 })
  const [reviewData, setReviewData] = useState({ averageRating: 0, totalReviews: 0, recentReviews: [] })
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [setupData, setSetupData] = useState({ restaurantName: '', ownerName: '', phone: '', address: '', district: '', registrationNo: '' })
  const [setupError, setSetupError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('restaurantUser') || '{}')
        const token = localStorage.getItem('restaurantToken')
        const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

        // Fetch all restaurants to find this owner's restaurant
        const restRes = await fetch(`${API_BASE}/restaurants`, { headers })
        const allRestaurants = await restRes.json()
        const matchedRestaurant = Array.isArray(allRestaurants)
          ? allRestaurants.find(r => r.email === user.email)
          : null

        if (matchedRestaurant) {
          setRestaurantData(matchedRestaurant)
          setProfileNotFound(false)

          // Fetch menu items, offers, reservations, revenue, and reviews
          const [menuRes, offersRes, reservRes, revRes, reviewRes] = await Promise.all([
            fetch(`${API_BASE}/menu/restaurant/${matchedRestaurant._id}`, { headers }),
            fetch(`${API_BASE}/offers/restaurant/${matchedRestaurant._id}`, { headers }),
            fetch(`${API_BASE}/reservations/restaurant/${matchedRestaurant._id}`, { headers }),
            fetch(`${API_BASE}/reservations/restaurant/${matchedRestaurant._id}/revenue`, { headers }),
            fetch(`${API_BASE}/reviews/owner/${matchedRestaurant._id}`, { headers }),
          ])

          const menuItems = await menuRes.json()
          setMenuCount(Array.isArray(menuItems) ? menuItems.length : 0)

          const offersData = await offersRes.json()
          const activeCount = Array.isArray(offersData)
            ? offersData.filter(o => o.isActive).length
            : 0
          setActiveOffers(activeCount)

          if (reservRes.ok) {
            const reservData = await reservRes.json()
            setReservations(Array.isArray(reservData) ? reservData : [])
          }

          if (revRes.ok) {
            const revData = await revRes.json()
            setRevenueData(revData)
          }

          if (reviewRes.ok) {
            const revData = await reviewRes.json()
            setReviewData({
              averageRating: revData.stats?.averageRating || 0,
              totalReviews: revData.stats?.totalReviews || 0,
              recentReviews: Array.isArray(revData.reviews) ? revData.reviews.slice(0, 3) : [],
            })
          }
        } else {
          // No restaurant profile found for this user — show setup form
          setProfileNotFound(true)
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const user = JSON.parse(localStorage.getItem('restaurantUser') || '{}')

  // ── Handle profile creation for users who skipped/failed step 2 ──────────
  const handleSetupProfile = async (e) => {
    e.preventDefault()
    setSetupError('')
    if (!setupData.restaurantName || !setupData.ownerName || !setupData.phone || !setupData.address || !setupData.district || !setupData.registrationNo) {
      setSetupError('Please fill in all required fields.')
      return
    }
    setCreating(true)
    try {
      const token = localStorage.getItem('restaurantToken')
      const res = await fetch(`${API_BASE}/restaurants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...setupData,
          email: user.email,
          tables: {
            ethereal: { name: 'The Ethereal (full luxury experience)', pricePerPerson: 285, limit: 500 },
            obsidian: { name: 'Obsidian Terrace (open air sunset dining)', pricePerPerson: 195, limit: 500 },
          },
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setRestaurantData(data)
        setProfileNotFound(false)
      } else {
        setSetupError(data.message || 'Failed to create profile. Try again.')
      }
    } catch {
      setSetupError('Network error. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  // ── No-profile state: show inline setup form ─────────────────────────────
  if (!loading && profileNotFound) {
    const SRI_LANKA_DISTRICTS = ["Colombo","Gampaha","Kalutara","Kandy","Matale","Nuwara Eliya","Galle","Matara","Hambantota","Jaffna","Kilinochchi","Mannar","Mullaitivu","Vavuniya","Trincomalee","Batticaloa","Ampara","Kurunegala","Puttalam","Anuradhapura","Polonnaruwa","Badulla","Monaragala","Ratnapura","Kegalle"]
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
          <div className="mb-6 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Complete Your Restaurant Profile</h2>
            <p className="mt-1.5 text-sm text-slate-500">Your account is set up. Now add your restaurant details to get started.</p>
          </div>
          {setupError && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600 font-medium">{setupError}</div>}
          <form onSubmit={handleSetupProfile} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">Restaurant Name *</label>
                <input value={setupData.restaurantName} onChange={e => setSetupData(p => ({ ...p, restaurantName: e.target.value }))} placeholder="e.g. Royal Taste" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-slate-50" />
              </div>
              <div>
                <label className="block mb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">Owner Full Name *</label>
                <input value={setupData.ownerName} onChange={e => setSetupData(p => ({ ...p, ownerName: e.target.value }))} placeholder="e.g. John Doe" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-slate-50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">Registration No *</label>
                <input value={setupData.registrationNo} onChange={e => setSetupData(p => ({ ...p, registrationNo: e.target.value }))} placeholder="e.g. Reg-77382" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-slate-50" />
              </div>
              <div>
                <label className="block mb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">Contact Phone *</label>
                <input value={setupData.phone} onChange={e => setSetupData(p => ({ ...p, phone: e.target.value }))} placeholder="0774659824" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-slate-50" />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">Full Address *</label>
              <input value={setupData.address} onChange={e => setSetupData(p => ({ ...p, address: e.target.value }))} placeholder="123 Restaurant Street, Colombo" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-slate-50" />
            </div>
            <div>
              <label className="block mb-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">District *</label>
              <select value={setupData.district} onChange={e => setSetupData(p => ({ ...p, district: e.target.value }))} className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-slate-50">
                <option value="">-- Select District --</option>
                {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button type="submit" disabled={creating} className="w-full h-10 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50 cursor-pointer">
              {creating ? 'Creating Profile...' : 'Create Restaurant Profile'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const todayReservationsCount = reservations.filter(r => r.date === todayStr).length

  const stats = [
    { label: 'Menu Items', value: loading ? '...' : menuCount, sub: 'Total items listed' },
    { label: 'Today Reservations', value: loading ? '...' : todayReservationsCount, sub: 'Diners visiting today' },
    {
      label: 'Rating & Reviews',
      value: loading ? '...' : (reviewData.averageRating > 0 ? `⭐ ${reviewData.averageRating.toFixed(1)}` : '0.0'),
      sub: loading ? '...' : `${reviewData.totalReviews} total ${reviewData.totalReviews === 1 ? 'review' : 'reviews'}`
    },
    { label: 'Active Offers', value: loading ? '...' : activeOffers, sub: 'Currently running' },
    { label: 'Total Revenue', value: loading ? '...' : `$${(revenueData.totalRevenue || 0).toFixed(2)}`, sub: 'Lifetime earnings' },
  ]

  return (
    <section className="relative min-h-[calc(100vh-2rem)] overflow-hidden rounded-3xl border border-white/40 bg-slate-100 shadow-xl">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={bgImage}
        alt="Restaurant terrace background"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/8 to-white/25" />
      <div className="absolute inset-0 bg-slate-900/5" />

      <div className="relative p-4 md:p-6 lg:p-8">
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Welcome Back{restaurantData ? `, ${restaurantData.restaurantName}` : user.fullName ? `, ${user.fullName}` : ''}!
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Here is what&apos;s happening with your restaurant today.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 cursor-pointer"
          >
            Download Report
          </button>
        </header>

        {/* Stats Grid */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((item) => (
            <article
              key={item.label}
              className="min-h-[92px] rounded-2xl border border-blue-200/70 bg-white/82 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-[2px]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {item.label}
              </p>
              <h3 className="mt-4 text-2xl font-bold text-slate-900">{item.value}</h3>
              <p className="mt-1 text-xs text-blue-600">{item.sub}</p>
            </article>
          ))}
        </div>

        {/* Restaurant Info Card */}
        {restaurantData && (
          <div className="mb-6 rounded-2xl border border-blue-200/70 bg-white/82 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-[2px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">Restaurant Info</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              <div><span className="text-slate-500 text-xs">Name: </span><span className="font-semibold text-slate-900">{restaurantData.restaurantName}</span></div>
              <div><span className="text-slate-500 text-xs">Owner: </span><span className="font-semibold text-slate-900">{restaurantData.ownerName}</span></div>
              <div><span className="text-slate-500 text-xs">Phone: </span><span className="font-semibold text-slate-900">{restaurantData.phone}</span></div>
              <div><span className="text-slate-500 text-xs">Address: </span><span className="font-semibold text-slate-900">{restaurantData.address}</span></div>
            </div>
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <div className="grid gap-4">
            {/* Upcoming Reservations section */}
            <article className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-[2px]">
              <header className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Upcoming Reservations</h3>
              </header>
              {loading ? (
                <div className="py-6 text-center text-xs text-slate-400">Loading...</div>
              ) : reservations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  No reservations yet
                </div>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto">
                  {reservations.slice(0, 5).map(r => (
                    <div key={r._id} className="flex justify-between items-center bg-white/80 p-3 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{r.userName}</span>
                        <span className="text-[10px] text-slate-400">{r.userEmail} • {r.guestCount} guests</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-blue-600 block">{r.tableType === 'ethereal' ? 'Ethereal' : 'Obsidian'}</span>
                        <span className="text-slate-500 text-[10px]">{r.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>

            {/* Customer Reviews Section */}
            <article className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-[2px]">
              <header className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">Recent Customer Reviews</h3>
                  {reviewData.totalReviews > 0 && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      {reviewData.totalReviews}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/resturent/dashboard/reviews')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  View All →
                </button>
              </header>

              {loading ? (
                <div className="py-6 text-center text-xs text-slate-400">Loading...</div>
              ) : reviewData.recentReviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
                  No customer reviews yet. Reviews submitted by tourists will appear here.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {reviewData.recentReviews.map(rev => (
                    <div key={rev._id} className="bg-white/80 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white">
                            {getInitials(rev.user?.fullName)}
                          </div>
                          <span className="font-bold text-slate-800">{rev.user?.fullName || 'Customer'}</span>
                        </div>
                        <RatingStars rating={rev.rating} />
                      </div>
                      <p className="text-slate-600 text-xs line-clamp-2 pl-8">{rev.comment}</p>
                      {rev.restaurantReply && (
                        <p className="text-[10px] text-blue-600 font-medium pl-8">✓ Replied</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>

            {/* Active Offers Section */}
            <article className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-[2px]">
              <header className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Active Offers</h3>
              </header>
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                Manage offers from the sidebar settings page.
              </div>
            </article>
          </div>

          <div className="grid gap-4 align-start">
            {/* Revenue Analytics Section */}
            <article className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-[2px]">
              <header className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Revenue Analytics</h3>
              </header>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-3">
                <p className="text-xs text-slate-500">Total processed revenue</p>
                <p className="text-3xl font-extrabold text-blue-600">${(revenueData.totalRevenue || 0).toFixed(2)}</p>
                <div className="text-[10px] text-slate-400">Includes 15% service charge details.</div>
              </div>
            </article>

            {/* Rating Summary Overview Card */}
            <article className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-[2px]">
              <header className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Rating Overview</h3>
                <button
                  type="button"
                  onClick={() => navigate('/resturent/dashboard/reviews')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  Manage →
                </button>
              </header>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-2">
                <p className="text-xs text-slate-500">Average Customer Rating</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {reviewData.averageRating > 0 ? reviewData.averageRating.toFixed(1) : '0.0'}
                  </span>
                  <div className="flex flex-col items-start">
                    <RatingStars rating={Math.round(reviewData.averageRating)} size="w-4 h-4" />
                    <span className="text-[10px] text-slate-400 mt-0.5">out of 5.0</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  Based on <strong className="text-slate-800">{reviewData.totalReviews}</strong> customer reviews
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResturentDashboardPage;
