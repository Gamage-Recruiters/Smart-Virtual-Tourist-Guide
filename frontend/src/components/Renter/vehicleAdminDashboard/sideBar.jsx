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
  const storedUser = localStorage.getItem("userData");
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
      <div className="">
        <div className="flex items-center justify-center gap-3 border-b border-blue-200  p-2 px-2 mb-4">
          <div className="w-11 h-11 rounded-full border-2 border-slate-300 cursor-pointer">
            <Link to="/login">
              <img
              // user icon
                src={user?.profileImage || "https://images.unsplash.com/vector-1776244475768-9554c65cd5b5?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </Link>
          </div>
          <div className="flex-1 min-w-0">
            <p className="xl:text-[17px] text-sm font-bold text-slate-800 truncate">
              {user?.role === "renter_user" ? user?.fullName : "Guest"}
            </p>
            <p className="xl:text-[12px] text-[10px] font-semibold text-slate-500 truncate">
              {user?.role === "renter_user" ? user?.email : ""}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg borde bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700 cursor-pointer"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
