import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ChevronLeft, ChevronRight, Info } from 'lucide-react'
import Footer from '../../components/Footer'
import GuideBidCard from '../../components/guideBids/GuideBidCard'
import GuideBidsHeader from '../../components/guideBids/GuideBidsHeader'
import GuideProfileModal from '../../components/guideBids/GuideProfileModal'
import SelectGuideModal from '../../components/guideBids/SelectGuideModal'
import TouristSidebar from '../../components/guideBids/TouristSidebar'
import { GUIDE_BIDS_PER_PAGE, guideBids } from '../../data/guideBids'

export default function GuideBidsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [profileGuide, setProfileGuide] = useState(null)
  const [pendingGuide, setPendingGuide] = useState(null)
  const [selectedGuideId, setSelectedGuideId] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const totalPages = Math.ceil(guideBids.length / GUIDE_BIDS_PER_PAGE)
  const visibleGuides = useMemo(() => {
    const start = (currentPage - 1) * GUIDE_BIDS_PER_PAGE
    return guideBids.slice(start, start + GUIDE_BIDS_PER_PAGE)
  }, [currentPage])

  const closeProfile = useCallback(() => setProfileGuide(null), [])
  const closeConfirmation = useCallback(() => setPendingGuide(null), [])

  useEffect(() => {
    if (!successMessage) return undefined
    const timeout = window.setTimeout(() => setSuccessMessage(''), 4500)
    return () => window.clearTimeout(timeout)
  }, [successMessage])

  useEffect(() => {
    if (!menuOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const changePage = (page) => {
    setCurrentPage(page)
    document.getElementById('available-guides')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const confirmGuide = (guide) => {
    if (selectedGuideId === guide.id) {
      setPendingGuide(null)
      return
    }

    setSelectedGuideId(guide.id)
    setPendingGuide(null)
    setSuccessMessage(`${guide.name} has been selected for your trip.`)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-[#102538]">
      <GuideBidsHeader menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} />
      <TouristSidebar mobile open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="mx-auto flex max-w-[1500px]">
        <TouristSidebar />

        <main className="min-w-0 flex-1 px-4 pb-16 pt-9 sm:px-7 lg:px-10 lg:pt-12 xl:px-14">
          <section className="mx-auto max-w-[1120px]" aria-labelledby="available-guides">
            <div>
              <h1
                id="available-guides"
                tabIndex={-1}
                className="text-2xl font-extrabold tracking-tight text-[#102538] outline-none sm:text-[28px]"
              >
                Available Guides
              </h1>
              <p className="mt-2 inline-flex items-start gap-2 text-xs leading-5 text-[#627587] sm:text-sm">
                <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#248bd5]" />
                <span>
                  Bids for your trip: Colombo to Sigiriya <span aria-hidden="true">•</span>{' '}
                  3 Adults <span aria-hidden="true">•</span> Nov 12–15
                </span>
              </p>
            </div>

            <div className="mt-7 space-y-4">
              {visibleGuides.map((guide) => (
                <GuideBidCard
                  key={guide.id}
                  guide={guide}
                  isSelected={selectedGuideId === guide.id}
                  onViewProfile={setProfileGuide}
                  onSelectGuide={setPendingGuide}
                />
              ))}
            </div>

            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Guide bid pages">
              <button
                type="button"
                aria-label="Previous page"
                onClick={() => changePage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="grid h-9 w-9 place-items-center rounded-lg border border-[#dfe8ef] bg-white text-[#607689] transition hover:border-[#9ec7e5] hover:bg-[#f2f9fe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  type="button"
                  key={page}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                  onClick={() => changePage(page)}
                  className={`grid h-9 w-9 place-items-center rounded-lg border text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3] ${
                    currentPage === page
                      ? 'border-[#1b4e73] bg-[#1b4e73] text-white'
                      : 'border-[#dfe8ef] bg-white text-[#607689] hover:border-[#9ec7e5] hover:bg-[#f2f9fe]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                aria-label="Next page"
                onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="grid h-9 w-9 place-items-center rounded-lg border border-[#dfe8ef] bg-white text-[#607689] transition hover:border-[#9ec7e5] hover:bg-[#f2f9fe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </nav>
          </section>
        </main>
      </div>

      <Footer />

      {profileGuide && <GuideProfileModal guide={profileGuide} onClose={closeProfile} />}
      {pendingGuide && (
        <SelectGuideModal
          guide={pendingGuide}
          onCancel={closeConfirmation}
          onConfirm={confirmGuide}
        />
      )}

      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl bg-[#103d5d] px-5 py-4 text-sm font-semibold text-white shadow-xl"
        >
          <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 text-[#65d6a1]" />
          {successMessage}
        </div>
      )}
    </div>
  )
}
