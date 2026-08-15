import { useState } from "react";
import { X, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import BasicInfoStep from "./basicInfoStep";
import TechSpecsStep from "./techSpecsStep";
import AddDocumentsStep from "./addDocumentsStep";
import AddPhotosStep from "./addPhotosStep";
import ProgressBar from "./progressBar";
import axios from "axios";
import uploadFileToSupabase from "../../../../utils/fileUpload.js";
import toast from "react-hot-toast";

const getInitialFormState = (editData) => ({
  brand: editData?.brand || "",
  model: editData?.model || "",
  year: editData?.year || "",
  licensePlate: editData?.licensePlate || "",
  transmission: editData?.transmission || "Automatic",
  fuelType: editData?.fuelType || "Hybrid",
  passengers: editData?.passengers || 1,
  luggage: editData?.luggage || 1,
  location: editData?.currentLocation || editData?.location || "",
  rentalPrice: editData?.dailyRentalPrice || "",
  vehicleInsurance: editData?.documents?.vehicleInsurance || null,
  revenueLicense: editData?.documents?.revenueLicense || null,
  photos: {
    exterior: editData?.photos?.exterior || "",
    interior: editData?.photos?.interior || "",
    side: editData?.photos?.side || "",
    dashboard: editData?.photos?.dashboard || "",
  },
});

function AddVehicleModal({ isOpen, onClose, editData = null, onMutationSuccess }) {
  if (!isOpen) return null;

  return (
    <AddVehicleModalContent
      editData={editData}
      onClose={onClose}
      onMutationSuccess={onMutationSuccess}
    />
  );
}

// Inner component mounts freshly every time isOpen becomes true
function AddVehicleModalContent({ editData, onClose, onMutationSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => getInitialFormState(editData));
  const token = localStorage.getItem("renterToken") || localStorage.getItem("token");

  const resolveApiUrl = (path = "") => {
    const base = (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return base.includes("/api") ? `${base}${normalizedPath}` : `${base}/api${normalizedPath}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const uploadOrKeepUrl = async (fileOrUrl, folder) => {
        if (!fileOrUrl) return "";
        if (typeof fileOrUrl === "string") return fileOrUrl;
        return await uploadFileToSupabase(fileOrUrl, folder);
      };

      const [
        insuranceUrl,
        licenseUrl,
        exteriorUrl,
        interiorUrl,
        sideUrl,
        dashboardUrl,
      ] = await Promise.all([
        uploadOrKeepUrl(formData.vehicleInsurance, "documents"),
        uploadOrKeepUrl(formData.revenueLicense, "documents"),
        uploadOrKeepUrl(formData.photos.exterior, "photos"),
        uploadOrKeepUrl(formData.photos.interior, "photos"),
        uploadOrKeepUrl(formData.photos.side, "photos"),
        uploadOrKeepUrl(formData.photos.dashboard, "photos"),
      ]);

      const finalPayload = {
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        licensePlate: formData.licensePlate,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        passengers: Number(formData.passengers),
        luggage: Number(formData.luggage),
        dailyRentalPrice: Number(formData.rentalPrice),
        currentLocation: formData.location,
        photos: {
          exterior: exteriorUrl,
          interior: interiorUrl,
          side: sideUrl,
          dashboard: dashboardUrl,
        },
        documents: {
          vehicleInsurance: insuranceUrl,
          revenueLicense: licenseUrl,
        },
      };

      if (editData) {
        await axios.put(resolveApiUrl(`/vehicle/${editData._id}`), finalPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Vehicle updated successfully!");
      } else {
        await axios.post(resolveApiUrl("/vehicle"), finalPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Vehicle saved successfully!");
      }

      if (onMutationSuccess) {
        onMutationSuccess();
      }

      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error("Error during submission process:", error);
      setIsSubmitting(false);
      toast.error("Something went wrong! Please try again.");
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-slate-200/20 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-4xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Section */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {editData ? "Edit Vehicle Details" : "Add New Vehicle"}
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>
          <ProgressBar currentStep={currentStep} />
        </div>

        {/* Dynamic Content Area */}
        <div className="px-8 py-4 overflow-y-auto flex-1">
          {currentStep === 1 && (
            <BasicInfoStep formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 2 && (
            <TechSpecsStep formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 3 && (
            <AddDocumentsStep formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 4 && (
            <AddPhotosStep formData={formData} setFormData={setFormData} />
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-8 py-6 bg-white border-t border-slate-100 flex justify-between items-center mt-auto">
          <button
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all border border-slate-200 cursor-pointer ${
              currentStep === 1
                ? "opacity-0 pointer-events-none"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ArrowLeft size={18} /> Back
          </button>

          <button
            onClick={currentStep === 4 ? handleSubmit : nextStep}
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-[#0B57D0] hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {currentStep === 4 ? (
              isSubmitting ? (
                <>
                  <span>Updating... </span>
                  <Loader2 size={18} className="animate-spin" />
                </>
              ) : (
                <>
                  <span>{editData ? "Save Changes" : "Submit Vehicle"}</span>{" "}
                  <ArrowRight size={18} />
                </>
              )
            ) : (
              <>
                <span>Next Step</span> <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddVehicleModal;