import React from "react";
import { MapPin, Phone, Send } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import h1 from "../assets/h1.png";
import h2 from "../assets/h2.png";
import Lotus1 from "../assets/Lotus1.png";
import Lotus2 from "../assets/Lotus2.png";

export default function Footer() {
  return (
    <footer className="relative w-full min-h-[330px] bg-gradient-to-b from-white via-[#eaf7ff] to-[#bfe8ff] overflow-hidden">
      {/* Left Big Lotus Background */}
      <img
        src={Lotus1}
        alt="Lotus Flower"
        className="absolute left-0 top-0 w-[280px] h-full object-contain object-left"
        />

      {/* Bottom Mandala Image - desktop only */}
      <img
        src={Lotus2}
        alt="Mandala Design"
        className="hidden lg:block absolute right-10 bottom-0 w-[450px] object-contain opacity-100"
      />

      
      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start min-h-[330px] px-2 lg:px-[50px]">
        {/* Logo and Description */}
        <div className="w-[220px] mx-20 -mt-25 text-center lg:text-left lg:w-[260px] lg:mt-8">
          <img
            src={h1}
            alt="Sri Lanka Logo"
            className="w-[100px] h-[100px] object-contain mx-auto lg:ml-[28px]"
          />

          <img
            src={h2}
            alt="Smart Virtual Tourism Guide Sri Lanka"
            className="w-[190px] mt-1 object-contain mx-auto lg:mx-0"
          />

          <p className="text-[12px] lg:text-[13px] leading-[18px] text-black mt-2 w-[190px] mx-auto lg:mx-0">
            AI-powered travel planning platform designed to help you explore Sri
            Lanka safely, smartly and efficiently
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-4 mt-3 lg:ml-[100px]">
            <FaFacebookF size={16} className="text-[#1877f2]" />
            <FaInstagram size={16} className="text-[#e1306c]" />
            <FaXTwitter size={16} className="text-black" />
          </div>
        </div>

        {/* Desktop Columns */}
        <div className="hidden -mt-20 lg:flex items-start">
          {/* Quick Links */}
          <div className="w-[200px] -ml-[20px]">
            <h3 className="font-bold text-[13px] mb-3">Quick Links</h3>
            <ul className="text-[13px] leading-[21px] list-disc list-inside">
              <li>Home</li>
              <li>Features</li>
              <li>Destinations</li>
              <li>How it Works</li>
              <li>Safety</li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="w-[200px]">
            <h3 className="font-bold text-[13px] mb-3">Destinations</h3>
            <ul className="text-[13px] leading-[21px] list-disc list-inside">
              <li>Sigiriya</li>
              <li>Ella</li>
              <li>Galle</li>
              <li>Yala National Park</li>
              <li>Colombo</li>
            </ul>
          </div>

          {/* Support */}
          <div className="w-[220px]">
            <h3 className="font-bold text-[13px] mb-3">Support</h3>
            <ul className="text-[13px] leading-[21px] list-disc list-inside">
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms & Condition</li>
              <li>FAQ</li>
              <li>Travel Safety Guidelines</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="w-[190px]">
            <h3 className="font-bold text-[13px] mb-3">Contact Us.</h3>

            <div className="flex items-center gap-2 text-[12px] mb-6">
              <MapPin size={15} className="text-red-500" />
              <span>Colombo, Sri Lanka</span>
            </div>

            <div className="flex items-center gap-2 text-[12px] mb-6">
              <Phone size={14} className="text-red-500" />
              <span>+91 9876543210</span>
            </div>

            <div className="flex items-center gap-2 text-[12px]">
              <Send size={15} className="text-blue-500" />
              <span>support@svgt.lk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright - desktop only */}
      <p className="hidden lg:block absolute bottom-5 left-1/2 -translate-x-1/2 text-[13px] text-[#0099e5]">
        svgt@2026 all right reserve
      </p>
    </footer>
  );
}