import { useState, useMemo } from 'react';
import { FiSearch, FiFlag, FiThumbsUp, FiThumbsDown, FiChevronDown } from 'react-icons/fi';
import ActivityProviderSidebar from '../../components/ActivityProviderSidebar';
import heroBanner from '../../assets/nature.png';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ACTIVITIES = [
  { _id: 'a1', title: 'Yala National Park Safari' },
  { _id: 'a2', title: 'Weligama Beach Surf Lessons' },
  { _id: 'a3', title: 'Sigiriya Rock Fortress Tour' },
];

const MOCK_REVIEWS = {
  a1: [
    {
      _id: 'r1',
      touristName: 'John Doe',
      touristCountry: 'USA',
      rating: 5,
      title: 'Absolutely incredible experience!',
      body: 'We saw leopards, elephants and sloth bears all in one day. The guide was extremely knowledgeable and made the trip unforgettable. Highly recommended!',
      helpfulYes: 12,
      helpfulNo: 1,
      visitDate: '12 Mar 2026',
      createdAt: '2026-04-15T08:00:00Z',
    },
    {
      _id: 'r2',
      touristName: 'Emma Wilson',
      touristCountry: 'UK',
      rating: 4,
      title: 'Fantastic safari, minor timing issue',
      body: 'The wildlife sightings were breathtaking. We did have to wait about 30 minutes at the gate but once inside the experience was world-class.',
      helpfulYes: 8,
      helpfulNo: 0,
      visitDate: '05 Mar 2026',
      createdAt: '2026-03-20T10:00:00Z',
    },
    {
      _id: 'r3',
      touristName: 'Hans Müller',
      touristCountry: 'Germany',
      rating: 5,
      title: 'Best wildlife experience in Asia',
      body: 'Coming from Germany, I have been on safaris in Africa but Yala surprised me. Incredible density of leopards. The jeep driver was professional and safe.',
      helpfulYes: 20,
      helpfulNo: 2,
      visitDate: '18 Feb 2026',
      createdAt: '2026-02-25T09:00:00Z',
    },
    {
      _id: 'r4',
      touristName: 'Sophie Martin',
      touristCountry: 'France',
      rating: 3,
      title: 'Good but could be better',
      body: 'The park itself is amazing but our group was a bit large. Would have preferred a smaller jeep. Wildlife sightings were still good.',
      helpfulYes: 4,
      helpfulNo: 3,
      visitDate: '10 Feb 2026',
      createdAt: '2026-02-14T11:00:00Z',
    },
    {
      _id: 'r5',
      touristName: 'Carlos Mendez',
      touristCountry: 'Brazil',
      rating: 4,
      title: 'Muito bom! Very good safari',
      body: 'Beautiful national park with amazing biodiversity. We spotted 3 leopards which I heard is very lucky. The sunrise entry was magical.',
      helpfulYes: 9,
      helpfulNo: 1,
      visitDate: '25 Jan 2026',
      createdAt: '2026-01-30T14:00:00Z',
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const COUNTRY_FLAGS = {
  'USA': '🇺🇸', 'UK': '🇬🇧', 'Germany': '🇩🇪', 'France': '🇫🇷',
  'Australia': '🇦🇺', 'Canada': '🇨🇦', 'Japan': '🇯🇵', 'India': '🇮🇳',
  'Brazil': '🇧🇷', 'Italy': '🇮🇹', 'Sweden': '🇸🇪', 'Singapore': '🇸🇬',
  'UAE': '🇦🇪', 'Sri Lanka': '🇱🇰',
};

const getFlag = (country) => COUNTRY_FLAGS[country] || '🌍';

const formatDate = (iso) => {
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
  <div className="relative overflow-hidden" style={{ height: '280px' }}>
    <img
      src={heroBanner}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 px-7 h-full flex flex-col justify-end pb-6 text-white">
      <h2 className="text-2xl font-semibold">View Ratings &amp; Reviews</h2>
      <p className="text-sm opacity-80 mt-1">See what travelers say about your activities</p>
    </div>
  </div>
);

// ─── Sub-components ───────────────────────────────────────────────────────────
const RatingOverview = ({ avg, total, breakdown }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center">
    <div className="text-center">
      <p className="text-sm font-semibold text-slate-500 mb-1">Overall Rating</p>
      <p className="text-4xl font-bold text-slate-900">
        {avg.toFixed(1)}
        <span className="text-2xl font-normal text-slate-400"> / 5</span>
      </p>
      <div className="flex justify-center my-2">
        <StarDisplay rating={Math.round(avg)} size="lg" />
      </div>
      <p className="text-xs text-slate-400">{total} reviews</p>
    </div>

    <div className="space-y-2">
      {breakdown.map(({ star, pct }) => (
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
          <span className="text-xs text-slate-500 w-8 text-right flex-shrink-0">{pct}%</span>
        </div>
      ))}
    </div>
  </div>
);

const ReviewCard = ({ review }) => {
  const [localYes, setLocalYes] = useState(review.helpfulYes);
  const [localNo, setLocalNo]   = useState(review.helpfulNo);
  const [voted, setVoted]       = useState(null);
  const [reported, setReported] = useState(false);

  const handleVote = (v) => {
    if (voted) return;
    setVoted(v);
    if (v === 'yes') setLocalYes((n) => n + 1);
    else setLocalNo((n) => n + 1);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
          <span className="text-slate-500 text-lg">👤</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {review.touristName}
            {review.touristCountry && (
              <span className="ml-2 font-normal text-slate-500">
                {getFlag(review.touristCountry)} {review.touristCountry}
              </span>
            )}
          </p>
          {review.visitDate && (
            <p className="text-xs text-slate-400">Date: {review.visitDate}</p>
          )}
        </div>
      </div>

      <div className="mb-3">
        <StarDisplay rating={review.rating} size="sm" />
      </div>

      <div className="border-t border-gray-100 pt-3 mb-3">
        <p className="text-sm font-semibold text-slate-800 mb-1">{review.title}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{review.body}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span>{formatDate(review.createdAt)}</span>
          <span className="flex items-center gap-2">
            Was this helpful?
            <button
              onClick={() => handleVote('yes')}
              disabled={!!voted}
              className={`flex items-center gap-1 transition ${
                voted === 'yes' ? 'text-blue-600' : 'hover:text-blue-600 disabled:cursor-default'
              }`}
            >
              <FiThumbsUp className="w-3.5 h-3.5" /> {localYes}
            </button>
            <button
              onClick={() => handleVote('no')}
              disabled={!!voted}
              className={`flex items-center gap-1 transition ${
                voted === 'no' ? 'text-red-500' : 'hover:text-red-500 disabled:cursor-default'
              }`}
            >
              <FiThumbsDown className="w-3.5 h-3.5" /> {localNo}
            </button>
          </span>
          <button
            onClick={() => setReported(true)}
            className="flex items-center gap-1 hover:text-red-500 transition"
          >
            <FiFlag className="w-3.5 h-3.5" /> Report
          </button>
        </div>

        <button
          onClick={() => setReported(true)}
          className={`px-4 py-1.5 text-xs font-medium rounded-lg transition ${
            reported
              ? 'bg-gray-100 text-gray-400 cursor-default'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={reported}
        >
          {reported ? 'Reported' : 'Report'}
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ViewRatings = () => {
  const [currentActivityId, setCurrentActivityId] = useState('a1');
  const [filterRating, setFilterRating]           = useState('');
  const [sort, setSort]                           = useState('recent');
  const [search, setSearch]                       = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allReviews = MOCK_REVIEWS[currentActivityId] || [];

  const breakdown = useMemo(() => {
    const total = allReviews.length;
    return [5, 4, 3, 2, 1].map((star) => {
      const count = allReviews.filter((r) => r.rating === star).length;
      return { star, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 };
    });
  }, [allReviews]);

  const avgRating = useMemo(() => {
    if (!allReviews.length) return 0;
    const sum = allReviews.reduce((s, r) => s + r.rating, 0);
    return Math.round((sum / allReviews.length) * 10) / 10;
  }, [allReviews]);

  const filtered = useMemo(() => {
    let list = [...allReviews];

    if (filterRating) {
      const min = parseInt(filterRating, 10);
      list = list.filter((r) => r.rating >= min);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.body.toLowerCase().includes(q) ||
          r.touristName.toLowerCase().includes(q)
      );
    }

    if (sort === 'recent')  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === 'highest') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'lowest')  list.sort((a, b) => a.rating - b.rating);
    if (sort === 'helpful') list.sort((a, b) => b.helpfulYes - a.helpfulYes);

    return list;
  }, [allReviews, filterRating, search, sort]);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <ActivityProviderSidebar />

      <div className="flex-1 flex flex-col">
        {/* Hero Banner with background image */}
        <HeroBanner />

        <div className="flex-1 px-6 py-5">

          {/* Activity selector */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 mb-5 flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 flex-shrink-0">
              Activity
            </label>
            <select
              value={currentActivityId}
              onChange={(e) => {
                setCurrentActivityId(e.target.value);
                setFilterRating('');
                setSearch('');
                setSort('recent');
              }}
              className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            >
              {MOCK_ACTIVITIES.map((a) => (
                <option key={a._id} value={a._id}>{a.title}</option>
              ))}
            </select>
          </div>

          {/* Filter / Sort / Search bar */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 mb-5 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                Filter by Rating :
              </span>
              {['5', '4', '3'].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRating(filterRating === r ? '' : r)}
                  className={`px-3 py-1 rounded-full text-xs border transition ${
                    filterRating === r
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400 bg-white'
                  }`}
                >
                  {r}+ Stars
                </button>
              ))}
              {filterRating && (
                <button
                  onClick={() => setFilterRating('')}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort by:</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-blue-600 text-white text-xs font-medium pl-3 pr-7 py-1.5 rounded-lg outline-none cursor-pointer"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-full px-3 py-1.5">
                <FiSearch className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-xs outline-none bg-transparent w-32"
                />
              </div>
            </div>
          </div>

          {/* Overall rating panel */}
          {allReviews.length > 0 && (
            <RatingOverview
              avg={avgRating}
              total={allReviews.length}
              breakdown={breakdown}
            />
          )}

          {/* Reviews list */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-3">⭐</div>
              <h4 className="text-base font-medium text-slate-700 mb-2">No reviews found</h4>
              <p className="text-sm text-slate-400">
                {filterRating || search
                  ? 'Try adjusting your filters or search term'
                  : 'Reviews from tourists will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRatings;