import { useEffect, useState } from 'react'
import bgImage from '../../assets/resturent_BG.png'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

function ResturentDashboardPage() {
  const [restaurantData, setRestaurantData] = useState(null)
  const [menuCount, setMenuCount] = useState(0)
  const [activeOffers, setActiveOffers] = useState(0)
  const [reservations, setReservations] = useState([])
  const [revenueData, setRevenueData] = useState({ totalRevenue: 0 })
  const [loading, setLoading] = useState(true)

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

          // Fetch menu items, offers, reservations, and revenue
          const [menuRes, offersRes, reservRes, revRes] = await Promise.all([
            fetch(`${API_BASE}/menu/restaurant/${matchedRestaurant._id}`, { headers }),
            fetch(`${API_BASE}/offers/restaurant/${matchedRestaurant._id}`, { headers }),
            fetch(`${API_BASE}/reservations/restaurant/${matchedRestaurant._id}`, { headers }),
            fetch(`${API_BASE}/reservations/restaurant/${matchedRestaurant._id}/revenue`, { headers }),
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

  // Calculate today's reservations count
  const todayStr = new Date().toISOString().split('T')[0]
  const todayReservationsCount = reservations.filter(r => r.date === todayStr).length

  const stats = [
    { label: 'Menu Items', value: loading ? '...' : menuCount, sub: 'Total items listed' },
    { label: 'Today Reservations', value: loading ? '...' : todayReservationsCount, sub: 'Diners visiting today' },
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
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Download Report
          </button>
        </header>

        {/* Stats Grid */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

          <div className="grid gap-4">
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResturentDashboardPage;
