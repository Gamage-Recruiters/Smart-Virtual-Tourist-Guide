import React, { useState } from "react";
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

  const [driverName, setDriverName] = useState("Mendaka Peiris");
  const [vehicleName, setVehicleName] = useState("Toyota Prius");
  const [vehicleNumber, setVehicleNumber] = useState("CBA-1234");
  const [vehicleColor, setVehicleColor] = useState("Pearl White");
  const [nationalIdNumber, setNationalIdNumber] = useState("199012345678");
  const [contactNumber, setContactNumber] = useState("0712345678");

  const [showCurrentLocation, setShowCurrentLocation] = useState(false);
  const [availability, setAvailability] = useState(false);

  const [loading, setLoading] = useState(false);

  const tripId = "TRIP001";

  const handleSaveDriverDetails = async () => {
    if (
      !driverName ||
      !vehicleName ||
      !vehicleNumber ||
      !vehicleColor ||
      !nationalIdNumber ||
      !contactNumber
    ) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          driverName,
          vehicleName,
          vehicleNumber,
          vehicleColor,
          nationalIdNumber,
          contactNumber,
          showCurrentLocation,
          availability
        })
      });

      const result = await response.json();

      if (result.success) {
      } else {
      }
    } catch (error) {
      console.error("Driver details save error:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="relative min-h-screen flex flex-col font-sans">
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
              <div className="relative">
                <div className="w-24 h-24 bg-blue-100 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                  <FaUser className="text-4xl text-blue-300" />
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 text-center"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 text-center"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 text-center"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 text-center"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 text-center"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 text-center"
                />
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
                {loading ? "Saving..." : "Edit your details"}
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

