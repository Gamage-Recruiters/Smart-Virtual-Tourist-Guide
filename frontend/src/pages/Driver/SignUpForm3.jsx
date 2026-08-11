
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Driver/Header";
import Footer from "../../components/Guide/Footer";
import heroImg from "../../assets/Driver/bg.jpg";
import { useDriverSignup } from "../../context/DriverSignupContext";
import { driverAPI } from "../../services/api";

import {
  Camera,
  X,
  ChevronLeft,
  CheckCircle,
  Loader2,
  AlertCircle,
  FileText,
  BookOpen,
  Car,
  Hash,
  CreditCard,
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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

// ─── Success Screen ───────────────────────────────────────────────────────────

const SuccessScreen = () => (
  <div className="flex flex-col items-center justify-center py-10 text-center animate-fadeIn">
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5">
      <CheckCircle size={44} className="text-green-500" />
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">Account Created!</h3>
    <p className="text-gray-500 text-sm">
      Welcome aboard! Redirecting you to your dashboard…
    </p>
  </div>
);

// ─── Image Upload Section ─────────────────────────────────────────────────────

const UploadSection = ({ title, icon: Icon, images, setter, id }) => {
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file,
    }));
    setter((prev) => [...prev, ...newImages]);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const removeImage = (imgId) => {
    setter((prev) => {
      const updated = prev.filter((img) => img.id !== imgId);
      return updated;
    });
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon size={16} className="text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
        {images.length > 0 && (
          <span className="ml-auto text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
            {images.length} file{images.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Upload area */}
      <label
        htmlFor={id}
        className="w-full h-28 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-500 transition-all duration-200 mb-3"
      >
        <Camera size={28} className="text-blue-400 mb-1" />
        <p className="text-xs text-gray-400">Click to upload images</p>
        <input
          id={id}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </label>

      {/* Previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.url}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg shadow-sm ring-1 ring-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors opacity-80 group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const DriverSignUpForm3 = () => {
  const navigate = useNavigate();
  const { step1Data, step2Data, step3Data, setStep3Data, clearSignupData } =
    useDriverSignup();

  const [licenseImages, setLicenseImages] = useState(step3Data.licenseImages ?? []);
  const [regBookImages, setRegBookImages] = useState(step3Data.regBookImages ?? []);
  const [vehicleImages, setVehicleImages] = useState(step3Data.vehicleImages ?? []);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "vehicleNumber":
        if (!value.trim()) return "Vehicle registration number is required";
        return "";
      case "licenseNumber":
        if (!value.trim()) return "License number is required";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStep3Data({ [name]: value });
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Save image state back to context
    setStep3Data({ licenseImages, regBookImages, vehicleImages });

    // Build the FormData payload for backend
    const formData = new FormData();
    formData.append("fullName", step1Data.fullName.trim());
    formData.append("email", step1Data.email.trim());
    formData.append("password", step1Data.password);
    formData.append("contactNumber", step1Data.contactNumber.trim());
    formData.append("vehicleType", step2Data.vehicleType.trim());
    formData.append("vehicleNumber", step3Data.vehicleNumber.trim());
    formData.append("licenseNumber", step3Data.licenseNumber.trim());

    // Append Images
    licenseImages.forEach(img => formData.append("licenseImages", img.file));
    regBookImages.forEach(img => formData.append("regBookImages", img.file));
    vehicleImages.forEach(img => formData.append("vehicleImages", img.file));

    if (!step3Data.vehicleNumber.trim()) {
      setErrors(prev => ({ ...prev, vehicleNumber: "Vehicle registration number is required" }));
      setTouched(prev => ({ ...prev, vehicleNumber: true }));
      return;
    }
    if (!step3Data.licenseNumber.trim()) {
      setErrors(prev => ({ ...prev, licenseNumber: "License number is required" }));
      setTouched(prev => ({ ...prev, licenseNumber: true }));
      return;
    }

    setIsLoading(true);
    try {
      const res = await driverAPI.register(formData);

      // Persist the JWT so the user is logged in immediately
      if (res.token) {
        localStorage.setItem("token", res.token);
      }
      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
      }

      clearSignupData();
      setIsSuccess(true);

      // Redirect after a short success animation
      setTimeout(() => navigate("/dashboard-Driver"), 2000);
    } catch (err) {
      setApiError(
        err?.message || "Registration failed. Please check your details and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
      <section className="relative -mt-[400px] z-20 px-4 pb-20">
        <div className="max-w-[620px] mx-auto bg-white rounded-[24px] shadow-2xl p-8">

          {isSuccess ? (
            <SuccessScreen />
          ) : (
            <>
              {/* Title */}
              <div className="text-center mb-2">
                <h2 className="text-[26px] font-bold text-gray-800">
                  Upload Documents
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Step 3 of 3 — Verification Documents
                </p>
              </div>

              {/* Progress */}
              <StepIndicator current={3} />

              {/* Summary banner — show what we collected */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-800">
                <p className="font-semibold mb-1">Registration Summary</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-blue-700">
                  <span>👤 {step1Data.fullName || "—"}</span>
                  <span>📧 {step1Data.email || "—"}</span>
                  <span>🚗 {step2Data.vehicleType || "—"}</span>
                  <span>📞 {step1Data.contactNumber || "—"}</span>
                </div>
              </div>

              {/* API Error */}
              {apiError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{apiError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-7">
                
                {/* Vehicle Registration Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 ml-1">
                    Vehicle Registration Number
                  </label>
                  <div className={`flex items-center px-4 rounded-xl transition-all duration-200 ${
                    errors.vehicleNumber && touched.vehicleNumber
                      ? "bg-red-50 ring-2 ring-red-300"
                      : "bg-gray-100 focus-within:ring-2 focus-within:ring-blue-300"
                  }`}>
                    <Hash size={20} className="text-blue-600 mr-3 flex-shrink-0" />
                    <input
                      id="driver-vehicleNumber"
                      type="text"
                      name="vehicleNumber"
                      value={step3Data.vehicleNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. WP CAB-1234"
                      className="w-full h-14 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  {errors.vehicleNumber && touched.vehicleNumber && (
                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1 ml-1">
                      <AlertCircle size={12} /> {errors.vehicleNumber}
                    </p>
                  )}
                </div>

                {/* License Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 ml-1">
                    Driver License Number
                  </label>
                  <div className={`flex items-center px-4 rounded-xl transition-all duration-200 ${
                    errors.licenseNumber && touched.licenseNumber
                      ? "bg-red-50 ring-2 ring-red-300"
                      : "bg-gray-100 focus-within:ring-2 focus-within:ring-blue-300"
                  }`}>
                    <CreditCard size={20} className="text-blue-600 mr-3 flex-shrink-0" />
                    <input
                      id="driver-licenseNumber"
                      type="text"
                      name="licenseNumber"
                      value={step3Data.licenseNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. B1234567"
                      className="w-full h-14 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  {errors.licenseNumber && touched.licenseNumber && (
                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1 ml-1">
                      <AlertCircle size={12} /> {errors.licenseNumber}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400 font-medium">DOCUMENT UPLOADS</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <UploadSection
                  id="upload-license"
                  title="Driver License"
                  icon={FileText}
                  images={licenseImages}
                  setter={setLicenseImages}
                />

                <UploadSection
                  id="upload-regbook"
                  title="Vehicle Registration Book"
                  icon={BookOpen}
                  images={regBookImages}
                  setter={setRegBookImages}
                />

                <UploadSection
                  id="upload-vehicle"
                  title="Vehicle Photos"
                  icon={Car}
                  images={vehicleImages}
                  setter={setVehicleImages}
                />

                {/* Navigation */}
                <div className="flex gap-3">
                  <button
                    id="driver-signup3-back"
                    type="button"
                    onClick={() => navigate("/driver-signup2")}
                    disabled={isLoading}
                    className="flex-1 h-14 border-2 border-gray-200 hover:border-blue-400 text-gray-600 hover:text-blue-600 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                    Back
                  </button>

                  <button
                    id="driver-signup3-create"
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] h-14 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Creating Account…
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Create Account
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-xs text-gray-400">
                  By creating an account you agree to our{" "}
                  <span className="text-blue-500 cursor-pointer hover:underline">
                    Terms of Service
                  </span>{" "}
                  &amp;{" "}
                  <span className="text-blue-500 cursor-pointer hover:underline">
                    Privacy Policy
                  </span>
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
};

export default DriverSignUpForm3;
