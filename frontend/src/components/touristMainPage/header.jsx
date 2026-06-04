import {
  Search,
  Globe,
  Bell,
} from "lucide-react";
import logo from "../../assets/touristDashboard/Lanka.png";
import textImage from "../../assets/touristDashboard/main_text.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="w-full h-20 bg-white flex items-center justify-between z-1 px-8 fixed top-0 left-0">
        <div className="flex items-start justify-center pl-10">
          <img className="w-30 mt-15" src={logo} alt="Sri Lanka" />
        </div>
        <div className="flex items-center justify-between w-full">
          <img className="w-50" src={textImage} alt="Main text" />
          <div className="relative w-1/2">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search destinations, bookings, or activities..."
              className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 cursor-pointer">
              <Globe size={18} />
              <span className="font-medium">EN</span>
            </div>
            <div className="relative cursor-pointer">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex items-center gap-3 pl-6">
              <Link  className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold">
                D
              </Link>
              <span className="font-semibold text-sm">Dasuni</span>
            </div>
          </div>
        </div>
      </header>
  )
}

export default Header