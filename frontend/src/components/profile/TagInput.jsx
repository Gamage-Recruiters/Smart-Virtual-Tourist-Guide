import React from 'react';

/**
 * Reusable TagInput Component for languages and skills selection
 * @param {string} label - Input label
 * @param {Array<string>} tags - List of current tag strings
 * @param {Function} onRemoveTag - Callback when removing a tag
 * @param {Function} onAddTag - Callback when selecting/adding a new tag
 * @param {Array<string>} availableOptions - Array of available dropdown options
 */
export const TagInput = ({
  label,
  tags = [],
  onRemoveTag,
  onAddTag,
  availableOptions = [
    'English',
    'Sinhala',
    'Tamil',
    'French',
    'German',
    'Japanese',
    'Chinese',
    'Spanish',
    'Italian',
    'Russian',
  ],
}) => {
  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50/80 text-blue-600 border border-blue-100"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="hover:text-blue-800 font-bold ml-0.5 text-xs"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
      <div>
        <select
          onChange={(e) => {
            if (e.target.value) {
              onAddTag(e.target.value);
              e.target.value = '';
            }
          }}
          className="w-full px-4 py-2.5 text-xs bg-slate-50/60 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-blue-500 text-slate-500 font-medium appearance-none cursor-pointer"
        >
          <option value="">Add a language...</option>
          {availableOptions
            .filter((lang) => !tags.includes(lang))
            .map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default TagInput;
