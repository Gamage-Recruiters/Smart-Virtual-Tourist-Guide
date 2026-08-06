import React, { useState, useEffect, useCallback } from 'react';
import { Package, MapPin, Image, Tag, Trash2, Pencil, Loader2 } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import SectionHeader from '../../components/common/SectionHeader';
import FormInput from '../../components/common/FormInput';
import FormSelect from '../../components/common/FormSelect';
import FormTextarea from '../../components/common/FormTextarea';
import MapPreview from '../../components/tour-package/MapPreview';
import RouteStopsList from '../../components/tour-package/RouteStopsList';
import PhotoDropzone from '../../components/tour-package/PhotoDropzone';
import { tourPackageAPI } from '../../services/api';

/* ────────────────────────────────────────────────────────────────────────────
   Empty form shape
──────────────────────────────────────────────────────────────────────────── */
const EMPTY_FORM = {
  name: '',
  category: 'Cultural',
  description: '',
  destination: 'Sigiriya',
  stops: [],
  photos: [],
  pricePerItinerary: '',
  durationValue: '1',
  durationUnit: 'Days',
};

/* ────────────────────────────────────────────────────────────────────────────
   Status badge helper
──────────────────────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    draft: 'bg-amber-50 text-amber-700 border-amber-200',
    archived: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${map[status] || map.draft}`}>
      {status?.toUpperCase() || 'DRAFT'}
    </span>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
   Package Card (list view)
──────────────────────────────────────────────────────────────────────────── */
const PackageCard = ({ pkg, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-200 transition-all">
    <div className="flex-1 min-w-0 space-y-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-sm font-bold text-slate-900 truncate">{pkg.packageName}</h3>
        <StatusBadge status={pkg.status} />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
        <span>📍 {pkg.primaryDestination}</span>
        <span>🏷️ {pkg.category}</span>
        <span>⏱ {pkg.durationValue} {pkg.durationUnit}</span>
        <span className="font-bold text-slate-700">LKR {Number(pkg.pricePerPerson || 0).toLocaleString()}</span>
      </div>
      {pkg.shortDescription && (
        <p className="text-xs text-slate-400 line-clamp-1">{pkg.shortDescription}</p>
      )}
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      <button
        onClick={() => onEdit(pkg)}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-all"
      >
        <Pencil className="w-3.5 h-3.5" /> Edit
      </button>
      <button
        onClick={() => onDelete(pkg._id)}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-500 border border-rose-200 rounded-xl hover:bg-rose-50 transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete
      </button>
    </div>
  </div>
);

/* ────────────────────────────────────────────────────────────────────────────
   Main Page
──────────────────────────────────────────────────────────────────────────── */
const AddNewTourPackage = () => {
  const [activeTab] = useState('packages');
  const [viewMode, setViewMode] = useState('list');
  const [editingId, setEditingId] = useState(null); // null = create, string = edit

  // Form State
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Packages List State
  const [packages, setPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingList, setLoadingList] = useState(false);

  /* ── Fetch current guide's packages ─── */
  const fetchPackages = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await tourPackageAPI.listPackages({ guide: 'current', page: currentPage, limit: 10 });
      if (res?.success && Array.isArray(res.data)) {
        setPackages(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch packages:', err);
      setFeedback({ type: 'error', text: 'Could not load your packages. Please refresh.' });
    } finally {
      setLoadingList(false);
    }
  }, [currentPage]);

  useEffect(() => {
    if (viewMode === 'list') fetchPackages();
  }, [viewMode, fetchPackages]);

  /* ── Form handlers ─── */
  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleAddStop = () =>
    setFormData((prev) => ({ ...prev, stops: [...prev.stops, ''] }));

  const handleRemoveStop = (index) =>
    setFormData((prev) => ({ ...prev, stops: prev.stops.filter((_, i) => i !== index) }));

  const handleChangeStop = (index, value) =>
    setFormData((prev) => {
      const updated = [...prev.stops];
      updated[index] = value;
      return { ...prev, stops: updated };
    });

  const handleUploadPhotos = (newFiles) =>
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...newFiles] }));

  const handleRemovePhoto = (index) =>
    setFormData((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));

  /* ── Open edit form pre-filled ─── */
  const handleEdit = (pkg) => {
    setEditingId(pkg._id);
    setFormData({
      name: pkg.packageName || '',
      category: pkg.category || 'Cultural',
      description: pkg.shortDescription || '',
      destination: pkg.primaryDestination || 'Sigiriya',
      stops: (pkg.routeStops || []).map((s) => (typeof s === 'string' ? s : s.name)),
      photos: [],
      pricePerItinerary: String(pkg.pricePerPerson || ''),
      durationValue: String(pkg.durationValue || '1'),
      durationUnit: pkg.durationUnit || 'Days',
    });
    setFeedback(null);
    setViewMode('form');
  };

  /* ── Delete package ─── */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tour package? This cannot be undone.')) return;
    try {
      await tourPackageAPI.deletePackage(id);
      setPackages((prev) => prev.filter((p) => p._id !== id));
      setFeedback({ type: 'success', text: 'Package deleted successfully.' });
    } catch (err) {
      console.error('Delete error:', err);
      setFeedback({ type: 'error', text: 'Failed to delete package. Please try again.' });
    }
  };

  /* ── Submit (create or update) ─── */
  const submitPackage = async (status) => {
    setFeedback(null);

    if (status === 'published') {
      if (!formData.name.trim()) {
        setFeedback({ type: 'error', text: 'Package Name is required.' });
        return;
      }
      if (!formData.pricePerItinerary) {
        setFeedback({ type: 'error', text: 'Price per Person is required.' });
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        packageName: formData.name,
        category: formData.category,
        shortDescription: formData.description,
        primaryDestination: formData.destination,
        routeStops: formData.stops.filter((s) => s && s.trim() !== ''),
        pricePerPerson: Number(formData.pricePerItinerary) || 0,
        durationValue: Number(formData.durationValue) || 1,
        durationUnit: formData.durationUnit || 'Days',
        status,
      };

      let pkgId;
      if (editingId) {
        // Update existing
        const res = await tourPackageAPI.updatePackage(editingId, payload);
        pkgId = editingId;
        setFeedback({ type: 'success', text: 'Tour package updated successfully!' });
      } else {
        // Create new
        const res = await tourPackageAPI.createPackage(payload);
        pkgId = res.data?._id;
        setFeedback({
          type: 'success',
          text: status === 'published' ? 'Tour package published successfully!' : 'Tour package saved as draft.',
        });
      }

      // Upload photos if any new files selected
      if (pkgId && formData.photos.length > 0) {
        const imageFiles = formData.photos.filter((p) => p instanceof File);
        if (imageFiles.length > 0) {
          try {
            await tourPackageAPI.uploadPhotos(pkgId, imageFiles);
          } catch (photoErr) {
            console.error('Photo upload failed:', photoErr);
          }
        }
      }

      setFormData(EMPTY_FORM);
      setEditingId(null);
      setViewMode('list');
    } catch (err) {
      console.error('Submit error:', err);
      const errMsg =
        err?.message ||
        err?.errors?.[0]?.message ||
        'Failed to save tour package. Please try again.';
      setFeedback({ type: 'error', text: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Cancel form ─── */
  const handleCancelForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setFeedback(null);
    setViewMode('list');
  };

  /* ────────────────────────────────────────────────────────────────────────
     Render
  ──────────────────────────────────────────────────────────────────────── */
  return (
    <PageWrapper
      activeTab={activeTab}
      containerClassName={viewMode === 'form' ? 'max-w-3xl' : 'max-w-5xl'}
    >
      {/* Page Header with toggle */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {viewMode === 'form'
              ? editingId ? 'Edit Tour Package' : 'Add New Tour Package'
              : 'My Tour Packages'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {viewMode === 'form'
              ? 'Fill in the details below to create the best experience for your travelers.'
              : 'Manage your active tour packages and listings.'}
          </p>
        </div>
        <button
          onClick={() => {
            if (viewMode === 'form') {
              handleCancelForm();
            } else {
              setEditingId(null);
              setFormData(EMPTY_FORM);
              setFeedback(null);
              setViewMode('form');
            }
          }}
          className="px-4 py-2 text-xs font-bold rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
        >
          {viewMode === 'form' ? '📋 View Listings' : '➕ Add Tour Package'}
        </button>
      </div>

      {/* Alert Feedback */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* ── Form View ── */}
      {viewMode === 'form' ? (
        <form
          onSubmit={(e) => { e.preventDefault(); submitPackage('published'); }}
          className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 sm:p-8 space-y-8"
        >
          {/* Section 1: Package Basics */}
          <div className="space-y-4">
            <SectionHeader icon={<Package className="w-4 h-4" />} title="PACKAGE BASICS" />
            <div className="space-y-4">
              <FormInput
                label="Package Name"
                required
                placeholder="e.g. Ancient Wonders of Sigiriya & Dambulla Caves"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              <FormSelect
                label="Category"
                required
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                options={['Cultural', 'Adventure', 'Wildlife', 'Culinary', 'Beach & Relax', 'Historical', 'Nature & Trekking']}
              />
              <FormTextarea
                label="Short Description"
                rows={3}
                placeholder="Describe the highlights of this tour in a few sentences..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Location & Route */}
          <div className="space-y-4">
            <SectionHeader icon={<MapPin className="w-4 h-4" />} title="LOCATION & ROUTE" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <FormSelect
                  label="Primary Destination"
                  required
                  value={formData.destination}
                  onChange={(e) => handleChange('destination', e.target.value)}
                  options={['Sigiriya', 'Ella', 'Kandy', 'Galle', 'Nuwara Eliya', 'Yala', 'Colombo', 'Mirissa', 'Polonnaruwa', 'Dambulla']}
                />
                <MapPreview destination={formData.destination} />
              </div>
              <RouteStopsList
                stops={formData.stops}
                onAddStop={handleAddStop}
                onRemoveStop={handleRemoveStop}
                onChangeStop={handleChangeStop}
              />
            </div>
          </div>

          {/* Section 3: Media & Photos */}
          <div className="space-y-4">
            <SectionHeader icon={<Image className="w-4 h-4" />} title="MEDIA & PHOTOS" />
            <PhotoDropzone
              photos={formData.photos}
              onUpload={handleUploadPhotos}
              onRemove={handleRemovePhoto}
            />
          </div>

          {/* Section 4: Pricing & Details */}
          <div className="space-y-4">
            <SectionHeader icon={<Tag className="w-4 h-4" />} title="PRICING & DETAILS" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Price per Person (LKR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-xs font-medium text-slate-400">Rs.</span>
                  <input
                    type="number"
                    placeholder="15000"
                    value={formData.pricePerItinerary}
                    onChange={(e) => handleChange('pricePerItinerary', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200/80 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-slate-800"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Duration</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={formData.durationValue}
                    onChange={(e) => handleChange('durationValue', e.target.value)}
                    className="w-1/2 px-4 py-2.5 text-xs bg-white border border-slate-200/80 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-slate-800"
                  />
                  <FormSelect
                    value={formData.durationUnit}
                    onChange={(e) => handleChange('durationUnit', e.target.value)}
                    options={['Days', 'Hours', 'Half Day']}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCancelForm}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => submitPackage('draft')}
                disabled={submitting}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {submitting ? 'Saving...' : editingId ? 'Update Package' : 'Publish Package'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* ── List View ── */
        <div className="space-y-4">
          {loadingList ? (
            <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="text-xs font-semibold">Loading your packages…</span>
            </div>
          ) : packages.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-4 text-center text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">No tour packages yet</p>
                <p className="text-xs text-slate-400 mt-1">Click "Add Tour Package" to create your first one.</p>
              </div>
              <button
                onClick={() => { setEditingId(null); setFormData(EMPTY_FORM); setViewMode('form'); }}
                className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all"
              >
                ➕ Add Tour Package
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg._id}
                    pkg={pkg}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    ← Prev
                  </button>
                  <span className="text-xs font-semibold text-slate-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default AddNewTourPackage;
