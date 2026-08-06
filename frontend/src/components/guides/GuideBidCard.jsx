import { BadgeCheck, BriefcaseBusiness, Check, Clock3, Languages, Star } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/guideFormatters'

export default function GuideBidCard({ guide, bid, compared, onCompare, onViewProfile, onSelectGuide, selectionDisabled }) {
  return (
    <article className="rounded-2xl border border-[#dfe8ef] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(25,77,120,0.1)] sm:p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row">
          <img src={guide.image} alt={`${guide.name}, verified tour guide`} onError={(event) => { event.currentTarget.hidden = true }} className="h-20 w-20 shrink-0 rounded-full border-2 border-white bg-[#e9f6ff] object-cover shadow-sm" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-extrabold break-words">{guide.name}</h2>{guide.verified && <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f4ff] px-2 py-1 text-[11px] font-bold text-[#176eae]"><BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />Verified</span>}</div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#627587]"><span className="inline-flex items-center gap-1 font-bold text-[#b46900]"><Star aria-hidden="true" className="h-4 w-4 fill-current" />{guide.rating.toFixed(1)} <span className="font-normal text-[#718396]">({guide.reviewCount} reviews)</span></span><span className="inline-flex items-center gap-1"><BriefcaseBusiness aria-hidden="true" className="h-4 w-4" />{guide.experienceYears} years</span><span className="inline-flex items-center gap-1"><Languages aria-hidden="true" className="h-4 w-4" />{guide.languages.map((item) => item.name).join(', ')}</span></div>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${guide.name}'s specialities`}>{guide.specialities.map((item) => <li key={item} className="rounded-full bg-[#edf7ff] px-2.5 py-1 text-[11px] font-bold text-[#3279ae]">{item}</li>)}</ul>
            <p className="mt-3 text-sm leading-6 text-[#586f82]">{guide.bio}</p>
            <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2"><div className="rounded-lg bg-[#f6f9fc] p-3"><strong className="block text-[#29465d]">Proposed itinerary</strong><span className="mt-1 block leading-5 text-[#64798b]">{bid.proposedItinerary}</span></div><div className="rounded-lg bg-[#f6f9fc] p-3"><strong className="block text-[#29465d]">Services</strong><span className="mt-1 block leading-5 text-[#28704e]">Includes: {bid.includedServices.join(', ')}</span><span className="mt-1 block leading-5 text-[#7b5a2c]">Excludes: {bid.excludedServices.join(', ')}</span></div></div>
          </div>
        </div>
        <div className="border-t border-[#edf2f6] pt-4 xl:w-[250px] xl:shrink-0 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
          <div className="flex flex-wrap items-center justify-between gap-2 xl:block xl:text-right"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8497a8]">Total bid</p><p className="text-2xl font-extrabold text-[#23669e]">{formatCurrency(bid.amount, bid.currency)}</p></div><span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${guide.availability === 'Available' ? 'bg-[#e6f8ef] text-[#18794e]' : 'bg-[#feeceb] text-[#b42318]'}`}>{guide.availability}</span></div>
          <p className="mt-3 inline-flex items-center gap-1 text-xs text-[#6c7f8f] xl:justify-end"><Clock3 aria-hidden="true" className="h-3.5 w-3.5" />{guide.responseTime}</p>
          <p className="mt-1 text-xs text-[#6c7f8f]">Bid expires {formatDate(bid.expiresAt.slice(0, 10))}</p>
          <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-[#dbe5ed] px-3 text-sm font-bold xl:justify-center"><input type="checkbox" checked={compared} onChange={onCompare} className="h-4 w-4 accent-[#2e5c88]" />Compare</label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-1"><button type="button" onClick={onViewProfile} className="guide-button-secondary">View profile</button><button type="button" onClick={onSelectGuide} disabled={selectionDisabled} className="guide-button-primary"><Check aria-hidden="true" className="h-4 w-4" />Select guide</button></div>
        </div>
      </div>
    </article>
  )
}
