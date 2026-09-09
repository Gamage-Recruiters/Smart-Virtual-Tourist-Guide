import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiEye, FiType, FiAlignLeft, FiTag, FiDollarSign, FiCalendar, FiBarChart2, FiMousePointer, FiUsers } from 'react-icons/fi';
import apiClient from '../../services/Admin/adminApi';

const ViewAdvertisement = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch advertisement details on mount
  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await apiClient.get(`/admin/ads/${id}`);
        if (response && response.success) {
          setAd(response.data);
        } else {
          setError('Failed to fetch advertisement details.');
        }
      } catch (err) {
        console.error("Error fetching ad details:", err);
        setError('Server error while fetching advertisement.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EBF4FF]">
        <p className="text-gray-500 font-medium">Loading advertisement details...</p>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EBF4FF]">
        <p className="text-red-500 font-medium mb-4">{error || "Advertisement not found"}</p>
        <Link to="/admin/ads">
          <button className="px-6 py-2 bg-white border border-gray-200 rounded-full text-[#111111] hover:bg-gray-50 transition-colors shadow-sm">
            Return to Manage Ads
          </button>
        </Link>
      </div>
    );
  }

  // Calculate CTR safely
  const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0;

  return (
    <div className="font-inter w-full bg-[#EBF4FF] min-h-screen pb-16 pt-8 px-6 md:px-12">
      <div className="max-w-4xl mx-auto w-full">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center justify-center bg-[#A855F7] text-white px-3 py-1 rounded-full text-[12px] font-bold tracking-wide mb-3 shadow-sm">
              <FiEye className="mr-1" /> PREVIEW
            </div>
            <h1 className="text-[28px] font-bold text-[#111111]">Advertisement Details</h1>
          </div>
          <Link to="/admin/ads">
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#111111] px-5 py-2.5 rounded-[8px] font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <FiArrowLeft /> Back
            </button>
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[16px] shadow-sm overflow-hidden border border-gray-100 flex flex-col md:flex-row">

          {/* Image Section */}
          <div className="md:w-2/5 bg-gray-50 border-r border-gray-100 p-6 flex flex-col justify-center items-center">
             <img
               src={ad.imageUrl || 'https://images.unsplash.com/photo-1544473244-f6895e69ce8d?w=800&q=80'}
               alt={ad.title}
               className="w-full h-auto rounded-[12px] object-cover shadow-sm mb-6"
             />
             <div className="w-full bg-white p-4 rounded-[12px] border border-gray-100 shadow-sm">
               <h3 className="text-[14px] font-bold text-[#111111] mb-4 border-b border-gray-100 pb-2">Campaign Performance</h3>

               <div className="flex justify-between items-center mb-3">
                 <div className="flex items-center gap-2 text-gray-500"><FiMousePointer size={14}/> <span className="text-[13px]">Clicks</span></div>
                 <span className="text-[14px] font-bold text-[#111111]">{ad.clicks}</span>
               </div>

               <div className="flex justify-between items-center mb-3">
                 <div className="flex items-center gap-2 text-gray-500"><FiBarChart2 size={14}/> <span className="text-[13px]">Impressions</span></div>
                 <span className="text-[14px] font-bold text-[#111111]">{ad.impressions}</span>
               </div>

               <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2 text-gray-500"><FiUsers size={14}/> <span className="text-[13px]">CTR</span></div>
                 <span className="text-[14px] font-bold text-[#1877F2]">{ctr}%</span>
               </div>
             </div>
          </div>

          {/* Details Section */}
          <div className="md:w-3/5 p-8 md:p-10">

            <div className="mb-6">
              <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${ad.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {ad.status}
              </span>
            </div>

            <div className="mb-8">
              <label className="text-[12px] font-bold text-[#1877F2] uppercase tracking-wider mb-1 flex items-center gap-2"><FiType /> Title</label>
              <h2 className="text-[22px] font-bold text-[#111111]">{ad.title}</h2>
            </div>

            <div className="mb-8">
              <label className="text-[12px] font-bold text-[#1877F2] uppercase tracking-wider mb-1 flex items-center gap-2"><FiAlignLeft /> Description</label>
              <p className="text-[15px] text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-[8px] border border-gray-100">
                {ad.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <label className="text-[12px] font-bold text-[#1877F2] uppercase tracking-wider mb-1 flex items-center gap-2"><FiTag /> Type</label>
                <p className="text-[15px] font-medium text-[#111111]">{ad.type || 'Standard Banner'}</p>
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#1877F2] uppercase tracking-wider mb-1 flex items-center gap-2"><FiDollarSign /> Budget</label>
                <p className="text-[15px] font-medium text-[#111111]">${ad.budget}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-[12px] font-bold text-[#1877F2] uppercase tracking-wider mb-1 flex items-center gap-2"><FiCalendar /> Start Date</label>
                <p className="text-[15px] font-medium text-[#111111]">{new Date(ad.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#1877F2] uppercase tracking-wider mb-1 flex items-center gap-2"><FiCalendar /> End Date</label>
                <p className="text-[15px] font-medium text-[#111111]">{new Date(ad.endDate).toLocaleDateString()}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewAdvertisement;