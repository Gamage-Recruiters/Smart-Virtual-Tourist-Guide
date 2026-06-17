import bgImage from '../assets/Resturent_Menu.png'

const filters = [
  'All Items',
  'Authentic SriLankan',
  'Main course',
  'Dessert',
  'Beverages'
]

const menuItems = [
  'Rice & Curry',
  'Chicken Spring Rolls',
  'Kottu Roti',
  'Watalappan',
  'Iced Tea',
  'Seafood Rice'
]

function ResturentMenuPage() {
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
              Resturent Menu
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700 md:text-base">
              Add a new dish to your digital showcase for international travelers and locals.
            </p>
          </div>

          <div className="rounded-2xl border border-white/50 bg-sky-100/95 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm md:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <label htmlFor="menu-search" className="sr-only">
                  Search menu items
                </label>
                <input
                  id="menu-search"
                  type="text"
                  placeholder="Search menu items (e.g. Rice & curry)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((filter, index) => (
                  <button
                    key={filter}
                    type="button"
                    className={[
                      'rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors',
                      index === 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    ].join(' ')}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="lg:pl-3 lg:border-l lg:border-slate-200">
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  + Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-6 bg-white px-5 py-6 md:px-8 md:py-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">All Items</h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {menuItems.map((item) => (
            <article
              key={item}
              className="overflow-hidden rounded-2xl border border-sky-100 bg-sky-50 shadow-sm"
            >
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-sky-100 via-white to-amber-50 text-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Menu Item
                  </p>
                  <h4 className="mt-3 text-2xl font-bold text-slate-900">{item}</h4>
                </div>
              </div>

              <div className="space-y-3 p-4">
                <p className="text-sm text-slate-600">
                  Static placeholder for future food data and item details.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">Heading only</span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Category
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </section>
  )
}

export default ResturentMenuPage
