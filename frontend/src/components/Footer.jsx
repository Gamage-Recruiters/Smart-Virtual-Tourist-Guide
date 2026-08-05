import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
// Import your images
import leftImage from '../assets/fbg1.png';
import rightImage from '../assets/fbg2.png';
import logoImage from '../assets/logo.png';
import nameImage from '../assets/name.png';

const Footer = () => {
  return (
    <footer
      className="relative pt-12 pb-6 text-black overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(160, 219, 255, 0.8))',
      }}
    >
      {/* Left Bottom Image - Increased size */}
      <div 
        className="absolute bottom-0 left-0 z-0"
        style={{
          backgroundImage: `url(${leftImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'bottom left',
          backgroundRepeat: 'no-repeat',
          width: '600px',
          height: '450px',
          opacity: 0.6
        }}
      ></div>

      {/* Right Bottom Image - Increased size */}
      <div 
        className="absolute bottom-0 right-0 z-0"
        style={{
          backgroundImage: `url(${rightImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'bottom right',
          backgroundRepeat: 'no-repeat',
          width: '600px',
          height: '450px',
          opacity: 0.6
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Main Footer Content - 5 column layout matching the image */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          
          {/* Brand Section with Logo and Name Images */}
          <div className="lg:col-span-1">
            <div className="flex flex-col gap-2">
              {/* Logo Image - Increased size */}
              <img 
                src={logoImage} 
                alt="Logo" 
                className="w-20 h-40 object-contain mb-1"
              />
              {/* Name/Brand Image */}
              <img 
                src={nameImage} 
                alt="Smart Virtual Tourism Guide" 
                className="w-full max-w-[200px] object-contain"
              />
            </div>
            <p className="text-xs text-black leading-relaxed mt-3">
              Ai-powered travel planning platform design to help you explore Sri Lanka safely, smartly and efficiently
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 mt-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-[#1877F2] transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-[#E4405F] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-[#1DA1F2] transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links - Aligned to middle */}
          <div className="flex flex-col justify-center">
            <h3 className="text-md font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">Home</a></li>
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">Features</a></li>
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">Destinations</a></li>
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">How it Works</a></li>
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">Safety</a></li>
            </ul>
          </div>

          {/* Destinations - Aligned to middle */}
          <div className="flex flex-col justify-center">
            <h3 className="text-md font-semibold mb-3">Destinations</h3>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">Sigiriya</a></li>
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">Ella</a></li>
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">Galle</a></li>
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">Yala National Park</a></li>
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">Colombo</a></li>
            </ul>
          </div>

          {/* Support - Aligned to middle */}
          <div className="flex flex-col justify-center">
            <h3 className="text-md font-semibold mb-3">Support</h3>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">Help Center</a></li>
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">Terms & Condition</a></li>
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">FAQ</a></li>
              <li><a href="#" className="text-black hover:text-[#3CB4FF] transition-colors">Travel Safety Guidelines</a></li>
            </ul>
          </div>

          {/* Contact Section - Aligned to middle */}
          <div className="flex flex-col justify-center">
            <h3 className="text-md font-semibold mb-3">Contact Us</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-black mt-0.5 flex-shrink-0" />
                <span className="text-black">Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-black flex-shrink-0" />
                <span className="text-black">+91 9876543210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-black flex-shrink-0" />
                <span className="text-black">support@svgt.lk</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-10 pt-6 text-center text-xs text-[#3CB4FF] border-t border-gray-400/30">
          © {new Date().getFullYear()} Smart Virtual Tourism Guide. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;