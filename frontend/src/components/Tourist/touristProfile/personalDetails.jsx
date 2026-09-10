import { ChevronDown, Eye } from "lucide-react"


function PersonalDetails({ formData, handleChange }) {
  return (
    <section className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-sm xl:text-base font-bold text-slate-700 whitespace-nowrap">
                01. Personal Details
              </h2>
              <div className="h-px bg-slate-200 w-full"></div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-4xl space-y-5 shadow-sm border border-white">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-white border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full bg-white border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
              />

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full bg-white border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-white border-none rounded-2xl py-4 px-5 text-sm text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none appearance-none shadow-sm cursor-pointer"
                  >
                    <option value="" disabled>
                      Country
                    </option>
                    <option value="lk">Sri Lanka</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
                <input
                  type="text"
                  name="passport"
                  value={formData.passport}
                  onChange={handleChange}
                  placeholder="Passport Number"
                  className="w-full bg-white border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
                />
              </div>
            </div>
          </section>
  )
}

export default PersonalDetails