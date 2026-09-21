import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Import your logo images
import logoIcon from '../../assets/Tourist/logo.png';
import logoText from '../../assets/Tourist/name.png';
import navBg from '../../assets/Tourist/Headder.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50">
      <nav className="relative">
        {/* Background Image for Navigation Bar */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${navBg})`,
          }}
        />

        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-white/90" />

        {/* Navigation Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">

            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <img
                src={logoIcon}
                alt="Logo"
                className="h-30 w-auto object-contain pt-3 cursor-pointer"
                onClick={() => navigate('/')}
              />

              <img
                src={logoText}
                alt="Smart Virtual Tourism Guide Sri Lanka"
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-slideDown">
              <button
                className="w-full px-4 py-3 bg-[#0075FF] hover:bg-[#0059CC] text-white font-semibold rounded-lg transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Custom Animation */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;