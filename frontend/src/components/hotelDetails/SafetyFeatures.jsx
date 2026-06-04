import { ShieldCheck, Check } from "lucide-react";

export default function SafetyFeatures() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center gap-3 mb-5">
        <ShieldCheck className="text-blue-600" />

        <h2 className="text-xl font-bold">Safety Features</h2>
      </div>

      <div className="space-y-4">
        {[
          "24/7 Security",
          "Medical Assistance",
          "Emergency Contacts",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 text-gray-700"
          >
            <Check className="text-green-500" size={18} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}