import { ChevronDown } from "lucide-react"; // Replaced Search, Globe, Bell with ChevronDown
import logo from "../assets/headerAssets/Lanka.png";
import textImage from "../assets/headerAssets/main-test-2.png";
import { Link } from "react-router-dom";

function Header() {
  const navLinks = [
    "Home",
    "Menu",
    "Offers",
    "Reservation",
    "Revenue",
    "Profile",
  ];

  return (
    <header className="w-full h-20 bg-white flex items-center justify-between  fixed top-0 left-0 z-50">
      {/* Left Section: Logo & Brand Text */}
      <div className="absolute top-0 left-0 h-full">
        <div className="relative w-32 h-20 shrink-0">
          <div className="absolute top-20 left-0 w-24 h-12 bg-white rounded-b-full shadow-sm z-10"></div>

          <div className="absolute top-0 left-0 w-24 h-32 flex items-center justify-center z-10">
            <img
              className="w-24 h-24 object-contain drop-shadow-md"
              src={logo}
              alt="Sri Lanka Logo"
            />
          </div>
          
        </div>
      </div>
      <div className="flex items-center justify-between w-full h-20 shadow-sm pl-20 pr-8">
        <div className="flex items-center">
          {/* Main Text Image */}
          <img
            className="w-56 object-contain ml-1"
            src={textImage}
            alt="Smart Virtual Tourism Guide Sri Lanka"
          />
        </div>

        {/* Right Section: Nav Links, Button, Language */}
        <div className="flex items-center gap-8">
          {/* Navigation Links (Hidden on small screens, visible on large) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ">
            {navLinks.map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-slate-800 font-bold hover:text-blue-600 transition-colors text-xl"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Call to Action & Language Selector */}
          <div className="flex items-center gap-6 ml-4 border-l border-slate-100 pl-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-xl shadow-sm transition-transform active:scale-95">
              Sign in
            </button>

            <div className="flex items-center gap-1 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">
              <span className="font-bold uppercase tracking-wide">EN</span>
              <ChevronDown size={14} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
