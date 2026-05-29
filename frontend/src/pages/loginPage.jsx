import { FaFacebookF } from "react-icons/fa";
import carImage from "../assets/registerVehicle/main_car_image.png";
import Header from "../components/header";

export const RenterLoginPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />

      <main className="w-full mt-20">
        <div className="relative flex flex-col items-center font-sans overflow-hidden bg-slate-50">
          <div className="absolute top-0 left-0 w-full h-[70vh] z-0 bg-slate-900">
            <img
              src={carImage}
              alt="Premium Fleet"
              className="w-full h-full object-cover grayscale opacity-80"
            />
          </div>
          <div className="relative z-20 w-full max-w-5xl px-6 pt-[20vh] pb-12 flex flex-col items-center">
            <div className="rounded-3xl bg-[#bce0fd]/85 p-6">
              <div className="w-full text-left mb-8 md:pr-12">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-7 tracking-tight text-center">
                  Welcome Smart Virtual Vehicle Rental Section
                </h1>
                <p className="text-slate-800 text-sm md:text-base leading-relaxed font-medium text-center">
                  The definitive management console for premium vehicle fleets.
                  Elevate your rental business and curate exceptional journeys
                  across Sri Lanka with absolute professional mastery.
                </p>
              </div>

              <div className="bg-white p-8 md:px-20 rounded-3xl shadow-2xl w-full max-w-xl mx-auto mb-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-1">
                    Sign In your account
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Start managing your Vehicle Rental with professional
                    precision.
                  </p>
                </div>

                <form
                  className="space-y-5"
                  onSubmit={(e) => e.preventDefault()}
                >
                  {/* Email Input */}
                  <div className="space-y-1.5 text-left">
                    <label className=" font-extrabold text-slate-600 ml-1">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="name@rent.lk"
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 transition-all"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5 text-left">
                    <label className="font-extrabold text-slate-600 ml-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Min. 8 characters"
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 transition-all"
                    />
                  </div>

                  {/* Primary Action Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-full hover:bg-blue-700 transition-all active:scale-[0.98] shadow-md shadow-blue-200 cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-slate-200"></div>
                    <span className="px-4 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                      Or continue with
                    </span>
                    <div className="flex-1 border-t border-slate-200"></div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </button>

                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <FaFacebookF
                        size={16}
                        className="text-[#1877F2] fill-current"
                      />
                      Facebook
                    </button>
                  </div>

                  {/* Footer Links */}
                  <div className="pt-6 space-y-4 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                      You don't have an account?{" "}
                      <a
                        href="#"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Sign up
                      </a>
                    </p>

                    <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                      By creating an account, you agree to our{" "}
                      <a href="#" className="underline hover:text-slate-600">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="underline hover:text-slate-600">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
