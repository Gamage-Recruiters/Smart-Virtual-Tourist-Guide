import React, { useState, useEffect, useRef } from "react";
import { userAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Header from "./DriverHeader";
import Footer from "../Footer";
import bImage from "../../assets/B.png";
import { IoCaretBackOutline } from "react-icons/io5";
import { FaUser, FaCarSide, FaIdCard, FaPhoneAlt, FaLocationArrow } from "react-icons/fa";
import { MdDirectionsCar, MdColorLens } from "react-icons/md";
import { TbCashBanknote } from "react-icons/tb";

export default function Driver_Details() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const vehicleInputRef1 = useRef(null);
  const vehicleInputRef2 = useRef(null);

  const initialUser = JSON.parse(localStorage.getItem('userData') || localStorage.getItem('user') || '{}');

  const [driverName, setDriverName] = useState(initialUser.fullName || initialUser.name || "");
  const [vehicleName, setVehicleName] = useState(initialUser.vehicleType || "");
  const [vehicleNumber, setVehicleNumber] = useState(initialUser.vehicleNumber || "");
  const [vehicleColor, setVehicleColor] = useState(initialUser.vehicleColor || "");
  const [nationalIdNumber, setNationalIdNumber] = useState(initialUser.nationalIdNumber || initialUser.licenseNumber || "");
  const [contactNumber, setContactNumber] = useState(initialUser.contactNumber || "");

  const [showCurrentLocation, setShowCurrentLocation] = useState(false);
  const [availability, setAvailability] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(initialUser.profileImage || initialUser.image || "");

  // Vehicle Images State (2 images)
  const [vehicleImageFile1, setVehicleImageFile1] = useState(null);
  const [previewVehicleImage1, setPreviewVehicleImage1] = useState(initialUser.vehicleImages?.[0] || "");

  const [vehicleImageFile2, setVehicleImageFile2] = useState(null);
  const [previewVehicleImage2, setPreviewVehicleImage2] = useState(initialUser.vehicleImages?.[1] || "");

  // Custom Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getProfile();
        const user = response?.user || response?.data?.user || response?.data || response;
        if (user) {
          if (user.fullName) setDriverName(user.fullName);
          if (user.profileImage || user.image) setPreviewImage(user.profileImage || user.image);
          if (user.vehicleType) setVehicleName(user.vehicleType);
          if (user.vehicleNumber) setVehicleNumber(user.vehicleNumber);
          if (user.vehicleColor) setVehicleColor(user.vehicleColor);
          if (user.nationalIdNumber || user.licenseNumber) setNationalIdNumber(user.nationalIdNumber || user.licenseNumber);
          if (user.contactNumber) setContactNumber(user.contactNumber);

          if (user.vehicleImages && Array.isArray(user.vehicleImages)) {
            if (user.vehicleImages[0]) setPreviewVehicleImage1(user.vehicleImages[0]);
            if (user.vehicleImages[1]) setPreviewVehicleImage2(user.vehicleImages[1]);
          }
        }
      } catch (error) {
        console.error("Error fetching driver details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDriverDetails();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setIsEditing(true);
    }
  };

  const handleSaveDriverDetails = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!driverName.trim()) {
      showToast("Please enter driver name.", "error");
      return;
    }

    try {
      setLoading(true);
      let uploadedImageUrl = previewImage;
      let uploadedVehicleUrl1 = previewVehicleImage1;
      let uploadedVehicleUrl2 = previewVehicleImage2;

      // Upload profile image if selected
      if (profileImage) {
        uploadedImageUrl = await userAPI.uploadImage(profileImage);
      }

      // Upload vehicle image 1 if selected
      if (vehicleImageFile1) {
        uploadedVehicleUrl1 = await userAPI.uploadImage(vehicleImageFile1);
      }

      // Upload vehicle image 2 if selected
      if (vehicleImageFile2) {
        uploadedVehicleUrl2 = await userAPI.uploadImage(vehicleImageFile2);
      }

      const vehicleImages = [uploadedVehicleUrl1, uploadedVehicleUrl2].filter(Boolean);

      const updatePayload = {
        fullName: driverName,
        vehicleType: vehicleName,
        vehicleNumber,
        vehicleColor,
        nationalIdNumber,
        licenseNumber: nationalIdNumber,
        contactNumber,
        profileImage: uploadedImageUrl,
        vehicleImages
      };

      const response = await userAPI.updateProfile(updatePayload);

      if (response && (response.success || response.user)) {
        const updatedUser = response.user || response;
        const currentData = JSON.parse(localStorage.getItem("userData") || localStorage.getItem("user") || "{}");
        const newUserData = {
          ...currentData,
          ...updatedUser,
          profileImage: uploadedImageUrl,
          fullName: driverName,
          vehicleType: vehicleName,
          vehicleNumber,
          vehicleColor,
          nationalIdNumber,
          contactNumber,
          vehicleImages
        };
        localStorage.setItem("userData", JSON.stringify(newUserData));
        localStorage.setItem("user", JSON.stringify(newUserData));

        setPreviewImage(uploadedImageUrl);
        setPreviewVehicleImage1(uploadedVehicleUrl1);
        setPreviewVehicleImage2(uploadedVehicleUrl2);
        setProfileImage(null);
        setVehicleImageFile1(null);
        setVehicleImageFile2(null);
        setIsEditing(false);
        showToast("Driver profile details saved successfully!", "success");
      } else {
        showToast(response?.message || "Failed to save driver details. Please try again.", "error");
      }
    } catch (error) {
      console.error("Driver details save error:", error);
      showToast(error.message || "An error occurred while saving profile details.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-extrabold transition-all transform animate-bounce ${
          toast.type === "success"
            ? "bg-emerald-500 text-white border-emerald-600 shadow-emerald-200"
            : "bg-red-500 text-white border-red-600 shadow-red-200"
        }`}>
          <span className="text-lg">{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={bImage}
          alt="Sri Lanka View"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-[#E5F3FD]/70 to-[#E5F3FD] backdrop-blur-[3px]"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Header />

        <div className="flex-1 flex items-center justify-center w-full px-4 py-10 mt-20">
          <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-10 border border-blue-400">
            
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div 
                  onClick={() => {
                    setIsEditing(true);
                    fileInputRef.current?.click();
                  }}
                  className="w-28 h-28 bg-blue-100 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden cursor-pointer relative"
                  title="Click to change profile picture"
                >
                  {previewImage ? (
                    <img src={previewImage} alt="Driver Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-5xl text-blue-300" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    Change Photo
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  onClick={(e) => e.stopPropagation()}
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    fileInputRef.current?.click();
                  }}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                  title="Edit Profile Picture"
                >
                  ✏️
                </button>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 mt-4">Driver Profile</h2>
              <p className="text-sm text-slate-500 font-medium">Manage your personal and vehicle information</p>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              
              {/* Driver Name */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                  <FaUser className="text-blue-600" />
                  Driver name
                </label>
                <input
                  type="text"
                  placeholder="Driver name"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full ${!isEditing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-800'} border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 text-center`}
                />
              </div>

              {/* Vehicle Name */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                  <MdDirectionsCar className="text-blue-600" />
                  Vehicle name
                </label>
                <input
                  type="text"
                  placeholder="vehicle name"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full ${!isEditing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-800'} border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 text-center`}
                />
              </div>

              {/* Vehicle Number */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                  <FaCarSide className="text-blue-600" />
                  Vehicle number
                </label>
                <input
                  type="text"
                  placeholder="vehicle number"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full ${!isEditing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-800'} border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 text-center`}
                />
              </div>

              {/* Vehicle Color */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                  <MdColorLens className="text-blue-600" />
                  Vehicle color
                </label>
                <input
                  type="text"
                  placeholder="vehicle color"
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full ${!isEditing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-800'} border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 text-center`}
                />
              </div>

              {/* National ID */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                  <FaIdCard className="text-blue-600" />
                  National ID number
                </label>
                <input
                  type="text"
                  placeholder="National ID number"
                  value={nationalIdNumber}
                  onChange={(e) => setNationalIdNumber(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full ${!isEditing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-800'} border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 text-center`}
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                  <FaPhoneAlt className="text-blue-600" />
                  Contact number
                </label>
                <input
                  type="text"
                  placeholder="Contact number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full ${!isEditing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-800'} border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 text-center`}
                />
              </div>
            </div>

            {/* Vehicle & Document Images */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3">
                <MdDirectionsCar className="text-blue-600 text-base" />
                Vehicle & Document Images (2 Photos)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Image 1 Card */}
                <div 
                  onClick={() => {
                    setIsEditing(true);
                    vehicleInputRef1.current?.click();
                  }}
                  className="bg-[#F8FBFF] border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl p-3 flex flex-col items-center justify-center relative min-h-[170px] cursor-pointer group transition-all hover:bg-blue-50/50"
                  title="Click to upload Vehicle Photo 1"
                >
                  {previewVehicleImage1 ? (
                    <img src={previewVehicleImage1} alt="Vehicle 1" className="w-full h-36 object-cover rounded-xl shadow-sm" />
                  ) : (
                    <div className="flex flex-col items-center text-blue-400 gap-2 py-4">
                      <MdDirectionsCar className="text-4xl text-blue-400" />
                      <span className="text-xs font-bold text-slate-600">Upload Vehicle Photo 1</span>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={vehicleInputRef1}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setVehicleImageFile1(file);
                        setPreviewVehicleImage1(URL.createObjectURL(file));
                        setIsEditing(true);
                      }
                    }}
                    className="hidden"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      vehicleInputRef1.current?.click();
                    }}
                    className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg text-xs transition-transform transform hover:scale-105"
                    title="Upload Vehicle Image 1"
                  >
                    ✏️
                  </button>
                </div>

                {/* Image 2 Card */}
                <div 
                  onClick={() => {
                    setIsEditing(true);
                    vehicleInputRef2.current?.click();
                  }}
                  className="bg-[#F8FBFF] border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl p-3 flex flex-col items-center justify-center relative min-h-[170px] cursor-pointer group transition-all hover:bg-blue-50/50"
                  title="Click to upload Vehicle Photo 2 / Document"
                >
                  {previewVehicleImage2 ? (
                    <img src={previewVehicleImage2} alt="Vehicle 2 / Document" className="w-full h-36 object-cover rounded-xl shadow-sm" />
                  ) : (
                    <div className="flex flex-col items-center text-blue-400 gap-2 py-4">
                      <FaIdCard className="text-4xl text-blue-400" />
                      <span className="text-xs font-bold text-slate-600">Upload Photo 2 / Document</span>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={vehicleInputRef2}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setVehicleImageFile2(file);
                        setPreviewVehicleImage2(URL.createObjectURL(file));
                        setIsEditing(true);
                      }
                    }}
                    className="hidden"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      vehicleInputRef2.current?.click();
                    }}
                    className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg text-xs transition-transform transform hover:scale-105"
                    title="Upload Vehicle Image 2"
                  >
                    ✏️
                  </button>
                </div>

              </div>
            </div>

            {/* Toggle Options */}
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FaLocationArrow className="text-blue-600" />
                  Now show your current location
                </h3>

                <button
                  type="button"
                  onClick={() => setShowCurrentLocation(!showCurrentLocation)}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${
                    showCurrentLocation ? "bg-blue-500" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-all ${
                      showCurrentLocation ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FaCarSide className="text-blue-600" />
                  Availability
                </h3>

                <button
                  type="button"
                  onClick={() => setAvailability(!availability)}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${
                    availability ? "bg-blue-500" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-all ${
                      availability ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            {/* Action Rows */}
            <div className="mt-8 space-y-5">
              <div className="flex items-center justify-between gap-6">
                <h3 className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <TbCashBanknote className="text-blue-600" />
                  Earnings
                </h3>

                <button
                  type="button"
                  onClick={() => navigate('/driver-earnings')}
                  className="w-[170px] bg-[#3478F6] hover:bg-[#1f66e5] text-white py-3 rounded-xl flex items-center justify-center gap-4 shadow-lg shadow-blue-200 text-sm font-bold"
                >
                  Earnings
                  <IoCaretBackOutline className="rotate-180" />
                </button>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={handleSaveDriverDetails}
                disabled={loading}
                className="w-full max-w-sm bg-[#3478F6] hover:bg-[#1f66e5] disabled:bg-blue-300 text-white py-3 rounded-xl flex items-center justify-center gap-4 shadow-lg shadow-blue-200 text-sm font-bold"
              >
                {loading ? "Saving..." : isEditing ? "Save your details" : "Edit your details"}
                <IoCaretBackOutline className="rotate-180" />
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full max-w-sm bg-[#3478F6] hover:bg-[#1f66e5] text-white py-3 rounded-xl flex items-center justify-center gap-4 shadow-lg shadow-blue-200 text-sm font-bold"
              >
                Back
                <IoCaretBackOutline className="rotate-180" />
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
