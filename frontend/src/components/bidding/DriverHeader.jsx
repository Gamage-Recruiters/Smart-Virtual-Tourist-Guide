import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCar, FaMoneyBillWave, FaClipboardList, FaUser } from "react-icons/fa";
import { IoCaretBackOutline } from "react-icons/io5";

export default function DriverHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Dashboard", path: "/driver-dashboard", icon: <FaCar size={14} /> },
    { label: "Requests",  path: "/driver-request",   icon: <FaClipboardList size={14} /> },
    { label: "Earnings",  path: "/driver-earnings",  icon: <FaMoneyBillWave size={14} /> },
    { label: "Profile",   path: "/driver-details",   icon: <FaUser size={14} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full h-16 bg-white border-b border-slate-100 shadow-sm flex items-center justify-between px-6 fixed top-0 left-0 z-50">
      
      {/* Logo / Brand */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/driver-dashboard")}
      >
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow">
          <FaCar className="text-white" size={14} />
        </div>
        <div className="leading-tight">
          <span className="font-extrabold text-slate-800 text-sm block">Driver</span>
          <span className="text-[10px] text-slate-400 font-medium">Dashboard</span>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isActive(link.path)
                ? "bg-blue-600 text-white shadow"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            {link.icon}
            {link.label}
          </button>
        ))}
      </nav>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={`block w-5 h-0.5 bg-slate-600 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-5 h-0.5 bg-slate-600 transition-all ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-0.5 bg-slate-600 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-100 shadow-lg md:hidden z-50">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold border-b border-slate-50 transition-all ${
                isActive(link.path)
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}


