import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bgImage from '../assets/Resturent_Menu.png'

const categoryOptions = ['Authentic Sri Lanka', 'Appetizer', 'Main Course', 'Dessert']

function ResturentAddMenuPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('Authentic Sri Lanka')
  const [isAvailableToday, setIsAvailableToday] = useState(true)
  const [isVegan, setIsVegan] = useState(false)

  const categoryPreview = useMemo(() => selectedCategory, [selectedCategory])

  return (
    <section className="overflow-hidden rounded-3xl bg-slate-50 shadow-xl ring-1 ring-slate-200">
      <header className="relative min-h-[420px] overflow-hidden md:min-h-[520px]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={bgImage}
          alt="Beach restaurant background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/20 to-slate-900/25" />

        <div className="relative flex h-full min-h-[420px] flex-col justify-end p-5 md:min-h-[520px] md:p-8 lg:p-10">
          <div className="max-w-2xl rounded-2xl bg-slate-950/30 p-5 text-white backdrop-blur-[2px] md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              Menu Builder
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              Upload New Menu Item
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 md:text-base">
              Add a new dish to your digital showcase for international travelers and locals.
            </p>
          </div>
        </div>
      </header>

      <main className="bg-blue-50 px-5 py-6 md:px-8 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Dish Photography</h3>
            <div className="mt-4 rounded-2xl bg-blue-50 p-5 text-center ring-1 ring-blue-100">
              <div className="flex h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-white text-blue-500">
                <div className="rounded-full bg-blue-50 p-3 text-2xl">📷</div>
                <p className="mt-4 text-sm font-semibold text-slate-700">Click to upload</p>
                <p className="mt-1 text-xs text-slate-400">High-res JPG or PNG</p>
              </div>
              <div className="mt-4 rounded-xl bg-white p-3 text-left text-xs text-slate-500 ring-1 ring-slate-200">
                Bright, natural lighting works best for food shots to attract international travelers.
              </div>
            </div>
          </aside>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
            <div className="grid gap-5">
              <div>
                <label htmlFor="dishName" className="mb-2 block text-sm font-medium text-slate-900">
                  Dish Name
                </label>
                <input
                  id="dishName"
                  type="text"
                  placeholder="Enter dish name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-900">
                  Description
                </label>
                <textarea
                  id="description"
                  rows="5"
                  placeholder="Write a short description of the dish"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-900">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={[
                        'rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-colors',
                        categoryPreview === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      ].join(' ')}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="price" className="mb-2 block text-sm font-medium text-slate-900">
                  Price
                </label>
                <input
                  id="price"
                  type="text"
                  placeholder="USD 0.00"
                  className="w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">Available Today?</span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Currently available to serve customers
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={isAvailableToday}
                    onChange={(event) => setIsAvailableToday(event.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">Is it Vegan?</span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Mark this if the dish uses no animal products
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={isVegan}
                    onChange={(event) => setIsVegan(event.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/menu')}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  Save & Publish
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  )
}

export default ResturentAddMenuPage
