import { Camera, Info } from 'lucide-react';

function AddPhotosStep({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const photoRequirements = [
    { id: 'exterior', label: 'Exterior Front' },
    { id: 'interior', label: 'Interior' },
    { id: 'side', label: 'Side View' },
    { id: 'dashboard', label: 'Dashboard' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-extrabold text-slate-900">Step 4: Vehicle Photos</h3>

      {/* Photo Upload Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photoRequirements.map((req) => (
          <div key={req.id} className="space-y-1.5">
            <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">
              {req.label}
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl h-32 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
              <Camera size={24} strokeWidth={1.5} className="text-slate-400 mb-2 group-hover:text-blue-600 transition-colors" />
              <span className="text-[10px] font-bold text-slate-900">
                Click to upload
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Rental Price Input */}
      <div className="space-y-2 pt-2">
        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">
          Daily Rental Price
        </label>
        <input
          type="text"
          name="rentalPrice"
          placeholder="15 000 LKR"
          value={formData.rentalPrice || ''}
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
        />
      </div>

      {/* Info Warning Box */}
      <div className="bg-slate-50 rounded-xl p-4 flex gap-3 border border-slate-100 mt-2">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Ensure photos are taken in good lighting and show the full vehicle.
        </p>
      </div>
    </div>
  )
}

export default AddPhotosStep