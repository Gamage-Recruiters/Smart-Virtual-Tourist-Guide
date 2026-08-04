import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { activityAPI } from '../../services/ActivityProvider/activityAPI';
import {
  CATEGORIES,
  LOCATIONS,
  DURATIONS,
  MAX_PARTICIPANTS_OPTIONS,
  EQUIPMENT_OPTIONS,
  CATEGORY_ICON,
  ICON_COLORS,
} from '../../constants/ActivityProvider/activityindex';
import ActivityProviderSidebar from '../../components/ActivityProvider/ActivityProviderSidebar';
import { FiCheck, FiClipboard, FiPlus, FiUpload, FiSave, FiX } from 'react-icons/fi';
import { IoRocket } from 'react-icons/io5';
import heroBanner from '../../assets/fisherman.png';

const HERO_IMAGE = heroBanner;

const BLANK = {
  title: '',
  category: 'Hiking & Adventure',
  description: '',
  location: '',
  duration: '4 Hours',
  maxParticipants: 15,
  pricePerPerson: '',
  requiredEquipment: ['Guide'],
  safetyNotes: '',
  timeSlotTemplates: [],
};

const normalizeImages = (images = []) =>
  [...new Set(
    images
      .filter((image) => typeof image === 'string')
      .map((image) => image.trim())
      .filter((image) => image && image !== '/uploads/undefined')
  )];

const getImageSrc = (image) =>
  image?.startsWith('http://') || image?.startsWith('https://') || image?.startsWith('data:')
    ? image
    : `http://localhost:5000${image}`;

