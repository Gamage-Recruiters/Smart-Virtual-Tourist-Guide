
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Driver/Header";
import Footer from "../../components/Guide/Footer";
import heroImg from "../../assets/Driver/bg.jpg";
import { useDriverSignup } from "../../context/DriverSignupContext";

import {
  Truck,
  Grid,
  Calendar,
  Package,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";

// ─── Progress Stepper ────────────────────────────────────────────────────────

const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {[1, 2, 3].map((step) => (
      <React.Fragment key={step}>
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            step < current
              ? "bg-blue-600 text-white shadow-md"
              : step === current
              ? "bg-blue-600 text-white shadow-lg ring-4 ring-blue-100"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          {step < current ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            step
          )}
        </div>
        {step < 3 && (
          <div
            className={`h-1 w-12 rounded-full transition-all duration-300 ${
              step < current ? "bg-blue-600" : "bg-gray-200"
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const DriverSignUpForm2 = () => {
  const navigate = useNavigate();
  const { step2Data, setStep2Data } = useDriverSignup();

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateField = (name, value) => {
    switch (name) {
      case "vehicleType":
        if (!value.trim()) return "Vehicle type is required";
        return "";
      case "vehicleCategory":
        if (!value.trim()) return "Vehicle category is required";
        return "";
      case "manufactureDate":
        if (!value) return "Manufacture date is required";
        return "";
      case "loadType":
        if (!value.trim()) return "Load type is required";
        return "";
      default:
        return "";
    }
  };

  const requiredFields = [
    "vehicleType",
    "vehicleCategory",
    "manufactureDate",
    "loadType",
  ];

  const validateAll = () => {
    const newErrors = {};
    const newTouched = {};
    requiredFields.forEach((f) => {
      newTouched[f] = true;
      const err = validateField(f, step2Data[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    setTouched(newTouched);
    return Object.keys(newErrors).length === 0;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStep2Data({ [name]: value });
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    navigate("/driver-signup3");
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const fieldClass = (name) =>
    `flex items-center px-4 rounded-xl transition-all duration-200 ${
      errors[name] && touched[name]
        ? "bg-red-50 ring-2 ring-red-300"
        : "bg-gray-100 focus-within:ring-2 focus-within:ring-blue-300"
    }`;

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative h-[820px]">
        <img
          src={heroImg}
          alt="Driver signup background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </section>

      {/* Floating Form */}
      <section className="relative -mt-[420px] z-20 px-4 pb-20">
        <div className="max-w-[520px] mx-auto bg-white rounded-[24px] shadow-2xl p-8">

          {/* Title */}
          <div className="text-center mb-2">
            <h2 className="text-[26px] font-bold text-gray-800">
              Vehicle Details
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Step 2 of 3 — Vehicle Information
            </p>
          </div>

          {/* Progress */}
          <StepIndicator current={2} />

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Vehicle Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 ml-1">
                Vehicle Type
              </label>
              <div className={fieldClass("vehicleType")}>
                <Truck size={20} className="text-blue-600 mr-3 flex-shrink-0" />
                <input
                  id="driver-vehicleType"
                  type="text"
                  name="vehicleType"
                  value={step2Data.vehicleType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Car, Van, Tuk-Tuk, Bus…"
                  className="w-full h-14 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.vehicleType && touched.vehicleType && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1 ml-1">
                  <AlertCircle size={12} /> {errors.vehicleType}
                </p>
              )}
            </div>

            {/* Vehicle Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 ml-1">
                Vehicle Category
              </label>
              <div className={fieldClass("vehicleCategory")}>
                <Grid size={20} className="text-blue-600 mr-3 flex-shrink-0" />
                <input
                  id="driver-vehicleCategory"
                  type="text"
                  name="vehicleCategory"
                  value={step2Data.vehicleCategory}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Private, Commercial, Tourist"
                  className="w-full h-14 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.vehicleCategory && touched.vehicleCategory && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1 ml-1">
                  <AlertCircle size={12} /> {errors.vehicleCategory}
                </p>
              )}
            </div>

            {/* Manufacture Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 ml-1">
                Manufacture Date
              </label>
              <div className={fieldClass("manufactureDate")}>
                <Calendar size={20} className="text-blue-600 mr-3 flex-shrink-0" />
                <input
                  id="driver-manufactureDate"
                  type="date"
                  name="manufactureDate"
                  value={step2Data.manufactureDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full h-14 bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
              {errors.manufactureDate && touched.manufactureDate && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1 ml-1">
                  <AlertCircle size={12} /> {errors.manufactureDate}
                </p>
              )}
            </div>

            {/* Load Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 ml-1">
                Load Type
              </label>
              <div className={fieldClass("loadType")}>
                <Package size={20} className="text-blue-600 mr-3 flex-shrink-0" />
                <input
                  id="driver-loadType"
                  type="text"
                  name="loadType"
                  value={step2Data.loadType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Light, Heavy, Passengers, Goods"
                  className="w-full h-14 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.loadType && touched.loadType && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1 ml-1">
                  <AlertCircle size={12} /> {errors.loadType}
                </p>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-2">
              <button
                id="driver-signup2-back"
                type="button"
                onClick={() => navigate("/driver-signup1")}
                className="flex-1 h-14 border-2 border-gray-200 hover:border-blue-400 text-gray-600 hover:text-blue-600 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ChevronLeft size={20} />
                Back
              </button>

              <button
                id="driver-signup2-next"
                type="submit"
                className="flex-[2] h-14 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Next Step
                <ChevronRight size={20} />
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default DriverSignUpForm2;
