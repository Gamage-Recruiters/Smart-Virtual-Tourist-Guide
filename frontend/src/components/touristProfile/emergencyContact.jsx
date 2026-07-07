import { ChevronDown } from "lucide-react"

function EmergencyContact({formData, handleChange}) {
  return (
    <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-sm xl:text-base font-bold text-slate-700 whitespace-nowrap">
                    04. Emergency Contact
                  </h2>
                  <div className="h-px bg-slate-200 w-full"></div>
                </div>
    
                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-4xl space-y-5 shadow-sm border border-white">
                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleChange}
                    placeholder="Contact Name"
                    className="w-full bg-white border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
                  />
    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full bg-white border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
                    />
    
                    <div className="relative">
                      <select
                        name="emergencyRelation"
                        value={formData.emergencyRelation}
                        onChange={handleChange}
                        className="w-full bg-white border-none rounded-2xl py-4 px-5 text-sm text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none appearance-none shadow-sm cursor-pointer"
                      >
                        <option value="" disabled>
                          Relationship
                        </option>
                        <option value="parent">Parent</option>
                        <option value="spouse">Spouse</option>
                        <option value="sibling">Sibling</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown
                        size={18}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              </section>
  )
}

export default EmergencyContact