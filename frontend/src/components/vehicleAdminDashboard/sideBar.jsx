import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Car,
  DollarSign,
  Settings,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const navItems = [
    {
      name: "Dashboard",
      path: "/vehicle-admin",
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: "Rental Requests",
      path: "/vehicle-admin/requests",
      icon: FileText,
    },
    { name: "My Fleet", path: "/vehicle-admin/fleet", icon: Car },
    { name: "Earnings", path: "/vehicle-admin/earnings", icon: DollarSign },
    { name: "Settings", path: "/vehicle-admin/settings", icon: Settings },
  ];
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("renter");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("renterToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("renter");
    localStorage.removeItem("signupData");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#e8f0fe] h-full flex flex-col justify-between py-6 px-4">
      <div>
        {/* Logo Area */}
        <div className="mb-10 px-4">
          <h1 className="text-lg font-extrabold text-slate-800 tracking-wide">
            VEHICLES
          </h1>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
            Admin Portal
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-500 hover:bg-blue-100 hover:text-blue-600"
                }`
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className="border-t border-blue-200 pt-4 px-2 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-300 cursor-pointer">
            <Link to="/login">
              <img
                src="#"
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </Link>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">
              {user?.fullName || "Guest"}
            </p>
            <p className="text-[10px] font-semibold text-slate-500 truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
