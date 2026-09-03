import { ChevronDown, X } from "lucide-react"


function HealthProfile({ formData, handleChange, handleAllergyKeyDown, removeAllergy ,allergyInput, setAllergyInput}) {
  return (
    <section className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-sm xl:text-base font-bold text-slate-700 whitespace-nowrap">
                03. Health Profile
              </h2>
              <div className="h-px bg-slate-200 w-full"></div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-4xl space-y-6 shadow-sm border border-white">
              <div className="relative">
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full bg-white border-none rounded-2xl py-4 px-5 text-sm text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none appearance-none shadow-sm cursor-pointer"
                >
                  <option value="" disabled>
                    Blood Type
                  </option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>

              <textarea
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleChange}
                placeholder="Medical Conditions (Optional)"
                rows="3"
                className="w-full bg-white border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 shadow-sm resize-none"
              ></textarea>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-800">
                  Food Allergies
                </label>

                {/* Render Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2"
                    >
                      {allergy}
                      <X
                        size={14}
                        className="cursor-pointer hover:text-red-800"
                        onClick={() => removeAllergy(allergy)}
                      />
                    </span>
                  ))}
                </div>

                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={handleAllergyKeyDown}
                  placeholder="Type allergy and press Enter"
                  className="w-full bg-white border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
                />
              </div>
            </div>
          </section>
  )
}

export default HealthProfile