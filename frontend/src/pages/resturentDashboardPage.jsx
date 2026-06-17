import bgImage from '../assets/resturent_BG.png'

const stats = [
  { label: 'Total Revenue' },
  { label: 'Today Reservation' },
  { label: 'Active Offers' },
  { label: 'Avg. Ratings' }
]

const sections = [
  { title: 'Upcoming Reservation' },
  { title: 'Active Offers' },
  { title: 'Recent Reviews' },
  { title: 'Top Performing Dishes' },
  { title: 'Revenue Analytics' }
]

function ResturentDashboardPage() {
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
            <p className="text-sm font-semibold text-slate-900">Welcome Back..</p>
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

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <article
              key={item.label}
              className="min-h-[92px] rounded-2xl border border-blue-200/70 bg-white/82 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-[2px]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {item.label}
              </p>
              <h3 className="mt-5 text-sm font-semibold text-slate-900">Heading only</h3>
              <p className="mt-1 text-xs text-blue-600">No backend data yet</p>
            </article>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <div className="grid gap-4">
            {sections.slice(0, 3).map((section) => (
              <article
                key={section.title}
                className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-[2px]"
              >
                <header className="mb-6 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">{section.title}</h3>
                  <span className="text-xs text-slate-500">View All</span>
                </header>
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  Section placeholder
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-4">
            {sections.slice(3).map((section) => (
              <article
                key={section.title}
                className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-[2px]"
              >
                <header className="mb-6 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">{section.title}</h3>
                  <span className="text-xs text-slate-500">View All</span>
                </header>
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  Section placeholder
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResturentDashboardPage
