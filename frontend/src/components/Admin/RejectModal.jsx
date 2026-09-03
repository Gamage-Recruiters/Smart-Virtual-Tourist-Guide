import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const RejectModal = ({ isOpen, onClose, onSubmit, providerName }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason.trim() === '') {
      alert('Please provide a reason for rejection.');
      return;
    }
    onSubmit(reason);
    setReason(''); // Reset the input after submitting
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[12px] shadow-lg w-full max-w-md overflow-hidden relative transform transition-all">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Reject Listing</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-[14px] text-gray-600 mb-4">
            You are about to reject the listing from <span className="font-bold text-gray-900">{providerName}</span>.
            Please provide a valid reason. This will be recorded in the system.
          </p>

          <div className="mb-6">
            <label htmlFor="reason" className="block text-[13px] font-medium text-gray-700 mb-2">
              Reason for Rejection <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              rows="4"
              className="w-full border border-gray-300 rounded-[8px] p-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow resize-none"
              placeholder="E.g., Invalid business license, inappropriate images..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[14px] font-medium text-gray-700 bg-white border border-gray-300 rounded-[6px] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-[14px] font-medium text-white bg-red-600 rounded-[6px] hover:bg-red-700 transition-colors shadow-sm"
            >
              Confirm Rejection
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default RejectModal;