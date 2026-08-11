import { useLocation } from "react-router-dom";
import { NavItem } from "../../components/touristMainPage/navItem";
import {
  LayoutDashboard,
  Map,
  ShieldCheck,
  User,
  MapPin,
  LogOut,
  Settings,
} from "lucide-react";

function Sidebar() {
  const path  = useLocation();
  const location = path.pathname;
  return (
    <aside className="w-64 pt-35 h-screen bg-white border-r border-slate-200 flex flex-col justify-between fixed top-0 left-0">
      <div>
        <nav className="mt-6 flex-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            navigate="/tour-dashboard"
            //if navigate to dashboard, show active class
            active={location === "/tour-dashboard" || location === "/dashboard" || location === "/"}
          />
          <NavItem
            icon={<MapPin size={20} />}
            label="Plan Trip"
            navigate="/trip-plan"
            active={location === "/trip-plan"}
          />
          <NavItem icon={<Map size={20} />} label="Map" navigate="/" />
          <NavItem
            icon={<ShieldCheck size={20} />}
            label="Safety"
            navigate="/"
          />
          <NavItem icon={<User size={20} />} label="Profile" navigate="/touristProfile" active={location === "/touristProfile"}  />
        </nav>
      </div>
      <div>
        <nav className="border-t border-slate-200">
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            navigate="/"
          />
          <button className="flex items-center gap-4 px-8 pb-6 cursor-pointer transition-colors text-slate-400 hover:text-slate-600 font-semibold">
            {" "}
            <span>
              <LogOut size={20} />
            </span>
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;

