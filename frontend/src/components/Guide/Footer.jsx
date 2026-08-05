import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

// Assets
import lotusFlower from '../../assets/HotelOwner/fbg1.png';
import mandalaPattern from '../../assets/HotelOwner/fbg2.png';
import logoImage from '../../assets/HotelOwner/logo.png';
import sriLankaFlag from '../../assets/HotelOwner/SLFF.jpg';

const Footer = () => {
  return (
    <footer className="relative w-full bg-gradient-to-b from-white via-sky-50 to-blue-100/80 text-slate-800 overflow-hidden font-sans border-t border-slate-200/60">
      {/* Decorative Background Assets */}
      <div className="absolute bottom-0 left-0 pointer-events-none select-none z-0 max-w-[45%] opacity-40 md:opacity-60">
        <img
          src={lotusFlower}
          alt="Lotus Flower"
          className="w-auto h-auto max-h-[300px] object-contain"
        />
      </div>

      <div className="absolute bottom-0 right-0 pointer-events-none select-none z-0 max-w-[45%] opacity-40 md:opacity-60">
        <img
          src={mandalaPattern}
          alt="Mandala Pattern"
          className="w-auto h-auto max-h-[300px] object-contain"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand & Socials (Span 1 or 2 on wider view) */}
          <div className="lg:col-span-1 flex flex-col items-start space-y-3">
            <img
              src={logoImage}
              alt="Sri Lanka Tourism Logo"
              className="w-16 h-auto object-contain"
            />

            <div>
              <h2 className="text-slate-900 font-bold text-sm leading-tight">
                Smart Virtual Tourism Guide
              </h2>
              <div className="relative inline-block mt-0.5">
                <h1
                  className="text-xl font-black tracking-tight"
                  style={{
                    backgroundImage: `url(${sriLankaFlag})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Sri Lanka
                </h1>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
              AI-powered travel planning platform designed to help you explore Sri Lanka safely, smartly and efficiently.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
                aria-label="Facebook"
              >
                <FaFacebook size={14} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 transition-colors shadow-sm"
                aria-label="Instagram"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm"
                aria-label="Twitter / X"
              >
                <FaTwitter size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
            <h3 className="font-bold text-slate-900 mb-3 text-sm tracking-wide">Quick Links</h3>
            <nav>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> Destinations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> Safety
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 3: Destinations */}
          <div className="flex flex-col">
            <h3 className="font-bold text-slate-900 mb-3 text-sm tracking-wide">Destinations</h3>
            <nav>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> Sigiriya
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> Ella
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> Galle
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> Yala National Park
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> Colombo
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 4: Support */}
          <div className="flex flex-col">
            <h3 className="font-bold text-slate-900 mb-3 text-sm tracking-wide">Support</h3>
            <nav>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> Terms & Condition
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">•</span> Travel Safety Guidelines
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 5: Contact Us */}
          <div className="flex flex-col">
            <h3 className="font-bold text-slate-900 mb-3 text-sm tracking-wide">Contact Us</h3>
            <ul className="text-xs text-slate-700 space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span>support@svgt.lk</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar Divider & Copyright */}
        <div className="mt-10 pt-4 border-t border-slate-300/60 text-center relative z-10">
          <p className="text-xs font-semibold text-sky-600 tracking-wide">
            svtg@2026 All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;