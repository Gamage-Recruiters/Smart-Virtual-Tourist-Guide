import { useEffect, useState } from 'react'
import { BadgeCheck, BriefcaseBusiness, Check, ChevronLeft, Clock3, Languages, MapPin } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import GuideLayout from '../../components/guides/GuideLayout'
import GuidePageSkeleton from '../../components/guides/GuidePageSkeleton'
import GuideRating from '../../components/guides/GuideRating'
import GuideReviewCard from '../../components/guides/GuideReviewCard'
import GuideStatusBadge from '../../components/guides/GuideStatusBadge'
import { guideService } from '../../services/guideService'
import { formatCurrency, formatDate } from '../../utils/guideFormatters'

export default function GuideProfilePage() {
  const { guideId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const requestId = searchParams.get('requestId')
  const bidId = searchParams.get('bidId')
  const [data, setData] = useState({ guide: undefined, bid: null })

  useEffect(() => {
    let active = true
    Promise.all([guideService.getGuide(guideId), requestId && bidId ? guideService.getBid(requestId, bidId) : null]).then(([guide, bid]) => {
      if (active) setData({ guide, bid })
    })
    return () => { active = false }
  }, [guideId, requestId, bidId])

  if (data.guide === undefined) return <GuideLayout><h1 className="mb-6 text-3xl font-extrabold">Guide profile</h1><GuidePageSkeleton cards={2} /></GuideLayout>
  if (!data.guide) return <GuideLayout><h1 className="text-3xl font-extrabold">Guide not found</h1><p className="mt-3 text-sm text-[#627587]">The guide profile link is invalid or this profile is no longer available.</p><Link className="guide-button-primary mt-6" to={requestId ? `/guides/requests/${requestId}/bids` : '/guides/request'}>Return to guide search</Link></GuideLayout>

  const { guide, bid } = data
  const selectGuide = () => {
    if (requestId && bid?.id) navigate(`/guides/requests/${requestId}/confirm/${bid.id}?guideId=${guide.id}`)
  }

  return <GuideLayout>
    <Link to={requestId ? `/guides/requests/${requestId}/bids` : '/guide-bids'} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-[#2e5c88] focus-visible:outline-2 focus-visible:outline-[#2e5c88]"><ChevronLeft aria-hidden="true" className="h-4 w-4" />Back to bids</Link>
    <header className="mt-3 rounded-2xl border border-[#dfe8ef] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] sm:p-7">
      <div className="flex flex-col gap-6 md:flex-row md:items-center"><img src={guide.image} alt={`${guide.name}, verified tour guide`} className="h-36 w-36 rounded-2xl bg-[#e9f6ff] object-cover" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="text-3xl font-extrabold break-words">{guide.name}</h1>{guide.verified && <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f4ff] px-3 py-1 text-xs font-bold text-[#176eae]"><BadgeCheck aria-hidden="true" className="h-4 w-4" />Verified</span>}</div><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#627587]"><GuideRating rating={guide.rating} reviewCount={guide.reviewCount} size="lg" /><span className="inline-flex items-center gap-1"><MapPin aria-hidden="true" className="h-4 w-4" />{guide.location}</span><span className="inline-flex items-center gap-1"><BriefcaseBusiness aria-hidden="true" className="h-4 w-4" />{guide.experienceYears} years</span><span className="inline-flex items-center gap-1"><Clock3 aria-hidden="true" className="h-4 w-4" />{guide.responseTime}</span></div><div className="mt-4 flex flex-wrap items-center gap-3"><GuideStatusBadge status={guide.availability} /><span className="text-xs font-semibold text-[#4b667b]">{guide.profileCompletion}</span></div></div></div>
    </header>

    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]"><div className="space-y-6">
      <section className="guide-card" aria-labelledby="about-guide"><h2 id="about-guide" className="text-xl font-extrabold">About</h2><p className="mt-3 text-sm leading-7 text-[#586f82]">{guide.bio}</p><dl className="mt-5 grid gap-4 sm:grid-cols-2"><div><dt className="text-xs font-bold uppercase tracking-wide text-[#718396]">Tour style</dt><dd className="mt-1 text-sm leading-6">{guide.tourStyle}</dd></div><div><dt className="text-xs font-bold uppercase tracking-wide text-[#718396]">Local knowledge</dt><dd className="mt-1 text-sm leading-6">{guide.localKnowledge}</dd></div></dl></section>
      <section className="guide-card" aria-labelledby="experience-guide"><h2 id="experience-guide" className="text-xl font-extrabold">Experience & qualifications</h2><dl className="mt-4 grid gap-4 sm:grid-cols-3"><div><dt className="text-xs font-bold text-[#718396]">Experience</dt><dd className="mt-1 text-lg font-extrabold">{guide.experienceYears} years</dd></div><div><dt className="text-xs font-bold text-[#718396]">Completed tours</dt><dd className="mt-1 text-lg font-extrabold">{guide.completedTours}</dd></div><div><dt className="text-xs font-bold text-[#718396]">Areas covered</dt><dd className="mt-1 text-sm">{guide.areasCovered.join(', ')}</dd></div></dl><div className="mt-5 grid gap-4 sm:grid-cols-2"><div><h3 className="text-sm font-extrabold">Qualifications</h3><ul className="mt-2 space-y-2 text-sm text-[#586f82]">{guide.qualifications.map((item) => <li key={item} className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#27855d]" />{item}</li>)}</ul></div><div><h3 className="text-sm font-extrabold">Certifications</h3><ul className="mt-2 space-y-2 text-sm text-[#586f82]">{guide.certifications.map((item) => <li key={item} className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#27855d]" />{item}</li>)}</ul></div></div></section>
      <section className="guide-card" aria-labelledby="languages-guide"><h2 id="languages-guide" className="text-xl font-extrabold">Languages & specialities</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{guide.languages.map((language) => <div key={language.name} className="rounded-lg bg-[#f5f9fc] p-3"><strong className="inline-flex items-center gap-2"><Languages aria-hidden="true" className="h-4 w-4 text-[#2e5c88]" />{language.name}</strong><p className="mt-1 text-xs text-[#627587]">{language.proficiency}</p></div>)}</div><ul className="mt-4 flex flex-wrap gap-2">{guide.specialities.map((item) => <li key={item} className="rounded-full bg-[#edf7ff] px-3 py-1.5 text-xs font-bold text-[#2779b8]">{item}</li>)}</ul></section>
      <section className="guide-card" aria-labelledby="guide-reviews"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 id="guide-reviews" className="text-xl font-extrabold">Traveller reviews</h2><p className="mt-1 text-sm text-[#627587]">Based on {guide.reviewCount} verified tour reviews</p></div><GuideRating rating={guide.rating} reviewCount={guide.reviewCount} size="lg" /></div><div className="mt-5 space-y-3">{guide.reviews.length ? guide.reviews.map((review) => <GuideReviewCard key={review.id} review={review} />) : <p className="rounded-lg bg-[#f5f9fc] p-4 text-sm text-[#627587]">This guide has no reviews yet.</p>}</div></section>
    </div><aside className="space-y-5">
      <section className="guide-card lg:sticky lg:top-24"><h2 className="text-lg font-extrabold">Current bid</h2>{bid ? <><p className="mt-3 text-3xl font-extrabold text-[#23669e]">{formatCurrency(bid.amount, bid.currency)}</p><p className="mt-2 text-xs text-[#627587]">Expires {formatDate(bid.expiresAt.slice(0, 10))}</p><h3 className="mt-5 text-sm font-extrabold">Included services</h3><ul className="mt-2 space-y-2 text-sm text-[#586f82]">{bid.includedServices.map((item) => <li key={item} className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#27855d]" />{item}</li>)}</ul><h3 className="mt-5 text-sm font-extrabold">Proposed schedule</h3><p className="mt-2 text-sm leading-6 text-[#586f82]">{bid.proposedItinerary}</p><h3 className="mt-5 text-sm font-extrabold">Cancellation policy</h3><p className="mt-2 text-xs leading-5 text-[#627587]">{bid.cancellationPolicy}</p><button type="button" onClick={selectGuide} disabled={guide.availability !== 'Available'} className="guide-button-primary mt-6 w-full">Select guide</button></> : <p className="mt-3 text-sm leading-6 text-[#627587]">Open this profile from a guide request to review and select the current bid.</p>}</section>
    </aside></div>
  </GuideLayout>
}
