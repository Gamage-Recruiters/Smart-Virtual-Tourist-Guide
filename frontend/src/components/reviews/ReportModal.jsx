import React, { useState } from 'react';

/**
 * ReportModal Component
 * 
 * A popup modal that allows users to report a specific review.
 * Includes a dropdown for the reason, a textarea for details, and a preview of the review.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Determines if the modal is visible.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Object} props.review - The review object being reported.
 * @param {Function} props.onSubmit - Function called when the report is submitted.
 * @returns {JSX.Element|null} The modal UI, or null if isOpen is false.
 */
const ReportModal = ({ isOpen, onClose, review, onSubmit }) => {
  // State to hold the user's selected reason and additional text
  const [reason, setReason] = useState('Spam');
  const [details, setDetails] = useState('');

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Dummy fallback data if review object is not fully passed
  const authorName = review?.authorName || 'Emma L.';
  const reviewText = review?.text || 'This review is fake and contains false information that needs to be reported.';

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the collected data back to the parent component
    onSubmit({ reason, details });
    // Clear form and close modal
    setDetails('');
    onClose();
  };

  return (
    // Backdrop overlay (Darkened background)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity">
      
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-8 relative mx-4">
        
        {/* Back Button / Close Link */}
        <button 
          onClick={onClose}
          className="flex items-center text-sm font-medium text-gray-800 hover:text-blue-500 transition-colors mb-6"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Return to Ratings & Reviews
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-8">Report Review</h2>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            
            {/* Left Column: Form Inputs */}
            <div className="flex-1 space-y-6">
              
              {/* Reason Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Reason for Report</label>
                <div className="relative">
                  <select 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none appearance-none cursor-pointer"
                  >
                    <option value="Spam">Spam</option>
                    <option value="Inappropriate Language">Inappropriate Language</option>
                    <option value="False Information">False Information</option>
                    <option value="Other">Other</option>
                  </select>
                  {/* Custom Dropdown Arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Additional Details Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Additional Details</label>
                <textarea 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows="4"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none resize-none"
                  placeholder="Tell us more about why you are reporting this review..."
                ></textarea>
              </div>

            </div>

            {/* Right Column: Review Preview (Grey Box) */}
            <div className="md:w-1/3">
              <div className="bg-gray-100 rounded-lg p-5 h-full">
                <h4 className="text-sm font-bold text-gray-900 mb-2">{authorName}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "{reviewText}"
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Submit Button */}
          <div className="flex justify-center md:justify-end">
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-8 rounded-lg transition-colors shadow-md"
            >
              Submit Report
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReportModal;