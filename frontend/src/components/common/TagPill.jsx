import React from 'react';

/**
 * Reusable TagPill Component
 * @param {string} label - Tag text
 */
export const TagPill = ({ label }) => (
  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 tracking-wider uppercase border border-slate-200/60">
    {label}
  </span>
);

export default TagPill;
