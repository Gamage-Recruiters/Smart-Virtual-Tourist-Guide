import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiType, FiAlignLeft, FiTag, FiDollarSign, FiCalendar, FiImage, FiAward, FiLink, FiX } from 'react-icons/fi';
import apiClient from '../../services/Admin/adminApi';

const CreateAdvertisement = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Banner Ad',
    budget: '',
    startDate: '',
    endDate: '',
    imageUrl: '' // Will store either Base64 string or pasted URL
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [dragActive, setDragActive] = useState(false);

  // Handle standard input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert uploaded image to Base64
  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please upload a valid image file (PNG, JPG, JPEG).');
    }
  };

  // Handle file selection from button click
  const handleFileSelect = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Remove selected image
  const clearImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/admin/ads', formData);

      if (response && response.success) {
        alert("Advertisement Created Successfully!");
        navigate('/admin/ads');
      } else {
        setError(response.message || "Failed to create advertisement");
      }
    } catch (err) {
      console.error("Error submitting ad:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-[16px] shadow-sm p-8 md:p-10 border border-white">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-6">
              <label className="block text-[13px] font-bold text-[#111111] mb-2 flex items-center gap-2">
                <FiType className="text-[#1877F2]" /> Advertisement Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
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
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
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
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-[8px] border border-gray-200 bg-gray-50/50 text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] appearance-none cursor-pointer"
                  >
                    <option value="Banner Ad">Banner Ad</option>
                    <option value="Sidebar Ad">Sidebar Ad</option>
                    <option value="Sponsored Listing">Sponsored Listing</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-2 flex items-center gap-2">
                  <FiDollarSign className="text-[#1877F2]" /> Budget
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
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
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-[8px] border border-gray-200 bg-gray-50/50 text-[14px] text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-2 flex items-center gap-2">
                  <FiCalendar className="text-[#1877F2]" /> End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-[8px] border border-gray-200 bg-gray-50/50 text-[14px] text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] transition-colors"
                />
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[13px] font-bold text-[#111111] flex items-center gap-2">
                  <FiImage className="text-[#1877F2]" /> Advertisement Image
                </label>

                {/* Toggle Upload Mode */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setUploadMode('file')}
                    className={`px-3 py-1 text-[12px] font-medium rounded-md transition-colors ${uploadMode === 'file' ? 'bg-white shadow-sm text-[#111111]' : 'text-gray-500'}`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('url')}
                    className={`px-3 py-1 text-[12px] font-medium rounded-md transition-colors ${uploadMode === 'url' ? 'bg-white shadow-sm text-[#111111]' : 'text-gray-500'}`}
                  >
                    Paste URL
                  </button>
                </div>
              </div>

              {/* Image Preview Area */}
              {formData.imageUrl ? (
                <div className="relative mt-2 rounded-[12px] overflow-hidden border border-gray-200">
                  <img src={formData.imageUrl} alt="Advertisement Preview" className="w-full h-[200px] object-cover" />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div className="mt-2">
                  {uploadMode === 'file' ? (
                    /* Drag & Drop File Area */
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current.click()}
                      className={`flex justify-center px-6 pt-10 pb-10 border-2 border-dashed rounded-[12px] transition-colors cursor-pointer ${dragActive ? 'border-[#1877F2] bg-blue-50' : 'border-gray-300 bg-gray-50/50 hover:bg-gray-50'}`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="space-y-2 text-center flex flex-col items-center pointer-events-none">
                        <FiUploadCloud className={`mx-auto h-10 w-10 ${dragActive ? 'text-[#1877F2]' : 'text-gray-400'}`} />
                        <div className="text-[14px] font-bold text-[#111111]">
                          Drag and drop or click to upload
                        </div>
                        <p className="text-[12px] font-medium text-gray-500">
                          PNG, JPG, or JPEG up to 5MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Paste URL Input */
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiLink className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 bg-gray-50/50 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] transition-colors"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link to="/admin/ads" className="w-full sm:w-auto">
                <button type="button" className="w-full sm:w-auto px-10 py-3 bg-white border border-gray-200 rounded-full text-[14px] font-bold text-[#111111] hover:bg-gray-50 transition-colors shadow-sm">
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading || (!formData.imageUrl && uploadMode === 'file')}
                className={`w-full sm:w-auto px-10 py-3 ${loading || (!formData.imageUrl && uploadMode === 'file') ? 'bg-blue-300 cursor-not-allowed' : 'bg-[#1877F2] hover:bg-blue-600'} border border-transparent rounded-full text-[14px] font-bold text-white transition-colors shadow-sm flex justify-center items-center`}
              >
                {loading ? 'Creating...' : 'Create Advertisement'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default CreateAdvertisement;