import React from 'react';
import { UploadCloud, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';

/**
 * Reusable FileDropzone Component
 * @param {string} label - Field label
 * @param {string} helperText - Guidance subtitle text
 * @param {File} file - Newly selected File object (pending upload)
 * @param {object|null} existingFile - Already uploaded file: { url, fileName, verificationStatus }
 * @param {boolean} multiple - Allow multiple file selection
 * @param {Function} onFileSelect - Callback when file(s) are chosen
 */
const StatusBadge = ({ status }) => {
  const map = {
    verified: { icon: CheckCircle, text: 'Verified', cls: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    pending: { icon: Clock, text: 'Pending Review', cls: 'text-amber-600 bg-amber-50 border-amber-200' },
    rejected: { icon: XCircle, text: 'Rejected', cls: 'text-rose-600 bg-rose-50 border-rose-200' },
  };
  const cfg = map[status] || map.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.cls}`}>
      <Icon className="w-3 h-3" />
      {cfg.text}
    </span>
  );
};

export const FileDropzone = ({ label, helperText, file, existingFile, multiple = false, onFileSelect }) => {
  // Resolve display state
  const hasNewFile = file instanceof File;
  const hasExistingFile = existingFile && (existingFile.url || existingFile.fileName);

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}

      {/* Existing uploaded file display */}
      {hasExistingFile && !hasNewFile && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 mb-2">
          <FileText className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">
              {existingFile.fileName || 'Uploaded document'}
            </p>
            {existingFile.verificationStatus && (
              <div className="mt-1">
                <StatusBadge status={existingFile.verificationStatus} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Drop zone */}
      <label className="border border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-5 bg-white hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px] group">
        <input
          type="file"
          className="hidden"
          multiple={multiple}
          onChange={(e) => {
            if (!e.target.files?.length) return;
            onFileSelect(multiple ? Array.from(e.target.files) : e.target.files[0]);
          }}
        />
        <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-1.5 transition-colors" />
        {hasNewFile ? (
          <p className="text-xs font-bold text-blue-600">{file.name}</p>
        ) : (
          <>
            <p className="text-xs font-bold text-blue-600 mb-0.5">
              {hasExistingFile ? 'Replace file' : 'Upload a file'}{' '}
              <span className="font-normal text-slate-500">or drag and drop</span>
            </p>
            {helperText && <p className="text-[10px] text-slate-400">{helperText}</p>}
          </>
        )}
      </label>
    </div>
  );
};

export default FileDropzone;
