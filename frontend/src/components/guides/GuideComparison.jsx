import { X } from 'lucide-react'
import ModalShell from '../guideBids/ModalShell'
import { formatCurrency } from '../../utils/guideFormatters'

export default function GuideComparison({ items, onRemove, onClose }) {
  return (
    <ModalShell titleId="guide-comparison-title" onClose={onClose} size="max-w-5xl">
      <div className="pr-9"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#2e5c88]">Side-by-side view</p><h2 id="guide-comparison-title" className="mt-1 text-2xl font-extrabold">Compare guides</h2></div>
      <div className="mt-6 overflow-x-auto">
        <div className="grid min-w-[620px] gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(190px, 1fr))` }}>
          {items.map(({ guide, bid }) => (
            <article key={guide.id} className="rounded-xl border border-[#dfe8ef] p-4">
              <button type="button" onClick={() => onRemove(guide.id)} aria-label={`Remove ${guide.name} from comparison`} className="float-right grid h-9 w-9 place-items-center rounded-lg hover:bg-[#f2f6f9] focus-visible:outline-2 focus-visible:outline-[#2e5c88]"><X aria-hidden="true" className="h-4 w-4" /></button>
              <img src={guide.image} alt="" className="h-16 w-16 rounded-full bg-[#e9f6ff] object-cover" />
              <h3 className="mt-3 font-extrabold">{guide.name}</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div><dt className="text-xs font-bold text-[#718396]">Rating & reviews</dt><dd>{guide.rating.toFixed(1)} · {guide.reviewCount} reviews</dd></div>
                <div><dt className="text-xs font-bold text-[#718396]">Experience</dt><dd>{guide.experienceYears} years</dd></div>
                <div><dt className="text-xs font-bold text-[#718396]">Languages</dt><dd>{guide.languages.map((item) => item.name).join(', ')}</dd></div>
                <div><dt className="text-xs font-bold text-[#718396]">Specialities</dt><dd>{guide.specialities.join(', ')}</dd></div>
                <div><dt className="text-xs font-bold text-[#718396]">Bid</dt><dd className="font-extrabold text-[#23669e]">{formatCurrency(bid.amount, bid.currency)}</dd></div>
                <div><dt className="text-xs font-bold text-[#718396]">Included</dt><dd>{bid.includedServices.join(', ')}</dd></div>
                <div><dt className="text-xs font-bold text-[#718396]">Availability</dt><dd>{guide.availability}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </ModalShell>
  )
}
