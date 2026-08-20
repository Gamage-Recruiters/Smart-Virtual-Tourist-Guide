import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import HeroBg from '../../assets/Admin/airplane-bg.jpg';
import apiClient from '../../services/Admin/adminApi';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/admin/auth/login', {
        username: formData.username.trim(),
        password: formData.password,
      });

      localStorage.setItem('adminToken', response.token);

      const roleHome = response.data.role === 'Administrator'
        ? '/admin'
        : response.data.role === 'Moderator'
          ? '/admin/listings'
          : '/admin/access-denied';

      navigate(roleHome, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="relative overflow-hidden bg-[#eef8ff]">
        {/* Hero image */}
        <section
          className="relative h-[280px] sm:h-[330px] md:h-[390px] lg:h-[430px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${HeroBg})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400/5 via-transparent to-[#d8efff]/45" />

          {/* Figma-style translucent panel at bottom of hero */}
          <div className="absolute bottom-0 left-1/2 h-[92px] w-[86%] max-w-[1280px] -translate-x-1/2 bg-sky-300/20 backdrop-blur-[1px]" />
        </section>

        {/* Login background */}
        <section className="relative bg-[#d9effd] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="mx-auto flex w-full max-w-[880px] justify-center">
            <div className="w-full max-w-[610px] rounded-[14px] bg-white px-7 py-10 shadow-[0_10px_40px_rgba(30,119,242,0.08)] sm:px-12 sm:py-14 lg:px-16">
              <div className="mb-8 text-center">
                <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[#1677ff] sm:text-[25px]">
                  Welcome To The Admin Panel
                </h1>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Username / Email */}
                <div className="mb-6">
                  <label
                    htmlFor="username"
                    className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.08em] text-[#555c66]"
                  >
                    Email or Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                    placeholder="admin@svtg.lk or admin"
                    className="
                      h-[38px]
                      w-full
                      border-0
                      border-b
                      border-[#d9dde4]
                      bg-[#f2f4f7]
                      px-3
                      text-[12px]
                      text-[#262b33]
                      outline-none
                      transition
                      placeholder:text-[#aeb4bd]
                      focus:border-[#1677ff]
                      focus:bg-[#f8fbff]
                      focus:ring-0
                    "
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.08em] text-[#555c66]"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••"
                    className="
                      h-[38px]
                      w-full
                      border-0
                      border-b
                      border-[#d9dde4]
                      bg-[#f2f4f7]
                      px-3
                      text-[12px]
                      text-[#262b33]
                      outline-none
                      transition
                      placeholder:text-[#aeb4bd]
                      focus:border-[#1677ff]
                      focus:bg-[#f8fbff]
                      focus:ring-0
                    "
                  />
                </div>

                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    className="text-[8px] font-medium uppercase tracking-[0.04em] text-[#49505a] transition hover:text-[#1677ff]"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    mt-8
                    flex
                    h-[42px]
                    w-full
                    items-center
                    justify-center
                    rounded-[6px]
                    text-[11px]
                    font-semibold
                    text-white
                    shadow-[0_5px_12px_rgba(22,119,255,0.15)]
                    transition-all
                    duration-200
                    ${
                      loading
                        ? 'cursor-not-allowed bg-blue-400'
                        : 'bg-[#1677ff] hover:bg-[#0869e8] hover:shadow-[0_8px_18px_rgba(22,119,255,0.22)]'
                    }
                  `}
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default Login;
