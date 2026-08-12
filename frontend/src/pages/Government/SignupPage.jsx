import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { governmentAPI } from "../../services/api";
import Header from "../../components/Government/Header";
import Footer from "../../components/HotelOwner/Footer";
import cityBg from "../../assets/Government/bg.jpg";
import useGoogleAuth from "../../hooks/useGoogleAuth";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { handleGoogleAuth, googleLoading, googleError } = useGoogleAuth(navigate, 'government_user');

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
      const response = await governmentAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      if (!response.token) {
        throw new Error(response.message || "Registration failed");
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("userData", JSON.stringify(response.user));

      navigate("/dashboard-Government");
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative h-[calc(100vh-100px)]">
        {/* Background */}
        <img
          src={cityBg}
          alt="City"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Form Container */}
        <div className="relative z-10 flex justify-center items-center h-full px-4">
          <div
            className="
              w-full
              max-w-[600px]
              bg-white
              border border-gray-200
              rounded-3xl
              shadow-2xl
              px-8
              py-6
            "
          >
            {/* Title */}
            <h2 className="text-center text-2xl font-semibold text-black mb-6">
              Sign Up
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-600 text-sm text-center bg-white/80 p-2 rounded">
                  {error}
                </div>
              )}

              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-black">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      h-11
                      px-4
                      rounded-xl
                      bg-white
                      border
                      border-gray-300
                      outline-none
                    "
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-black">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      h-11
                      px-4
                      rounded-xl
                      bg-white
                      border
                      border-gray-300
                      outline-none
                    "
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm mb-2 text-black">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    h-11
                    px-4
                    rounded-xl
                    bg-white
                    border
                    border-gray-300
                    outline-none
                  "
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm mb-2 text-black">
                  Password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="
                    w-full
                    h-11
                    px-4
                    pr-12
                    rounded-xl
                    bg-white
                    border
                    border-gray-300
                    outline-none
                  "
                />

                <button
                  type="button"
                  className="absolute right-4 top-[70%] -translate-y-1/2 text-gray-600"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-sm mb-2 text-black">
                  Confirm Password
                </label>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="
                    w-full
                    h-11
                    px-4
                    pr-12
                    rounded-xl
                    bg-white
                    border
                    border-gray-300
                    outline-none
                  "
                />

                <button
                  type="button"
                  className="absolute right-4 top-[70%] -translate-y-1/2 text-gray-600"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              {/* Terms */}
              <div className="flex items-center gap-2">
                <input type="checkbox" required />

                <span className="text-xs text-black">
                  I agree with Terms & Conditions
                </span>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-11
                  rounded-xl
                  bg-blue-600
                  text-white
                  font-medium
                  hover:bg-blue-700
                  duration-300
                  disabled:opacity-50
                "
              >
                {loading ? "Creating Account..." : "Create an Account"}
              </button>

              {/* Login */}
              <p className="text-center text-sm text-black">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-700 font-bold"
                >
                  Sign in
                </Link>
              </p>

              {/* Social */}
              {googleError && (
                <div className="text-red-500 text-xs text-center mb-2 bg-red-50 p-1 rounded max-w-[200px] mx-auto">
                  {googleError}
                </div>
              )}
              <div className="flex justify-center gap-6 pt-1">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="google"
                  className={`w-6 h-6 cursor-pointer transition ${googleLoading ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={handleGoogleAuth}
                  title="Sign up with Google"
                />

                <img
                  src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                  alt="facebook"
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />

    </div>
  );
};

export default RegisterScreen;