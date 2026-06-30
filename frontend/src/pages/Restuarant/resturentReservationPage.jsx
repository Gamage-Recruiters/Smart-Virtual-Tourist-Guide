function ResturentReservationPage() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
          Reservations
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Manage Reservations
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          View and manage table reservations from tourists and local customers.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900">Reservation System Coming Soon</h3>
        <p className="mt-2 text-sm text-slate-500">
          The reservation module is under development. Tourists will be able to book tables directly through the platform.
        </p>
      </div>
    </section>
  )
}

export default ResturentReservationPage
