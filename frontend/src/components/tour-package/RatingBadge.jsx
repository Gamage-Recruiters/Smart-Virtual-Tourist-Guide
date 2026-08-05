import React from 'react';

/**
 * Reusable RatingBadge Component
 * @param {number|string} rating - Numerical or string rating (e.g. 4.9 or "4.9/5")
 * @param {number} reviewCount - Number of reviews
 * @param {string} yearsExperience - Experience summary string (e.g. "8+ Years")
 */
export const RatingBadge = ({ rating, reviewCount, yearsExperience = '8+ Years' }) => {
  const formattedRating = typeof rating === 'number' ? `${rating}/5` : rating;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
      <div className="flex items-center gap-1 font-bold text-slate-800">
        <span className="text-amber-400 text-sm">★</span>
        <span>{formattedRating}</span>
      </div>
      {reviewCount !== undefined && <span className="text-slate-400">({reviewCount} reviews)</span>}
      {yearsExperience && (
        <>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-slate-600">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <span>{yearsExperience} Experience</span>
          </span>
        </>
      )}
    </div>
  );
};

export default RatingBadge;
