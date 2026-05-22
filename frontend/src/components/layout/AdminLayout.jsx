import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';
import Logo from "../../assets/logo.png";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F4F9FF] font-inter flex flex-col">
      <header className="bg-white px-8 py-4 flex justify-between items-center shadow-sm relative z-50">
        <div className="flex items-center gap-4">
          <img src={Logo} alt="Smart Virtual Tourism Guide" className="h-12 w-auto" />
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-[#1E3A8A]">Smart Virtual Tourism Guide</span>
            <span className="text-[20px] font-bold text-green-600 tracking-wider">
              S r i <span className="text-orange-500">L a n k a</span>
            </span>
          </div>
        </div>

        <nav className="hidden md:flex gap-8 text-[14px] font-medium text-gray-700">
          <Link to="/" className="text-[#1877F2]">Dashboard</Link>
          <Link to="#" className="hover:text-[#1877F2]">Packages</Link>
          <Link to="#" className="hover:text-[#1877F2]">Booking</Link>
          <Link to="#" className="hover:text-[#1877F2]">Analytics</Link>
          <Link to="#" className="hover:text-[#1877F2]">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="bg-[#1877F2] text-white px-6 py-2 rounded-md text-[14px] font-medium hover:bg-blue-600 transition-colors">
            Sign in
          </button>
          <select className="bg-transparent text-[14px] font-medium text-gray-700 outline-none border-none cursor-pointer">
            <option value="en">EN</option>
            <option value="si">SI</option>
          </select>
        </div>
      </header>

      <main className="relative z-20 flex-grow">
        {children}
      </main>

      <footer className="bg-[#EBF4FF] pt-16 pb-8 px-12 relative overflow-hidden mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 relative z-10">
          <div className="flex flex-col gap-4">
             <img src={Logo} alt="Logo" className="h-16 w-16 object-contain" />
             <div className="flex flex-col">
              <span className="text-[14px] font-medium text-[#1E3A8A]">Smart Virtual Tourism Guide</span>
              <span className="text-[24px] font-bold text-green-600 tracking-wider">
                S r i <span className="text-orange-500">L a n k a</span>
              </span>
            </div>
            <p className="text-[12px] text-gray-600 max-w-[250px]">
              Al-powered travel planning platform design to help you explore Sri Lanka safely, smartly and efficiently.
            </p>
            <div className="flex gap-4 mt-2">
              <FiFacebook className="text-[#1877F2] text-xl cursor-pointer hover:opacity-80 transition-opacity" />
              <FiInstagram className="text-pink-500 text-xl cursor-pointer hover:opacity-80 transition-opacity" />
              <FiTwitter className="text-gray-800 text-xl cursor-pointer hover:opacity-80 transition-opacity" />
            </div>
          </div>

          <div className="flex gap-16 col-span-2">
            <div>
              <h4 className="font-bold text-[#111111] mb-4">Quick Links</h4>
              <ul className="flex flex-col gap-2 text-[14px] text-gray-700 list-disc ml-4">
                <li><Link to="#" className="hover:text-blue-600">Home</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Features</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Destinations</Link></li>
                <li><Link to="#" className="hover:text-blue-600">How it Works</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Safety</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#111111] mb-4">Destinations</h4>
              <ul className="flex flex-col gap-2 text-[14px] text-gray-700 list-disc ml-4">
                <li><Link to="#" className="hover:text-blue-600">Sigiriya</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Ella</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Galle</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Yala National Park</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Colombo</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-bold text-[#111111] mb-4">Support</h4>
              <ul className="flex flex-col gap-2 text-[14px] text-gray-700 list-disc ml-4">
                <li><Link to="#" className="hover:text-blue-600">Help Center</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Terms & Condition</Link></li>
                <li><Link to="#" className="hover:text-blue-600">FAQ</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Travel Safety Guidelines</Link></li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#111111] mb-4">Contact Us.</h4>
            <div className="flex flex-col gap-4 text-[14px] text-gray-700">
              <div className="flex items-center gap-3">
                <FiMapPin className="text-red-500 text-lg" />
                <span>Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-red-500 text-lg" />
                <span>+94 9876543210</span>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="text-blue-400 text-lg" />
                <span>support@svgt.lk</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-[12px] text-[#4CB5F9] font-medium border-t border-blue-100 pt-6">
          svgt©2026 all right reserve
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;