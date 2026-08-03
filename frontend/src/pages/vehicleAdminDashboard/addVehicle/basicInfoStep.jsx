import { Info } from 'lucide-react';

function BasicInfoStep({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-extrabold text-slate-900">Step 1: Basic Information</h3>
        <span className="bg-green-50 text-green-700 text-[10px] font-extrabold px-3 py-1 rounded-md flex items-center gap-1">
          ✨ AI ENHANCED VERIFICATION
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">Vehicle Brand</label>
          <input 
            type="text" name="brand" placeholder="e.g. BMW" 
            value={formData.brand} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">Model Name</label>
          <input 
            type="text" name="model" placeholder="e.g. i7 xDrive60" 
            value={formData.model} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">Manufacturing Year</label>
          <input
            type='number' name="year" value={formData.year} onChange={handleChange} placeholder='e.g. 2023'
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 outline-none transition-colors appearance-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">License Plate Number</label>
          <input 
            type="text" name="licensePlate" placeholder="WP CAS-4433" 
            value={formData.licensePlate} onChange={handleChange}
            className="w-full bg-blue-50/50 border border-blue-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 flex gap-3 border border-blue-100 mt-2">
        <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Ensure the license plate matches your registration documents. Our AI will automatically fetch technical details in the next step based on this data.
        </p>
      </div>
    </div>
  )
}

export default BasicInfoStep