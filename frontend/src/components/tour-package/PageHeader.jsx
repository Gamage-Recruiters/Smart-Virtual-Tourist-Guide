import React from 'react';
import Button from '../common/Button';

/**
 * Reusable PageHeader Component
 * @param {string} title - Page main title
 * @param {string} subtitle - Optional page subtitle
 * @param {Function} onAddPackage - Optional action handler for "Add Tour Package" button
 */
export const PageHeader = ({ title, subtitle, onAddPackage }) => (
  <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl font-black tracking-tight text-slate-900">{title}</h1>
      {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
    {onAddPackage && (
      <Button
        variant="solid"
        onClick={onAddPackage}
        className="py-2.5 px-4 text-xs sm:text-sm flex-shrink-0 shadow-md shadow-indigo-200"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Tour Package</span>
      </Button>
    )}
  </div>
);

export default PageHeader;
