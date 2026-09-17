import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api.js';
import Header from '../../components/HotelOwner/Header';
import Footer from '../../components/HotelOwner/Footer';

// Assuming you have these images in your src/assets folder
import bgHero from '../../assets/HotelOwner/profileSetting.png';
import heroTitle from '../../assets/HotelOwner/SubLogo.png';

const MAX_HOTEL_IMAGES = 20;

// ---------------------------------------------------------------------------
// Sri Lankan districts (flat list — used by the District dropdown)
// ---------------------------------------------------------------------------
const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
  'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle',
  'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala',
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
  'Trincomalee', 'Vavuniya',
];

// ---------------------------------------------------------------------------
// Amenities — checkbox list
// ---------------------------------------------------------------------------
const AMENITIES_LIST = [
  'Free WiFi',
  'Free Parking',
  'Swimming Pool',
  'Gym',
  'Restaurant',
  'Spa',
];

// ---------------------------------------------------------------------------
// Labels — centralized so they can be swapped for i18n t('key') later.
// ---------------------------------------------------------------------------
const LABELS = {
  hotelImagesTitle: 'Hotel Images',
  addImages: 'Add Images',
  saveImages: 'Save Images',
  uploading: 'Uploading...',
  newBadge: 'New',
  remove: 'Remove',
  uploadDropzoneTitle: 'Upload hotel images',
  profileDetails: 'Profile Details',
  saveChanges: 'Save Changes',
  fullName: 'Full Name',
  language: 'Language',
  languageValue: 'English UK',
  contactEmail: 'Contact Email',
  phoneNumber: 'Phone Number',
};
const HotelImageTile = memo(function HotelImageTile({ url, onRemove, removing }) {
  const handleClick = useCallback(() => onRemove(url), [onRemove, url]);
  return (
    <div className="relative group rounded-lg overflow-hidden border border-slate-200">
      <img src={url} alt="Hotel" className={`w-full h-28 object-cover transition ${removing ? 'opacity-40' : ''}`} />
      {removing ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
          <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
          title={LABELS.remove}
        >
          ×
        </button>
      )}
    </div>
  );
});

const NewHotelImageTile = memo(function NewHotelImageTile({ file, index, onRemove }) {
  const handleClick = useCallback(() => onRemove(index), [onRemove, index]);
  return (
    <div className="relative group rounded-lg overflow-hidden border-2 border-blue-300">
      <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-28 object-cover" />
      <span className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-[10px] text-center py-0.5">
        {LABELS.newBadge}
      </span>
      <button
        type="button"
        onClick={handleClick}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
        title={LABELS.remove}
      >
        ×
      </button>
    </div>
  );
});

