import { BadgeCheck, ChevronLeft, Languages, MapPin, Star } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import GuideLayout from '../../components/guides/GuideLayout'
import { useAuth } from '../../context/AuthContext'
import { findPublicGuide, formatPublicGuidePrice } from '../../data/publicGuideCatalog'

export default function PublicGuideCatalogPage() {
  const { catalogId } = useParams()
  const guide = findPublicGuide(catalogId)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, checkingSession } = useAuth()

  if (!guide) return <GuideLayout>
    <h1 className="text-3xl font-extrabold">Guide package not found</h1>
    <p className="mt-3 text-sm text-[#627587]">This public package link is invalid or no longer available.</p>
    <Link className="guide-button-primary mt-6" to="/guides">Browse guide packages</Link>
  </GuideLayout>

  const requestGuide = () => {
    if (checkingSession) return
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: '/guides/request', from: `${location.pathname}${location.search}` } })
      return
    }
    navigate('/guides/request')
  }

  return <GuideLayout>
    <Link to="/guides" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-[#2e5c88]"><ChevronLeft aria-hidden="true" className="h-4 w-4" />Back to guide marketplace</Link>
    <article className="mt-3 overflow-hidden rounded-2xl border border-[#dfe8ef] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
      <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <img src={guide.image} alt={guide.name} className="h-72 w-full object-cover md:h-full md:min-h-[460px]" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-3xl font-extrabold">{guide.name}</h1>{guide.verified && <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f4ff] px-3 py-1 text-xs font-bold text-[#176eae]"><BadgeCheck aria-hidden="true" className="h-4 w-4" />SLTDA Certified</span>}</div>
          <p className="mt-2 font-bold text-[#48677f]">{guide.title}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#627587]"><span className="inline-flex items-center gap-1 font-bold text-[#b46900]"><Star aria-hidden="true" className="h-4 w-4 fill-current" />{guide.rating.toFixed(1)}</span><span className="inline-flex items-center gap-1"><MapPin aria-hidden="true" className="h-4 w-4" />{guide.location}</span><span className="inline-flex items-center gap-1"><Languages aria-hidden="true" className="h-4 w-4" />{guide.languages.join(', ')}</span></div>
          <p className="mt-6 text-sm leading-7 text-[#586f82]">{guide.description}</p>
          <section className="mt-6" aria-labelledby="package-specialties"><h2 id="package-specialties" className="text-sm font-extrabold uppercase tracking-wide text-[#718396]">Specialities</h2><ul className="mt-3 flex flex-wrap gap-2">{guide.specialties.map((item) => <li key={item} className="rounded-full bg-[#edf7ff] px-3 py-1.5 text-xs font-bold text-[#2779b8]">{item}</li>)}</ul></section>
          <div className="mt-8 rounded-xl bg-[#f5f9fc] p-5"><p className="text-xs font-bold uppercase tracking-wide text-[#718396]">Public package rate</p><p className="mt-1 text-3xl font-extrabold text-blue-700">{formatPublicGuidePrice(guide.price)} <span className="text-sm text-[#627587]">LKR / {guide.priceUnit}</span></p><p className="mt-2 text-xs leading-5 text-[#627587]">Final availability, itinerary, and price are confirmed through a real guide request and bid.</p></div>
          <button type="button" onClick={requestGuide} disabled={checkingSession} className="guide-button-primary mt-6 w-full">{checkingSession ? 'Checking session...' : 'Request this guide'}</button>
        </div>
      </div>
    </article>
  </GuideLayout>
}
