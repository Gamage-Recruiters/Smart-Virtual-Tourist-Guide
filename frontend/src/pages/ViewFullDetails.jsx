import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiStar, FiMapPin, FiFileText, FiDollarSign, FiClock, FiMail, FiPhone, FiGlobe, FiCheckCircle, FiX, FiCheck } from 'react-icons/fi';

const ViewFullDetails = () => {
  
  const { id } = useParams(); 

  
  const details = {
    title: "PREMIUM ISLAND TOURS & TRANSFERS",
    provider: "Kumara Transport Services",
    rating: "4.9/5",
    reviews: "128 reviews",
    image: "https://images.unsplash.com/photo-1544473244-f6895e69ce8d?w=1200&q=80",
    description: "Professional, licensed driver with 15+ years experience. Air-conditioned luxury vehicles, English speaking, island-wide tours available. Specializing in airport transfers and multi-day tours.",
    location: "Negombo - Island Wide Service",
    submitted: "2024-03-02",
    price: "$50 - $120 per day",
    experience: "2018",
    contact: {
      email: "kumara@islandtours.lk",
      phone: "+94 77 1234567",
      website: "www.islandtours.lk"
    },
    facilities: [
      "WiFi Hotspot", "English Guide", "Complimentary Water", 
      "Entertainment System", "Child Seats Available", "Professional Driver"
    ],
    languages: ["English", "Sinhala", "Tamil"]
  };

  return (
    <div className="font-inter w-full bg-[#EBF4FF] min-h-screen pb-16 pt-8 px-6 md:px-12">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header Title */}
        <div className="text-center mb-6">
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#111111] uppercase tracking-wide">
            {details.title}
          </h1>
          <p className="text-[16px] font-semibold text-[#111111] mt-1">
            by {details.provider}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-[14px]">
            <FiStar className="text-yellow-400 fill-current" />
            <span className="font-bold text-yellow-500">{details.rating}</span>
            <span className="text-gray-400">({details.reviews})</span>
          </div>
        </div>

        {/* Main Image */}
        <div className="w-full h-[300px] md:h-[400px] rounded-[16px] overflow-hidden shadow-sm mb-8">
          <img src={details.image} alt="Vehicle" className="w-full h-full object-cover" />
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-[16px] shadow-sm p-8 mb-6 border border-gray-100">
          <h2 className="text-[20px] font-bold text-[#111111] mb-4">Description</h2>
          <p className="text-[14px] text-gray-700 leading-relaxed mb-8">
            {details.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <FiMapPin className="text-[#1E3A8A] mt-1" size={20} />
              <div>
                <h3 className="text-[14px] font-bold text-[#111111]">Location</h3>
                <p className="text-[13px] text-gray-600 font-medium">{details.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiFileText className="text-[#1E3A8A] mt-1" size={20} />
              <div>
                <h3 className="text-[14px] font-bold text-[#111111]">Submitted</h3>
                <p className="text-[13px] text-gray-600 font-medium">{details.submitted}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiDollarSign className="text-[#1E3A8A] mt-1" size={20} />
              <div>
                <h3 className="text-[14px] font-bold text-[#111111]">Plans & Packages</h3>
                <p className="text-[13px] text-gray-600 font-medium">{details.price}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiClock className="text-[#1E3A8A] mt-1" size={20} />
              <div>
                <h3 className="text-[14px] font-bold text-[#111111]">Experience Since</h3>
                <p className="text-[13px] text-gray-600 font-medium">{details.experience}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-[#D3E8FA] rounded-[16px] shadow-sm p-8 mb-6 border border-blue-100 max-w-2xl mx-auto">
          <h2 className="text-[18px] font-bold text-[#111111] mb-6 text-center">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-white p-3 rounded-[12px]">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#1877F2]">
                <FiMail />
              </div>
              <div>
                <p className="text-[12px] text-gray-500">Email</p>
                <p className="text-[13px] font-bold text-[#111111]">{details.contact.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-3 rounded-[12px]">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#1877F2]">
                <FiPhone />
              </div>
              <div>
                <p className="text-[12px] text-gray-500">Phone</p>
                <p className="text-[13px] font-bold text-[#111111]">{details.contact.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-3 rounded-[12px] md:col-span-2 w-full md:w-1/2 md:mx-auto">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#1877F2]">
                <FiGlobe />
              </div>
              <div>
                <p className="text-[12px] text-gray-500">Website</p>
                <p className="text-[13px] font-bold text-[#111111]">{details.contact.website}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle & Services Card */}
        <div className="bg-white rounded-[16px] shadow-sm p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-[16px] font-bold text-[#111111] mb-2 text-center md:text-left">Vehicle Information</h3>
              <p className="text-[13px] text-gray-600 font-medium text-center md:text-left">Van & Luxury Bus Available</p>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#111111] mb-2 text-center md:text-left">License & Certification</h3>
              <div className="flex justify-center md:justify-start">
                 <span className="flex items-center gap-1 bg-[#DCFCE7] text-[#166534] px-3 py-1 rounded-full text-[11px] font-bold">
                   <FiCheckCircle size={12}/> Tourist Board Certified #TB-2018-456
                 </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-[18px] font-bold text-[#111111] mb-6 text-center">Facilities & Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 max-w-lg mx-auto pl-4 md:pl-0">
              {details.facilities.map((facility, index) => (
                <div key={index} className="flex items-center gap-3">
                  <FiCheckCircle className="text-[#8B5CF6]" size={16} />
                  <span className="text-[13px] font-medium text-[#111111]">{facility}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-[18px] font-bold text-[#111111] mb-6 text-center">Languages Spoken</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {details.languages.map((lang, index) => (
                <span key={index} className="bg-[#93C5FD] text-[#1E3A8A] px-8 py-2 rounded-full text-[13px] font-bold shadow-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/approve-listings" className="w-full md:w-auto">
              <button className="w-full md:w-auto px-10 py-3 bg-white border border-gray-300 rounded-[8px] text-[14px] font-bold text-[#111111] hover:bg-gray-50 transition-colors shadow-sm">
                Back
              </button>
            </Link>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-[#4D7C0F] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#3f620e] transition-colors shadow-sm">
                <FiX size={18} /> Reject Listing
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-[#1877F2] text-white rounded-[8px] text-[14px] font-bold hover:bg-blue-600 transition-colors shadow-sm">
                <FiCheck size={18} /> Approve Listing
              </button>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default ViewFullDetails;