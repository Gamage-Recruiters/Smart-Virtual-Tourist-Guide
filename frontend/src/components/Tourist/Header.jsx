import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';

// Import your logo images - adjust the paths based on your actual file structure
import logoIcon from '../../assets/Tourist/logo.png';
import logoText from '../../assets/Tourist/name.png';
import navBg from '../../assets/Tourist/Headder.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  // Load user data if logged in (check all potential keys)
  const getUserFromStorage = () => {
    try {
      const keys = ['userData', 'user', 'restaurantUser', 'renter', 'touristProfile'];
      for (const key of keys) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed && typeof parsed === 'object') return parsed;
        }
      }
    } catch {
      return null;
    }
    return null;
  };

  const user = getUserFromStorage();

  const navigate = useNavigate();

  const navItems = ['Home', 'Features', 'Destinations', 'Restaurants', 'How it Works', 'Contact'];

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
    console.log(`Language changed to: ${langName}`);
  };

  const handleProfileClick = () => {
    const activeUser = user || getUserFromStorage();
    const role = (activeUser?.role || '').toLowerCase();
    if (role.includes('driver')) {
      navigate('/driver-details');
    } else if (role.includes('hotel')) {
      navigate('/Hotel-Owner-Profile-Settings');
    } else if (role.includes('restaurant')) {
      navigate('/resturent/dashboard/profile');
    } else if (role.includes('guide')) {
      navigate('/guide-dashboard');
    } else if (role.includes('renter')) {
      navigate('/renter-dashboard');
    } else {
      navigate('/dashboard-Tourist/touristProfile');
    }
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
                className="h-14 w-auto cursor-pointer"
                onClick={() => navigate('/')}
              />
              {/* Logo Text Image - Increased from h-8 to h-10 */}
              <img
                src={logoText}
                alt="Smart Virtual Tourist Guide"
                className="h-10 w-auto hidden sm:block cursor-pointer"
                onClick={() => navigate('/')}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-700 hover:text-[#0075FF] font-medium text-sm transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Language Selector & Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">

              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-[#0075FF] transition-colors duration-200"
                >
                  <Globe className="w-5 h-5 text-[#0075FF]" />
                  <span className="text-sm font-semibold">{selectedLanguage}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isLanguageOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsLanguageOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code, lang.name)}
                          className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 ${selectedLanguage === lang.code ? 'bg-blue-50 text-[#0075FF]' : 'text-gray-700'
                            }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
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

              {/* Sign In / User Profile display */}
              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleProfileClick}
                    className="ml-2 px-5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0075FF] font-bold rounded-lg text-sm flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    title="View Profile"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    {user.fullName || user.restaurantName || user.username || 'User'}
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('userData');
                      localStorage.removeItem('restaurantUser');
                      window.location.reload();
                    }}
                    className="px-4 py-2 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-700 font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-sm"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="ml-2 px-6 py-2 bg-[#0075FF] hover:bg-[#0059CC] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-xl"
                >
                  Sign in
                </button>
              )}
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
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (item === 'Restaurants') {
                        navigate('/restaurants');
                      } else if (item === 'Home') {
                        navigate('/');
                      }
                    }}
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
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${selectedLanguage === lang.code
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

                {user ? (
                  <div className="mx-4 py-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[#0075FF] font-bold text-sm">
                      {user.fullName || user.restaurantName || user.username || 'User'}
                    </span>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        localStorage.removeItem('token');
                        localStorage.removeItem('userData');
                        localStorage.removeItem('restaurantUser');
                        window.location.reload();
                      }}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 rounded-lg text-xs font-semibold"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button
                    className="px-4 py-3 bg-[#0075FF] hover:bg-[#0059CC] text-white font-semibold rounded-lg transition-colors mt-2 text-center"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/login');
                    }}
                  >
                    Sign in
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Custom animations */}
      <style jsx>{`
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
