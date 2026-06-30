function ResturentRevenuePage() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
          Revenue
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Revenue Analytics
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Track your restaurant earnings, top-performing dishes, and financial trends.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {['Total Revenue', 'This Month', 'Today'].map(label => (
          <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <p className="mt-3 text-2xl font-bold text-slate-900">—</p>
            <p className="mt-1 text-xs text-slate-400">No data yet</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900">Revenue Analytics Coming Soon</h3>
        <p className="mt-2 text-sm text-slate-500">
          Detailed charts and financial analytics will be available once the payment and order systems are integrated.
        </p>
      </div>
    </section>
  )
}

export default ResturentRevenuePage
