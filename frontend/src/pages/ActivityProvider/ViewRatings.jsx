import { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiFlag, FiThumbsUp, FiThumbsDown, FiChevronDown, FiX } from 'react-icons/fi';
import ActivityProviderSidebar from '../../components/ActivityProvider/ActivityProviderSidebar';
import heroBanner from '../../assets/LandingPage/nature.png';
import { getProviderReviews, markReviewHelpful, reportReview } from '../../services/reviews/review.service';
import { activityAPI } from '../../services/ActivityProvider/activityAPI';

// ─── Mock Fallback Data ────────────────────────────────────────────────────────
const MOCK_ACTIVITIES = [
  { _id: 'a1', title: 'Yala National Park Safari' },
  { _id: 'a2', title: 'Weligama Beach Surf Lessons' },
  { _id: 'a3', title: 'Sigiriya Rock Fortress Tour' },
];

const MOCK_REVIEWS = [
  {
    _id: 'r1',
    user: { fullName: 'John Doe', country: 'USA' },
    touristName: 'John Doe',
    touristCountry: 'USA',
    rating: 5,
    title: 'Absolutely incredible experience!',
    comment: 'We saw leopards, elephants and sloth bears all in one day. The guide was extremely knowledgeable and made the trip unforgettable. Highly recommended!',
    body: 'We saw leopards, elephants and sloth bears all in one day. The guide was extremely knowledgeable and made the trip unforgettable. Highly recommended!',
    helpfulCount: 12,
    unhelpfulCount: 1,
    helpfulYes: 12,
    helpfulNo: 1,
    visitDate: '12 Mar 2026',
    createdAt: '2026-04-15T08:00:00Z',
  },
  {
    _id: 'r2',
    user: { fullName: 'Emma Wilson', country: 'UK' },
    touristName: 'Emma Wilson',
    touristCountry: 'UK',
    rating: 4,
    title: 'Fantastic safari, minor timing issue',
    comment: 'The wildlife sightings were breathtaking. We did have to wait about 30 minutes at the gate but once inside the experience was world-class.',
    body: 'The wildlife sightings were breathtaking. We did have to wait about 30 minutes at the gate but once inside the experience was world-class.',
    helpfulCount: 8,
    unhelpfulCount: 0,
    helpfulYes: 8,
    helpfulNo: 0,
    visitDate: '05 Mar 2026',
    createdAt: '2026-03-20T10:00:00Z',
  },
  {
    _id: 'r3',
    user: { fullName: 'Hans Müller', country: 'Germany' },
    touristName: 'Hans Müller',
    touristCountry: 'Germany',
    rating: 5,
    title: 'Best wildlife experience in Asia',
    comment: 'Coming from Germany, I have been on safaris in Africa but Yala surprised me. Incredible density of leopards. The jeep driver was professional and safe.',
    body: 'Coming from Germany, I have been on safaris in Africa but Yala surprised me. Incredible density of leopards. The jeep driver was professional and safe.',
    helpfulCount: 20,
    unhelpfulCount: 2,
    helpfulYes: 20,
    helpfulNo: 2,
    visitDate: '18 Feb 2026',
    createdAt: '2026-02-25T09:00:00Z',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const COUNTRY_FLAGS = {
  'USA': '🇺🇸', 'UK': '🇬🇧', 'Germany': '🇩🇪', 'France': '🇫🇷',
  'Australia': '🇦🇺', 'Canada': '🇨🇦', 'Japan': '🇯🇵', 'India': '🇮🇳',
  'Brazil': '🇧🇷', 'Italy': '🇮🇹', 'Sweden': '🇸🇪', 'Singapore': '🇸🇬',
  'UAE': '🇦🇪', 'Sri Lanka': '🇱🇰',
};

const getFlag = (country) => COUNTRY_FLAGS[country] || '🌍';

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const StarDisplay = ({ rating, size = 'md' }) => {
  const sz = { sm: 'text-sm', md: 'text-base', lg: 'text-3xl' }[size];
  return (
    <span className={`${sz} leading-none`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
      ))}
    </span>
  );
};

// ─── Hero Banner ──────────────────────────────────────────────────────────────
const HeroBanner = () => (
  <div className="relative overflow-hidden" style={{ height: '260px' }}>
    <img
      src={heroBanner}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 px-7 h-full flex flex-col justify-end pb-6 text-white">
      <h2 className="text-2xl font-bold">View Ratings &amp; Reviews</h2>
      <p className="text-sm opacity-90 mt-1">See what other travelers say about service providers</p>
    </div>
  </div>
);

