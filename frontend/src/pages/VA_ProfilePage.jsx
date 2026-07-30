import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Truck, 
  Wallet, 
  Settings, 
  Bell, 
  Plus, 
  Save, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  Trash2 
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#F5F8FC] flex font-sans text-slate-700">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-100 flex flex-col py-6 flex-shrink-0">
        <div className="px-6 mb-8">
          <h2 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Vehicles</h2>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem icon={<FileText size={20} />} label="Rental Requests" />
          <NavItem icon={<Truck size={20} />} label="My Fleet" />
          <NavItem icon={<Wallet size={20} />} label="Earnings" />
          <NavItem icon={<Settings size={20} />} label="Settings" active />
        </nav>

        <div className="px-6 mt-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-300"></div>
          <div className="text-sm font-medium">Lanka Rentals</div>
        </div>
      </aside>


      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        
        {/* TOP HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your provider profile, documentation, and security preferences.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-200 relative">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition">
              <Plus size={18} />
              ADD NEW VEHICLE
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-3 mb-8">
          <Tab label="Profile Information" active />
          <Tab label="Documents & Compliance" />
          <Tab label="Security Settings" />
        </div>

        <div className="space-y-6">
          
          {/* SECTION 1: PROFILE DETAILS */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Profile Details</h3>
              <button className="text-red-500 text-sm font-medium hover:underline flex items-center gap-1">
                <Save size={16} />
                Save Changes
              </button>
            </div>

            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="w-28 h-28 rounded-full bg-gray-300 relative group cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition text-white">
                    <UploadCloud size={24} />
                  </div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-6">
                <InputGroup label="Full Name" value="Ishan Lankathilaka" />
                <InputGroup label="Business Name" value="Lanka Rentals" />
                <InputGroup label="Contact Email" value="Lankarentals@gmail.co" />
                <InputGroup label="Phone Number" value="+947 000-1234" />
              </div>
            </div>
          </div>

          {/* SECTION 2: VERIFICATION DOCUMENTS */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Verification Documents</h3>
            
            <div className="grid grid-cols-3 gap-6">
              <DocumentCard 
                icon={<FileText size={28} className="text-slate-400" />}
                title="Vehicle Insurance"
                subtitle="PDF, JPG up to 10MB"
                action="UPLOAD NOW"
              />
              <DocumentCard 
                icon={<FileText size={28} className="text-slate-400" />}
                title="Owner ID / Passport"
                subtitle="Front & Back scan"
                status="VERIFIED"
                statusColor="green"
              />
              <DocumentCard 
                icon={<FileText size={28} className="text-slate-400" />}
                title="Business License"
                subtitle="Valid trade license"
                status="UNDER REVIEW"
                statusColor="orange"
              />
            </div>
          </div>

          {/* SECTION 3: SECURITY & PASSWORD */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Security & Password</h3>
            
            <div className="space-y-6">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <input type="password" value="........" readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                  <input type="password" value="........" readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                  <input type="password" value="........" readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <p className="text-xs text-slate-400">Password must be at least 12 characters long with symbols.</p>

              <div className="flex justify-end pt-2">
                <button className="bg-[#F06B2D] hover:bg-[#d65a22] text-white px-6 py-2.5 rounded-lg font-medium text-sm transition">
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM ACTIONS */}
          <div className="flex justify-between items-center pt-2 text-sm text-slate-500">
            <span>Last login: 2 hours ago from Colombo, Sri Lanka</span>
            <button className="text-red-500 font-medium hover:underline flex items-center gap-1">
              <Trash2 size={16} />
              Deactivate Account
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---

function NavItem({ icon, label, active = false }) {
  return (
    <a href="#" className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}>
      {icon}
      <span>{label}</span>
    </a>
  );
}

function Tab({ label, active = false }) {
  return (
    <button className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-gray-200 text-slate-600 hover:bg-gray-300'}`}>
      {label}
    </button>
  );
}

function InputGroup({ label, value }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-slate-700">
        {value}
      </div>
    </div>
  );
}

function DocumentCard({ icon, title, subtitle, action, status, statusColor = 'green' }) {
  const StatusIcon = statusColor === 'green' ? CheckCircle2 : Clock;
  const statusTextColor = statusColor === 'green' ? 'text-emerald-500' : 'text-orange-500';
  const statusBgColor = statusColor === 'green' ? 'bg-emerald-50' : 'bg-orange-50';

  return (
    <div className="border border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center text-center bg-white relative">
      <div className="mb-3 bg-white p-2 rounded-full">{icon}</div>
      <h4 className="font-semibold text-slate-800 text-sm">{title}</h4>
      <p className="text-[10px] text-slate-400 mt-1 mb-4">{subtitle}</p>
      
      {action ? (
        <button className="bg-[#F06B2D]/10 text-[#F06B2D] text-[10px] font-bold px-4 py-1.5 rounded-full border border-[#F06B2D]/30 hover:bg-[#F06B2D]/20 transition">
          {action}
        </button>
      ) : (
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${statusBgColor} ${statusTextColor} text-[10px] font-bold`}>
          <StatusIcon size={14} />
          {status}
        </div>
      )}
    </div>
  );
}

export default App;