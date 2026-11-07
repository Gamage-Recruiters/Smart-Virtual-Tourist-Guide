import React from 'react';

/**
 * StarRating Component
 * 
 * Displays a visual representation of a rating using SVG star icons.
 * It renders a total of 5 stars, coloring them yellow or gray based on the provided rating.
 * 
 * @param {Object} props - The component props.
 * @param {number} props.rating - The rating value (e.g., 4, 4.5) to display.
 * @returns {JSX.Element} A horizontal container of 5 star SVGs.
 */
const StarRating = ({ rating }) => {
  // Define the maximum number of stars to display
  const totalStars = 5;

  return (
    <div className="flex items-center space-x-1" aria-label={`Rating: ${rating} out of 5 stars`}>
      {/* 
        Create an array of length 5 and map over it to render the stars.
        The index goes from 0 to 4.
      */}
      {[...Array(totalStars)].map((_, index) => {
        /*
         * Determine if the current star should be filled.
         * Math.floor ensures that if rating is 4.6, only the first 4 stars are fully filled.
         * (Note: Partial star filling requires a more complex SVG/gradient approach, 
         * so we use whole stars for standard UI performance).
         */
        const isFilled = index < Math.floor(rating);

        return (
          <svg
            key={index}
            className={`w-5 h-5 transition-colors duration-200 ${
              isFilled ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;