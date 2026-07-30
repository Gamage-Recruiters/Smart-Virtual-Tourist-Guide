function ResturentReviewPage() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
          Reviews
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Customer Reviews
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          See what tourists and locals are saying about your restaurant.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900">Review System Coming Soon</h3>
        <p className="mt-2 text-sm text-slate-500">
          The reviews module is under development. Tourist feedback and ratings will appear here once the system is live.
        </p>
      </div>
    </section>
  )
}

export default ResturentReviewPage
