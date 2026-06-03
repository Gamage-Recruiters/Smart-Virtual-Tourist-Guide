import { useState, useRef } from "react";
import { AlertCircle, CheckCircle, CloudUpload, Info } from "lucide-react";

function AddDocumentsStep({ formData, setFormData }) {
  // --- STATE FOR VEHICLE INSURANCE ---
  const [insuranceDragging, setInsuranceDragging] = useState(false);
  const [insuranceError, setInsuranceError] = useState("");
  const insuranceInputRef = useRef(null);

  // --- STATE FOR REVENUE LICENSE ---
  const [licenseDragging, setLicenseDragging] = useState(false);
  const [licenseError, setLicenseError] = useState("");
  const licenseInputRef = useRef(null);

  // --- REUSABLE FILE PROCESSOR ---
  const processFile = (file, setError, fieldName) => {
    setError("");

    if (!file) return;

    const validTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid format. Please use PDF, PNG, or JPG.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    // Save directly to the master formData
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: file,
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-extrabold text-slate-900">
        Step 3: Legal Documents
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider ml-1">
            Vehicle Insurance
          </label>

          <input
            type="file"
            name="vehicleInsurance"
            ref={insuranceInputRef}
            onChange={(e) =>
              processFile(
                e.target.files[0],
                setInsuranceError,
                "vehicleInsurance",
              )
            }
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
          />

          <div
            onClick={() => insuranceInputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setInsuranceDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setInsuranceDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setInsuranceDragging(false);
              if (e.dataTransfer.files.length > 0) {
                processFile(
                  e.dataTransfer.files[0],
                  setInsuranceError,
                  "vehicleInsurance",
                );
              }
            }}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
              insuranceDragging
                ? "border-blue-500 bg-blue-50 scale-[1.02]"
                : insuranceError
                  ? "border-red-300 hover:bg-red-50"
                  : formData.vehicleInsurance
                    ? "border-green-300 hover:bg-green-50"
                    : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                formData.vehicleInsurance
                  ? "bg-green-100 text-green-600"
                  : insuranceDragging
                    ? "bg-blue-200 text-blue-700"
                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
              }`}
            >
              {formData.vehicleInsurance ? (
                <CheckCircle size={20} />
              ) : (
                <CloudUpload size={20} />
              )}
            </div>

            <h4 className="text-sm font-bold text-slate-900 mb-1 truncate w-full max-w-50">
              {formData.vehicleInsurance
                ? formData.vehicleInsurance.name
                : insuranceDragging
                  ? "Drop file here"
                  : "Upload insurance scan"}
            </h4>

            {!formData.vehicleInsurance && !insuranceError && (
              <p className="text-[10px] font-medium text-slate-400 mb-4">
                PDF, PNG, JPG (Max 10MB)
              </p>
            )}

            {insuranceError && (
              <p className="text-[10px] font-bold text-red-500 mb-3 flex items-center gap-1">
                <AlertCircle size={12} /> {insuranceError}
              </p>
            )}

            <span
              className={`text-[9px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest transition-colors ${
                formData.vehicleInsurance
                  ? "bg-green-100 text-green-600"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {formData.vehicleInsurance ? "Uploaded" : "Upload Pending"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider ml-1">
            Revenue License
          </label>

          <input
            type="file"
            name="revenueLicense"
            ref={licenseInputRef}
            onChange={(e) =>
              processFile(e.target.files[0], setLicenseError, "revenueLicense")
            }
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
          />

          <div
            onClick={() => licenseInputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setLicenseDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setLicenseDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setLicenseDragging(false);
              if (e.dataTransfer.files.length > 0) {
                processFile(
                  e.dataTransfer.files[0],
                  setLicenseError,
                  "revenueLicense",
                );
              }
            }}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
              licenseDragging
                ? "border-blue-500 bg-blue-50 scale-[1.02]"
                : licenseError
                  ? "border-red-300 hover:bg-red-50"
                  : formData.revenueLicense
                    ? "border-green-300 hover:bg-green-50"
                    : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                formData.revenueLicense
                  ? "bg-green-100 text-green-600"
                  : licenseDragging
                    ? "bg-blue-200 text-blue-700"
                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
              }`}
            >
              {formData.revenueLicense ? (
                <CheckCircle size={20} />
              ) : (
                <CloudUpload size={20} />
              )}
            </div>

            <h4 className="text-sm font-bold text-slate-900 mb-1 truncate w-full max-w-50">
              {formData.revenueLicense
                ? formData.revenueLicense.name
                : licenseDragging
                  ? "Drop file here"
                  : "Upload license PDF"}
            </h4>

            {!formData.revenueLicense && !licenseError && (
              <p className="text-[10px] font-medium text-slate-400 mb-4">
                Scan both sides clearly
              </p>
            )}

            {licenseError && (
              <p className="text-[10px] font-bold text-red-500 mb-3 flex items-center gap-1">
                <AlertCircle size={12} /> {licenseError}
              </p>
            )}

            <span
              className={`text-[9px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest transition-colors ${
                formData.revenueLicense
                  ? "bg-green-100 text-green-600"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {formData.revenueLicense ? "Uploaded" : "Upload Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* Current Location Input */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider ml-1">
          Current Location of Vehicle
        </label>
        <input
          type="text"
          name="location"
          placeholder="Colombo"
          value={formData.location || ""}
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        />
      </div>

      {/* Info Warning Box */}
      <div className="bg-slate-50 rounded-xl p-4 flex gap-3 border border-slate-100 mt-2">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          To maintain our high safety standards and insurance compliance, we
          verify every vehicle's legal status before activation.
        </p>
      </div>
    </div>
  );
}

export default AddDocumentsStep;
