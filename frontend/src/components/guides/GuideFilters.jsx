import { Filter, RotateCcw, Search } from 'lucide-react'
import ModalShell from '../guideBids/ModalShell'

const fieldClass = 'min-h-11 w-full rounded-lg border border-[#cddbe6] bg-white px-3 text-sm text-[#243f54] outline-none transition focus:border-[#2e5c88] focus:ring-2 focus:ring-[#cde6fa]'

export default function GuideFilters({ filters, onChange, onReset, mobileOpen, onClose }) {
  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="guide-filter-title" className="inline-flex items-center gap-2 text-base font-extrabold"><Filter aria-hidden="true" className="h-4 w-4" />Filters</h2>
      </div>
      <label className="block text-xs font-bold">Guide name
        <span className="relative mt-1 block"><Search aria-hidden="true" className="absolute left-3 top-3.5 h-4 w-4 text-[#7990a2]" /><input className={`${fieldClass} pl-9`} type="search" value={filters.search} onChange={(event) => onChange('search', event.target.value)} placeholder="Search guides" /></span>
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs font-bold">Min price<input className={`${fieldClass} mt-1`} type="number" min="0" value={filters.minPrice} onChange={(event) => onChange('minPrice', event.target.value)} /></label>
        <label className="text-xs font-bold">Max price<input className={`${fieldClass} mt-1`} type="number" min="0" value={filters.maxPrice} onChange={(event) => onChange('maxPrice', event.target.value)} /></label>
      </div>
      <label className="block text-xs font-bold">Minimum rating<select className={`${fieldClass} mt-1`} value={filters.rating} onChange={(event) => onChange('rating', event.target.value)}><option value="">Any rating</option><option value="4.5">4.5+</option><option value="4.8">4.8+</option><option value="4.9">4.9+</option></select></label>
      <label className="block text-xs font-bold">Language<select className={`${fieldClass} mt-1`} value={filters.language} onChange={(event) => onChange('language', event.target.value)}><option value="">Any language</option><option>English</option><option>Sinhala</option><option>Tamil</option><option>French</option><option>German</option></select></label>
      <label className="block text-xs font-bold">Experience<select className={`${fieldClass} mt-1`} value={filters.experience} onChange={(event) => onChange('experience', event.target.value)}><option value="">Any experience</option><option value="5">5+ years</option><option value="8">8+ years</option><option value="10">10+ years</option></select></label>
      <label className="block text-xs font-bold">Speciality<select className={`${fieldClass} mt-1`} value={filters.speciality} onChange={(event) => onChange('speciality', event.target.value)}><option value="">Any speciality</option><option>Historical tours</option><option>Cultural tours</option><option>Wildlife and nature</option><option>Adventure</option><option>Photography</option><option>Food tours</option><option>Family-friendly tours</option><option>Accessibility assistance</option></select></label>
      <label className="block text-xs font-bold">Availability<select className={`${fieldClass} mt-1`} value={filters.availability} onChange={(event) => onChange('availability', event.target.value)}><option value="">Any status</option><option>Available</option><option>Unavailable</option></select></label>
      <label className="flex min-h-11 items-center gap-3 rounded-lg border border-[#dbe5ed] px-3 text-sm font-semibold"><input type="checkbox" checked={filters.verifiedOnly} onChange={(event) => onChange('verifiedOnly', event.target.checked)} className="h-4 w-4 accent-[#2e5c88]" />Verified guides only</label>
      <button type="button" onClick={onReset} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#aebfcd] text-sm font-bold text-[#36566f] hover:bg-[#f3f7fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e5c88]"><RotateCcw aria-hidden="true" className="h-4 w-4" />Reset filters</button>
    </div>
  )

  return <>
    <aside className="hidden rounded-2xl border border-[#dfe8ef] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] lg:block">{content}</aside>
    {mobileOpen && <div className="lg:hidden"><ModalShell titleId="guide-filter-title" onClose={onClose} size="max-w-md">{content}</ModalShell></div>}
  </>
}
