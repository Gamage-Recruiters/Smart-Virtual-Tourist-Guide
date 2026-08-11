
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Driver/Header";
import Footer from "../../components/Guide/Footer";
import heroImg from "../../assets/Driver/bg.jpg";
import { useDriverSignup } from "../../context/DriverSignupContext";

import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ChevronRight,
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

const DriverSignUpForm1 = () => {
  const navigate = useNavigate();
  const { step1Data, setStep1Data } = useDriverSignup();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(value.trim()))
          return "Please enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== step1Data.password) return "Passwords do not match";
        return "";
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 3)
          return "Name must be at least 3 characters";
        return "";
      case "contactNumber":
        if (!value.trim()) return "Contact number is required";
        if (!/^[+]?[\d\s-]{7,15}$/.test(value.trim()))
          return "Please enter a valid phone number";
        return "";
      default:
        return "";
    }
  };

  const validateAll = () => {
    const fields = ["email", "password", "confirmPassword", "fullName", "contactNumber"];
    const newErrors = {};
    fields.forEach((f) => {
      const err = validateField(f, step1Data[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    setTouched({ email: true, password: true, confirmPassword: true, fullName: true, contactNumber: true });
    return Object.keys(newErrors).length === 0;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStep1Data({ [name]: value });
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
    navigate("/driver-signup2");
  };

  // ── Field helper ───────────────────────────────────────────────────────────

  const fieldClass = (name) =>
    `flex items-center px-4 rounded-xl transition-all duration-200 ${
      errors[name] && touched[name]
        ? "bg-red-50 ring-2 ring-red-300"
        : "bg-gray-100 focus-within:ring-2 focus-within:ring-blue-300"
    }`;

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative h-[820px]">
        <img
          src={heroImg}
          alt="Driver signup background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-black/30" />
      </section>

      {/* Floating Form Card */}
      <section className="relative -mt-[360px] z-20 px-4 pb-20">
        <div className="max-w-[520px] mx-auto bg-white rounded-[24px] shadow-2xl p-8">

          {/* Title */}
          <div className="text-center mb-2">
            <h2 className="text-[26px] font-bold text-gray-800">
              Create Driver Account
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Step 1 of 3 — Personal Information
            </p>
          </div>

          {/* Step Progress */}
          <StepIndicator current={1} />

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Full Name */}
            <div>
              <div className={fieldClass("fullName")}>
                <User size={20} className="text-blue-600 mr-3 flex-shrink-0" />
                <input
                  id="driver-fullname"
                  type="text"
                  name="fullName"
                  value={step1Data.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your Full Name"
                  autoComplete="name"
                  className="w-full h-14 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.fullName && touched.fullName && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1 ml-1">
                  <AlertCircle size={12} /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className={fieldClass("email")}>
                <Mail size={20} className="text-blue-600 mr-3 flex-shrink-0" />
                <input
                  id="driver-email"
                  type="email"
                  name="email"
                  value={step1Data.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Email Address"
                  autoComplete="email"
                  className="w-full h-14 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.email && touched.email && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1 ml-1">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className={fieldClass("password")}>
                <Lock size={20} className="text-blue-600 mr-3 flex-shrink-0" />
                <input
                  id="driver-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={step1Data.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Password (min. 8 characters)"
                  autoComplete="new-password"
                  className="w-full h-14 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0 ml-2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1 ml-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className={fieldClass("confirmPassword")}>
                <Lock size={20} className="text-blue-600 mr-3 flex-shrink-0" />
                <input
                  id="driver-confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={step1Data.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  className="w-full h-14 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0 ml-2"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1 ml-1">
                  <AlertCircle size={12} /> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <div className={fieldClass("contactNumber")}>
                <Phone size={20} className="text-blue-600 mr-3 flex-shrink-0" />
                <input
                  id="driver-contact"
                  type="tel"
                  name="contactNumber"
                  value={step1Data.contactNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+94 77 000 0000"
                  autoComplete="tel"
                  className="w-full h-14 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.contactNumber && touched.contactNumber && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1 ml-1">
                  <AlertCircle size={12} /> {errors.contactNumber}
                </p>
              )}
            </div>

            {/* Next Step Button */}
            <button
              id="driver-signup1-next"
              type="submit"
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-2"
            >
              Next Step
              <ChevronRight size={20} />
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500 mt-2">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Log In
              </button>
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default DriverSignUpForm1;
