import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { renterAPI } from "../../services/api";
import Header from "../../components/Renter/Header";
import Footer from "../../components/Renter/Footer";
import heroImg from "../../assets/Renter/bg.png";
import useGoogleAuth from "../../hooks/useGoogleAuth";

// Import social icons from assets (SVG files)
import googleIcon from '../../assets/HotelOwner/svg/google.svg';

const RenterSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { handleGoogleAuth, googleLoading, googleError } = useGoogleAuth(navigate, 'renter_user');

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
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
      const response = await renterAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber
      });

      if (!response.token) {
        throw new Error(response.message || "Registration failed");
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("userData", JSON.stringify(response.user));

      navigate("/vehicle-admin");
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
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
      </section>

      {/* LIGHT BLUE AREA */}
      <section className="pt-10 pb-20">
        <div className="max-w-[1080px] mx-auto bg-blue-200/50 min-h-[980px] -mt-84 relative z-20 p-[20px] flex flex-col gap-5">

          {/* TEXT */}
          <div className="px-4 lg:px-10 pt-10">
            <h1 className="text-[38px] font-bold text-black leading-tight">
              Welcome Smart Virtual Vehicle Rental Section
            </h1>

            <p className="mt-4 text-lg text-black max-w-[920px] pb-10">
              The definitive management console for premium vehicle fleets. Elevate your rental
              business and curate exceptional journeys across Sri Lanka with absolute professional mastery.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="w-full max-w-[760px] mx-auto bg-white rounded-[30px] p-[20px] shadow-md relative z-30 mb-10">

            {/* TITLE */}
            <div className="text-center mb-10">
              <h2 className="text-[34px] font-semibold text-gray-800">
                Create your account
              </h2>

              <p className="mt-3 text-gray-500">
                Start managing your rental business with professional precision.
              </p>
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
                  Vehicle Renter Full Name
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
                  Email Address of the Renter
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

              {/* WhatsApp Contact */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Contact Number (WhatsApp)
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
                className="w-full h-[48px] rounded-full bg-[#1565ff] text-white mt-2 font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Creating Account..." : "Create Account"}
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

            {/* Social Sign In */}
            <div className="mt-6 text-center">
              {googleError && (
                <div className="text-red-500 text-xs text-center mb-2 bg-red-50 p-1 rounded max-w-[200px] mx-auto">
                  {googleError}
                </div>
              )}
              <div className="flex justify-center gap-6">
                
                <div
                  className={`cursor-pointer hover:bg-gray-100 p-2 rounded-full transition ${googleLoading ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={handleGoogleAuth}
                  title="Sign up with Google"
                >
                  <img src={googleIcon} alt="Google" className="w-6 h-6 object-contain" />
                </div>
              </div>
        
            </div>

            {/* LOGIN */}
            <div className="text-center mt-10">
              <p className="text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold"
                >
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

export default RenterSignup;