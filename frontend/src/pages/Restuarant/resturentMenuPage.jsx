import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bgImage from '../../assets/Resturent_Menu.png'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const FOOD_TYPE_COLORS = {
  Vegetarian: 'bg-green-100 text-green-700',
  'Non-Vegetarian': 'bg-red-100 text-red-700',
  Vegan: 'bg-emerald-100 text-emerald-700',
}

const ALL_FILTERS = [
  'All Items',
  'Authentic Sri Lankan',
  'Vegetarian',
  'Non-Vegetarian',
  'Vegan',
  'Appetizer',
  'Main Course',
  'Dessert',
  'Beverage'
]

function ResturentMenuPage() {
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState([])
  const [offers, setOffers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeFilter, setActiveFilter] = useState('All Items')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [restaurantId, setRestaurantId] = useState(null)

  useEffect(() => {
    const init = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('restaurantUser') || '{}')
        const token = localStorage.getItem('restaurantToken')
        const headers = { Authorization: `Bearer ${token}` }

        // Find this owner's restaurant
        const restRes = await fetch(`${API_BASE}/restaurants`, { headers })
        const allRestaurants = await restRes.json()
        const matched = Array.isArray(allRestaurants)
          ? allRestaurants.find(r => r.email === user.email)
          : null

        if (!matched) { setLoading(false); return }

        setRestaurantId(matched._id)

        // Fetch active offers for this restaurant
        const offersRes = await fetch(`${API_BASE}/offers/restaurant/${matched._id}`, { headers })
        const offersData = await offersRes.json()
        setOffers(Array.isArray(offersData) ? offersData.filter(o => o.isActive) : [])

        const menuRes = await fetch(`${API_BASE}/menu/restaurant/${matched._id}`, { headers })
        const items = await menuRes.json()
        setMenuItems(Array.isArray(items) ? items : [])
        setFiltered(Array.isArray(items) ? items : [])
      } catch (err) {
        console.error('Menu fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // Apply search + filter
  useEffect(() => {
    let result = menuItems
    if (activeFilter !== 'All Items') {
      const foodTypes = ['Vegetarian', 'Non-Vegetarian', 'Vegan']
      if (foodTypes.includes(activeFilter)) {
        result = result.filter(item => item.foodType === activeFilter)
      } else {
        // Filter by Category
        result = result.filter(item => item.category === activeFilter)
      }
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        item =>
          item.name?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, activeFilter, menuItems])



  const handleToggleAvailability = async (id) => {
    try {
      const token = localStorage.getItem('restaurantToken')
      const res = await fetch(`${API_BASE}/menu/${id}/availability`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const updated = await res.json()
        setMenuItems(prev =>
          prev.map(item => (item._id === id ? updated : item))
        )
      }
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return
    try {
      const token = localStorage.getItem('restaurantToken')
      const res = await fetch(`${API_BASE}/menu/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setMenuItems(prev => prev.filter(item => item._id !== id))
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-slate-50 shadow-xl ring-1 ring-slate-200">
      <header className="relative min-h-[420px] overflow-hidden md:min-h-[520px]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={bgImage}
          alt="Beachside restaurant menu background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-slate-900/5" />

        <div className="relative flex h-full min-h-[420px] flex-col justify-between p-5 md:min-h-[520px] md:p-8 lg:p-10">
          <div className="max-w-xl pt-2 md:pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-700/70">
              Menu Items
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Restaurant Menu
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700 md:text-base">
              Manage your dishes — add, edit, and control availability for international travelers and locals.
            </p>
          </div>

          <div className="rounded-2xl border border-white/50 bg-sky-100/90 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm space-y-4">
            {/* Search Input Row */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="menu-search" className="sr-only">Search menu items</label>
                <input
                  id="menu-search"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search menu items by name, category, or details..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('/resturent/dashboard/menu/add')}
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 cursor-pointer"
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-200/50">
              {ALL_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={[
                    'rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all cursor-pointer',
                    activeFilter === filter
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  ].join(' ')}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-6 bg-white px-5 py-6 md:px-8 md:py-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {activeFilter === 'All Items' ? 'All Items' : activeFilter}
            <span className="ml-2 text-sm font-normal text-slate-400">({filtered.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">Loading menu items...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-500 text-sm">No menu items found.</p>
            <button
              onClick={() => navigate('/resturent/dashboard/menu/add')}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden rounded-2xl border border-sky-100 bg-sky-50 shadow-sm"
              >
                <div 
                  onClick={() => navigate(`/resturent/dashboard/menu/edit/${item._id}`)}
                  className="flex h-48 items-center justify-center bg-gradient-to-br from-sky-100 via-white to-amber-50 text-center relative cursor-pointer group"
                >
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300" />
                  ) : (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                        {item.category}
                      </p>
                      <h4 className="mt-3 text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h4>
                    </div>
                  )}

                  {/* Availability badge */}
                  <span className={`absolute top-3 right-3 rounded-full px-2 py-1 text-[10px] font-semibold ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  
                  {/* Discount percentage badge */}
                  {offers.length > 0 && (() => {
                    const bestOffer = offers.reduce((prev, current) => 
                      (prev.discountPercentage > current.discountPercentage) ? prev : current
                    );
                    return (
                      <span className="absolute top-3 left-3 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                        {bestOffer.discountPercentage}% OFF
                      </span>
                    );
                  })()}
                </div>


                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.name}</h4>
                      {item.description && (
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${FOOD_TYPE_COLORS[item.foodType] || 'bg-slate-100 text-slate-600'}`}>
                      {item.foodType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {offers.length > 0 ? (
                        (() => {
                          // Find largest active offer discount
                          const bestOffer = offers.reduce((prev, current) => 
                            (prev.discountPercentage > current.discountPercentage) ? prev : current
                          );
                          const discount = bestOffer.discountPercentage;
                          const discountedPrice = item.price * (1 - discount / 100);
                          return (
                            <div className="flex flex-col">
                              <span className="text-xs text-red-500 line-through">
                                LKR {item.price?.toFixed(2)}
                              </span>
                              <span className="text-lg font-bold text-slate-900">
                                LKR {discountedPrice?.toFixed(2)}
                              </span>
                            </div>
                          );
                        })()
                      ) : (
                        <span className="text-lg font-bold text-slate-900">
                          LKR {item.price?.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {item.category}
                    </span>
                  </div>


                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleToggleAvailability(item._id)}
                      className="flex-1 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    <button
                      onClick={() => navigate(`/resturent/dashboard/menu/edit/${item._id}`)}
                      className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>

            ))}
          </div>
        )}
      </main>
    </section>
  )
}

export default ResturentMenuPage
