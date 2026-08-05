import React from 'react';
import { UploadCloud } from 'lucide-react';

/**
 * PhotoDropzone Component
 * Drag-and-drop image file uploader with thumbnail grid
 * @param {Array<File|string>} photos - Uploaded photos (File objects or image URLs)
 * @param {Function} onUpload - Callback when photos are added/dropped
 * @param {Function} onRemove - Callback when a photo is removed by index
 */
export const PhotoDropzone = ({ photos = [], onUpload, onRemove }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
    }
  };

  const samplePhotos = [
    'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=400&q=80',
  ];

  const displayPhotos = photos.length > 0 ? photos : samplePhotos;

  return (
    <div className="space-y-4">
      {/* Large Dashed Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border border-dashed border-slate-200 hover:border-blue-400 rounded-3xl p-6 bg-white hover:bg-blue-50/10 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px] group relative"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          onChange={handleFileChange}
        />
        <UploadCloud className="w-8 h-8 text-blue-500 mb-2 transition-transform group-hover:scale-110" />
        <p className="text-xs font-bold text-slate-800 mb-0.5">
          Drag and drop your photos here
        </p>
        <p className="text-[10px] text-slate-400 mb-3">PNG, JPG or JPEG (Max: 10MB)</p>
        
        <button
          type="button"
          className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-all shadow-2xs"
        >
          Select Files
        </button>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-3 gap-4">
        {displayPhotos.map((photo, index) => {
          const photoUrl = typeof photo === 'string' ? photo : URL.createObjectURL(photo);
          return (
            <div
              key={index}
              className="relative aspect-4/3 rounded-2xl border border-slate-100 overflow-hidden group shadow-sm bg-slate-100"
            >
              <img src={photoUrl} alt={`Uploaded preview ${index}`} className="w-full h-full object-cover" />
              {photos.length > 0 && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold transition-colors shadow-sm"
                  title="Remove photo"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}

        {/* Empty Placeholder Tile */}
        <label className="aspect-4/3 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-center text-slate-300 hover:text-blue-500 cursor-pointer transition-colors">
          <span className="text-xl">📷</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default PhotoDropzone;
