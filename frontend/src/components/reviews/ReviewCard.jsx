import React from 'react';
import StarRating from './StarRating';

/**
 * ReviewCard Component
 * 
 * Displays an individual user review including the author's details, 
 * star rating, review text, and action buttons (Helpful/Report).
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.review - The review data object.
 * @param {Function} props.onHelpful - Callback function when 'Was this helpful' is clicked.
 * @param {Function} props.onReport - Callback function when 'Report' button is clicked.
 * @returns {JSX.Element} A styled card displaying the review details.
 */
const ReviewCard = ({ review, onHelpful, onReport }) => {
  // Destructure review object for cleaner code (Using dummy fallbacks if data is missing)
  const {
    authorName = 'John Doe',
    authorCountry = 'USA',
    date = '12 Mar 2026',
    rating = 0,
    title = 'Fantastic!',
    text = 'Safe and reliable, highly recommended!',
    helpfulCount = 0,
    unhelpfulCount = 0,
    postDate = 'April 15, 2026'
  } = review || {};

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 mb-6">
      
      {/* --- Top Section: Avatar, Name, Date, and Stars --- */}
      <div className="flex items-start space-x-4 mb-4">
        {/* User Avatar Placeholder (Black Silhouette from Figma) */}
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white overflow-hidden shrink-0">
          <svg className="w-8 h-8 mt-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        {/* User Details */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <h4 className="text-gray-900 font-semibold">{authorName}</h4>
            {/* Country Flag & Name (Using an emoji flag for simplicity) */}
            <span className="text-gray-600 text-sm">🇺🇸 {authorCountry}</span>
          </div>
          <span className="text-gray-500 text-sm mb-2">Date: {date}</span>
          
          {/* Reusing our StarRating component! */}
          <StarRating rating={rating} />
        </div>
      </div>

      {/* --- Middle Section: Review Text --- */}
      <div className="mb-6">
        <p className="text-gray-800 text-sm leading-relaxed">
          <span className="font-semibold block mb-1">{title}</span>
          {text}
        </p>
      </div>

      {/* --- Bottom Section: Footer Actions (Helpful & Report) --- */}
      <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
        
        {/* Left Side: Post Date & Helpful Actions */}
        <div className="flex items-center space-x-4">
          <span>{postDate}</span>
          
          {/* Vertical Divider line */}
          <span className="w-px h-4 bg-gray-300"></span>
          
          <div className="flex items-center space-x-2">
            <span>Was this helpful?</span>
            <button 
              onClick={() => onHelpful(true)} 
              className="hover:text-primary transition-colors flex items-center"
              aria-label="Mark as helpful"
            >
              👍 {helpfulCount}
            </button>
            <button 
              onClick={() => onHelpful(false)} 
              className="hover:text-red-500 transition-colors flex items-center"
              aria-label="Mark as unhelpful"
            >
              👎 {unhelpfulCount}
            </button>
          </div>
        </div>

        {/* Right Side: Report Button */}
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <button 
            className="hover:underline text-gray-500"
            onClick={onReport}
          >
            Report
          </button>
          
          {/* Primary Action Button (Blue outline/filled from UI) */}
          <button 
            onClick={onReport}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1.5 px-4 rounded-lg transition-colors"
          >
            Report
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReviewCard;