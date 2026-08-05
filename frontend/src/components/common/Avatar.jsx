import React from 'react';

/**
 * Reusable Guide & User Avatar Component
 * @param {string} src - Image source URL
 * @param {string} name - Alt text / Full name
 * @param {string} initials - Fallback initials e.g. "RP"
 * @param {boolean} verified - Shows verified badge if true
 * @param {'sm' | 'md' | 'lg'} size - Size variant
 */
export const Avatar = ({ src, name, initials = 'RP', verified = false, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div className={`${sizeClasses[size] || sizeClasses.md} rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold border-2 border-white shadow-sm overflow-hidden`}>
        {src ? (
          <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {verified && (
        <span
          className="absolute bottom-0 right-0 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] border-2 border-white shadow-sm"
          title="Verified Guide"
        >
          ✓
        </span>
      )}
    </div>
  );
};

export default Avatar;
