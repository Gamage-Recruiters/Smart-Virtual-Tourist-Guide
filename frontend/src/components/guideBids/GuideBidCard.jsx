import { BriefcaseBusiness, Check, Quote, Star } from 'lucide-react'

const formatBid = (amount) => `LKR ${amount.toLocaleString('en-US')}`

export default function GuideBidCard({
  guide,
  isSelected,
  onViewProfile,
  onSelectGuide,
}) {
  return (
    <article
      className={`group rounded-2xl border bg-white p-4 shadow-[0_8px_28px_rgba(25,77,120,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(25,77,120,0.09)] sm:p-5 ${
        isSelected ? 'border-[#57a3e9] ring-2 ring-[#d9efff]' : 'border-[#e5edf3]'
      }`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 gap-4">
          <img
            src={guide.image}
            alt={`${guide.name}, tour guide`}
            className="h-16 w-16 shrink-0 rounded-full border-2 border-white bg-[#e9f6ff] object-cover shadow-sm sm:h-[72px] sm:w-[72px]"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="text-base font-bold text-[#102538]">{guide.name}</h2>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#f59d18]">
                <Star aria-hidden="true" className="h-3.5 w-3.5 fill-current" />
                {guide.rating.toFixed(1)}
              </span>
              <span className="text-[11px] text-[#8494a3]">({guide.reviews} reviews)</span>
              <span className="hidden h-3 w-px bg-[#dbe4eb] sm:block" aria-hidden="true" />
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#718396]">
                <BriefcaseBusiness aria-hidden="true" className="h-3.5 w-3.5 text-[#4f86b5]" />
                {guide.experience}+ Years Experience
              </span>
            </div>

            <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`${guide.name}'s skills`}>
              {guide.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded bg-[#edf7ff] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#3279ae]"
                >
                  {skill}
                </li>
              ))}
            </ul>

            <p className="mt-2.5 flex max-w-3xl gap-2 text-xs leading-5 text-[#657789]">
              <Quote aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-[#238ee6] text-[#238ee6]" />
              <span>{guide.description}</span>
            </p>
          </div>
        </div>

        <div className="border-t border-[#edf2f6] pt-4 lg:w-[230px] lg:shrink-0 lg:border-l lg:border-t-0 lg:py-1 lg:pl-6">
          <div className="text-left lg:text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#91a3b3]">Total bid</p>
            <p className="mt-0.5 text-xl font-extrabold tracking-tight text-[#23669e]">
              {formatBid(guide.bid)}
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onViewProfile(guide)}
              className="min-h-10 rounded-full border border-[#1888df] bg-white px-3 text-xs font-bold text-[#1477bf] transition hover:bg-[#edf8ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
            >
              View Profile
            </button>
            <button
              type="button"
              onClick={() => onSelectGuide(guide)}
              disabled={isSelected}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#0787f6] px-3 text-xs font-bold text-white transition hover:bg-[#006dcc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3] disabled:cursor-not-allowed disabled:bg-[#579acc]"
            >
              {isSelected && <Check aria-hidden="true" className="h-3.5 w-3.5" />}
              {isSelected ? 'Selected' : 'Select Guide'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
