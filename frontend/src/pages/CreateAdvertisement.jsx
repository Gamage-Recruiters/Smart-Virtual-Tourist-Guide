import React from 'react';
import { Link } from 'react-router-dom';
import { FiUploadCloud, FiType, FiAlignLeft, FiTag, FiDollarSign, FiCalendar, FiImage, FiAward } from 'react-icons/fi';

const CreateAdvertisement = () => {
  return (
    <div className="font-inter w-full bg-[#EBF4FF] min-h-screen pb-16 pt-8 px-6 md:px-12">
      <div className="max-w-3xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-[#86D889] text-white px-3 py-1 rounded-full text-[12px] font-bold tracking-wide mb-4 shadow-sm">
            <FiAward className="mr-1" /> NEW
          </div>
          <h1 className="text-[32px] font-bold text-[#111111] mb-2">Create New Advertisement</h1>
          <p className="text-[15px] text-gray-500">Set up a new promotional campaign for your travel packages</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[16px] shadow-sm p-8 md:p-10 border border-white">
          <form>
            {/* Title */}
            <div className="mb-6">
              <label className="block text-[13px] font-bold text-[#111111] mb-2 flex items-center gap-2">
                <FiType className="text-[#1877F2]" /> Advertisement Title
              </label>
              <input 
                type="text" 
                placeholder="e.g., Summer Special - 20% Off" 
                className="w-full px-4 py-3 rounded-[8px] border border-gray-200 bg-gray-50/50 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] transition-colors placeholder-gray-400"
              />
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-[13px] font-bold text-[#111111] mb-2 flex items-center gap-2">
                <FiAlignLeft className="text-[#1877F2]" /> Description
              </label>
              <textarea 
                rows="4"
                placeholder="Describe Your Promotional Offer......" 
                className="w-full px-4 py-3 rounded-[8px] border border-gray-200 bg-gray-50/50 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] transition-colors placeholder-gray-400 resize-none"
              ></textarea>
            </div>

            {/* Type and Budget Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-2 flex items-center gap-2">
                  <FiTag className="text-[#1877F2]" /> Advertisement Type
                </label>
                <div className="relative">
                  <select className="w-full px-4 py-3 rounded-[8px] border border-gray-200 bg-gray-50/50 text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] appearance-none cursor-pointer">
                    <option>Banner Ad</option>
                    <option>Sidebar Ad</option>
                    <option>Sponsored Listing</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-2 flex items-center gap-2">
                  <FiDollarSign className="text-[#1877F2]" /> Budget
                </label>
                <input 
                  type="text" 
                  placeholder="$500" 
                  className="w-full px-4 py-3 rounded-[8px] border border-gray-200 bg-gray-50/50 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] transition-colors placeholder-gray-400"
                />
              </div>
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-2 flex items-center gap-2">
                  <FiCalendar className="text-[#1877F2]" /> Start Date
                </label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 rounded-[8px] border border-gray-200 bg-gray-50/50 text-[14px] text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-2 flex items-center gap-2">
                  <FiCalendar className="text-[#1877F2]" /> End Date
                </label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 rounded-[8px] border border-gray-200 bg-gray-50/50 text-[14px] text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] transition-colors"
                />
              </div>
            </div>

            {/* Upload Area */}
            <div className="mb-10">
              <label className="block text-[13px] font-bold text-[#111111] mb-2 flex items-center gap-2">
                <FiImage className="text-[#1877F2]" /> Upload Advertisement Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-gray-200 border-dashed rounded-[12px] bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="space-y-2 text-center flex flex-col items-center">
                  <FiUploadCloud className="mx-auto h-10 w-10 text-[#1877F2]" />
                  <div className="text-[14px] font-bold text-[#111111]">
                    Drag and drop or click to upload
                  </div>
                  <p className="text-[12px] font-medium text-[#1877F2]">
                    PNG, JPG, or PDF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link to="/manage-ads" className="w-full sm:w-auto">
                <button type="button" className="w-full sm:w-auto px-10 py-3 bg-white border border-gray-200 rounded-full text-[14px] font-bold text-[#111111] hover:bg-gray-50 transition-colors shadow-sm">
                  Cancel
                </button>
              </Link>
              <button type="button" className="w-full sm:w-auto px-10 py-3 bg-[#1877F2] border border-transparent rounded-full text-[14px] font-bold text-white hover:bg-blue-600 transition-colors shadow-sm">
                Create Advertisement
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
};

export default CreateAdvertisement;