// FRONTEND/src/components/reviews/WriteReviewModal.jsx
import React, { useState, useRef } from 'react';

/**
 * WriteReviewModal Component
 * 
 * A modal that allows users to submit a new review. Includes interactive star ratings,
 * text inputs for title and experience, and a client-side image preview for uploads.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Determines if the modal is visible.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {string} props.targetName - Name of the provider being reviewed (e.g., "Rohan").
 * @param {Function} props.onSubmit - Function called with the review data upon submission.
 * @returns {JSX.Element|null} The modal UI, or null if isOpen is false.
 */
const WriteReviewModal = ({ isOpen, onClose, targetName = "the provider", onSubmit }) => {
  // Form State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // For star hover effect
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  
  // Image Upload State
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  
  const fileInputRef = useRef(null);

  // Don't render if modal is closed
  if (!isOpen) return null;

  // --- Handlers ---

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if files exist
    if (files.length === 0) return;

    // Optional: Check file size (e.g., limit to 10MB as per UI)
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    
    if (validFiles.length < files.length) {
      alert("Some files were too large. Please select images under 10MB.");
    }

    // Add valid files to state
    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Create local URLs for previewing images instantly
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please select a star rating!");
      return;
    }

    // Pass data back to parent component
    onSubmit({
      rating,
      title,
      reviewText,
      files: selectedFiles // We pass raw files; Cloudinary upload will happen in the parent/service
    });
  };

  // --- Reset form when closing ---
  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setReviewText('');
    setSelectedFiles([]);
    setPreviewUrls([]);
    onClose();
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Write a Review for {targetName}</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="writeReviewForm" onSubmit={handleSubmit}>
            
            {/* Interactive Star Rating */}
            <div className="flex flex-col items-center mb-6">
              <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-3">Add Rating</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg 
                      className={`w-10 h-10 ${
                        star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-200'
                      } transition-colors duration-150`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Title of your review</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Experience Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Share your experience</label>
              <textarea 
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="4"
                placeholder={`What was it like to travel with ${targetName}? What were the highlights?`}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              ></textarea>
            </div>

            {/* Photo Upload Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Upload Photos</label>
              
              {/* Dotted Upload Box */}
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors"
              >
                <svg className="w-8 h-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="text-sm text-gray-600 font-medium">Click to add your pictures</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/png, image/jpeg, image/webp"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  className="hidden" 
                />
              </div>

              {/* Image Previews Grid */}
              {previewUrls.length > 0 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative w-20 h-20 shrink-0">
                      <img src={url} alt={`preview-${index}`} className="w-full h-full object-cover rounded-lg shadow-sm border border-gray-200" />
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </form>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button 
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="writeReviewForm"
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            Submit Review
          </button>
        </div>

      </div>
    </div>
  );
};

export default WriteReviewModal;