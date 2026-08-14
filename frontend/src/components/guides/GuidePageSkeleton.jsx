export default function GuidePageSkeleton({ cards = 3 }) {
  return (
    <div role="status" aria-label="Loading guide information" className="space-y-4">
      {Array.from({ length: cards }, (_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-[#e5edf3] bg-white p-5">
          <div className="flex gap-4">
            <div className="h-16 w-16 rounded-full bg-[#e7eef4]" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-1/3 rounded bg-[#e7eef4]" />
              <div className="h-3 w-2/3 rounded bg-[#edf2f6]" />
              <div className="h-3 w-full rounded bg-[#edf2f6]" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  )
}
