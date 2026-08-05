import React, { useState, useEffect } from 'react';
import { User, BadgeCheck, FileText, ShieldCheck } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import SectionHeader from '../../components/common/SectionHeader';
import FormInput from '../../components/common/FormInput';
import FormTextarea from '../../components/common/FormTextarea';
import FileDropzone from '../../components/common/FileDropzone';
import TagInput from '../../components/profile/TagInput';
import CheckboxPillGroup from '../../components/profile/CheckboxPillGroup';
import ProfilePhotoUploader from '../../components/profile/ProfilePhotoUploader';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Initial Form Data State
  const initialFormData = {
    fullName: 'Rohan Perera',
    gender: 'Male',
    dob: '1990-05-15',
    contactNumber: '+94 77 123 4567',
    email: 'rohan.perera@example.com',
    guideId: 'GD-88492',
    yearsOfExperience: '8',
    languages: ['English', 'Sinhala', 'Tamil'],
    expertise: ['Cultural', 'Adventure', 'Wildlife'],
    bio: 'Experienced tour guide with 8+ years leading cultural and wildlife expeditions across Sri Lanka.',
    specialSkills: 'Wilderness First Aid Certified, Photography Expert, Fluent in 3 languages.',
    identityProof: null,
    certifications: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [savedData, setSavedData] = useState(initialFormData);
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Load existing profile from localStorage / API
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('userData');
      if (rawUser) {
        const user = JSON.parse(rawUser);
        const fetched = {
          ...initialFormData,
          fullName: user.fullName || user.name || initialFormData.fullName,
          email: user.email || initialFormData.email,
          contactNumber: user.phone || user.contactNumber || initialFormData.contactNumber,
        };
        setFormData(fetched);
        setSavedData(fetched);
      }
    } catch (err) {
      console.error('Failed to load profile settings', err);
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData(savedData);
    setMessage({ type: 'info', text: 'Changes reset to last saved state.' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Basic Validation
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setMessage({ type: 'error', text: 'Full Name and Email Address are required fields.' });
      setSaving(false);
      return;
    }

    try {
      setSavedData(formData);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.contactNumber,
          role: 'Senior Tour Guide',
        })
      );

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Header Profile Prop
  const headerProfile = {
    name: formData.fullName,
    role: 'Senior Tour Guide',
    avatarInitials: formData.fullName
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase(),
  };

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
            initials={headerProfile.avatarInitials}
            onPhotoChange={(file) => setPhoto(file)}
            onRemovePhoto={() => setPhoto(null)}
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
                    <label key={g} className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
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
                  handleChange(
                    'languages',
                    formData.languages.filter((l) => l !== tag)
                  )
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
              <FileDropzone
                label="Identity Proof (Passport/NIC)"
                helperText="PNG, JPG, PDF up to 10MB"
                file={formData.identityProof}
                onFileSelect={(file) => handleChange('identityProof', file)}
              />
              <FileDropzone
                label="Certifications & Licenses"
                helperText="Multiple files accepted"
                file={formData.certifications}
                onFileSelect={(file) => handleChange('certifications', file)}
              />
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default ProfileSettings;

