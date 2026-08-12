import { useEffect, useState } from 'react'
import { reviewAPI } from '../../services/api'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

/* ─── Star helpers ─── */
const StarIcon = ({ filled, size = 'w-4 h-4' }) => (
  <svg className={`${size} ${filled ? 'text-amber-400' : 'text-slate-200'} shrink-0`} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

const RatingStars = ({ rating, size = 'w-4 h-4' }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled={i <= rating} size={size} />)}
  </div>
)

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now - d
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function ResturentReviewPage() {
  const [restaurantId, setRestaurantId] = useState(null)
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } })
  const [reviews, setReviews] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Reply state
  const [replyingTo, setReplyingTo] = useState(null) // review _id
  const [replyText, setReplyText] = useState('')
  const [replySubmitting, setReplySubmitting] = useState(false)
  const [replyError, setReplyError] = useState('')
  const [replySuccess, setReplySuccess] = useState('')

  // Find this owner's restaurant on mount
  useEffect(() => {
    const findRestaurant = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('restaurantUser') || '{}')
        const token = localStorage.getItem('restaurantToken')
        const res = await fetch(`${API_BASE}/restaurants`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const all = await res.json()
        const matched = Array.isArray(all) ? all.find(r => r.email === user.email) : null
        if (matched) {
          setRestaurantId(matched._id)
        } else {
          setError('Could not find your restaurant. Please set up your restaurant profile first.')
          setLoading(false)
        }
      } catch {
        setError('Failed to load restaurant data.')
        setLoading(false)
      }
    }
    findRestaurant()
  }, [])

  // Fetch reviews when restaurantId is available
  const fetchReviews = async (pageNum = 1, append = false) => {
    if (!restaurantId) return
    setLoading(true)
    setError('')
    try {
      const data = await reviewAPI.getOwnerReviews(restaurantId, pageNum)
      if (data.success) {
        setStats(data.stats)
        if (append) {
          setReviews(prev => [...prev, ...data.reviews])
        } else {
          setReviews(data.reviews)
        }
        setPage(data.page)
        setTotalPages(data.totalPages)
      } else {
        setError(data.message || 'Failed to load reviews.')
      }
    } catch {
      setError('Failed to load reviews. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (restaurantId) fetchReviews(1)
  }, [restaurantId])

  const getBarWidth = (count) => {
    if (stats.totalReviews === 0) return 0
    return (count / stats.totalReviews) * 100
  }

  const openReplyForm = (reviewId, existingReply = '') => {
    setReplyingTo(reviewId)
    setReplyText(existingReply)
    setReplyError('')
    setReplySuccess('')
  }

  const closeReplyForm = () => {
    setReplyingTo(null)
    setReplyText('')
    setReplyError('')
    setReplySuccess('')
  }

  const handleSubmitReply = async (reviewId) => {
    if (!replyText.trim()) {
      setReplyError('Reply cannot be empty.')
      return
    }
    if (replyText.length > 1000) {
      setReplyError('Reply cannot exceed 1000 characters.')
      return
    }

    setReplySubmitting(true)
    setReplyError('')
    try {
      await reviewAPI.replyToReview(reviewId, replyText.trim())
      setReplySuccess('Reply submitted successfully!')
      setTimeout(() => {
        closeReplyForm()
        fetchReviews(1)
      }, 1000)
    } catch (err) {
      setReplyError(err.message || 'Failed to submit reply.')
    } finally {
      setReplySubmitting(false)
    }
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">Reviews</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Customer Reviews</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Monitor feedback from your customers and engage with them through replies.
        </p>
      </header>

      {/* Error */}
      {error && !loading && (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-6 py-4 text-sm text-red-600 font-semibold">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && reviews.length === 0 && !error && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm animate-pulse">
            <div className="flex gap-8 items-start">
              <div className="space-y-3 w-24">
                <div className="h-12 bg-slate-200 rounded w-20" />
                <div className="h-3 bg-slate-200 rounded w-16" />
              </div>
              <div className="flex-1 space-y-2">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-2.5 bg-slate-200 rounded" />)}
              </div>
            </div>
          </div>
          {[1, 2].map(i => (
            <div key={i} className="rounded-2xl bg-white p-6 border border-slate-200 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 bg-slate-200 rounded w-32" />
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {!loading && !error && (
        <>
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Average */}
              <div className="text-center md:text-left shrink-0 md:w-32">
                <div className="text-5xl font-black text-slate-900 leading-none">
                  {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}
                </div>
                <div className="mt-2">
                  <RatingStars rating={Math.round(stats.averageRating)} size="w-4 h-4" />
                </div>
                <p className="mt-1.5 text-xs text-slate-400 font-medium">
                  {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Distribution */}
              <div className="flex-1 w-full space-y-2">
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 w-4 text-right">{star}</span>
                    <StarIcon filled size="w-3.5 h-3.5" />
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${getBarWidth(stats.distribution[star])}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 font-medium w-8 text-right">
                      {stats.distribution[star]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">No Reviews Yet</h3>
              <p className="mt-2 text-sm text-slate-500">
                Your restaurant has no reviews yet. Reviews from tourists will appear here once submitted.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">All Reviews ({stats.totalReviews})</h3>

              {reviews.map(review => (
                <div key={review._id} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow">
                  {/* Review Content */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
                      {getInitials(review.user?.fullName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-sm text-slate-900">
                          {review.user?.fullName || 'Anonymous'}
                        </span>
                        <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
                        {review.user?.email && (
                          <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                            {review.user.email}
                          </span>
                        )}
                      </div>
                      <div className="mt-1"><RatingStars rating={review.rating} size="w-3.5 h-3.5" /></div>
                      <p className="mt-2 text-sm text-slate-700 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>

                  {/* Existing Reply */}
                  {review.restaurantReply && replyingTo !== review._id && (
                    <div className="ml-14 bg-blue-50/60 border border-blue-200/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">Your Reply</span>
                          {review.restaurantReplyDate && (
                            <span className="text-[10px] text-slate-400">{formatDate(review.restaurantReplyDate)}</span>
                          )}
                        </div>
                        <button
                          onClick={() => openReplyForm(review._id, review.restaurantReply)}
                          className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{review.restaurantReply}</p>
                    </div>
                  )}

                  {/* Reply Button / Form */}
                  {replyingTo === review._id ? (
                    <div className="ml-14 bg-white border border-blue-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {review.restaurantReply ? 'Edit Your Reply' : 'Write a Reply'}
                        </span>
                        <button onClick={closeReplyForm} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Thank the customer or address their feedback..."
                        rows={3}
                        maxLength={1000}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white focus:border-blue-400 resize-none transition-colors"
                      />
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] ${replyText.length > 900 ? 'text-amber-600' : 'text-slate-400'}`}>
                          {replyText.length}/1000
                        </span>
                        <div className="flex gap-2">
                          {replyError && (
                            <span className="text-xs text-red-500 font-semibold self-center">{replyError}</span>
                          )}
                          {replySuccess && (
                            <span className="text-xs text-green-600 font-semibold self-center">{replySuccess}</span>
                          )}
                          <button
                            onClick={closeReplyForm}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSubmitReply(review._id)}
                            disabled={replySubmitting}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {replySubmitting ? 'Sending...' : review.restaurantReply ? 'Update Reply' : 'Send Reply'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : !review.restaurantReply && (
                    <div className="ml-14">
                      <button
                        onClick={() => openReplyForm(review._id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                        Reply to this review
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Load More */}
              {page < totalPages && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => fetchReviews(page + 1, true)}
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More Reviews'}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default ResturentReviewPage
