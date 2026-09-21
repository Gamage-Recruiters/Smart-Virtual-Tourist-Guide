export const ProgressStep = ({ step, label, active }) => (
  <div className="flex gap-4 items-start">
    <div
      className={`mt-1.5 w-2 h-2 rounded-full ring-4 transition-colors ${active ? "bg-blue-600 ring-blue-100" : "bg-slate-200 ring-transparent"}`}
    ></div>
    <div>
      <p
        className={`text-[10px] 2xl:text-xs font-bold tracking-wider uppercase transition-colors ${active ? "text-blue-600" : "text-slate-400"}`}
      >
        Step {step}
      </p>
      <p
        className={`text-sm 2xl:text-base font-semibold mt-0.5 transition-colors ${active ? "text-blue-600" : "text-slate-500"}`}
      >
        {label}
      </p>
    </div>
  </div>
);
