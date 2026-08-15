import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Car,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white shadow-md border border-slate-200 text-slate-700 lg:hidden hover:bg-slate-50 transition"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#e8f0fe] h-screen flex flex-col justify-between py-6 px-4 shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Area */}
          <div className="mb-8 px-4 mt-12 lg:mt-0">
            <h1 className="text-xl font-extrabold text-slate-800 tracking-wide">
              VEHICLES
            </h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
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
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-300/40"
                      : "text-slate-600 hover:bg-blue-100 hover:text-blue-600"
                  }`
                }
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="pt-4 border-t border-blue-200/60">
          <div className="flex items-center gap-3 p-2 mb-2">
            <div className="w-10 h-10 rounded-full border border-slate-300 overflow-hidden shrink-0">
              <Link to="/login" onClick={closeSidebar}>
                <img
                  src={
                    user?.profileImage ||
                    "https://images.unsplash.com/vector-1776244475768-9554c65cd5b5?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">
                {user?.role === "renter_user" ? user?.fullName : "pasan kumara"}
              </p>
              <p className="text-xs font-medium text-slate-500 truncate">
                {user?.role === "renter_user" ? user?.email : "pasan@gmail.com"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-3 py-2.5 text-sm font-semibold text-white transition shadow-sm cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;