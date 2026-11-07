import React from 'react';
import StarRating from './StarRating';

/**
 * ReviewStats Component
 * 
 * Displays the overall average rating alongside a breakdown of star ratings 
 * using horizontal progress bars.
 * 
 * @param {Object} props
 * @param {number} props.averageRating - The overall rating out of 5 (e.g., 4.6).
 * @param {Object} props.starPercentages - Object containing the percentage for each star level.
 * @returns {JSX.Element} The aggregated review statistics UI.
 */
const ReviewStats = ({ averageRating = 4.6, starPercentages = { 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 } }) => {
  
  /**
   * Helper function to render an individual progress bar row
   * @param {number} starCount - The star tier (5, 4, 3, 2, or 1)
   * @param {number} percentage - The percentage of reviews that fall into this tier
   */
  const renderProgressBar = (starCount, percentage) => (
    <div key={starCount} className="flex items-center space-x-4">
      {/* Left side: Star components representing the rating tier */}
      <div className="w-24 flex justify-end">
        <StarRating rating={starCount} />
      </div>

      {/* Middle: The visual progress bar track and fill */}
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Right side: The percentage label */}
      <div className="w-10 text-right text-sm font-medium text-gray-700">
        {percentage}%
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-8 mb-8 flex flex-col md:flex-row items-center border border-gray-50">
      
      {/* Left Section: Overall Rating Indicator */}
      <div className="flex flex-col items-center justify-center md:w-1/3 mb-8 md:mb-0 md:border-r md:border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Overall Rating</h3>
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {averageRating} <span className="text-2xl text-gray-400 font-normal">/ 5</span>
        </div>
        {/* Large yellow star icon representing the overall rating */}
        <svg 
          className="w-12 h-12 text-yellow-400" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>

      {/* Right Section: Progress Bars Breakdown */}
      <div className="flex flex-col w-full md:w-2/3 md:pl-10 space-y-3">
        {/* Map through star tiers from 5 down to 1 to render the corresponding progress bars */}
        {[5, 4, 3, 2, 1].map((star) => renderProgressBar(star, starPercentages[star] || 0))}
      </div>

    </div>
  );
};

export default ReviewStats;