import React, { useState, useEffect } from 'react';
import { Package, MapPin, Image, Tag } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import PageHeader from '../../components/tour-package/PageHeader';
import SectionHeader from '../../components/common/SectionHeader';
import FormInput from '../../components/common/FormInput';
import FormSelect from '../../components/common/FormSelect';
import FormTextarea from '../../components/common/FormTextarea';
import MapPreview from '../../components/tour-package/MapPreview';
import RouteStopsList from '../../components/tour-package/RouteStopsList';
import PhotoDropzone from '../../components/tour-package/PhotoDropzone';
import FormFooterActions from '../../components/common/FormFooterActions';
import { GuideBidList } from '../../components/tour-package/GuideBidCard';
import Pagination from '../../components/common/Pagination';

const AddNewTourPackage = () => {
  const [activeTab, setActiveTab] = useState('packages');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewMode, setViewMode] = useState('form'); // 'form' or 'list'

  // User Profile
  const [profile, setProfile] = useState({
    name: 'Rohan Perera',
    role: 'Senior Tour Guide',
    avatarInitials: 'RP',
  });

  // Form State
  const initialFormState = {
    name: '',
    category: 'Cultural',
    description: '',
    destination: 'Sigiriya',
    stops: ['Colombo Fort', 'Sigiriya Lion Rock', 'Dambulla Cave Temple'],
    photos: [],
    pricePerItinerary: '',
    durationValue: '3',
    durationUnit: 'Days',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Guide Bids / Packages List State
  const [guides, setGuides] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [loadingBids, setLoadingBids] = useState(false);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('userData');
      if (rawUser) {
        const user = JSON.parse(rawUser);
        setProfile({
          name: user.fullName || user.name || 'Rohan Perera',
          role: 'Senior Tour Guide',
          avatarInitials: (user.fullName || user.name || 'RP')
            .trim()
            .split(/\s+/)
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase(),
        });
      }
    } catch (e) {
      console.error('Failed to parse user profile', e);
    }
  }, []);

  // Fetch sample guide bids list
  useEffect(() => {
    if (viewMode === 'list') {
      setLoadingBids(true);
      setTimeout(() => {
        setGuides([
          {
            id: 'bid-1',
            name: 'Rohan Perera',
            avatarInitials: 'RP',
            rating: '4.9/5',
            reviewCount: 120,
            yearsExperience: '8+ Years',
            specialties: ['HISTORICAL TOURS', 'PHOTOGRAPHY', 'FLUENT IN ENGLISH'],
            pitch: 'Specialized in cultural heritage & photography tours. Includes private transport and custom timing for attractions.',
            totalBid: 15000,
            verified: true,
          },
          {
            id: 'bid-2',
            name: 'Rohan Perera',
            avatarInitials: 'RP',
            rating: '4.5',
            reviewCount: 100,
            yearsExperience: '6 Years',
            specialties: ['CULTURAL TOURS', 'HISTORICAL LOCATIONS', 'STORYTELLING'],
            pitch: 'Experienced driver-guide focused on historical locations around Kandy and Dambulla with detailed storytelling.',
            totalBid: 25000,
            verified: true,
          },
          {
            id: 'bid-3',
            name: 'Rohan Perera',
            avatarInitials: 'RP',
            rating: '4.8/5',
            reviewCount: 95,
            yearsExperience: '7 Years',
            specialties: ['WILDLIFE SAFARI', 'NATURE TREKS', 'ENGLISH & GERMAN'],
            pitch: 'Expert wildlife tracker and expedition guide for Yala & Udawalawe national parks. Includes binoculars & camera gear assistance.',
            totalBid: 32000,
            verified: true,
          },
          {
            id: 'bid-4',
            name: 'Rohan Perera',
            avatarInitials: 'RP',
            rating: '4.7/5',
            reviewCount: 84,
            yearsExperience: '5 Years',
            specialties: ['BEACH & SURF', 'SOUTHERN COAST', 'CULINARY TOURS'],
            pitch: 'Southern coast specialist covering Mirissa whale watching, Galle Fort heritage walks, and authentic local food tasting.',
            totalBid: 28000,
            verified: true,
          },
        ]);
        setTotalPages(3);
        setLoadingBids(false);
      }, 300);
    }
  }, [viewMode, currentPage]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddStop = () => {
    setFormData((prev) => ({ ...prev, stops: [...prev.stops, ''] }));
  };

  const handleRemoveStop = (index) => {
    setFormData((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, idx) => idx !== index),
    }));
  };

  const handleChangeStop = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.stops];
      updated[index] = value;
      return { ...prev, stops: updated };
    });
  };

  const handleUploadPhotos = (newFiles) => {
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...newFiles] }));
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, idx) => idx !== index),
    }));
  };

  const submitPackage = async (status) => {
    setFeedback(null);

    // Validation for published status
    if (status === 'published') {
      if (!formData.name.trim()) {
        setFeedback({ type: 'error', text: 'Package Name is required.' });
        return;
      }
      if (!formData.pricePerItinerary) {
        setFeedback({ type: 'error', text: 'Price per Itinerary is required.' });
        return;
      }
    }

    setSubmitting(true);
    try {
      // Endpoint call simulation: POST /api/tour-packages
      const payload = { ...formData, status };
      console.log(`Submitting package to /api/tour-packages (${status}):`, payload);

      // Simulate network request delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      setFeedback({
        type: 'success',
        text:
          status === 'published'
            ? 'Tour package published successfully!'
            : 'Tour package saved as draft.',
      });

      if (status === 'published') {
        setFormData(initialFormState);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to save tour package. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      profile={profile}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      showSearch={true}
      containerClassName={viewMode === 'form' ? 'max-w-3xl' : 'max-w-5xl'}
    >
      {/* View Toggle Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {viewMode === 'form' ? 'Add New Tour Package' : 'My Tour Packages & Bids'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {viewMode === 'form'
              ? 'Fill in the details below and create the best experience for your travelers.'
              : 'Manage your active tour packages, bids, and listings.'}
          </p>
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'form' ? 'list' : 'form')}
          className="px-4 py-2 text-xs font-bold rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
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
          <button onClick={() => setFeedback(null)} className="font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Form Mode */}
      {viewMode === 'form' ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitPackage('published');
          }}
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
                options={[
                  'Cultural',
                  'Adventure',
                  'Wildlife',
                  'Culinary',
                  'Beach & Relax',
                  'Historical',
                  'Nature & Trekking',
                ]}
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
                  options={[
                    'Sigiriya',
                    'Ella',
                    'Kandy',
                    'Galle',
                    'Nuwara Eliya',
                    'Yala',
                    'Colombo',
                    'Mirissa',
                    'Polonnaruwa',
                    'Dambulla',
                  ]}
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
                <label className="block text-xs font-bold text-slate-700">
                  Price per Person (LKR)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-xs font-medium text-slate-400">
                    Rs.
                  </span>
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
                <label className="block text-xs font-bold text-slate-700">
                  Duration
                </label>
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

          {/* Footer Action Bar */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => submitPackage('draft')}
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Publish Package'}
            </button>
          </div>
        </form>
      ) : (
        /* Listings Mode */
        <div className="space-y-4">
          {loadingBids ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading guide bids...</div>
          ) : (
            <GuideBidList
              guides={guides}
              onEditInfo={(guide) => alert(`Editing bid for ${guide.name}`)}
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </PageWrapper>
  );
};

export default AddNewTourPackage;
