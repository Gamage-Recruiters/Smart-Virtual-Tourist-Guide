import React from 'react';

/**
 * Reusable Pagination Component
 * @param {number} currentPage - Currently active page index (1-based)
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Callback when a page is selected
 */
export const Pagination = ({ currentPage = 1, totalPages = 3, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
      >
        ‹
      </button>

      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
            currentPage === page
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
              : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
