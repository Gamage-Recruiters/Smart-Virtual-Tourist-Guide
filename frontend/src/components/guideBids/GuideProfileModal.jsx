import { BriefcaseBusiness, Star } from 'lucide-react'
import ModalShell from './ModalShell'

export default function GuideProfileModal({ guide, onClose }) {
  const titleId = `profile-${guide.id}-title`

  return (
    <ModalShell titleId={titleId} onClose={onClose} size="max-w-xl">
      <div className="pr-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2185cf]">Guide profile</p>
        <h2 id={titleId} className="mt-1 text-2xl font-extrabold text-[#102538]">
          Meet your local guide
        </h2>
      </div>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
        <img
          src={guide.image}
          alt={`${guide.name}, tour guide`}
          className="h-28 w-28 shrink-0 rounded-full border-4 border-[#e7f5ff] bg-[#e9f6ff] object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-[#102538]">{guide.name}</h3>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#df8b0a]">
              <Star aria-hidden="true" className="h-4 w-4 fill-current" />
              {guide.rating.toFixed(1)} ({guide.reviews} reviews)
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-[#63788a]">
              <BriefcaseBusiness aria-hidden="true" className="h-4 w-4 text-[#4085bb]" />
              {guide.experience}+ years experience
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-bold text-[#18364d]">Specialities</h4>
        <ul className="mt-2 flex flex-wrap gap-2">
          {guide.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full bg-[#edf7ff] px-3 py-1.5 text-xs font-bold text-[#2779b8]"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-2xl bg-[#f6fafd] p-4">
        <h4 className="text-sm font-bold text-[#18364d]">About {guide.name.split(' ')[0]}</h4>
        <p className="mt-2 text-sm leading-6 text-[#617587]">{guide.description}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-full bg-[#0787f6] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#006dcc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
      >
        Close profile
      </button>
    </ModalShell>
  )
}
