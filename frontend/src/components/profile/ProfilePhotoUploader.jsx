import React from 'react';

/**
 * Reusable ProfilePhotoUploader Component
 * @param {File|string} photo - Photo File or URL
 * @param {string} initials - Fallback avatar initials
 * @param {Function} onPhotoChange - Handler when user selects a new image file
 * @param {Function} onRemovePhoto - Handler when user removes photo
 */
export const ProfilePhotoUploader = ({ photo, initials = 'RP', onPhotoChange, onRemovePhoto }) => {
  const photoUrl = typeof photo === 'string' ? photo : photo ? URL.createObjectURL(photo) : null;

  return (
    <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
      <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xl border border-slate-200 shadow-sm overflow-hidden flex-shrink-0">
        {photoUrl ? (
          <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800 mb-2">Profile Photo</h4>
        <div className="flex items-center gap-3">
          <label className="px-4 py-1.5 bg-blue-50/80 hover:bg-blue-100/80 text-blue-600 text-xs font-bold rounded-full cursor-pointer transition-all">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onPhotoChange(e.target.files[0])}
            />
          </label>
          <button
            type="button"
            onClick={onRemovePhoto}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUploader;
