import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Filter, GitCompareArrows, Info } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import GuideLayout from '../../components/guides/GuideLayout'
import GuideBidCard from '../../components/guides/GuideBidCard'
import GuideComparison from '../../components/guides/GuideComparison'
import GuideEmptyState from '../../components/guides/GuideEmptyState'
import GuideFilters from '../../components/guides/GuideFilters'
import GuidePageSkeleton from '../../components/guides/GuidePageSkeleton'
import GuideStatusBadge from '../../components/guides/GuideStatusBadge'
import GuideToast from '../../components/guides/GuideToast'
import useGuideBookingFlow from '../../hooks/useGuideBookingFlow'
import { formatDateRange } from '../../utils/guideFormatters'

export default function GuideBidsPage() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const flow = useGuideBookingFlow(requestId)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [comparisonOpen, setComparisonOpen] = useState(false)
  const [toast, setToast] = useState(location.state?.notice || '')

  useEffect(() => {
    if (location.state?.notice) window.history.replaceState({}, document.title)
  }, [location.state])

  if (flow.loading) return <GuideLayout><h1 className="mb-6 text-3xl font-extrabold">Available Guides</h1><GuidePageSkeleton cards={4} /></GuideLayout>
  if (flow.error) return <GuideLayout><h1 className="mb-6 text-3xl font-extrabold">Available Guides</h1><GuideEmptyState title="We could not load guide bids" description={flow.error} actionLabel="Retry" onAction={flow.retry} /></GuideLayout>
  if (!flow.request) return <GuideLayout><h1 className="text-3xl font-extrabold">Guide request not found</h1><p className="mt-3 text-sm text-[#627587]">This request may have been removed or the link is incorrect.</p><Link to="/guides/request" className="guide-button-primary mt-6">Create a guide request</Link></GuideLayout>

  const disabledRequest = ['Cancelled', 'Expired'].includes(flow.request.status)
  const compare = (guideId) => {
    const result = flow.toggleComparison(guideId)
    setToast(result.limitReached ? 'You can compare up to three guides.' : result.added ? 'Guide added to comparison.' : 'Guide removed from comparison.')
  }
  const select = (guide, bid) => navigate(`/guides/requests/${requestId}/confirm/${bid.id}?guideId=${guide.id}`)

  return <GuideLayout>
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><h1 id="available-guides" className="break-words text-3xl font-extrabold tracking-tight">Available Guides</h1><p className="mt-2 flex min-w-0 items-start gap-2 text-sm leading-6 text-[#627587]"><Info aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#248bd5]" /><span className="min-w-0 break-words">Bids for your trip: {flow.request.startLocation} to {flow.request.destination} · {flow.request.adults} {flow.request.adults === 1 ? 'Adult' : 'Adults'} · {formatDateRange(flow.request.startDate, flow.request.endDate)}</span></p></div><GuideStatusBadge status={flow.request.status} /></header>
    <section className="mt-5 rounded-xl border border-[#d8e6f0] bg-[#edf7ff] p-4 text-sm text-[#31546c]" aria-label="Request summary"><strong>{flow.request.destination}</strong> · {flow.request.languages?.join(', ') || 'Any language'} · Budget up to {flow.request.currency} {Number(flow.request.maxBudget).toLocaleString('en-US')}</section>
    {disabledRequest ? <div className="mt-6"><GuideEmptyState title={`This request is ${flow.request.status.toLowerCase()}`} description="New guide selections are no longer available for this request. You can create another request when you are ready." /></div> : <div className="mt-6 grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
      <GuideFilters filters={flow.filters} onChange={flow.changeFilter} onReset={() => { flow.resetFilters(); setToast('Filters reset.') }} mobileOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />
      <section aria-labelledby="results-title" className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="results-title" className="text-lg font-extrabold">{flow.filteredItems.length} bids found</h2><p className="text-xs text-[#718396]">Showing verified local guide offers for this request</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setFiltersOpen(true)} className="guide-button-secondary lg:hidden"><Filter aria-hidden="true" className="h-4 w-4" />Filters</button><select aria-label="Sort guide bids" value={flow.sortBy} onChange={(event) => { flow.setSortBy(event.target.value); flow.setPage(1) }} className="min-h-11 rounded-lg border border-[#b9c9d6] bg-white px-3 text-sm font-bold"><option value="recommended">Recommended</option><option value="lowest">Lowest price</option><option value="highest">Highest price</option><option value="rating">Highest rating</option><option value="experience">Most experienced</option><option value="newest">Newest bid</option></select></div></div>
        {flow.visibleItems.length ? <div className="mt-4 space-y-4">{flow.visibleItems.map(({ guide, bid }) => <GuideBidCard key={bid.id} guide={guide} bid={bid} compared={flow.comparisonIds.includes(guide.id)} onCompare={() => compare(guide.id)} onViewProfile={() => navigate(`/guides/${guide.id}?requestId=${requestId}&bidId=${bid.id}`)} onSelectGuide={() => select(guide, bid)} selectionDisabled={guide.availability !== 'Available'} />)}</div> : <div className="mt-4"><GuideEmptyState title={flow.items.length ? 'No guides match these filters' : 'No bids yet'} description={flow.items.length ? 'Try widening the price, rating, language or speciality filters.' : 'Verified guides will appear here as soon as they submit an offer.'} actionLabel={flow.items.length ? 'Reset filters' : undefined} onAction={flow.items.length ? flow.resetFilters : undefined} /></div>}
        {flow.filteredItems.length > 0 && <nav className="mt-7 flex items-center justify-center gap-2" aria-label="Guide bid pages"><button type="button" aria-label="Previous page" disabled={flow.page === 1} onClick={() => flow.setPage((page) => Math.max(1, page - 1))} className="guide-page-button"><ChevronLeft aria-hidden="true" className="h-4 w-4" /></button>{Array.from({ length: flow.totalPages }, (_, index) => index + 1).map((page) => <button type="button" key={page} aria-label={`Page ${page}`} aria-current={flow.page === page ? 'page' : undefined} onClick={() => flow.setPage(page)} className={`guide-page-button ${flow.page === page ? '!bg-[#2e5c88] !text-white' : ''}`}>{page}</button>)}<button type="button" aria-label="Next page" disabled={flow.page === flow.totalPages} onClick={() => flow.setPage((page) => Math.min(flow.totalPages, page + 1))} className="guide-page-button"><ChevronRight aria-hidden="true" className="h-4 w-4" /></button></nav>}
      </section>
    </div>}
    {flow.comparisonIds.length > 0 && <div className="fixed bottom-4 right-4 z-30 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-xl bg-[#153f60] p-3 text-white shadow-xl"><span className="text-sm font-bold">{flow.comparisonIds.length} selected</span><button type="button" disabled={flow.comparisonIds.length < 2} onClick={() => setComparisonOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-[#153f60] disabled:cursor-not-allowed disabled:opacity-55"><GitCompareArrows aria-hidden="true" className="h-4 w-4" />Compare</button></div>}
    {comparisonOpen && <GuideComparison items={flow.comparisonItems} onRemove={(id) => flow.toggleComparison(id)} onClose={() => setComparisonOpen(false)} />}
    <GuideToast message={toast} tone={toast.includes('up to') ? 'error' : 'success'} onClose={() => setToast('')} />
  </GuideLayout>
}
