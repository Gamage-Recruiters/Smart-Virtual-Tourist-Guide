import { CloudUpload, Info } from 'lucide-react';

function AddDocumentsStep({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-extrabold text-slate-900">Step 3: Legal Documents</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Vehicle Insurance Upload Box */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">
            Vehicle Insurance
          </label>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
              <CloudUpload size={20} className="text-blue-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Upload insurance scan</h4>
            <p className="text-[10px] font-medium text-slate-400 mb-4">PDF, PNG, JPG (Max 10MB)</p>
            <span className="bg-slate-100 text-slate-400 text-[9px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest">
              Upload Pending
            </span>
          </div>
        </div>

        {/* Revenue License Upload Box */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">
            Revenue License
          </label>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
              <CloudUpload size={20} className="text-blue-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Upload license PDF</h4>
            <p className="text-[10px] font-medium text-slate-400 mb-4">Scan both sides clearly</p>
            <span className="bg-slate-100 text-slate-400 text-[9px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest">
              Upload Pending
            </span>
          </div>
        </div>

      </div>

      {/* Current Location Input */}
      <div className="space-y-2">
        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">
          Current Location of Vehicle
        </label>
        <input
          type="text"
          name="location"
          placeholder="Colombo"
          value={formData.location || ''}
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        />
      </div>

      {/* Info Warning Box */}
      <div className="bg-slate-50 rounded-xl p-4 flex gap-3 border border-slate-100 mt-2">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          To maintain our high safety standards and insurance compliance, we verify every vehicle's legal status before activation.
        </p>
      </div>
    </div>
  )
}

export default AddDocumentsStep