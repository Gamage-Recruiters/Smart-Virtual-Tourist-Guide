import { PhoneCall } from "lucide-react";

export const SupportCard = () => {
  return (
    <div className="bg-white p-6 shadow-sm rounded-3xl border border-blue-100 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm">
          <PhoneCall size={18} />
        </div>
        <h4 className="font-extrabold text-slate-800 text-sm">Need Help?</h4>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        Our team is available 24/7 to assist you with your booking execution or custom itineraries.
      </p>
      <button className="w-full bg-white border border-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
        Contact Support
      </button>
    </div>
  );
};