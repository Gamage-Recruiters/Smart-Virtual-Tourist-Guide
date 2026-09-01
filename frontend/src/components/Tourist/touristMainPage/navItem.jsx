import { Link } from "react-router-dom";

export const NavItem = ({ icon, label, active = false, navigate="/" }) => (
  <Link to={navigate}
    className={` relative flex items-center gap-4 px-8 py-4 cursor-pointer transition-colors rounded-2xl ${active ? "text-[#2E5C88] bg-blue-50/50" : "text-slate-400 hover:text-slate-600"}`}
  >
    <div className={`h-full w-2 bg-[#2E5C88] absolute top-0 left-0 rounded-e-2xl ${active ? "block" : "hidden"}`}></div>
    {icon}
    <span className="font-semibold">{label}</span>
  </Link>
);