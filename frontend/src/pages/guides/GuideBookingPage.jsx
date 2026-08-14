import { useEffect, useState } from 'react'
import { CheckCircle2, ChevronLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import GuideEmptyState from '../../components/guides/GuideEmptyState'
import GuideLayout from '../../components/guides/GuideLayout'
import GuidePageSkeleton from '../../components/guides/GuidePageSkeleton'
import GuideStatusBadge from '../../components/guides/GuideStatusBadge'
import { guideService } from '../../services/guideService'
import { formatCurrency, formatDateRange } from '../../utils/guideFormatters'

export default function GuideBookingPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [state, setState] = useState({ booking: undefined, error: '', errorStatus: 0, retry: 0 })

  useEffect(() => {
    let active = true
    guideService.getBookingById(bookingId)
      .then((booking) => { if (active) setState((current) => ({ ...current, booking, error: '', errorStatus: 0 })) })
      .catch((error) => { if (active) setState((current) => ({ ...current, booking: null, error: error.message || 'The booking could not be loaded.', errorStatus: error.status || 0 })) })
    return () => { active = false }
  }, [bookingId, state.retry])

  if (state.booking === undefined) return <GuideLayout><h1 className="mb-6 text-3xl font-extrabold">Guide booking</h1><GuidePageSkeleton cards={2} /></GuideLayout>
  if (state.error) return <GuideLayout><h1 className="mb-6 text-3xl font-extrabold">Guide booking</h1><GuideEmptyState title={state.errorStatus === 403 ? 'You do not have access to this booking' : state.errorStatus === 404 ? 'Booking not found' : 'We could not load this booking'} description={state.error} actionLabel={state.errorStatus >= 500 || state.errorStatus === 0 ? 'Retry' : 'Return to guide requests'} onAction={state.errorStatus >= 500 || state.errorStatus === 0 ? () => setState((current) => ({ ...current, booking: undefined, retry: current.retry + 1 })) : () => navigate('/guide-bids')} /></GuideLayout>

  const booking = state.booking
  return <GuideLayout>
    <Link to="/guide-bids" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-[#2e5c88]"><ChevronLeft aria-hidden="true" className="h-4 w-4" />Guide requests</Link>
    <section className="mt-3 rounded-2xl border border-[#bde2cf] bg-white p-6 shadow sm:p-8" aria-labelledby="guide-booking-title">
      <CheckCircle2 aria-hidden="true" className="h-12 w-12 text-[#2f9b68]" />
      <div className="mt-3 flex flex-wrap items-center gap-3"><h1 id="guide-booking-title" className="text-3xl font-extrabold">Guide booking</h1><GuideStatusBadge status={booking.bookingStatus} /></div>
      <p className="mt-2 text-sm text-[#627587]">Booking reference <strong className="text-[#183b56]">{booking.bookingReference}</strong></p>
      <dl className="mt-7 grid gap-5 rounded-xl bg-[#f5f9fc] p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div><dt className="detail-term">Guide</dt><dd className="mt-1 font-extrabold">{booking.guide?.name || booking.tripDetails.guideName}</dd></div>
        <div><dt className="detail-term">Route</dt><dd className="mt-1 font-extrabold">{booking.tripDetails.startLocation} to {booking.tripDetails.destination}</dd></div>
        <div><dt className="detail-term">Dates</dt><dd className="mt-1 font-extrabold">{formatDateRange(booking.tripDetails.startDate, booking.tripDetails.endDate)}</dd></div>
        <div><dt className="detail-term">Travellers</dt><dd className="mt-1 font-extrabold">{booking.tripDetails.adults} adults, {booking.tripDetails.children} children</dd></div>
        <div><dt className="detail-term">Total</dt><dd className="mt-1 font-extrabold text-[#23669e]">{formatCurrency(booking.amount, booking.currency)}</dd></div>
        <div><dt className="detail-term">Payment status</dt><dd className="mt-1 font-extrabold">{booking.paymentStatus}</dd></div>
      </dl>
    </section>
  </GuideLayout>
}