const AmenityCheckbox = memo(function AmenityCheckbox({ name, checked, onChange }) {
  const handleChange = useCallback(() => onChange(name), [onChange, name]);
  return (
    <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs text-slate-700 hover:text-slate-900 px-2 py-1 rounded hover:bg-white transition">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 shrink-0"
      />
      <span className="leading-tight tracking-wide">{name}</span>
    </label>
  );
});
const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    currentPassword: '',
    confirmPassword: '',
    contactNumber: '',
    hotelName: '',
    hotelRegistrationNo: '',
    hotelAddress: '',
    hotelCity: '',
    hotelDistrict: '',
    officialEmail: '',
    hotelOwnerName: '',
    hotelRegisterYear: '',
    officialContactNumber: '',
    hotelDescription: '',
    hotelPolicies: '',
  });

  // Amenities (array of selected amenity names)
  const [amenities, setAmenities] = useState([]);
  const [customAmenities, setCustomAmenities] = useState([]);
  const [newAmenityInput, setNewAmenityInput] = useState('');

  // Hotel images state
  const [hotelImages, setHotelImages] = useState([]);
  const [newHotelImages, setNewHotelImages] = useState([]);
  const [hotelImageMessage, setHotelImageMessage] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [removingImageUrl, setRemovingImageUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [hotelMessage, setHotelMessage] = useState('');
  const [hasHotel, setHasHotel] = useState(false);
  const [hotelId, setHotelId] = useState(null);
  const [savedHotel, setSavedHotel] = useState({
    hotelName: '',
    hotelRegistrationNo: '',
    hotelAddress: '',
    hotelCity: '',
    hotelDistrict: '',
    officialEmail: '',
    hotelRegisterYear: '',
    officialContactNumber: '',
    hotelDescription: '',
    hotelPolicies: '',
  });
  const [savedAmenities, setSavedAmenities] = useState([]);
  const [savedProfile, setSavedProfile] = useState({ fullName: '', email: '', contactNumber: '' });
  const [emailError, setEmailError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_RULES = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  ];

  const totalHotelImageCount = hotelImages.length + newHotelImages.length;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData._id || userData.id;

    if (userId) {
      apiClient.get(`/users/${userId}`)
        .then(data => {
          const profile = {
            fullName: data.fullName || '',
            email: data.email || '',
            contactNumber: data.contactNumber || ''
          };
          setIsGoogleUser(!!data.googleId);
          setSavedProfile(profile);
          setFormData(prev => ({ ...prev, ...profile, hotelOwnerName: data.fullName || '' }));
        })
        .catch(() => {
          const profile = {
            fullName: userData.fullName || '',
            email: userData.email || '',
            contactNumber: userData.contactNumber || ''
          };
          setIsGoogleUser(!!userData.googleId);
          setSavedProfile(profile);
          setFormData(prev => ({ ...prev, ...profile }));
        });

      apiClient.get('/users/me')
        .then(data => {
          const h = data.hotels?.[0] || {};
          setHasHotel(Array.isArray(data.hotels) && data.hotels.length > 0);
          setHotelId(h._id || null);
          setHotelImages(Array.isArray(h.hotelImages) ? h.hotelImages : []);

          const hotelAmenities = Array.isArray(h.hotelAmenities) ? h.hotelAmenities : [];
          const custom = hotelAmenities.filter((a) => !AMENITIES_LIST.includes(a));
          setCustomAmenities(custom);
          setAmenities(hotelAmenities);
          setSavedAmenities(hotelAmenities);

          const hotel = {
            hotelName: h.hotelName || '',
            hotelRegistrationNo: h.hotelRegistrationNo || '',
            hotelAddress: h.hotelAddress || '',
            hotelCity: h.hotelLocation?.city || '',
            hotelDistrict: h.hotelLocation?.district || '',
            officialEmail: h.hotelEmail || '',
            hotelRegisterYear: h.hotelRegisteredYear || '',
            officialContactNumber: h.hotelContactNumber || '',
            hotelDescription: h.hotelDescription || '',
            hotelPolicies: h.hotelPolicies || '',
          };
          setSavedHotel(hotel);
          setFormData(prev => ({ ...prev, ...hotel }));
        })
        .catch(() => {});
    } else {
      const profile = {
        fullName: userData.fullName || '',
        email: userData.email || '',
        contactNumber: userData.contactNumber || ''
      };
      setIsGoogleUser(!!userData.googleId);
      setSavedProfile(profile);
      setFormData(prev => ({ ...prev, ...profile }));
    }
  }, []);

  const profileChanged =
    formData.fullName !== savedProfile.fullName ||
    formData.contactNumber !== savedProfile.contactNumber ||
    (!isGoogleUser && formData.email !== savedProfile.email);

  const amenitiesEqual = (a, b) => {
    if (a.length !== b.length) return false;
    const setB = new Set(b);
    return a.every((x) => setB.has(x));
  };

  const hotelChanged =
    formData.hotelName !== savedHotel.hotelName ||
    formData.hotelRegistrationNo !== savedHotel.hotelRegistrationNo ||
    formData.hotelAddress !== savedHotel.hotelAddress ||
    formData.hotelCity !== savedHotel.hotelCity ||
    formData.hotelDistrict !== savedHotel.hotelDistrict ||
    formData.officialEmail !== savedHotel.officialEmail ||
    formData.hotelRegisterYear !== savedHotel.hotelRegisterYear ||
    formData.officialContactNumber !== savedHotel.officialContactNumber ||
    formData.hotelDescription !== savedHotel.hotelDescription ||
    formData.hotelPolicies !== savedHotel.hotelPolicies ||
    !amenitiesEqual(amenities, savedAmenities);

  // Amenities/policies/description dirty check (for the separate box)
  const detailsChanged =
    formData.hotelDescription !== savedHotel.hotelDescription ||
    formData.hotelPolicies !== savedHotel.hotelPolicies ||
    !amenitiesEqual(amenities, savedAmenities);

  const openHotelImagePicker = useCallback(() => {
    if (totalHotelImageCount >= MAX_HOTEL_IMAGES) return;
    fileInputRef.current?.click();
  }, [totalHotelImageCount]);

  const handleEmptyDropzoneClick = useCallback(() => {
    if (!hasHotel) return;
    fileInputRef.current?.click();
  }, [hasHotel]);

  const handleRemoveExisting = useCallback(async (url) => {
    setRemovingImageUrl(url);
    setHotelImageMessage('');
    try {
      const res = await apiClient.delete(`/users/hotel/images?url=${encodeURIComponent(url)}${hotelId ? `&hotelId=${hotelId}` : ''}`);
      setHotelImages(res.hotelImages || []);
    } catch (error) {
      setHotelImageMessage(error.message || 'Failed to remove image.');
    } finally {
      setRemovingImageUrl(null);
    }
  }, [hotelId]);

  const handleRemoveNew = useCallback((index) => {
    setNewHotelImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleHotelImageSelect = useCallback((e) => {
    setHotelImageMessage('');
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setNewHotelImages((prevNew) => {
      const totalAfterAdd = hotelImages.length + prevNew.length + files.length;
      if (totalAfterAdd > MAX_HOTEL_IMAGES) {
        setHotelImageMessage(`You can have a maximum of ${MAX_HOTEL_IMAGES} images per hotel.`);
        return prevNew;
      }

      const invalid = files.find(
        (f) => !f.type.startsWith('image/') || f.size > 5 * 1024 * 1024
      );
      if (invalid) {
        setHotelImageMessage('Only image files under 5 MB are allowed.');
        return prevNew;
      }

      if (fileInputRef.current) fileInputRef.current.value = '';
      return [...prevNew, ...files];
    });
  }, [hotelImages.length]);

  const handleHotelImagesSave = useCallback(async () => {
    setHotelImageMessage('');
    setUploadingImages(true);

    try {
      const uploadedUrls = await Promise.all(
        newHotelImages.map(async (file) => {
          const fd = new FormData();
          fd.append('image', file);
          const res = await apiClient.upload('/upload', fd);
          if (!res.imageUrl) throw new Error('Upload failed for ' + file.name);
          return res.imageUrl;
        })
      );

      const allImages = [...hotelImages, ...uploadedUrls];
      const res = await apiClient.put('/users/hotel/images', {
        ...(hotelId && { hotelId }),
        images: allImages,
      });

      setHotelImages(res.hotelImages || []);
      setNewHotelImages([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setHotelImageMessage('Hotel images updated successfully.');
      setTimeout(() => setHotelImageMessage(''), 4000);
    } catch (error) {
      setHotelImageMessage(error.message || 'Failed to update hotel images.');
    } finally {
      setUploadingImages(false);
    }
  }, [hotelId, newHotelImages, hotelImages]);

  const handleAmenityToggle = useCallback((name) => {
    setAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  }, []);

  const handleAddCustomAmenity = useCallback(() => {
    const trimmed = newAmenityInput.trim();
    if (!trimmed) return;
    const allAmenities = [...AMENITIES_LIST, ...customAmenities];
    if (allAmenities.some((a) => a.toLowerCase() === trimmed.toLowerCase())) return;
    setCustomAmenities((prev) => [...prev, trimmed]);
    setAmenities((prev) => [...prev, trimmed]);
    setNewAmenityInput('');
  }, [newAmenityInput, customAmenities]);

  const handleCustomAmenityKeyDown = useCallback((e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddCustomAmenity(); }
  }, [handleAddCustomAmenity]);

  // ---------- EXISTING HANDLERS ----------

  const handleHotelUpdate = async () => {
    setHotelMessage('');
    setLoading(true);
    try {
      await apiClient.put('/users/hotel', {
        hotelName: formData.hotelName,
        hotelRegistrationNo: formData.hotelRegistrationNo,
        hotelAddress: formData.hotelAddress,
        hotelCity: formData.hotelCity,
        hotelDistrict: formData.hotelDistrict,
        hotelEmail: formData.officialEmail,
        hotelRegisteredYear: formData.hotelRegisterYear,
        hotelContactNumber: formData.officialContactNumber,
        hotelDescription: formData.hotelDescription,
        hotelPolicies: formData.hotelPolicies,
        hotelAmenities: amenities,
      });
      setSavedHotel({
        hotelName: formData.hotelName,
        hotelRegistrationNo: formData.hotelRegistrationNo,
        hotelAddress: formData.hotelAddress,
        hotelCity: formData.hotelCity,
        hotelDistrict: formData.hotelDistrict,
        officialEmail: formData.officialEmail,
        hotelRegisterYear: formData.hotelRegisterYear,
        officialContactNumber: formData.officialContactNumber,
        hotelDescription: formData.hotelDescription,
        hotelPolicies: formData.hotelPolicies,
      });
      setSavedAmenities(amenities);
      setHotelMessage('Hotel info updated successfully.');
      setTimeout(() => setHotelMessage(''), 4000);
    } catch (error) {
      setHotelMessage(error.message || 'Failed to update hotel info.');
    } finally {
      setLoading(false);
    }
  };
  const handleDetailsSave = async () => {
    setHotelMessage('');
    setLoading(true);
    try {
      await apiClient.put('/users/hotel', {
        hotelDescription: formData.hotelDescription,
        hotelPolicies: formData.hotelPolicies,
        hotelAmenities: amenities,
      });
      setSavedHotel((prev) => ({
        ...prev,
        hotelDescription: formData.hotelDescription,
        hotelPolicies: formData.hotelPolicies,
      }));
      setSavedAmenities(amenities);
      setHotelMessage('Hotel info updated successfully.');
      setTimeout(() => setHotelMessage(''), 4000);
    } catch (error) {
      setHotelMessage(error.message || 'Failed to update hotel info.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setProfileMessage('');
    try {
      await apiClient.put('/users/profile', {
        fullName: formData.fullName,
        contactNumber: formData.contactNumber,
        ...(!isGoogleUser && { email: formData.email }),
      });
      const updated = {
        fullName: formData.fullName,
        contactNumber: formData.contactNumber,
        email: formData.email
      };
      setSavedProfile(updated);
      setProfileMessage('Profile updated successfully.');
      setTimeout(() => setProfileMessage(''), 4000);
    } catch (error) {
      setProfileMessage(error.message || 'Failed to update profile.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    if (!formData.currentPassword || !formData.password || !formData.confirmPassword) {
      setPasswordMessage('Please fill in all password fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordMessage('Passwords do not match.');
      return;
    }

    try {
      const res = await apiClient.put(`/users/change-password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.password,
      });
      setPasswordMessage(res.message || 'Your password has been changed successfully.');
      setFormData(prev => ({ ...prev, currentPassword: '', password: '', confirmPassword: '' }));
    } catch (error) {
      setPasswordMessage(error.message || 'Failed to change password.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'hotelDistrict') {
      setFormData(prev => ({ ...prev, hotelDistrict: value, hotelCity: '' }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setEmailError(value && !EMAIL_REGEX.test(value) ? 'Please enter a valid email address.' : '');
    }
    if (name === 'password') {
      setPasswordErrors(PASSWORD_RULES.filter(r => !r.test(value)).map(r => r.label));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
      <Header hasHotel={hasHotel} />

      {/* 1. HERO SECTION */}
      <div className="relative w-full overflow-hidden">
        <div className="relative h-[420px] md:h-[520px] w-full">
          <img
            src={bgHero}
            alt="Hotel hero"
            className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10" />
          <div className="absolute top-10 right-16 md:right-28 z-10 w-[140px] md:w-[220px] lg:w-[340px]">
            <img
              src={heroTitle}
              alt="Sri Lankan's Hotel"
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </div>
          <div className="absolute bottom-10 left-8 md:left-16 z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow">Profile Settings</h1>
            <p className="text-white/80 mt-1 text-base md:text-lg">Manage your hotel and account details</p>
          </div>
        </div>
      </div>

      {/* 2. PROFILE HEADER SECTION */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Account Settings</h2>
            <p className="text-slate-500 text-base mt-1">Update your profile, hotel info, and password</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-base font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3" />
              </svg>
              Dashboard
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* 3. PROFILE DETAILS CARD (Hotel Images + Profile Details) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left: Hotel Image Uploader */}
            <div className="w-full lg:w-3/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">{LABELS.hotelImagesTitle}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{totalHotelImageCount} / {MAX_HOTEL_IMAGES} uploaded</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={openHotelImagePicker}
                    disabled={totalHotelImageCount >= MAX_HOTEL_IMAGES || !hasHotel}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    {LABELS.addImages}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleHotelImageSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {totalHotelImageCount === 0 ? (
                <button
                  type="button"
                  onClick={handleEmptyDropzoneClick}
                  disabled={!hasHotel}
                  className="w-full h-56 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 flex flex-col items-center justify-center gap-3 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-medium">{LABELS.uploadDropzoneTitle}</p>
                    <p className="text-sm mt-0.5">PNG, JPG up to 5MB · max {MAX_HOTEL_IMAGES} images</p>
                  </div>
                </button>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {hotelImages.map((url) => (
                    <HotelImageTile key={url} url={url} onRemove={handleRemoveExisting} removing={removingImageUrl === url} />
                  ))}
                  {newHotelImages.map((file, idx) => (
                    <NewHotelImageTile key={`${file.name}-${idx}`} file={file} index={idx} onRemove={handleRemoveNew} />
                  ))}
                </div>
              )}

              {hotelImageMessage && (
                <div className={`mt-3 text-sm px-3 py-2 rounded-lg ${
                  hotelImageMessage.includes('successfully')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {hotelImageMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handleHotelImagesSave}
                disabled={!hasHotel || newHotelImages.length === 0 || uploadingImages}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {uploadingImages ? LABELS.uploading : LABELS.saveImages}
              </button>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-slate-100" />

            {/* Right: Profile Form */}
            <div className="w-full lg:w-2/5">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">{LABELS.profileDetails}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Your personal account info</p>
                </div>
                <button
                  type="button"
                  onClick={handleProfileSave}
                  disabled={!profileChanged}
                  className="inline-flex items-center gap-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {LABELS.saveChanges}
                </button>
              </div>

              {profileMessage && (
                <div className={`mb-4 text-sm px-3 py-2 rounded-lg ${
                  profileMessage.includes('successfully')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>{profileMessage}</div>
              )}

              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">{LABELS.fullName}</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-base text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">{LABELS.language}</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-base text-slate-500 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    {LABELS.languageValue}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">{LABELS.contactEmail}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    readOnly={isGoogleUser}
                    className={`w-full bg-slate-50 border rounded-lg px-3 py-2.5 text-base text-slate-800 outline-none transition ${
                      isGoogleUser
                        ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                        : emailError
                        ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                        : 'border-slate-200 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {emailError && !isGoogleUser && (
                    <p className="mt-1 text-sm text-red-500">{emailError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">{LABELS.phoneNumber}</label>
                  <div className="flex gap-2">
                    <select className="border border-slate-200 rounded-lg px-2 py-2.5 bg-slate-50 text-base text-slate-700">
                      <option>🇱🇰 +94</option>
                    </select>
                    <input
                      type="text"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-base text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3.5 DESCRIPTION, POLICIES & AMENITIES CARD */}
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-8 relative ${!hasHotel ? 'opacity-60' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg">Description, Policies &amp; Amenities</h3>
                <p className="text-sm text-slate-400 mt-0.5">Tell guests what your hotel offers</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDetailsSave}
              disabled={!detailsChanged || loading || !hasHotel}
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>

          {!hasHotel && (
            <div className="mb-5 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-base text-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              No hotel added yet. Add a hotel first to update amenities and policies.
            </div>
          )}

          {/* Row 1: Description — full width */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-500 mb-1">Hotel Description</label>
            <textarea
              name="hotelDescription"
              value={formData.hotelDescription}
              onChange={handleInputChange}
              disabled={!hasHotel}
              rows={3}
              placeholder="A short description of your hotel..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-base transition resize-y disabled:opacity-50"
            />
          </div>

          {/* Row 2: Policies + Amenities side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left: Amenities */}
            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-2">
                Amenities <span className="text-slate-400 font-normal">({amenities.length} selected)</span>
              </label>
              <fieldset disabled={!hasHotel}>
                <div className="grid grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                  {[...AMENITIES_LIST, ...customAmenities].map((name) => (
                    <AmenityCheckbox
                      key={name}
                      name={name}
                      checked={amenities.includes(name)}
                      onChange={handleAmenityToggle}
                    />
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newAmenityInput}
                    onChange={(e) => setNewAmenityInput(e.target.value)}
                    onKeyDown={handleCustomAmenityKeyDown}
                    placeholder="Add custom amenity..."
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAmenity}
                    disabled={!newAmenityInput.trim()}
                    className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </fieldset>
            </div>

            {/* Right: Policies */}
            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-1">Hotel Policies</label>
              <textarea
                name="hotelPolicies"
                value={formData.hotelPolicies}
                onChange={handleInputChange}
                disabled={!hasHotel}
                rows={5}
                placeholder="Check-in 2 PM · Check-out 11 AM · No smoking..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-base transition resize-y disabled:opacity-50"
              />
            </div>
          </div>

          {hotelMessage && (
            <div className={`mt-5 text-sm px-3 py-2.5 rounded-lg ${
              hotelMessage.includes('successfully')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>{hotelMessage}</div>
          )}
        </div>

        {/* 4. TWO COLUMN FORM SECTION */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left Column: Password */}
            <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden ${isGoogleUser ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 text-lg">Change Password</h3>
              </div>

              {isGoogleUser && (
                <div className="mb-5 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-base text-amber-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  You signed in with Google. Password changes are not available.
                </div>
              )}

              <fieldset disabled={isGoogleUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    readOnly
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 text-slate-400 cursor-not-allowed outline-none text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 text-slate-400 cursor-not-allowed outline-none text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-base transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-3 py-2.5 outline-none text-base transition ${
                      formData.password && passwordErrors.length > 0
                        ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                        : formData.password && passwordErrors.length === 0
                        ? 'border-green-400 focus:ring-2 focus:ring-green-400'
                        : 'border-slate-200 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {formData.password && (
                    <ul className="mt-2 space-y-1">
                      {PASSWORD_RULES.map((rule) => {
                        const passed = rule.test(formData.password);
                        return (
                          <li key={rule.label} className={`flex items-center gap-1.5 text-sm ${
                            passed ? 'text-green-600' : 'text-red-500'
                          }`}>
                            <span>{passed ? '✓' : '✗'}</span>
                            {rule.label}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-base transition"
                  />
                </div>

                {passwordMessage && (
                  <div className={`text-sm px-3 py-2.5 rounded-lg ${
                    passwordMessage.includes('successfully')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {passwordMessage}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePasswordUpdate}
                  disabled={loading || isGoogleUser}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg mt-2 transition disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </fieldset>
            </div>

            {/* Right Column: Hotel Info */}
            <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden ${!hasHotel ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 text-lg">Hotel Information</h3>
              </div>

              {!hasHotel && (
                <div className="mb-5 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-base text-amber-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  No hotel added yet. Add a hotel first to update details.
                </div>
              )}

              <fieldset disabled={!hasHotel} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">Hotel Name</label>
                  <input
                    type="text"
                    name="hotelName"
                    value={formData.hotelName}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-base transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">Registration No</label>
                  <input
                    type="text"
                    name="hotelRegistrationNo"
                    value={formData.hotelRegistrationNo}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-base transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">Hotel Address</label>
                  <input
                    type="text"
                    name="hotelAddress"
                    value={formData.hotelAddress}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-base transition"
                  />
                </div>

                {/* District (dropdown) + City (free text) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">District</label>
                    <select
                      name="hotelDistrict"
                      value={formData.hotelDistrict}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-base transition bg-white"
                    >
                      <option value="">Select district</option>
                      {SRI_LANKA_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">City</label>
                    <input
                      type="text"
                      name="hotelCity"
                      value={formData.hotelCity}
                      onChange={handleInputChange}
                      placeholder="e.g. Kandy"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-base transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">Official Email</label>
                  <input
                    type="text"
                    name="officialEmail"
                    value={formData.officialEmail}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-base transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">Hotel Owner Name</label>
                  <input
                    type="text"
                    name="hotelOwnerName"
                    value={formData.hotelOwnerName}
                    readOnly
                    placeholder={formData.fullName}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 text-slate-400 cursor-not-allowed outline-none text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">Register Year</label>
                    <input
                      type="text"
                      name="hotelRegisterYear"
                      value={formData.hotelRegisterYear}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-base transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">Contact Number</label>
                    <div className="flex gap-1.5">
                      <select className="border border-slate-200 rounded-lg px-2 py-2.5 bg-slate-50 text-sm text-slate-700">
                        <option>🇱🇰 +94</option>
                      </select>
                      <input
                        type="text"
                        name="officialContactNumber"
                        value={formData.officialContactNumber}
                        onChange={handleInputChange}
                        className="flex-1 border border-slate-200 rounded-lg px-2 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-base transition"
                      />
                    </div>
                  </div>
                </div>

                {hotelMessage && (
                  <div className={`text-sm px-3 py-2.5 rounded-lg ${
                    hotelMessage.includes('successfully')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>{hotelMessage}</div>
                )}

                <button
                  type="button"
                  onClick={handleHotelUpdate}
                  disabled={!hotelChanged || loading || !hasHotel}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg mt-2 transition disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  {loading ? 'Saving...' : 'Save Hotel Info'}
                </button>
              </fieldset>
            </div>

          </div>
        </form>

      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;