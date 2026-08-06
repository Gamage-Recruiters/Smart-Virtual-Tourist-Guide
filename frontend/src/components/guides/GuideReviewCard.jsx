import GuideRating from './GuideRating'
import { formatDate } from '../../utils/guideFormatters'

export default function GuideReviewCard({ review }) {
  return (
    <article className="rounded-xl border border-[#dfe8ef] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-extrabold">{review.reviewerName}</h3><p className="text-xs text-[#718396]">{formatDate(review.date)}</p></div><GuideRating rating={review.rating} /></div>
      <p className="mt-3 text-sm leading-6 text-[#586f82]">{review.content}</p>
    </article>
  )
}