const formatTime12h = (time24) => {
  if (!time24) return '';
  const [hStr, m] = time24.split(':');
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2, '0')}:${m} ${period}`;
};

const buildSlotLabel = (startTime, endTime) =>
  `${formatTime12h(startTime)} – ${formatTime12h(endTime)}`;

// ─── Shared Hero Banner ───────────────────────────────────────────────────────
const HeroBanner = ({ title, subtitle }) => (
  <div className="relative overflow-hidden" style={{ height: '280px' }}>
    {/* Background photo */}
    <img
      src={HERO_IMAGE}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
    />
    {/* Gradient overlay — keeps brand colours while letting photo breathe */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#264653]/85 via-[#2d6a4f]/75 to-[#1a6fdb]/65" />
    {/* Text */}
    <div className="relative z-10 px-7 h-full flex flex-col justify-end pb-6 text-white">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-sm opacity-80 mt-1">{subtitle}</p>
    </div>
  </div>
);

const ActivityForm = () => {
  const getCategoryIcon = (cat) => CATEGORY_ICON[cat] || null;

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(BLANK);
  const [newFiles, setNewFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [published, setPublished] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    activityAPI
      .getById(id)
      .then((res) => {
        const a = res.data.data;

        setForm({
          title: a.title,
          category: a.category,
          description: a.description,
          location: a.location,
          duration: a.duration,
          maxParticipants: a.maxParticipants,
          pricePerPerson: a.pricePerPerson,
          requiredEquipment: a.requiredEquipment || [],
          safetyNotes: a.safetyNotes || '',
          timeSlotTemplates: (a.timeSlotTemplates || []).map((s) => ({
            ...s,
            label: buildSlotLabel(s.startTime, s.endTime),
          })),
        });

        setExistingImages(normalizeImages(a.images || []));
      })
      .catch(() => navigate('/activityprovider/activities'))
      .finally(() => setFetchLoading(false));
  }, [id, isEdit, navigate]);

  const newPreviews = useMemo(
    () => newFiles.map((f) => URL.createObjectURL(f)),
    [newFiles]
  );

  useEffect(() => {
    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [newPreviews]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggleEquipment = (item) =>
    setForm((f) => ({
      ...f,
      requiredEquipment: f.requiredEquipment.includes(item)
        ? f.requiredEquipment.filter((x) => x !== item)
        : [...f.requiredEquipment, item],
    }));

  const addTimeSlot = () =>
    setForm((f) => {
      const startTime = '08:00';
      const endTime = '12:00';
      return {
        ...f,
        timeSlotTemplates: [
          ...f.timeSlotTemplates,
          {
            label: buildSlotLabel(startTime, endTime),
            startTime,
            endTime,
            capacity: f.maxParticipants || 15,
          },
        ],
      };
    });

  const updateTimeSlot = (idx, field, value) =>
    setForm((f) => ({
      ...f,
      timeSlotTemplates: f.timeSlotTemplates.map((s, i) => {
        if (i !== idx) return s;
        const updated = { ...s, [field]: value };
        if (field === 'startTime' || field === 'endTime') {
          updated.label = buildSlotLabel(updated.startTime, updated.endTime);
        }
        return updated;
      }),
    }));

  const removeTimeSlot = (idx) =>
    setForm((f) => ({
      ...f,
      timeSlotTemplates: f.timeSlotTemplates.filter((_, i) => i !== idx),
    }));

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const total = existingImages.length + newFiles.length + files.length;
    if (total > 8) {
      setError('Maximum 8 images allowed');
      return;
    }
    setNewFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const buildFormData = (status) => {
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('category', form.category);
    fd.append('description', form.description);
    fd.append('location', form.location);
    fd.append('duration', form.duration);
    fd.append('maxParticipants', form.maxParticipants);
    fd.append('pricePerPerson', form.pricePerPerson);
    fd.append('requiredEquipment', JSON.stringify(form.requiredEquipment));
    fd.append('safetyNotes', form.safetyNotes);
    fd.append('status', status);
    fd.append('timeSlotTemplates', JSON.stringify(form.timeSlotTemplates));
    fd.append('existingImages', JSON.stringify(existingImages));
    newFiles.forEach((file) => fd.append('images', file));
    return fd;
  };

  const validate = () => {
    if (!form.title.trim()) return 'Activity title is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.location) return 'Please select a location';
    if (!form.pricePerPerson || Number(form.pricePerPerson) <= 0)
      return 'Please enter a valid price';
    for (const slot of form.timeSlotTemplates) {
      if (!slot.startTime || !slot.endTime) return 'Each time slot needs a start and end time';
      if (slot.startTime >= slot.endTime) return 'Time slot end time must be after start time';
      if (!slot.capacity || Number(slot.capacity) <= 0)
        return 'Each time slot needs a valid capacity';
    }
    return null;
  };

  const handleSaveDraft = async () => {
    if (!form.title.trim()) {
      setError('Please enter a title to save as draft');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await activityAPI.update(id, buildFormData('draft'));
      } else {
        await activityAPI.create(buildFormData('draft'));
      }
      navigate('/activityprovider/activities');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      let res;
      if (isEdit) {
        res = await activityAPI.update(id, buildFormData('active'));
      } else {
        res = await activityAPI.create(buildFormData('active'));
      }
      setPublished(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish');
    } finally {
      setLoading(false);
    }
  };

  const totalImages = existingImages.length + newFiles.length;

  // ─── Published success screen ───────────────────────────────────────────────
  if (published) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <HeroBanner title="Activity Published!" subtitle="Your activity is now live for tourists" />

        <div className="flex items-center justify-center px-5 py-10">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-lg w-full text-center shadow-sm">
            <div className="text-5xl mb-4">
              <FiCheck className="w-12 h-12 text-green-600 mx-auto" />
            </div>

            <h2 className="text-2xl font-semibold mb-2">Activity Published!</h2>

            <p className="text-gray-500 text-sm leading-6 mb-6">
              Your activity has been successfully published.
              <br />
              Tourists can now view and book this activity.
            </p>

            <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-xl p-4 text-left mb-6">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-blue-100 flex items-center justify-center text-3xl shrink-0">
                {published.images?.[0] ? (
                  <img
                    src={getImageSrc(published.images[0])}
                    alt={published.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">
                    {getCategoryIcon(published.category) || CATEGORY_ICON[published.category]}
                  </span>
                )}
              </div>

              <div>
                <p className="font-medium text-sm">{published.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {published.category} | {published.duration}
                </p>
                <p className="text-sm font-semibold text-blue-600 mt-1">
                  LKR {published.pricePerPerson?.toLocaleString()} per person
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/activityprovider/activities')}
                className="flex-1 border border-gray-300 hover:bg-gray-100 transition rounded-full py-3 text-sm font-medium"
              >
                <FiClipboard className="inline w-4 h-4 mr-2" /> My Activities
              </button>

              <button
                onClick={() => {
                  setPublished(null);
                  setForm(BLANK);
                  setNewFiles([]);
                  setExistingImages([]);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 transition text-white rounded-full py-3 text-sm font-medium"
              >
                <FiPlus className="inline w-4 h-4 mr-2" /> Add Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Loading screen ─────────────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <HeroBanner title="Loading..." subtitle="" />
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Loading activity...
        </div>
      </div>
    );
  }

  // ─── Main form ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <ActivityProviderSidebar />

      <div className="flex-1 flex flex-col">
        {/* Hero Banner with background image */}
        <HeroBanner
          title={isEdit ? 'Edit Activity' : 'Add New Activity'}
          subtitle={
            isEdit
              ? 'Update your activity details'
              : 'Create and publish a new activity for tourists'
          }
        />

        {/* Body */}
        <div className="flex-1 px-6 py-5">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
            {/* ── Form Card ── */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Sigiriya Rock Climbing"
                    value={form.title}
                    onChange={set('title')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={set('category')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Write a short description about your activity..."
                  value={form.description}
                  onChange={set('description')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    Location *
                  </label>
                  <select
                    value={form.location}
                    onChange={set('location')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  >
                    <option value="">Select location</option>
                    {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    Duration
                  </label>
                  <select
                    value={form.duration}
                    onChange={set('duration')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  >
                    {DURATIONS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    Max Participants
                  </label>
                  <select
                    value={form.maxParticipants}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, maxParticipants: parseInt(e.target.value) }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  >
                    {MAX_PARTICIPANTS_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    Price per Person (LKR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="8500"
                    value={form.pricePerPerson}
                    onChange={set('pricePerPerson')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Equipment */}
              <div className="mb-4">
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Required Equipment
                </label>
                <div className="flex flex-wrap gap-2">
                  {EQUIPMENT_OPTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleEquipment(item)}
                      className={`px-4 py-1.5 rounded-full text-xs border transition ${form.requiredEquipment.includes(item)
                        ? 'bg-blue-100 border-blue-500 text-blue-600 font-medium'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Templates */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Time Slots
                  </label>
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    disabled={form.timeSlotTemplates.length >= 6}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    <FiPlus className="w-3.5 h-3.5" /> Add Slot
                  </button>
                </div>

                {form.timeSlotTemplates.length === 0 ? (
                  <p className="text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg p-3">
                    No time slots defined yet. Add specific slots if this activity runs
                    at fixed times.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {form.timeSlotTemplates.map((slot, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-end gap-2 border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex-1 min-w-[100px]">
                          <label className="block text-[10px] text-gray-400 mb-1">Start</label>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateTimeSlot(idx, 'startTime', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex-1 min-w-[100px]">
                          <label className="block text-[10px] text-gray-400 mb-1">End</label>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateTimeSlot(idx, 'endTime', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-[10px] text-gray-400 mb-1">Capacity</label>
                          <input
                            type="number"
                            min="1"
                            value={slot.capacity}
                            onChange={(e) =>
                              updateTimeSlot(idx, 'capacity', Number(e.target.value) || 1)
                            }
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(idx)}
                          className="w-8 h-8 rounded-lg border border-gray-300 text-red-500 hover:bg-red-50 flex items-center justify-center transition shrink-0"
                          aria-label="Remove slot"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Safety */}
              <div className="mb-5">
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Safety Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g., Wear comfortable shoes..."
                  value={form.safetyNotes}
                  onChange={set('safetyNotes')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="border border-gray-300 hover:bg-gray-100 transition rounded-full py-3 text-sm font-medium disabled:opacity-50"
                >
                  <FiSave className="inline w-4 h-4 mr-2" style={{ color: ICON_COLORS.primary }} />
                  Save as Draft
                </button>

                <button
                  onClick={handlePublish}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 transition text-white rounded-full py-3 text-sm font-medium disabled:opacity-50"
                >
                  {loading ? (
                    'Publishing...'
                  ) : (
                    <>
                      <IoRocket
                        className="inline w-4 h-4 mr-2"
                        style={{ color: ICON_COLORS.publish }}
                      />
                      Publish Activity
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ── Upload Card ── */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Upload Photos
                </label>
                <span className="text-xs text-gray-400">{totalImages}/8</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {existingImages.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="aspect-square rounded-lg overflow-hidden relative border border-gray-200 bg-gray-100"
                  >
                    <img src={getImageSrc(url)} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() =>
                        setExistingImages((prev) => prev.filter((u) => u !== url))
                      }
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {newPreviews.map((preview, i) => (
                  <div
                    key={preview}
                    className="aspect-square rounded-lg overflow-hidden relative border border-gray-200 bg-gray-100"
                  >
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() =>
                        setNewFiles((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {totalImages < 8 && (
                  <label
                    htmlFor="img-input"
                    className="aspect-square rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center text-3xl text-gray-400 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition"
                  >
                    <FiPlus className="w-8 h-8" />
                  </label>
                )}
              </div>

              <label
                htmlFor="img-input"
                className="border-2 border-dashed border-blue-200 rounded-lg p-5 flex flex-col items-center justify-center text-center text-gray-500 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
              >
                <span className="text-2xl mb-1">
                  <FiUpload className="w-8 h-8 text-gray-500" />
                </span>
                <span className="text-sm font-medium">Upload Images</span>
                <span className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP · max 5 MB each</span>
              </label>

              <input
                id="img-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                disabled={totalImages >= 8}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityForm;