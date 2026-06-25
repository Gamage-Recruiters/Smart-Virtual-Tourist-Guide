import React from 'react';

/**
 * ReviewFilter Component
 * 
 * Provides UI controls to filter, sort, and search through user reviews.
 * 
 * @param {Object} props
 * @param {Function} props.onFilterChange - Callback triggered when a rating filter is clicked.
 * @param {Function} props.onSortChange - Callback triggered when the sort option changes.
 * @param {Function} props.onSearch - Callback triggered when the search input changes.
 * @returns {JSX.Element} The filter, sort, and search toolbar.
 */
const ReviewFilter = ({ onFilterChange, onSortChange, onSearch }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between py-4 mb-6 space-y-4 md:space-y-0 text-sm">
      
      {/* --- Left Section: Filter by Rating --- */}
      <div className="flex items-center space-x-2 text-gray-700 font-medium">
        <span>Filter by Rating :</span>
        <div className="flex space-x-2">
          {/* Filter Buttons */}
          <button 
            onClick={() => onFilterChange('5')} 
            className="hover:text-blue-500 transition-colors"
          >
            5 Stars
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => onFilterChange('4')} 
            className="hover:text-blue-500 transition-colors"
          >
            4+ Stars
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => onFilterChange('3')} 
            className="hover:text-blue-500 transition-colors"
          >
            3+ Stars
          </button>
        </div>
      </div>

      {/* --- Right Section: Sort and Search --- */}
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
        
        {/* Sort By Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 font-medium">Sort by:</span>
          <select 
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-blue-500 text-white font-medium py-1.5 px-3 rounded-lg outline-none cursor-pointer hover:bg-blue-600 transition-colors appearance-none pr-8 relative"
            style={{ 
              // Adding a custom arrow for the select dropdown to match Figma
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.2em 1.2em'
            }}
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full sm:w-auto">
          {/* Search SVG Icon inside the input */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search" 
            onChange={(e) => onSearch(e.target.value)}
            className="bg-gray-100 text-gray-900 text-sm rounded-full block w-full pl-10 p-2 outline-none border border-transparent focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

      </div>

    </div>
  );
};

export default ReviewFilter;