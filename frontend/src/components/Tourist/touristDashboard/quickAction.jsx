import { useNavigate } from "react-router-dom";

export default function QuickAction({ icon, label, location }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!location) return;
    // Absolute paths (start with '/') navigate directly
    // Relative paths are nested under the tourist dashboard
    if (location.startsWith('/')) {
      navigate(location);
    } else {
      navigate("/dashboard-Tourist/" + location);
    }
  };

  return (
    <button
      className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-blue-50 transition-all group h-30 cursor-pointer disabled:opacity-40"
      onClick={handleClick}
      disabled={!location}
      title={!location ? 'Coming soon' : label}
    >
      <div className="text-slate-500 group-hover:text-blue-600">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-600">
        {label}
      </span>
    </button>
  );
}

