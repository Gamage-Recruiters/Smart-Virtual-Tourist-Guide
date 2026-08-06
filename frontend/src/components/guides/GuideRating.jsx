import { Star } from 'lucide-react'

export default function GuideRating({ rating = 0, reviewCount, size = 'sm' }) {
  const normalized = Number.isFinite(Number(rating)) ? Number(rating) : 0
  return (
    <span className={`inline-flex items-center gap-1 font-semibold text-[#be7100] ${size === 'lg' ? 'text-base' : 'text-xs'}`}>
      <Star aria-hidden="true" className={`${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} fill-current`} />
      {normalized.toFixed(1)}
      {Number.isFinite(Number(reviewCount)) && (
        <span className="font-normal text-[#66788a]">({reviewCount} reviews)</span>
      )}
    </span>
  )
}
