import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';

// Import your logo images - adjust the paths based on your actual file structure
import logoIcon from '../assets/logo.png';
import logoText from '../assets/name.png';
import navBg from '../assets/Headder.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const navigate = useNavigate();

  const navItems = ['Home', 'Features', 'Destinations', 'How it Works', 'Contact'];
  
  const languages = [
    { code: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'SI', name: 'සිංහල', flag: '🇱🇰' },
    { code: 'TA', name: 'தமிழ்', flag: '🇱🇰' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
  ];

  const handleLanguageChange = (langCode, langName) => {
    setSelectedLanguage(langCode);
    setIsLanguageOpen(false);
    // Add your language change logic here
    console.log(`Language changed to: ${langName}`);
  };

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
        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-white/90" />
        
        {/* Navigation Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            
            {/* Logo Section - Using Images with increased size */}
            <div className="flex items-center space-x-4">
              {/* Logo Icon Image - Increased from h-10 to h-14 */}
              <img 
                src={logoIcon} 
                alt="Logo" 
                className="h-30 w-auto object-contain pt-3"
                onClick={() => navigate('/')}
              />
              
              {/* Logo Name Text Image - Increased from h-8 to h-12 */}
              <img 
                src={logoText} 
                alt="Smart Virtual Tourism Guide Sri Lanka" 
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => (
                <button
                  key={item}
                  className="px-4 py-2 text-gray-600 hover:text-[#0075FF] font-medium rounded-lg transition-all duration-200 hover:bg-white/50 hover:scale-105"
                >
                  {item}
                </button>
              ))}
              
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-[#0075FF] font-medium rounded-lg transition-all duration-200 hover:bg-white/50"
                >
                  <Globe size={18} />
                  <span>{selectedLanguage}</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Language Dropdown */}
                {isLanguageOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsLanguageOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-fadeIn border border-gray-100">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code, lang.name)}
                          className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 ${
                            selectedLanguage === lang.code ? 'bg-blue-50 text-[#0075FF]' : 'text-gray-700'
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="flex-1">{lang.name}</span>
                          {selectedLanguage === lang.code && (
                            <span className="text-[#0075FF]">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button 
                onClick={() => navigate('/sign-in')}
                className="ml-2 px-6 py-2 bg-[#0075FF] hover:bg-[#0059CC] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-xl"
              >
                Sign in
              </button>
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
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item}
                    className="px-4 py-3 text-gray-600 hover:text-[#0075FF] font-medium rounded-lg hover:bg-white/50 transition-colors text-left"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </button>
                ))}
                
                {/* Mobile Language Selector */}
                <div className="px-4 py-2">
                  <div className="text-gray-500 text-sm mb-2 font-medium">Select Language</div>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          handleLanguageChange(lang.code, lang.name);
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          selectedLanguage === lang.code
                            ? 'bg-[#0075FF] text-white'
                            : 'bg-white/80 text-gray-700 hover:bg-white'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <button 
                  className="px-4 py-3 bg-[#0075FF] hover:bg-[#0059CC] text-white font-semibold rounded-lg transition-colors mt-2 text-center"
                  onClick={() => { setIsMenuOpen(false); navigate('/sign-in'); }}
                >
                  Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Custom animations */}
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

        @keyframes fadeIn {
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

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;