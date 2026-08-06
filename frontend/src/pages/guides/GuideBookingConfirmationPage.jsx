import { useEffect, useState } from 'react'
import { BadgeCheck, CheckCircle2, ChevronLeft, Languages } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import BookingPriceSummary from '../../components/guides/BookingPriceSummary'
import GuideLayout from '../../components/guides/GuideLayout'
import GuidePageSkeleton from '../../components/guides/GuidePageSkeleton'
import GuideRating from '../../components/guides/GuideRating'
import GuideStatusBadge from '../../components/guides/GuideStatusBadge'
import GuideToast from '../../components/guides/GuideToast'
import { guideService } from '../../services/guideService'
import { formatCurrency, formatDateRange, isExpired } from '../../utils/guideFormatters'

const acknowledgements = [
  ['details', 'I confirm the trip details are correct.'],
  ['cancellation', 'I accept the guide’s cancellation policy.'],
  ['terms', 'I accept the terms and conditions.'],
  ['contact', 'I confirm my emergency and contact information is current in my profile.'],
]

export default function GuideBookingConfirmationPage() {
  const { requestId, bidId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryGuideId = searchParams.get('guideId')
  const [data, setData] = useState({ loading: true, request: null, bid: null, guide: null, booking: null })
  const [checked, setChecked] = useState({ details: false, cancellation: false, terms: false, contact: false })
  const [processing, setProcessing] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let active = true
    const load = async () => {
      const [request, bid, booking] = await Promise.all([guideService.getRequest(requestId), guideService.getBid(requestId, bidId), guideService.getBooking({ requestId, bidId })])
      const guideId = queryGuideId || bid?.guideId
      const guide = guideId ? await guideService.getGuide(guideId) : null
      if (active) setData({ loading: false, request, bid, guide, booking })
    }
    load().catch((error) => { if (active) { setToast(error.message || 'Booking details could not be loaded.'); setData((current) => ({ ...current, loading: false })) } })
    return () => { active = false }
  }, [requestId, bidId, queryGuideId])

  if (data.loading) return <GuideLayout><h1 className="mb-6 text-3xl font-extrabold">Confirm Your Guide Booking</h1><GuidePageSkeleton cards={3} /></GuideLayout>
  if (!data.request || !data.bid || !data.guide) return <GuideLayout><h1 className="text-3xl font-extrabold">Booking details not found</h1><p className="mt-3 text-sm text-[#627587]">The request, bid or guide is missing. Return to the bids page and select an available guide.</p><Link to={`/guides/requests/${requestId}/bids`} className="guide-button-primary mt-6">Back to bids</Link><GuideToast message={toast} tone="error" onClose={() => setToast('')} /></GuideLayout>

  const expired = isExpired(data.bid.expiresAt)
  const unavailable = data.guide.availability !== 'Available' || data.bid.status !== 'Available'
  const allChecked = acknowledgements.every(([key]) => checked[key])
  const backProfile = `/guides/${data.guide.id}?requestId=${requestId}&bidId=${bidId}`

  const confirm = async () => {
    if (processing || data.booking || expired || unavailable || !allChecked) return
    setProcessing(true)
    try {
      const result = await guideService.confirmBooking({ requestId, bidId, guideId: data.guide.id })
      setData((current) => ({ ...current, booking: result.booking }))
      setToast(result.alreadyConfirmed ? 'This booking was already confirmed.' : 'Guide booking confirmed.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setToast(error.message || 'The booking could not be confirmed.')
    } finally {
      setProcessing(false)
    }
  }

  if (data.booking) return <GuideLayout>
    <section id="booking-result" className="mx-auto max-w-3xl rounded-2xl border border-[#bde2cf] bg-white p-6 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06)] sm:p-10" aria-labelledby="booking-success-title"><CheckCircle2 aria-hidden="true" className="mx-auto h-14 w-14 text-[#2f9b68]" /><GuideStatusBadge status={data.booking.bookingStatus} /><h1 id="booking-success-title" className="mt-4 text-3xl font-extrabold">Booking confirmed</h1><p className="mt-2 text-sm text-[#627587]">Your guide booking has been saved on this device.</p><dl className="mx-auto mt-7 grid max-w-xl gap-4 rounded-xl bg-[#f5f9fc] p-5 text-left sm:grid-cols-2"><div><dt className="text-xs font-bold text-[#718396]">Booking reference</dt><dd className="mt-1 font-extrabold break-all">{data.booking.bookingReference}</dd></div><div><dt className="text-xs font-bold text-[#718396]">Guide</dt><dd className="mt-1 font-extrabold">{data.guide.name}</dd></div><div><dt className="text-xs font-bold text-[#718396]">Trip dates</dt><dd className="mt-1 font-extrabold">{formatDateRange(data.request.startDate, data.request.endDate)}</dd></div><div><dt className="text-xs font-bold text-[#718396]">Total price</dt><dd className="mt-1 font-extrabold text-[#23669e]">{formatCurrency(data.booking.amount, data.booking.currency)}</dd></div><div><dt className="text-xs font-bold text-[#718396]">Booking status</dt><dd className="mt-1 font-extrabold">{data.booking.bookingStatus}</dd></div><div><dt className="text-xs font-bold text-[#718396]">Payment</dt><dd className="mt-1 font-extrabold">{data.booking.paymentStatus}</dd></div></dl><div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => document.getElementById('booking-result')?.scrollIntoView()} className="guide-button-secondary">View booking</button><button type="button" onClick={() => navigate('/guides')} className="guide-button-primary">Return to Marketplace</button></div></section>
    <GuideToast message={toast} tone="success" onClose={() => setToast('')} />
  </GuideLayout>

  return <GuideLayout>
    <div className="flex flex-wrap gap-4"><Link to={backProfile} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-[#2e5c88] focus-visible:outline-2 focus-visible:outline-[#2e5c88]"><ChevronLeft aria-hidden="true" className="h-4 w-4" />Back to profile</Link><Link to={`/guides/requests/${requestId}/bids`} className="inline-flex min-h-11 items-center rounded-lg text-sm font-bold text-[#2e5c88] focus-visible:outline-2 focus-visible:outline-[#2e5c88]">Back to bids</Link></div>
    <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Confirm Your Guide Booking</h1><p className="mt-2 text-sm text-[#627587]">Review the selected guide, trip and bid before confirming.</p>
    {(expired || unavailable) && <div role="alert" className="mt-5 rounded-xl border border-[#f0bbb6] bg-[#fff0ef] p-4 text-sm font-semibold text-[#9e281f]">{expired ? 'This bid has expired and cannot be confirmed.' : 'This guide is currently unavailable and the booking cannot be confirmed.'}</div>}
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"><div className="space-y-6">
      <section className="guide-card" aria-labelledby="selected-guide-title"><h2 id="selected-guide-title" className="text-xl font-extrabold">Selected guide</h2><div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center"><img src={data.guide.image} alt={`${data.guide.name}, tour guide`} className="h-24 w-24 rounded-2xl bg-[#e9f6ff] object-cover" /><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-xl font-extrabold">{data.guide.name}</h3>{data.guide.verified && <BadgeCheck aria-label="Verified guide" className="h-5 w-5 text-[#176eae]" />}</div><div className="mt-2"><GuideRating rating={data.guide.rating} reviewCount={data.guide.reviewCount} /></div><p className="mt-2 inline-flex items-center gap-2 text-sm text-[#627587]"><Languages aria-hidden="true" className="h-4 w-4" />{data.guide.languages.map((item) => item.name).join(', ')}</p><p className="mt-2 text-xs text-[#627587]">{data.guide.specialities.join(' · ')}</p></div></div></section>
      <section className="guide-card" aria-labelledby="trip-details-title"><h2 id="trip-details-title" className="text-xl font-extrabold">Trip details</h2><dl className="mt-4 grid gap-4 sm:grid-cols-2"><div><dt className="detail-term">Route</dt><dd>{data.request.startLocation} to {data.request.destination}</dd></div><div><dt className="detail-term">Dates & time</dt><dd>{formatDateRange(data.request.startDate, data.request.endDate)} · {data.request.startTime}</dd></div><div><dt className="detail-term">Travellers</dt><dd>{data.request.adults} adults · {data.request.children} children</dd></div><div><dt className="detail-term">Additional stops</dt><dd>{data.request.stops?.join(', ') || 'None'}</dd></div><div><dt className="detail-term">Pickup</dt><dd>{data.request.pickupLocation || 'To be arranged'}</dd></div><div><dt className="detail-term">Drop-off</dt><dd>{data.request.dropoffLocation || 'To be arranged'}</dd></div><div className="sm:col-span-2"><dt className="detail-term">Special requirements</dt><dd>{data.request.specialRequirements || 'None provided'}</dd></div></dl></section>
      <section className="guide-card" aria-labelledby="bid-details-title"><h2 id="bid-details-title" className="text-xl font-extrabold">Selected bid</h2><p className="mt-3 text-sm leading-6 text-[#586f82]">{data.bid.proposedItinerary}</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><div><h3 className="text-sm font-extrabold text-[#28704e]">Included</h3><ul className="mt-2 list-inside list-disc text-sm text-[#586f82]">{data.bid.includedServices.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3 className="text-sm font-extrabold text-[#7b5a2c]">Excluded</h3><ul className="mt-2 list-inside list-disc text-sm text-[#586f82]">{data.bid.excludedServices.map((item) => <li key={item}>{item}</li>)}</ul></div></div><h3 className="mt-5 text-sm font-extrabold">Cancellation policy</h3><p className="mt-2 text-sm leading-6 text-[#586f82]">{data.bid.cancellationPolicy}</p></section>
      <fieldset className="guide-card"><legend className="guide-legend">Customer acknowledgement</legend><div className="space-y-3">{acknowledgements.map(([key, label]) => <label key={key} className="flex min-h-12 items-start gap-3 rounded-lg border border-[#dbe5ed] p-3 text-sm font-semibold"><input type="checkbox" checked={checked[key]} onChange={(event) => setChecked((current) => ({ ...current, [key]: event.target.checked }))} className="mt-0.5 h-5 w-5 shrink-0 accent-[#2e5c88]" />{label}</label>)}</div>{!allChecked && <p className="mt-3 text-xs font-medium text-[#9a6112]">All acknowledgements are required before confirmation.</p>}</fieldset>
    </div><aside className="space-y-4"><BookingPriceSummary bid={data.bid} /><button type="button" onClick={confirm} disabled={!allChecked || processing || expired || unavailable} className="guide-button-primary w-full">{processing ? 'Confirming…' : 'Confirm Booking'}</button><p className="text-center text-xs leading-5 text-[#627587]">Confirmation creates a demo booking record. It does not process payment.</p></aside></div>
    <GuideToast message={toast} tone={toast.includes('could not') ? 'error' : 'success'} onClose={() => setToast('')} />
  </GuideLayout>
}
