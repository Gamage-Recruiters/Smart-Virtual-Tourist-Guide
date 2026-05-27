import React from "react";
import h1 from "../assets/h1.png";
import h2 from "../assets/h2.png";

export default function Header() {
  return (
    <header className="relative w-full bg-transparent overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={h1}
            alt="Sri Lanka Logo"
            className="w-[100px] h-[100px] object-contain"
          />

          <img
            src={h2}
            alt="Smart Virtual Tourism Guide Sri Lanka"
            className="w-[200px] object-contain"
          />
        </div>
        <nav className="hidden md:flex items-center gap-15 text-md font-medium text-gray-900">
          <a href="#home" className="hover:text-blue-600 transition">Home</a>
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#destinations" className="hover:text-blue-600 transition">Destinations</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">How it Works</a>
          <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
        </nav>

        <div className="hidden md:flex items-center gap-8">
          <button className="bg-blue-600 text-white text-sm px-8 py-2 rounded-md hover:bg-blue-700 transition">
            Sign in
          </button>

          <select className="bg-transparent text-sm outline-none cursor-pointer">
            <option>EN</option>
            <option>SI</option>
          </select>
        </div>
      </div>
    </header>
  );
}