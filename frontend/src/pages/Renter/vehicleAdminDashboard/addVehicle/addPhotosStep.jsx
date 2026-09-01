import { useState, useRef } from 'react';
import { Camera, Info, AlertCircle } from 'lucide-react';

function PhotoUploadBox({ id, label, file, onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const getImagePreviewSrc = (photoAsset) => {
    if (!photoAsset) return "";
    // If it's already an active string URL from database, return it directly
    if (typeof photoAsset === "string") return photoAsset;
    // Only generate a blob URL if it is a newly uploaded local File instance object
    return URL.createObjectURL(photoAsset);
  };

  const processFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    // Validate it's an image
    if (!selectedFile.type.startsWith('image/')) {
      setError('Images only (PNG, JPG)');
      return;
    }

    // Validate size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Max size 10MB');
      return;
    }

    // Pass valid file up to the parent component
    onFileSelect(id, selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">
        {label}
      </label>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => processFile(e.target.files[0])}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {/* Upload Zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl h-32 flex flex-col items-center justify-center text-center transition-all cursor-pointer group overflow-hidden ${
          isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' :
          error ? 'border-red-300 bg-red-50' :
          file ? 'border-green-300' :
          'border-slate-200 hover:bg-slate-50'
        }`}
      >
        {/* If we have a file, show the Image Preview */}
        {file ? (
          <>
            <img 
              src={getImagePreviewSrc(file)} 
              alt={label} 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-60 transition-opacity"
            />
            {/* Overlay text that appears on hover to let them know they can change it */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <span className="text-white text-[10px] font-bold tracking-wider uppercase">Change Photo</span>
            </div>
          </>
        ) : (
          /* If no file, show the Camera icon and text */
          <>
            <Camera 
              size={24} 
              strokeWidth={1.5} 
              className={`mb-2 transition-colors ${error ? 'text-red-400' : isDragging ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`} 
            />
            {error ? (
              <span className="text-[9px] font-bold text-red-500 px-2 flex items-center gap-1">
                <AlertCircle size={10} /> {error}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-900">
                {isDragging ? 'Drop photo' : 'Click to upload'}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AddPhotosStep({ formData, setFormData }) {
  
  // Handler for the Rental Price text input
  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  };

  // Handler passed down to our sub-components to update the specific photo slot
  const handlePhotoSelect = (slotId, file) => {
    setFormData((prevData) => ({
      ...prevData,
      photos: {
        ...prevData.photos,
        [slotId]: file
      }
    }));
  };

  const photoRequirements = [
    { id: 'exterior', label: 'Exterior Front' },
    { id: 'interior', label: 'Interior' },
    { id: 'side', label: 'Side View' },
    { id: 'dashboard', label: 'Dashboard' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-extrabold text-slate-900">Step 4: Vehicle Photos</h3>

      {/* Photo Upload Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photoRequirements.map((req) => (
          <PhotoUploadBox
            key={req.id}
            id={req.id}
            label={req.label}
            file={formData.photos?.[req.id]} // Pass down the specific file if it exists
            onFileSelect={handlePhotoSelect}
          />
        ))}
      </div>

      {/* Daily Rental Price Input */}
      <div className="space-y-2 pt-2">
        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">
          Daily Rental Price
        </label>
        <input
          type="number"
          name="rentalPrice"
          placeholder="15 000 LKR"
          value={formData.rentalPrice || ''}
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
        />
      </div>

      {/* Info Warning Box */}
      <div className="bg-slate-50 rounded-xl p-4 flex gap-3 border border-slate-100 mt-2">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Ensure photos are taken in good lighting and show the full vehicle.
        </p>
      </div>
    </div>
  );
}

export default AddPhotosStep;