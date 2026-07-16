import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const SignInPage = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/main");
    } catch (err) {
      setError(err.message || "Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#eaf4fb] flex items-center justify-center px-4 py-16">
        {/* Decorative blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ position: "fixed" }}
        >
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "-8%",
              width: "420px",
              height: "420px",
              background: "radial-gradient(circle, rgba(0,117,255,0.12) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "8%",
              right: "-6%",
              width: "360px",
              height: "360px",
              background: "radial-gradient(circle, rgba(60,180,255,0.14) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
          />
        </div>

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div
            className="rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(0,117,255,0.12)",
            }}
          >
            {/* Top accent strip */}
            <div
              style={{
                height: "5px",
                background: "linear-gradient(90deg, #0075FF 0%, #3CB4FF 100%)",
              }}
            />

            <div className="px-10 py-10">
              {/* Heading */}
              <div className="mb-8 text-center">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                  style={{
                    background: "linear-gradient(135deg, #0075FF 0%, #3CB4FF 100%)",
                    boxShadow: "0 8px 24px rgba(0,117,255,0.28)",
                  }}
                >
                  {/* Lock icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    width="26"
                    height="26"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome Back
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Sign in to continue your Sri Lanka adventure
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="mb-5 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#dc2626",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="16"
                    height="16"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Email */}
                <div>
                  <label
                    htmlFor="signin-email"
                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        width="18"
                        height="18"
                      >
                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                      </svg>
                    </span>
                    <input
                      id="signin-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
                      style={{
                        background: "rgba(241,245,249,0.9)",
                        border: "1.5px solid rgba(203,213,225,0.8)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#0075FF";
                        e.target.style.boxShadow = "0 0 0 3px rgba(0,117,255,0.12)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(203,213,225,0.8)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="signin-password"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs font-medium text-[#0075FF] hover:text-[#0059CC] transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        width="18"
                        height="18"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
                      style={{
                        background: "rgba(241,245,249,0.9)",
                        border: "1.5px solid rgba(203,213,225,0.8)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#0075FF";
                        e.target.style.boxShadow = "0 0 0 3px rgba(0,117,255,0.12)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(203,213,225,0.8)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          width="18"
                          height="18"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
                            clipRule="evenodd"
                          />
                          <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          width="18"
                          height="18"
                        >
                          <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                          <path
                            fillRule="evenodd"
                            d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2.5">
                  <input
                    id="signin-remember"
                    type="checkbox"
                    className="w-4 h-4 rounded accent-[#0075FF] cursor-pointer"
                  />
                  <label
                    htmlFor="signin-remember"
                    className="text-sm text-slate-600 cursor-pointer select-none"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit */}
                <button
                  id="signin-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 active:scale-95"
                  style={{
                    background: isLoading
                      ? "linear-gradient(90deg, #93c5fd 0%, #7dd3fc 100%)"
                      : "linear-gradient(90deg, #0075FF 0%, #3CB4FF 100%)",
                    boxShadow: isLoading
                      ? "none"
                      : "0 6px 20px rgba(0,117,255,0.35)",
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,117,255,0.48)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = isLoading
                      ? "none"
                      : "0 6px 20px rgba(0,117,255,0.35)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Signing in…
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Register link */}
              <p className="text-center text-sm text-slate-500">
                New to Sri Lanka Explorer?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="font-semibold text-[#0075FF] hover:text-[#0059CC] transition-colors underline-offset-2 hover:underline"
                >
                  Create your profile
                </button>
              </p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="14"
                height="14"
                style={{ color: "#0075FF" }}
              >
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                  clipRule="evenodd"
                />
              </svg>
              256-bit SSL
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="14"
                height="14"
                style={{ color: "#0075FF" }}
              >
                <path
                  fillRule="evenodd"
                  d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.563 2 12.162 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.749z"
                  clipRule="evenodd"
                />
              </svg>
              Secure Login
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="14"
                height="14"
                style={{ color: "#0075FF" }}
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Verified Safe
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default SignInPage;
