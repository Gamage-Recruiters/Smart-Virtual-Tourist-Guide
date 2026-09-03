import { Check } from "lucide-react";

function ProgressBar({ currentStep }) {
  const steps = [
    { num: 1, label: "BASIC INFO" },
    { num: 2, label: "TECHNICAL SPECS" },
    { num: 3, label: "DOCUMENTS" },
    { num: 4, label: "PHOTOS" },
  ];

  return (
    <div className="flex items-center justify-between w-full relative px-2">
      <div className="absolute left-8 top-5 right-8 h-0.5 bg-slate-200 z-10"></div>
      <div className="flex justify-between items-center w-full relative z-10">
        {steps.map((step) => {
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;

          return (
            <div
              key={step.num}
              className="flex flex-col items-center gap-2 bg-white px-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${
                  isActive
                    ? "bg-[#0B57D0] border-[#0B57D0] text-white"
                    : isCompleted
                      ? "bg-[#0B57D0] border-[#0B57D0] text-white"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : step.num}
              </div>
              <span
                className={`text-[9px] font-extrabold uppercase tracking-widest ${
                  isActive ? "text-[#0B57D0]" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressBar;
