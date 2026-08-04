import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { guideAPI } from "../../services/api";
import Header from "../../components/Guide/Header";
import Footer from "../../components/Guide/Footer";
import heroImg from "../../assets/Guide/bg.jpg";
import useGoogleAuth from "../../hooks/useGoogleAuth";

const GuideSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { handleGoogleAuth, googleLoading, googleError } = useGoogleAuth(navigate, "guide_user");
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    guideId: "",
    dob: "",
    gender: "Male",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (genderVal) => {
    setFormData((prev) => ({
      ...prev,
      gender: genderVal
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await guideAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber,
        guideId: formData.guideId,
        dob: formData.dob,
        gender: formData.gender
      });

      if (!response.token) {
        throw new Error(response.message || "Registration failed");
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("userData", JSON.stringify(response.user));

      navigate("/dashboard-Guide");
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      {/* HERO IMAGE */}
      <section className="relative h-[820px]">
        <img
          src={heroImg}
          alt="guide"
          className="w-full h-full object-cover"
        />
      </section>

      {/* LIGHT BLUE AREA */}
      <section className="pt-10 pb-20">
        {/* WELCOME BOX */}
        <div className="max-w-[1080px] mx-auto bg-blue-200/50 min-h-[980px] -mt-84 relative z-20 p-[20px] flex flex-col gap-5">

          {/* Welcome Text */}
          <div className="px-4 lg:px-10 pt-10">
            <h1 className="text-[38px] font-bold text-black leading-tight">
              Welcome Smart Virtual Tourist Guide...
            </h1>

            <p className="mt-4 text-lg text-black max-w-[720px] pb-10">
              Create your guide profile and start delivering exceptional travel experiences.<br></br>
              Connect with travelers and showcase your expertise with confidence.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="w-full max-w-[760px] mx-auto bg-white rounded-[30px] p-[20px] shadow-md relative z-30 mb-10">

            {/* TITLE */}
            <div className="text-center mb-8">
              <h2 className="text-[34px] font-semibold text-gray-800">
                Create your account
              </h2>
              {error && (
                <div className="text-red-500 text-sm mt-3 bg-red-50 p-2 rounded max-w-[500px] mx-auto text-center">
                  {error}
                </div>
              )}
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5 max-w-[500px] mx-auto">

              {/* Full Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                  className="w-full h-[48px] bg-[#f5f7fa] rounded-md px-4 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full h-[48px] bg-[#f5f7fa] rounded-md px-4 outline-none"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  placeholder="07XXXXXXXX"
                  className="w-full h-[48px] bg-[#f5f7fa] rounded-md px-4 outline-none"
                />
              </div>

              {/* Guide ID */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Guide ID
                </label>
                <input
                  type="text"
                  name="guideId"
                  value={formData.guideId}
                  onChange={handleChange}
                  required
                  placeholder="Guide ID"
                  className="w-full h-[48px] bg-[#f5f7fa] rounded-md px-4 outline-none"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  placeholder="MM/DD/YY"
                  className="w-full h-[48px] bg-[#f5f7fa] rounded-md px-4 outline-none"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Gender
                </label>

                <div className="flex gap-6 text-sm text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === "Male"}
                      onChange={() => handleGenderChange("Male")}
                    />
                    Male
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === "Female"}
                      onChange={() => handleGenderChange("Female")}
                    />
                    Female
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === "Other"}
                      onChange={() => handleGenderChange("Other")}
                    />
                    Other
                  </label>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="w-full h-[48px] bg-[#f5f7fa] rounded-md px-4 outline-none"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="Confirm password"
                  className="w-full h-[48px] bg-[#f5f7fa] rounded-md px-4 outline-none"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full max-w-[470px] h-[48px] mx-auto block rounded-md bg-[#1565ff] text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="max-w-[500px] mx-auto flex items-center my-8">
              <div className="flex-1 border-t border-gray-300"></div>

              <span className="px-4 text-xs tracking-widest text-gray-400">
                OR SIGN UP WITH
              </span>

              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* SOCIAL */}
            {googleError && (
              <div className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded max-w-[470px] mx-auto text-center">
                {googleError}
              </div>
            )}
            <div className="max-w-[470px] mx-auto flex gap-3">
              <button
                type="button"
                disabled={googleLoading}
                onClick={handleGoogleAuth}
                className="flex-1 h-[50px] border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                {googleLoading ? "Connecting..." : "Google"}
              </button>

              {/* FACEBOOK */}
              <button type="button" className="flex-1 h-[50px] border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                <img
                  src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
                Facebook
              </button>
            </div>

            {/* LOGIN LINK */}
            <div className="text-center mt-10">
              <p className="text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>

            {/* TERMS */}
            <div className="text-center mt-8 text-xs text-gray-400">
              By creating an account, you agree to our{" "}
              <span className="underline">Terms of Service</span> and{" "}
              <span className="underline">Privacy Policy</span>.
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default GuideSignup;