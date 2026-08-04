import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../services/api";
import Header from "../../components/Admin/Header";
import Footer from "../../components/Admin/Footer";
import heroImg from "../../assets/Admin/bg.jpg";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiClient.post('/auth/login', {
        identifier: email,
        password,
      });

      if (data.token) {
        if (data.user.role !== 'admin') {
          throw new Error('Access denied. Admin role required.');
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        navigate('/dashboard-Admin');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      {/* HERO IMAGE */}
      <section className="relative h-[720px]">
        <img
          src={heroImg}
          alt="admin"
          className="w-full h-full object-cover"
        />
      </section>

      {/* LIGHT BLUE AREA */}
      <section className="pt-10 pb-20">
        <div className="max-w-[1080px] mx-auto bg-blue-200/50 h-auto -mt-84 relative z-20 p-[20px] flex flex-col items-center">

          {/* LOGIN CARD */}
          <div className="w-full max-w-[760px] bg-white rounded-[30px] p-[40px] shadow-md relative z-30 my-10">

            {/* TITLE */}
            <div className="text-center mb-10">
              <h2 className=" text-[36px] font-semibold text-gray-800">
                Welcome to the Admin Panel
              </h2>
              {error && (
                <div className="text-red-500 text-sm mt-3 bg-red-50 p-2 rounded max-w-[500px] mx-auto text-center">
                  {error}
                </div>
              )}
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6 max-w-[500px] mx-auto">

              {/* EMAIL */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[50px] bg-[#f5f7fa] rounded-md px-4 outline-none border border-transparent focus:border-blue-500"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[50px] bg-[#f5f7fa] rounded-md px-4 outline-none border border-transparent focus:border-blue-500"
                />

                {/* FORGOT PASSWORD */}
                <div className="text-right mt-2">
                  <Link
                    to="/admin/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[50px] rounded-md bg-[#1565ff] text-white font-medium hover:bg-[#0d56e8] transition disabled:opacity-50"
              >
                {loading ? "Logging In..." : "Log In"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AdminLogin;