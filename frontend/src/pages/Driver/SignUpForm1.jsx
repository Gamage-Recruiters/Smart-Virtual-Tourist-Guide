import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Guide/Header";
import Footer from "../../components/Guide/Footer";
import heroImg from "../../assets/Driver/bg.jpg";

const GuideSignup = () => {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative h-[820px]">
        <img
          src={heroImg}
          alt="Guide"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Floating Form Card */}
      <section className="relative -mt-[220px] z-20 px-4 pb-20">
        <div className="max-w-[520px] mx-auto bg-white rounded-[24px] shadow-2xl p-8">

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-[24px] font-semibold text-gray-800">
              Selected Create Account
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-6 text-sm">
            <button className="text-gray-400 px-4 py-2 border-b border-transparent">
              Login
            </button>

            <button className="text-blue-600 font-semibold px-4 py-2 border-b-2 border-blue-600">
              Create a driver account
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4">

            {/* Email */}
            <div>
              <div className="flex items-center border rounded-md px-3 bg-gray-50">
                <span className="text-gray-400 text-sm mr-2">✉</span>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full h-11 bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center border rounded-md px-3 bg-gray-50">
                <span className="text-gray-400 text-sm mr-2">🔒</span>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full h-11 bg-transparent outline-none text-sm"
                />
                <span className="text-gray-400 cursor-pointer">👁</span>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <div className="flex items-center border rounded-md px-3 bg-gray-50">
                <span className="text-gray-400 text-sm mr-2">👤</span>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full h-11 bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-center border rounded-md px-3 bg-gray-50">
                <span className="text-gray-400 text-sm mr-2">📞</span>
                <input
                  type="text"
                  placeholder="+94 -----------"
                  className="w-full h-11 bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold mt-2"
            >
              Next step
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default GuideSignup;