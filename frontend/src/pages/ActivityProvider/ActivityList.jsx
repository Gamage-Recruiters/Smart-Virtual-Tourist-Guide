import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityAPI } from '../../services/ActivityProvider/activityAPI';
import {
  CATEGORIES,
  CATEGORY_BG,
  CATEGORY_ICON,
  CATEGORY_COLOR,
  ICON_COLORS,
} from '../../constants/ActivityProvider/activityindex';
import { FiSearch, FiMap, FiMapPin, FiClock, FiUsers, FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { IoRocket } from 'react-icons/io5';
import ActivityProviderSidebar from '../../components/ActivityProvider/ActivityProviderSidebar';
import heroBanner from '../../assets/LandingPage/fisherman.png';

const getImageSrc = (image) =>
  image?.startsWith('http://') || image?.startsWith('https://') || image?.startsWith('data:')
    ? image
    : `http://localhost:5000${image}`;

// ─── Shared Hero Banner ───────────────────────────────────────────────────────
const HeroBanner = ({ title, subtitle }) => (
  <div className="relative overflow-hidden" style={{ height: '280px' }}>
    <img
      src={heroBanner}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[#264653]/85 via-[#2d6a4f]/75 to-[#1a6fdb]/65" />
    <div className="relative z-10 px-7 h-full flex flex-col justify-end pb-6 text-white">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-sm opacity-80 mt-1">{subtitle}</p>
    </div>
  </div>
);

const ActivityList = () => {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
  });

  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const [toastMsg, setToastMsg] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchActivities = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        const params = { page, limit: 12 };

        if (category !== 'All') params.category = category;
        if (status !== 'all') params.status = status;
        if (search.trim()) params.search = search.trim();

        const res = await activityAPI.getAll(params);
        setActivities(res.data.data);
        setPagination(res.data.pagination);
      } catch {
        showToast('Failed to load activities', 'error');
      } finally {
        setLoading(false);
      }
    },
    [category, status, search]
  );

  useEffect(() => {
    const t = setTimeout(() => fetchActivities(1), 350);
    return () => clearTimeout(t);
  }, [fetchActivities]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await activityAPI.delete(deleteTarget.id);
      showToast('Activity deleted');
      setDeleteTarget(null);
      fetchActivities(pagination.page);
    } catch {
      showToast('Failed to delete', 'error');
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await activityAPI.publish(id);
      showToast('Activity published!');
      fetchActivities(pagination.page);
    } catch {
      showToast('Failed to publish', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <ActivityProviderSidebar />

      <div className="flex-1 flex flex-col">
        {/* Toast */}
        {toastMsg && (
          <div
            className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg text-sm font-medium shadow-lg animate-slideIn ${toastMsg.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-300'
              : 'bg-red-50 text-red-700 border border-red-300'
              }`}
          >
            {toastMsg.msg}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black opacity-30"
              onClick={() => setDeleteTarget(null)}
            />
            <div className="bg-white rounded-lg shadow-lg z-50 w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-2">Confirm delete</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete "{deleteTarget.title}"? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="border border-gray-300 rounded-full px-4 py-2 text-sm hover:bg-gray-50"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white rounded-full px-4 py-2 text-sm hover:bg-red-700 flex items-center gap-2"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Banner with background image */}
        <HeroBanner
          title="My Activities"
          subtitle="Manage and publish your tourism activities"
        />

        <div className="flex-1 px-6 py-5">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium">All Activities</span>
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {pagination.total}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-full px-4 py-2">
                <FiSearch className="w-4 h-4" style={{ color: ICON_COLORS.muted }} />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm w-64"
                />
              </div>

              {/* Status */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Add */}
              <button
                onClick={() => navigate('/activityprovider/activities/new')}
                className="bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap flex items-center justify-center gap-2"
              >
                <FiPlus className="w-4 h-4" /> Add New
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-5">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border transition ${category === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800'
                  }`}
              >
                {cat !== 'All' && (
                  <span className="flex items-center justify-center">{CATEGORY_ICON[cat]}</span>
                )}
                <span className="truncate max-w-[10rem]">{cat}</span>
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[300px] rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : activities.length === 0 ? (
            /* Empty */
            <div className="flex flex-col items-center justify-center py-20 px-5">
              <div className="text-5xl mb-3">
                <FiMap className="w-12 h-12 mx-auto text-gray-400" />
              </div>
              <h4 className="text-lg font-medium mb-2">No activities found</h4>
              <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
                Try adjusting your filters or add a new activity
              </p>
              <button
                onClick={() => navigate('/activityprovider/activities/new')}
                className="bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium px-6 py-3 rounded-full flex items-center justify-center gap-2"
              >
                <FiPlus className="w-4 h-4" /> Create Your First Activity
              </button>
            </div>
          ) : (
            /* Grid */
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
              {activities.map((a) => (
                <div
                  key={a._id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition"
                >
                  {/* Image */}
                  <div
                    className="h-36 relative overflow-hidden flex items-center justify-center rounded-t-lg"
                    style={{ background: CATEGORY_BG[a.category] }}
                  >
                    {a.images?.[0] ? (
                      <img
                        src={getImageSrc(a.images[0])}
                        alt={a.title}
                        onError={(e) => { e.target.style.display = 'none'; }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">{CATEGORY_ICON[a.category]}</span>
                    )}

                    <span
                      className={`absolute top-3 right-3 px-1.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${a.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : a.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <h4 className="text-sm font-medium mb-1 leading-snug">{a.title}</h4>

                    <p className="text-xs text-gray-500 mb-1">
                      <FiMapPin className="inline w-3 h-3 mr-1 align-text-bottom" style={{ color: ICON_COLORS.primary }} />
                      {a.location} ·{' '}
                      <FiClock className="inline w-3 h-3 mx-1 align-text-bottom" style={{ color: ICON_COLORS.publish }} />
                      {a.duration}
                    </p>

                    <p className="text-xs text-gray-500 mb-2">
                      <FiUsers className="inline w-3 h-3 mr-1 align-text-bottom" style={{ color: ICON_COLORS.success }} />
                      Max {a.maxParticipants} participants
                    </p>

                    {a.averageRating > 0 ? (
                      <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
                        <span>
                          {'★'.repeat(Math.floor(a.averageRating))}
                          {'☆'.repeat(5 - Math.floor(a.averageRating))}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {a.averageRating.toFixed(1)} ({a.totalReviews})
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-400 mb-2">No reviews yet</p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-blue-600">
                        LKR {a.pricePerPerson?.toLocaleString()}
                      </span>
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: CATEGORY_BG[a.category] || '#eef2ff',
                          color: CATEGORY_COLOR[a.category] || '#3730a3',
                        }}
                      >
                        {a.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/activityprovider/activities/edit/${a._id}`)}
                      className="flex-1 py-2 text-xs text-gray-600 hover:bg-gray-100 transition flex items-center justify-center gap-1"
                    >
                      <FiEdit3 className="w-4 h-4" style={{ color: ICON_COLORS.primary }} /> Edit
                    </button>

                    {a.status === 'draft' && (
                      <button
                        onClick={() => handlePublish(a._id)}
                        className="flex-1 py-2 text-xs text-gray-600 hover:bg-green-50 hover:text-green-700 transition flex items-center justify-center gap-1"
                      >
                        <IoRocket className="w-4 h-4" style={{ color: ICON_COLORS.publish }} /> Publish
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteTarget({ id: a._id, title: a.title })}
                      className="flex-1 py-2 text-xs text-gray-600 hover:bg-red-50 hover:text-red-700 transition flex items-center justify-center gap-1"
                    >
                      <FiTrash2 className="w-4 h-4" style={{ color: ICON_COLORS.delete }} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchActivities(i + 1)}
                  className={`px-3 py-2 text-sm rounded-lg border transition ${pagination.page === i + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-300 hover:border-blue-500 hover:text-blue-600'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityList;