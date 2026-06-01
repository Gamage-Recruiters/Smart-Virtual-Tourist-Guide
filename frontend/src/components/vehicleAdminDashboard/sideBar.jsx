import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Car, DollarSign, Settings } from 'lucide-react';

function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/vehicle-admin', icon: LayoutDashboard, end: true },
    { name: 'Rental Requests', path: '/vehicle-admin/requests', icon: FileText },
    { name: 'My Fleet', path: '/vehicle-admin/fleet', icon: Car },
    { name: 'Earnings', path: '/vehicle-admin/earnings', icon: DollarSign },
    { name: 'Settings', path: '/vehicle-admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#e8f0fe] h-full flex flex-col justify-between py-6 px-4">
      <div>
        {/* Logo Area */}
        <div className="mb-10 px-4">
          <h1 className="text-sm font-bold text-slate-800 tracking-wide">VEHICLES</h1>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Admin Portal</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end = {item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' // Styling for the active page
                    : 'text-slate-500 hover:bg-blue-100 hover:text-blue-600' // Styling for inactive pages
                }`
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className="border-t border-blue-200 pt-4 px-2 flex items-center gap-3 mt-4">
        <div className="w-10 h-10 rounded-full bg-red-300"></div>
        <div>
          <p className="text-sm font-bold text-slate-800">Lanka Rentals</p>
          <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
            ✓ VERIFIED OWNER
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;