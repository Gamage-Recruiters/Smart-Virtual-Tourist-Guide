import React from 'react';
import { Phone, Mail, MapPin, Send, ChevronDown } from 'lucide-react';

// IMPORT HERO BACKGROUND
import heroBg from '../assets/Contact.png'; 

// IMPORT SUPPORT LADY IMAGE
import supportLady from '../assets/helper.png'; 

// IMPORT BACKGROUND DECORATION IMAGE
import bgDecoration from '../assets/Mask.png';

const ContactPage = () => {
  return (
    <div className="font-sans bg-white text-gray-800 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[400px] md:h-[500px]">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 bg-[url('')]"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-wide">
            CONTACT <span className="text-[#FDC628]">US</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-medium text-white drop-shadow-md">
            Your Journey Starts with a Conversation
          </p>
        </div>
      </section>

      {/* --- INTRO TEXT --- */}
      <section className="py-12 px-4 text-center max-w-4xl mx-auto">
        <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-medium">
          We welcome your questions, suggestions, and feedback.<br />
          Let us help you discover the beauty of Sri Lanka with confidence.
        </p>
      </section>

      {/* --- GET IN TOUCH & FORM SECTION --- */}
      <section className="pb-20 px-4 relative overflow-hidden min-h-[600px]">
        
        {/* --- BACKGROUND DECORATION IMAGE --- */}
        <div className="absolute bottom-0 right-0 w-32 md:w-44 lg:w-52 h-auto z-0 pointer-events-none">
           <img 
             src={bgDecoration} 
             alt="Background Decoration" 
             className="w-full h-auto object-contain object-right-bottom opacity-80"
           />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Main Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#F49917] text-center mb-12">
            Get in touch today we're happy to assist you!
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              
              {/* Support Lady Image */}
              <div className="flex justify-center mb-4">
                <img 
                  src={supportLady} 
                  alt="Support Agent" 
                  className="w-full max-w-[400px] object-contain h-auto" 
                />
              </div>

              {/* Contact Details */}
              <div className="space-y-4 text-lg font-medium">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#007BFF] flex items-center justify-center text-white shrink-0">
                    <Phone size={20} />
                  </div>
                  <span>(+94) 9876543210</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FDC628] flex items-center justify-center text-white shrink-0">
                    <Mail size={20} />
                  </div>
                  <span>support@svgt.lk</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#007BFF] flex items-center justify-center text-white shrink-0">
                    <MapPin size={20} />
                  </div>
                  <span>Colombo, Sri Lanka</span>
                </div>
              </div>

              {/* --- LIVE MAP REPLACEMENT --- */}
              <div className="mt-2 rounded-2xl overflow-hidden shadow-md">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.63069028542!2d79.83916878452959!3d6.927099218884228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259c7f8cf44c9%3A0xfd0749385da2fe1a!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="300" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Colombo Map Location"
                  className="w-full h-auto min-h-[250px]"
                ></iframe>
              </div>

            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-gradient-to-br from-[#d1eefd] to-[#f2fcff] p-8 rounded-3xl shadow-xl relative">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h3>
              
              <form className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full p-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 outline-none bg-white shadow-sm" 
                />
                <input 
                  type="email" 
                  placeholder="E-mail Address" 
                  className="w-full p-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 outline-none bg-white shadow-sm" 
                />
                
                {/* Phone Input Row */}
                <div className="flex gap-2">
                  <div className="relative bg-white rounded-lg shadow-sm flex items-center px-3 flex-shrink-0 border-0">
                    <span className="text-gray-600 font-medium">+94</span>
                    <ChevronDown size={16} className="ml-1 text-gray-500" />
                  </div>
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full p-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 outline-none bg-white shadow-sm" 
                  />
                </div>

                <input 
                  type="text" 
                  placeholder="Subject" 
                  className="w-full p-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 outline-none bg-white shadow-sm" 
                />
                <textarea 
                  placeholder="Message....." 
                  rows="4"
                  className="w-full p-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 outline-none bg-white shadow-sm resize-none" 
                ></textarea>

                <button 
                  type="button"
                  className="self-start bg-[#4CB8F6] hover:bg-[#3ba3e0] text-white font-bold py-2 px-8 rounded-full transition-colors shadow-md text-lg"
                >
                  SEND
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-16 px-4 bg-white relative">
        {/* Background Watermark elements */}
        <div className="absolute top-20 right-0 text-[150px] text-[#F2F9A3] opacity-30 font-bold select-none pointer-events-none leading-none">
          ???
        </div>
        <div className="absolute bottom-20 left-0 text-[150px] text-[#F2F9A3] opacity-30 font-bold select-none pointer-events-none leading-none">
          ???
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 pb-2 border-b-4 border-[#4CB8F6] inline-block">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8 text-center">
            {/* FAQ Item 1 */}
            <div>
              <p className="text-gray-700 font-semibold text-lg mb-1">How quickly will I receive a response?</p>
              <p className="text-[#F49917] font-bold text-lg">We usually respond within 24 hours.</p>
            </div>

            {/* FAQ Item 2 */}
            <div>
              <p className="text-gray-700 font-semibold text-lg mb-1">Can international tourists contact your support team?</p>
              <p className="text-[#F49917] font-bold text-lg">Yes. We provide support for both local and foreign tourists.</p>
            </div>

            {/* FAQ Item 3 */}
            <div>
              <p className="text-gray-700 font-semibold text-lg mb-1">Can I report safety concerns during my trip?</p>
              <p className="text-[#4CB8F6] font-bold text-lg">
                Absolutely. You can contact us to report travel-related safety concerns,<br />
                and we'll provide guidance or direct you to the appropriate emergency services.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div>
              <p className="text-gray-700 font-semibold text-lg mb-1">Is Smart Virtual Tourist Guide free to use?</p>
              <p className="text-[#F49917] font-bold text-lg">
                Yes. Our platform is designed to help travelers plan safer and more enjoyable trips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION SECTION --- */}
      <section className="py-20 px-4 text-center relative">
        {/* Decorative Background Elements (Simulated) */}
        <div className="absolute left-0 bottom-0 w-48 h-48 opacity-30 pointer-events-none">
           <div className="w-full h-full bg-gradient-to-tr from-yellow-200 to-red-200 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute right-0 top-10 w-32 h-32 bg-pink-100 rounded-full blur-xl opacity-50 pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="w-24 h-1 bg-[#4CB8F6] mx-auto mb-6"></div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">
            Start Your Safe Adventure<br />
            <span className="text-[#F49917]">Today</span>
          </h3>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            From personalized travel planning to real-time safety guidance,<br />
            Smart Virtual Tourist Guide is your trusted companion<br />
            for exploring Sri Lanka with confidence.
          </p>
        </div>
      </section>
      
    </div>
  );
};

export default ContactPage;