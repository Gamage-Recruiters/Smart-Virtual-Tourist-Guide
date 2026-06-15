import { useState } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import BasicInfoStep from './basicInfoStep';
import TechSpecsStep from './techSpecsStep';
import AddDocumentsStep from './addDocumentsStep';
import AddPhotosStep from './addPhotosStep';
import ProgressBar from './progressBar';
import axios from 'axios';
import uploadFileToSupabase from '../../../utils/fileUpload.js';

function AddVehicleModal({ isOpen, onClose }) {

  // 1. State to track the current step (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // 2. State to hold all the form data across all steps
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
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

  try {
    // Upload PDFs
    const insuranceUrl = await uploadFileToSupabase(formData.vehicleInsurance, 'documents');
    const licenseUrl = await uploadFileToSupabase(formData.revenueLicense, 'documents');

    // Upload Photos
    const exteriorUrl = await uploadFileToSupabase(formData.photos.exterior, 'photos');
    const interiorUrl = await uploadFileToSupabase(formData.photos.interior, 'photos');
    const sideUrl = await uploadFileToSupabase(formData.photos.side, 'photos');
    const dashboardUrl = await uploadFileToSupabase(formData.photos.dashboard, 'photos');

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
      currentLocation: formData.location,
      photos: {
        exterior: exteriorUrl,
        interior: interiorUrl,
        side: sideUrl, 
        dashboard: dashboardUrl
      },
      documents: {
        vehicleInsurance: insuranceUrl,
        revenueLicense: licenseUrl
      }
    };

    // Send to your backend running on port 5000
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/vehicle', finalPayload);
    console.log("Saved successfully!", response.data);

  } catch (error) {
    console.error("Error during submission process:", error);
  }
};

  // Early return if the modal shouldn't be visible
  if (!isOpen) return null;

  // Handlers for navigation
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    // Backdrop (Dark semi-transparent background)
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      
      {/* Modal Container */}
      <div className="bg-white rounded-4xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header & Progress Bar */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Add New Vehicle</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
          </div>
          
          {/* Progress Indicator */}
          <ProgressBar currentStep={currentStep} />
        </div>

        {/* Dynamic Content Area */}
        <div className="px-8 py-4 overflow-y-auto flex-1">
          {currentStep === 1 && <BasicInfoStep formData={formData} setFormData={setFormData} />}
          {currentStep === 2 && <TechSpecsStep formData={formData} setFormData={setFormData} />}
          {currentStep === 3 && <AddDocumentsStep formData={formData} setFormData={setFormData} />}
          {currentStep === 4 && <AddPhotosStep formData={formData} setFormData={setFormData} />}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-8 py-6 bg-white border-t border-slate-100 flex justify-between items-center mt-auto">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all border border-slate-200 cursor-pointer ${
              currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          <button 
            onClick={currentStep === 4 ? handleSubmit : nextStep}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-[#0B57D0] text-white hover:bg-blue-700 shadow-md transition-all cursor-pointer"
          >
            {currentStep === 4 ? 'Submit Vehicle' : 'Next Step'} <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddVehicleModal;