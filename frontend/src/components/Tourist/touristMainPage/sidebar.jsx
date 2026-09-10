import { useLocation, useNavigate } from "react-router-dom";
import { NavItem } from "../../../components/Tourist/touristMainPage/navItem";
import {
  LayoutDashboard,
  Map,
  ShieldCheck,
  User,
  MapPin,
  LogOut,
  
} from "lucide-react";

function Sidebar() {
  const path = useLocation();
  const navigate = useNavigate();
  const location = path.pathname;
  return (
    <aside className="w-64 pt-35 h-screen bg-white border-r border-slate-200 flex flex-col justify-between fixed top-0 left-0">
      <div>
        <nav className="mt-6 flex-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            navigate="/dashboard-Tourist"
            //if navigate to dashboard, show active class
            active={
              location === "/" ||
              location === "/dashboard-Tourist" ||
              (location.startsWith("/dashboard-Tourist/") &&
                location !== "/dashboard-Tourist/trip-plan" &&
                location !== "/dashboard-Tourist/direction" &&
                location !== "/dashboard-Tourist/touristProfile" && 
                location !== "/safety"
              )
            }
          />
          <NavItem
            icon={<MapPin size={20} />}
            label="Plan Trip"
            navigate="/dashboard-Tourist/trip-plan"
            active={location === "/dashboard-Tourist/trip-plan"}
          />
          <NavItem
            icon={<Map size={20} />}
            label="Map"
            navigate="/dashboard-Tourist/direction"
            active={location === "/dashboard-Tourist/direction"}
          />
          <NavItem
            icon={<ShieldCheck size={20} />}
            label="Safety"
            navigate="/safety"
          />
          <NavItem
            icon={<User size={20} />}
            label="Profile"
            navigate="/dashboard-Tourist/touristProfile"
            active={location === "/dashboard-Tourist/touristProfile"}
          />
        </nav>
      </div>
      <div>
        <nav className="border-t border-slate-200">
        
          <button className="flex items-center justify-center gap-4 px-8 py-5 cursor-pointer transition-colors text-red-500 hover:text-red-600 font-bold"
          onClick={()=>{
            localStorage.removeItem("token")
            localStorage.removeItem("userData")
            navigate("/login")
          }}
          >
            {" "}
            <span>
              <LogOut size={24} />
            </span>
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