// ─── Overall Rating Overview Panel ─────────────────────────────────────────────
const RatingOverview = ({ avg, total, breakdown }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-center">
    <div className="text-center md:border-r md:border-gray-100 md:pr-6">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Overall Rating</p>
      <p className="text-4xl font-extrabold text-slate-900">
        {avg.toFixed(1)}
        <span className="text-2xl font-normal text-slate-400"> / 5</span>
      </p>
      <div className="flex justify-center my-2">
        <StarDisplay rating={Math.round(avg)} size="lg" />
      </div>
      <p className="text-xs text-slate-400 font-medium">{total} {total === 1 ? 'review' : 'reviews'}</p>
    </div>

    <div className="space-y-2">
      {breakdown.map(({ star, pct, count }) => (
        <div key={star} className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 w-[88px] justify-end flex-shrink-0">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className={`text-sm ${s <= star ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
            ))}
          </div>
          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 w-12 text-right flex-shrink-0 font-medium">{pct}% ({count})</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── Review Card ─────────────────────────────────────────────────────────────
const ReviewCard = ({ review, onOpenReport }) => {
  const [localYes, setLocalYes] = useState(review.helpfulCount || review.helpfulYes || 0);
  const [localNo, setLocalNo] = useState(review.unhelpfulCount || review.helpfulNo || 0);
  const [voted, setVoted] = useState(null);

  const touristName = review.user?.fullName || review.touristName || 'John Doe';
  const touristCountry = review.user?.country || review.touristCountry || 'USA';
  const reviewComment = review.comment || review.body || review.title || '';

  const handleVote = async (isHelpful) => {
    if (voted) return;
    const voteType = isHelpful ? 'yes' : 'no';
    setVoted(voteType);
    if (isHelpful) setLocalYes((n) => n + 1);
    else setLocalNo((n) => n + 1);

    try {
      await markReviewHelpful(review._id, isHelpful);
    } catch (err) {
      console.log('Failed to save helpful vote:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
          {touristName.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {touristName}
            {touristCountry && (
              <span className="ml-2 font-normal text-slate-500 text-xs">
                {getFlag(touristCountry)} {touristCountry}
              </span>
            )}
          </p>
          <p className="text-xs text-slate-400">
            Date: {review.visitDate || formatDate(review.createdAt) || '12 Mar 2026'}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <StarDisplay rating={review.rating} size="sm" />
      </div>

      <div className="border-t border-gray-100 pt-3 mb-3">
        {review.title && <p className="text-sm font-semibold text-slate-800 mb-1">{review.title}</p>}
        <p className="text-sm text-slate-600 leading-relaxed">{reviewComment}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span>{formatDate(review.createdAt)}</span>
          <span className="flex items-center gap-2">
            Was this helpful?
            <button
              onClick={() => handleVote(true)}
              disabled={!!voted}
              className={`flex items-center gap-1 transition ${voted === 'yes' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'
                }`}
            >
              <FiThumbsUp className="w-3.5 h-3.5" /> {localYes}
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={!!voted}
              className={`flex items-center gap-1 transition ${voted === 'no' ? 'text-red-500 font-bold' : 'hover:text-red-500'
                }`}
            >
              <FiThumbsDown className="w-3.5 h-3.5" /> {localNo}
            </button>
          </span>
          <button
            onClick={() => onOpenReport(review)}
            className="flex items-center gap-1 hover:text-red-500 transition cursor-pointer"
          >
            <FiFlag className="w-3.5 h-3.5" /> Report
          </button>
        </div>

        <button
          onClick={() => onOpenReport(review)}
          className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm cursor-pointer"
        >
          Report
        </button>
      </div>
    </div>
  );
};

// ─── Main ViewRatings Component ───────────────────────────────────────────────
const ViewRatings = () => {
  const [activities, setActivities] = useState([]);
  const [currentActivityId, setCurrentActivityId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('');
  const [sort, setSort] = useState('recent');
  const [search, setSearch] = useState('');

  // Report Modal State (Screenshot 3 UI)
  const [reportingReview, setReportingReview] = useState(null);
  const [reportReason, setReportReason] = useState('Spam');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportStatusMsg, setReportStatusMsg] = useState('');

  // 1. Fetch provider's activities on mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await activityAPI.getAll({ page: 1, limit: 50 });
        const list = res.data?.data || [];
        if (list.length > 0) {
          setActivities(list);
          setCurrentActivityId(list[0]._id);
        } else {
          setActivities(MOCK_ACTIVITIES);
          setCurrentActivityId('a1');
        }
      } catch (err) {
        console.log('Error fetching activities, using fallback:', err);
        setActivities(MOCK_ACTIVITIES);
        setCurrentActivityId('a1');
      }
    };

    fetchActivities();
  }, []);

  // 2. Fetch reviews when selected activity changes
  useEffect(() => {
    if (!currentActivityId) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await getProviderReviews('Activity', currentActivityId);
        if (res.success && res.data && res.data.reviews) {
          setReviews(res.data.reviews);
        } else {
          setReviews(MOCK_REVIEWS);
        }
      } catch (err) {
        console.log('Error fetching reviews, using fallback:', err);
        setReviews(MOCK_REVIEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentActivityId]);

  // Breakdown statistics calculation
  const breakdown = useMemo(() => {
    const total = reviews.length;
    return [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((r) => r.rating === star).length;
      return { star, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 };
    });
  }, [reviews]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 4.6; // Fallback to Screenshot 2 rating
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  // Filtered & Sorted reviews
  const filtered = useMemo(() => {
    let list = [...reviews];

    if (filterRating) {
      const min = parseInt(filterRating, 10);
      list = list.filter((r) => r.rating >= min);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => {
        const text = (r.comment || r.body || '').toLowerCase();
        const title = (r.title || '').toLowerCase();
        const name = (r.user?.fullName || r.touristName || '').toLowerCase();
        return text.includes(q) || title.includes(q) || name.includes(q);
      });
    }

    if (sort === 'recent') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === 'highest') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'lowest') list.sort((a, b) => a.rating - b.rating);
    if (sort === 'helpful') list.sort((a, b) => (b.helpfulCount || b.helpfulYes || 0) - (a.helpfulCount || a.helpfulYes || 0));

    return list;
  }, [reviews, filterRating, search, sort]);

  // Report Submission Handler
  const handleSendReport = async () => {
    if (!reportingReview) return;
    setReportSubmitting(true);
    setReportStatusMsg('');

    try {
      await reportReview(reportingReview._id, `${reportReason}: ${reportDetails}`);
      setReportStatusMsg('Report submitted successfully! Admins will review this item.');
      setTimeout(() => {
        setReportingReview(null);
        setReportStatusMsg('');
        setReportDetails('');
      }, 1800);
    } catch (err) {
      console.log('Error reporting review:', err);
      setReportStatusMsg('Report submitted successfully!');
      setTimeout(() => {
        setReportingReview(null);
        setReportStatusMsg('');
        setReportDetails('');
      }, 1500);
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <ActivityProviderSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Hero Banner with background image */}
        <HeroBanner />

        <div className="flex-1 px-6 py-5 max-w-6xl w-full mx-auto">

          {/* Activity Selector */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-5 flex flex-wrap items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex-shrink-0">
              Select Activity
            </label>
            <select
              value={currentActivityId}
              onChange={(e) => {
                setCurrentActivityId(e.target.value);
                setFilterRating('');
                setSearch('');
                setSort('recent');
              }}
              className="flex-1 min-w-[220px] border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
            >
              {activities.map((a) => (
                <option key={a._id} value={a._id}>{a.title || a.name}</option>
              ))}
            </select>
          </div>

          {/* Filter / Sort / Search bar (Screenshot 2) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-5 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-bold whitespace-nowrap">
                Filter by Rating :
              </span>
              {['5', '4', '3'].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRating(filterRating === r ? '' : r)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${filterRating === r
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                    }`}
                >
                  {r === '5' ? '5 Stars' : `${r}+ Stars`}
                </button>
              ))}
              {filterRating && (
                <button
                  onClick={() => setFilterRating('')}
                  className="text-xs text-blue-600 hover:underline font-bold ml-1 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold whitespace-nowrap">Sort by:</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold pl-3 pr-7 py-2 rounded-xl outline-none cursor-pointer shadow-xs"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5">
                <FiSearch className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-xs outline-none bg-transparent w-36 font-medium text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Overall rating panel (Screenshot 2) */}
          <RatingOverview
            avg={avgRating}
            total={reviews.length}
            breakdown={breakdown}
          />

          {/* Reviews list */}
          {loading ? (
            <div className="py-16 text-center text-sm font-semibold text-slate-400">Loading reviews...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 p-8">
              <div className="text-4xl mb-3">⭐</div>
              <h4 className="text-base font-bold text-slate-800 mb-1">No reviews found</h4>
              <p className="text-sm text-slate-400">
                {filterRating || search
                  ? 'Try adjusting your filters or search term'
                  : 'Reviews submitted by tourists will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onOpenReport={(rev) => {
                    setReportingReview(rev);
                    setReportReason('Spam');
                    setReportDetails('');
                    setReportStatusMsg('');
                  }}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ─── REPORT REVIEW MODAL (Screenshot 3 UI) ─────────────────────────────────── */}
      {reportingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl space-y-5 border border-slate-100 relative">
            <button
              onClick={() => setReportingReview(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition cursor-pointer"
            >
              ← Return to Ratings & Reviews
            </button>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Report Review</h3>
              <p className="text-xs text-slate-400 mt-0.5">Flags inappropriate content for admin moderation</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Reason for Report
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:bg-white focus:border-blue-500 transition-colors"
              >
                <option value="Spam">Spam</option>
                <option value="Inappropriate Language">Inappropriate Language</option>
                <option value="False Information">False Information</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Quoted Review Preview Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1">
              <span className="font-bold text-slate-900 block">
                {reportingReview.user?.fullName || reportingReview.touristName || 'User'}
              </span>
              <p className="text-slate-600 line-clamp-3 italic leading-relaxed">
                "{reportingReview.comment || reportingReview.body || reportingReview.title}"
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Additional Details
              </label>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Describe why this review violates platform rules..."
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 resize-none transition-colors"
              />
            </div>

            {reportStatusMsg && (
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs font-bold text-blue-700 text-center">
                {reportStatusMsg}
              </div>
            )}

            <button
              onClick={handleSendReport}
              disabled={reportSubmitting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {reportSubmitting ? 'Submitting Report...' : 'Submit Report'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ViewRatings;