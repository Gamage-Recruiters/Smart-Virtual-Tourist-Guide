import React from 'react';
import { UploadCloud } from 'lucide-react';

/**
 * Reusable FileDropzone Component
 * @param {string} label - Field label
 * @param {string} helperText - Guidance subtitle text
 * @param {File} file - Selected File object
 * @param {Function} onFileSelect - Callback when file is chosen
 */
export const FileDropzone = ({ label, helperText, file, onFileSelect }) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}
      <label className="border border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-5 bg-white hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[110px] group">
        <input
          type="file"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        />
        <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-1.5 transition-colors" />
        {file ? (
          <p className="text-xs font-bold text-blue-600">{file.name}</p>
        ) : (
          <>
            <p className="text-xs font-bold text-blue-600 mb-0.5">
              Upload a file <span className="font-normal text-slate-500">or drag and drop</span>
            </p>
            {helperText && <p className="text-[10px] text-slate-400">{helperText}</p>}
          </>
        )}
      </label>
    </div>
  );
};

export default FileDropzone;
