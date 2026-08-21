import { useMemo, useState } from 'react'
import { FaAward, FaGlobe, FaSearch, FaStar } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { formatPublicGuidePrice, publicGuideCatalog } from '../../data/publicGuideCatalog'

const languages = ['English', 'German', 'Russian', 'Japanese', 'Tamil', 'French', 'Sinhala', 'Arabic', 'Hindi']
const initialFilters = { search: '', languages: [], minRating: 0, verified: false, maxPrice: 30000, sort: 'recommended' }

export default function GuidesCard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, checkingSession } = useAuth()
  const [filters, setFilters] = useState(initialFilters)

  const guides = useMemo(() => {
    const term = filters.search.trim().toLowerCase()
    const results = publicGuideCatalog.filter((guide) => {
      const searchable = [guide.name, guide.title, guide.location, ...guide.languages, ...guide.specialties].join(' ').toLowerCase()
      return (!term || searchable.includes(term))
        && (!filters.languages.length || filters.languages.some((language) => guide.languages.includes(language)))
        && guide.rating >= filters.minRating
        && (!filters.verified || guide.verified)
        && guide.price <= filters.maxPrice
    })
    return [...results].sort((a, b) => {
      if (filters.sort === 'rating') return b.rating - a.rating
      if (filters.sort === 'price-low') return a.price - b.price
      if (filters.sort === 'price-high') return b.price - a.price
      return Number(b.verified) - Number(a.verified) || b.rating - a.rating
    })
  }, [filters])

  const requestGuide = () => {
    if (checkingSession) return
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: '/guides/request', from: `${location.pathname}${location.search}` } })
      return
    }
    navigate('/guides/request')
  }

  const toggleLanguage = (language) => setFilters((current) => ({
    ...current,
    languages: current.languages.includes(language)
      ? current.languages.filter((item) => item !== language)
      : [...current.languages, language],
  }))

  return <div className="min-h-screen bg-[#EBF1FF] p-4 font-sans text-gray-800 sm:p-6">
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 lg:grid-cols-4">
      <aside className="space-y-4 lg:col-span-1">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#1E40AF]"><span aria-hidden="true">◆</span><span>Budget Guardian</span></div>
          <span className="block text-[10px] font-bold tracking-wider text-gray-400">GUIDE BUDGET AVAILABLE</span>
          <div className="mb-4 flex items-baseline space-x-1"><span className="text-2xl font-black text-gray-900">145,000</span><span className="text-xs font-bold text-gray-700">LKR</span></div>
          <div className="mb-4"><div className="mb-1 flex justify-between text-xs font-bold"><span className="text-gray-500">Trip Progress</span><span className="text-[#1E40AF]">65% Used</span></div><div className="h-2 w-full rounded-full bg-gray-100"><div className="h-2 w-[65%] rounded-full bg-[#1E40AF]" /></div></div>
          <button type="button" className="w-full rounded-xl border-2 border-[#1E40AF] py-2.5 text-xs font-bold uppercase tracking-wider text-[#1E40AF] hover:bg-blue-50">Manage Budget</button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-bold text-gray-900">Filters</h2><button type="button" onClick={() => setFilters(initialFilters)} className="text-xs font-bold text-blue-600 hover:underline">Reset</button></div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Search
            <span className="relative mt-2 block"><FaSearch aria-hidden="true" className="absolute left-3 top-3.5 text-xs text-gray-400" /><input type="search" value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="Name, place or speciality" className="min-h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-xs font-medium text-gray-700" /></span>
          </label>
          <div className="mt-5"><label htmlFor="guide-price" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Maximum price: {formatPublicGuidePrice(filters.maxPrice)} LKR</label><input id="guide-price" type="range" min="3000" max="30000" step="500" value={filters.maxPrice} onChange={(event) => setFilters((current) => ({ ...current, maxPrice: Number(event.target.value) }))} className="mt-3 w-full accent-blue-600" /><div className="flex justify-between text-xs font-bold text-gray-400"><span>3k</span><span>30k</span></div></div>
          <fieldset className="mt-5"><legend className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Languages</legend><div className="mt-3 grid grid-cols-2 gap-2">{languages.map((language) => <label key={language} className="flex cursor-pointer items-center space-x-2 text-xs font-medium text-gray-600"><input type="checkbox" checked={filters.languages.includes(language)} onChange={() => toggleLanguage(language)} className="h-4 w-4 rounded accent-blue-600" /><span>{language}</span></label>)}</div></fieldset>
          <label className="mt-5 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Minimum rating<select value={filters.minRating} onChange={(event) => setFilters((current) => ({ ...current, minRating: Number(event.target.value) }))} className="mt-2 min-h-10 w-full rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700"><option value="0">Any rating</option><option value="4.8">4.8+</option><option value="4.9">4.9+</option><option value="5">5.0</option></select></label>
          <label className="mt-4 flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-600"><input type="checkbox" checked={filters.verified} onChange={(event) => setFilters((current) => ({ ...current, verified: event.target.checked }))} className="h-4 w-4 accent-blue-600" />SLTDA certified only</label>
        </div>
      </aside>

      <section className="space-y-6 lg:col-span-3" aria-labelledby="public-guides-title">
        <div className="relative flex min-h-56 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] p-6 text-white shadow-sm md:flex-row md:items-center md:p-8">
          <div className="z-10 max-w-md pr-4"><h1 id="public-guides-title" className="mb-2 text-2xl font-extrabold tracking-tight md:text-3xl">Expert Tour Guides For You</h1><p className="mb-6 text-xs leading-relaxed text-blue-100">Transform your journey with certified local experts, historians, and multi-lingual guides approved by SV Guide.</p><button type="button" onClick={requestGuide} disabled={checkingSession} className="rounded-xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-md disabled:opacity-60">{checkingSession ? 'Checking session...' : 'Request a guide →'}</button></div>
          <div aria-hidden="true" className="absolute bottom-0 right-[-2rem] top-0 hidden items-center text-[10rem] font-black text-white/10 md:flex">GUIDE</div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex space-x-2 text-xs font-bold"><button type="button" className="rounded-xl bg-blue-600 px-5 py-2.5 text-white shadow-sm">All Guides</button><button type="button" onClick={requestGuide} disabled={checkingSession} className="rounded-xl border border-gray-100 bg-white px-5 py-2.5 text-gray-500 hover:bg-gray-50 disabled:opacity-60">Custom Offers</button></div><div className="flex items-center gap-3"><span className="text-xs font-bold text-gray-500">{guides.length} packages</span><select aria-label="Sort guides" value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))} className="min-h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600"><option value="recommended">Recommended</option><option value="rating">Highest rating</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div></div>

        {guides.length ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{guides.map((guide) => <article key={guide.id} className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
          <div className="relative h-52 bg-gray-50"><img src={guide.image} alt={guide.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /><div className="absolute bottom-3 left-3 flex flex-wrap gap-1">{guide.verified && <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white shadow-sm">SLTDA Certified</span>}{guide.online && <span className="rounded bg-green-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white shadow-sm">Available</span>}{guide.badge && <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white shadow-sm">{guide.badge}</span>}</div><div className="absolute right-3 top-3 flex items-center space-x-1 rounded-lg bg-white/95 px-2 py-0.5 shadow-sm"><FaStar className="text-xs text-amber-400" /><span className="text-xs font-black text-gray-800">{guide.rating.toFixed(1)}</span></div></div>
          <div className="flex flex-1 flex-col justify-between p-4"><div className="mb-4"><div className="mb-1 flex items-start justify-between gap-2"><h2 className="text-base font-bold text-gray-900">{guide.name}</h2><div className="shrink-0 text-right"><span className="text-lg font-black text-blue-600">{formatPublicGuidePrice(guide.price)}</span><span className="ml-0.5 text-[10px] font-bold text-gray-400">/{guide.priceUnit}</span></div></div><p className="mb-3 flex items-center text-xs font-semibold text-gray-500"><FaAward className="mr-1 shrink-0 text-blue-500" />{guide.title}</p><div className="mb-3 flex items-center text-[11px] font-medium text-gray-400"><FaGlobe className="mr-1.5 shrink-0" /><span className="truncate">{guide.languages.join(', ')}</span></div><hr className="my-2 border-gray-100" /><div className="mt-2 flex flex-wrap gap-1">{guide.specialties.map((speciality) => <span key={speciality} className="rounded-md bg-blue-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-600">{speciality}</span>)}</div></div>
            <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => navigate(`/guides/catalog/${guide.id}`)} className="rounded-xl border border-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-50">View details</button><button type="button" onClick={requestGuide} disabled={checkingSession} className="rounded-xl bg-[#2563EB] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#1D4ED8] disabled:opacity-60">Hire Guide</button></div>
          </div>
        </article>)}</div> : <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm"><h2 className="font-bold text-gray-900">No guide packages match these filters</h2><p className="mt-2 text-sm text-gray-500">Try a different search, language, rating, or price.</p><button type="button" onClick={() => setFilters(initialFilters)} className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold uppercase text-white">Reset filters</button></div>}
      </section>
    </div>
  </div>
}
