import React, { useState, useEffect, useCallback } from 'react';
import { User, BadgeCheck, FileText, ShieldCheck, Loader2 } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import SectionHeader from '../../components/common/SectionHeader';
import FormInput from '../../components/common/FormInput';
import FormTextarea from '../../components/common/FormTextarea';
import FileDropzone from '../../components/common/FileDropzone';
import TagInput from '../../components/profile/TagInput';
import CheckboxPillGroup from '../../components/profile/CheckboxPillGroup';
import ProfilePhotoUploader from '../../components/profile/ProfilePhotoUploader';
import { guideProfileAPI } from '../../services/api';

/* ─── Empty defaults (no fake data) ──────────────────────────────────── */
const EMPTY_FORM = {
  fullName: '',
  gender: 'Male',
  dob: '',
  contactNumber: '',
  email: '',
  guideId: '',
  yearsOfExperience: '',
  languages: [],
  expertise: [],
  bio: '',
  specialSkills: '',
};

/* ─── Map API response → local form shape ─────────────────────────────── */
const mapApiToForm = (apiData) => ({
  fullName: apiData.fullName || '',
  gender: apiData.gender || 'Male',
  dob: apiData.dateOfBirth ? apiData.dateOfBirth.split('T')[0] : '',
  contactNumber: apiData.contactNumber || '',
  email: apiData.email || '',
  guideId: apiData.guideIdNumber || '',
  yearsOfExperience: apiData.yearsOfExperience !== undefined ? String(apiData.yearsOfExperience) : '',
  languages: apiData.languagesSpoken || [],
  expertise: apiData.areasOfExpertise || [],
  bio: apiData.shortBio || '',
  specialSkills: apiData.specialSkills || '',
});

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ── Profile state ── */
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [savedData, setSavedData] = useState(EMPTY_FORM);

  /* ── Photo state:
       - string  → existing Cloudinary URL
       - File    → user picked new file (not yet uploaded)
       - null    → no photo
  ── */
  const [photo, setPhoto] = useState(null);

  /* ── Document states ── */
  const [identityFile, setIdentityFile] = useState(null);          // new File | null
  const [existingIdentity, setExistingIdentity] = useState(null);  // { url, fileName, verificationStatus }

  const [certFiles, setCertFiles] = useState(null);                // new File[] | null
  const [existingCerts, setExistingCerts] = useState([]);          // existing cert objects from DB

  /* ── UI states ── */
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  /* ──────────────────────────────────────────────────────────────────
     Load profile from API on mount
  ────────────────────────────────────────────────────────────────── */
  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const json = await guideProfileAPI.getMyProfile();
      if (json.success && json.data) {
        const d = json.data;
        const mapped = mapApiToForm(d);
        setFormData(mapped);
        setSavedData(mapped);

        if (d.profilePhoto?.url) {
          setPhoto(d.profilePhoto.url);
        }
        if (d.identityProof?.url) {
          setExistingIdentity(d.identityProof);
        }
        if (Array.isArray(d.certifications) && d.certifications.length > 0) {
          setExistingCerts(d.certifications);
        }
      }
    } catch (err) {
      console.error('Failed to load guide profile:', err);
      setMessage({ type: 'error', text: 'Could not load your profile. Please refresh.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /* ──────────────────────────────────────────────────────────────────
     Helpers
  ────────────────────────────────────────────────────────────────── */
  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleCancel = () => {
    setFormData(savedData);
    setIdentityFile(null);
    setCertFiles(null);
    setMessage({ type: 'info', text: 'Changes reset to last saved state.' });
  };

  const showMsg = (type, text) => setMessage({ type, text });

  /* ──────────────────────────────────────────────────────────────────
     Save handler — sequential API calls
  ────────────────────────────────────────────────────────────────── */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (!formData.fullName.trim() || !formData.email.trim()) {
      showMsg('error', 'Full Name and Email Address are required fields.');
      setSaving(false);
      return;
    }

    let hasError = false;

    /* 1 ── Text fields ─────────────────────────────────────────── */
    try {
      const payload = {
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dob || undefined,
        contactNumber: formData.contactNumber,
        email: formData.email,
        yearsOfExperience: formData.yearsOfExperience !== '' ? parseInt(formData.yearsOfExperience, 10) : 0,
        languagesSpoken: formData.languages,
        areasOfExpertise: formData.expertise,
        shortBio: formData.bio,
        specialSkills: formData.specialSkills,
      };
      await guideProfileAPI.updateProfile(payload);
      setSavedData(formData);
    } catch (err) {
      console.error('Profile text update failed:', err);
      hasError = true;
    }

    /* 2 ── Profile photo ────────────────────────────────────────── */
    if (photo instanceof File) {
      try {
        const res = await guideProfileAPI.uploadPhoto(photo);
        if (res.success && res.data?.url) {
          setPhoto(res.data.url);
        }
      } catch (err) {
        console.error('Photo upload failed:', err);
        hasError = true;
      }
    }

    /* 3 ── Identity / NIC proof ────────────────────────────────── */
    if (identityFile instanceof File) {
      try {
        const res = await guideProfileAPI.uploadIdentityProof(identityFile);
        if (res.success && res.data) {
          setExistingIdentity(res.data);
          setIdentityFile(null);
        }
      } catch (err) {
        console.error('Identity proof upload failed:', err);
        hasError = true;
      }
    }

    /* 4 ── Certifications ──────────────────────────────────────── */
    if (certFiles && certFiles.length > 0) {
      try {
        const res = await guideProfileAPI.uploadCertifications(certFiles);
        if (res.success && Array.isArray(res.data)) {
          setExistingCerts(res.data);
          setCertFiles(null);
        }
      } catch (err) {
        console.error('Certification upload failed:', err);
        hasError = true;
      }
    }

    setSaving(false);
    if (hasError) {
      showMsg('error', 'Some updates failed. Please check and try again.');
    } else {
      showMsg('success', 'Profile updated and saved successfully!');
    }
  };

  /* ──────────────────────────────────────────────────────────────────
     Remove profile photo handler
  ────────────────────────────────────────────────────────────────── */
  const handleRemovePhoto = async () => {
    if (typeof photo === 'string') {
      try {
        await guideProfileAPI.removePhoto();
      } catch (err) {
        console.error('Remove photo failed:', err);
      }
    }
    setPhoto(null);
  };

  /* ──────────────────────────────────────────────────────────────────
     Remove a single certification from DB
  ────────────────────────────────────────────────────────────────── */
  const handleRemoveCert = async (fileId) => {
    try {
      const res = await guideProfileAPI.removeCertification(fileId);
      if (res.success) {
        setExistingCerts((prev) => prev.filter((c) => c._id !== fileId));
      }
    } catch (err) {
      console.error('Remove certification failed:', err);
    }
  };

  /* ──────────────────────────────────────────────────────────────────
     Derived header profile
  ────────────────────────────────────────────────────────────────── */
  const avatarInitials = formData.fullName
    ? formData.fullName.trim().split(/\s+/).map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'GD';

  const headerProfile = {
    name: formData.fullName || 'Guide User',
    role: 'Tour Guide',
    profilePhoto: photo,
    avatarInitials,
  };

  /* ──────────────────────────────────────────────────────────────────
     Render
  ────────────────────────────────────────────────────────────────── */
  return (
    <PageWrapper
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      profile={headerProfile}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      showSearch={true}
      containerClassName="max-w-4xl"
    >
      {/* Top Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          Manage your professional guide identity and preferences.
        </p>
      </div>

      {/* Main White Card Container */}
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 sm:p-8 space-y-8">

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-xs font-semibold">Loading your profile…</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Alert Feedback */}
            {message && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : message.type === 'error'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                <span>{message.text}</span>
                <button onClick={() => setMessage(null)} className="font-bold ml-2">
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">

              {/* 1. Profile Photo */}
              <ProfilePhotoUploader
                photo={photo}
                initials={avatarInitials}
                onPhotoChange={(file) => setPhoto(file)}
                onRemovePhoto={handleRemovePhoto}
              />

              {/* 2. Personal Information */}
              <div className="space-y-4">
                <SectionHeader icon={<User className="w-4 h-4" />} title="PERSONAL INFORMATION" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Full Name"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                  />

                  {/* Gender Radio */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Gender</label>
                    <div className="flex items-center gap-5 py-2">
                      {['Male', 'Female', 'Other'].map((g) => (
                        <label
                          key={g}
                          className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={formData.gender === g}
                            onChange={(e) => handleChange('gender', e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                          />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>

                  <FormInput
                    label="Date of Birth"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                  />

                  <FormInput
                    label="Contact Number"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => handleChange('contactNumber', e.target.value)}
                  />

                  <div className="sm:col-span-2">
                    <FormInput
                      label="Email Address"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Guide Details */}
              <div className="space-y-4">
                <SectionHeader icon={<BadgeCheck className="w-4 h-4" />} title="GUIDE DETAILS" />
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Guide ID Number"
                      value={formData.guideId}
                      disabled
                    />
                    <FormInput
                      label="Years of Experience"
                      type="number"
                      min="0"
                      value={formData.yearsOfExperience}
                      onChange={(e) => handleChange('yearsOfExperience', e.target.value)}
                    />
                  </div>

                  <TagInput
                    label="Languages Spoken"
                    tags={formData.languages}
                    onRemoveTag={(tag) =>
                      handleChange('languages', formData.languages.filter((l) => l !== tag))
                    }
                    onAddTag={(tag) =>
                      handleChange('languages', [...formData.languages, tag])
                    }
                  />

                  <CheckboxPillGroup
                    label="Areas of Expertise"
                    options={['Cultural', 'Adventure', 'Wildlife', 'Culinary']}
                    selected={formData.expertise}
                    onChange={(updated) => handleChange('expertise', updated)}
                  />
                </div>
              </div>

              {/* 4. About Me */}
              <div className="space-y-4">
                <SectionHeader icon={<FileText className="w-4 h-4" />} title="ABOUT ME" />
                <div className="space-y-4">
                  <FormTextarea
                    label="Short Professional Bio"
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                  />
                  <FormTextarea
                    label="Special Skills or Highlights"
                    rows={2}
                    value={formData.specialSkills}
                    onChange={(e) => handleChange('specialSkills', e.target.value)}
                  />
                </div>
              </div>

              {/* 5. Documents Verification */}
              <div className="space-y-4">
                <SectionHeader icon={<ShieldCheck className="w-4 h-4" />} title="DOCUMENTS VERIFICATION" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* NIC / Identity Proof */}
                  <FileDropzone
                    label="Identity Proof (Passport / NIC)"
                    helperText="PNG, JPG, PDF up to 5MB"
                    file={identityFile}
                    existingFile={existingIdentity}
                    onFileSelect={(file) => setIdentityFile(file)}
                  />

                  {/* Certifications */}
                  <div className="space-y-1.5">
                    <FileDropzone
                      label="Certifications & Licenses"
                      helperText="Multiple files accepted (PNG, JPG, PDF)"
                      file={certFiles?.[0] ?? null}
                      multiple
                      onFileSelect={(files) => setCertFiles(Array.isArray(files) ? files : [files])}
                    />

                    {/* Existing certs list */}
                    {existingCerts.length > 0 && (
                      <div className="space-y-1.5 mt-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          Uploaded Certifications
                        </p>
                        {existingCerts.map((cert) => (
                          <div
                            key={cert._id}
                            className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                          >
                            <a
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 font-semibold hover:underline truncate"
                            >
                              {cert.fileName || 'Certification'}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveCert(cert._id)}
                              className="text-rose-400 hover:text-rose-600 font-bold flex-shrink-0"
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Action Bar */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancel Changes
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default ProfileSettings;
