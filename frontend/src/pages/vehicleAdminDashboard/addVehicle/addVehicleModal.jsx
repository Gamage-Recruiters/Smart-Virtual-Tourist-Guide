import { useState } from "react";
import { X, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import BasicInfoStep from "./basicInfoStep";
import TechSpecsStep from "./techSpecsStep";
import AddDocumentsStep from "./addDocumentsStep";
import AddPhotosStep from "./addPhotosStep";
import ProgressBar from "./progressBar";
import axios from "axios";
import uploadFileToSupabase from "../../../utils/fileUpload.js";
import toast from "react-hot-toast";

function AddVehicleModal({ isOpen, onClose }) {
  // 1. State to track the current step (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // 2. State to track if the form is currently uploading/saving
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. State to hold all the form data across all steps
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    licensePlate: "",
    transmission: "Automatic",
    fuelType: "Hybrid",
    passengers: 1,
    luggage: 1,
    vehicleInsurance: null,
    revenueLicense: null,
    location: "",
    photos: {
      exterior: "",
      interior: "",
      side: "",
      dashboard: "",
    },
    rentalPrice: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const [
        insuranceUrl,
        licenseUrl,
        exteriorUrl,
        interiorUrl,
        sideUrl,
        dashboardUrl,
      ] = await Promise.all([
        uploadFileToSupabase(formData.vehicleInsurance, "documents"),
        uploadFileToSupabase(formData.revenueLicense, "documents"),
        uploadFileToSupabase(formData.photos.exterior, "photos"),
        uploadFileToSupabase(formData.photos.interior, "photos"),
        uploadFileToSupabase(formData.photos.side, "photos"),
        uploadFileToSupabase(formData.photos.dashboard, "photos"),
      ]);

      // Build the clean JSON payload for Mongoose
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
        location: formData.location,
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

      // Send to your backend running on port 5000
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/vehicle",
        finalPayload,
      );
      toast.success("Saved successfully!");

      setIsSubmitting(false);
      setCurrentStep(1);
      setFormData({
        brand: "",
        model: "",
        year: "",
        licensePlate: "",
        transmission: "Automatic",
        fuelType: "Hybrid",
        passengers: 1,
        luggage: 1,
        vehicleInsurance: null,
        revenueLicense: null,
        location: "",
        photos: {
          exterior: "",
          interior: "",
          side: "",
          dashboard: "",
        },
        rentalPrice: "",
      });
      onClose();
    } catch (error) {
      console.error("Error during submission process:", error);
      setIsSubmitting(false);
      toast.error("Something went wrong! Please try again.");
    }
  };

  // Early return if the modal shouldn't be visible
  if (!isOpen) return null;

  // Handlers for navigation
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    // Backdrop (Dark semi-transparent background)
    <div className="fixed inset-0 backdrop-blur-sm bg-slate-200/20 z-50 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-4xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header & Progress Bar */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Add New Vehicle
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Indicator */}
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
            disabled={currentStep === 1}
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
                  <span>Submitting... </span>
                  <Loader2 size={18} className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Submit Vehicle</span> <ArrowRight size={18} />
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
