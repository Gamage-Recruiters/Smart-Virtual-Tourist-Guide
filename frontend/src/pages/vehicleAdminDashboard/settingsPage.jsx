import { useState, useRef } from 'react';
import { Bell, Plus, Camera, Car, ShieldCheck, Building2, Trash2 } from 'lucide-react';
import AddVehicleModal from './addVehicle/addVehicleModal';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile Information');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Create refs for each section
  const profileRef = useRef(null);
  const documentsRef = useRef(null);
  const securityRef = useRef(null);

  const tabs = ['Profile Information', 'Documents & Compliance', 'Security Settings'];

  // 2. Create a handler function to manage state and scrolling
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    // Scroll to the corresponding section based on the clicked tab
    if (tab === 'Profile Information' && profileRef.current) {
      profileRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tab === 'Documents & Compliance' && documentsRef.current) {
      documentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tab === 'Security Settings' && securityRef.current) {
      securityRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage your provider profile, documentation, and security preferences.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors" onClick={()=>setIsModalOpen(true)}>
            <Plus size={18} strokeWidth={3} />
            ADD NEW VEHICLE
          </button>
        </div>
        <AddVehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </header>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center justify-center gap-3 pb-2 my-2 sticky top-0 z-10 w-full">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)} // Use the new handler here
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
              activeTab === tab
                ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Profile Details Section */}
      <section ref={profileRef} className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm  ${activeTab === 'Profile Information' ? 'border-2 border-[#2563EB]' : 'border border-slate-100/50'} relative scroll-mt-20`} onClick={() => handleTabClick('Profile Information')}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-extrabold text-slate-900">Profile Details</h2>
          <button className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors absolute top-6 right-8">
            Save Changes
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Avatar Upload */}
          <div className="shrink-0 flex justify-center">
            <div className="relative w-28 h-28 rounded-full">
              <div className="w-28 h-28 rounded-full bg-slate-300"></div>
              <button className="absolute bottom-0 right-0 p-2 bg-slate-500 text-white rounded-full border-2 border-white hover:bg-slate-600 transition-colors shadow-sm">
                <Camera size={16} />
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <input type="text" defaultValue="Ishan Lankathilaka" className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Business Name</label>
              <input type="text" defaultValue="Lanka Rentals" className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Contact Email</label>
              <input type="email" defaultValue="Lankarentals@gmail.com" className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
              <input type="text" defaultValue="+947 000-1234" className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Verification Documents Section */}
      <section ref={documentsRef} className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm scroll-mt-20 ${activeTab === 'Documents & Compliance' ? 'border-2 border-[#2563EB]' : 'border border-slate-100/50'}`} onClick={() => handleTabClick('Documents & Compliance')}>
        <h2 className="text-lg font-extrabold text-slate-900 mb-6">Verification Documents</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Insurance */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-slate-50 transition-colors">
            <Car size={24} className="text-slate-400 mb-3" />
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">Vehicle Insurance</h3>
            <p className="text-[11px] font-medium text-slate-400 mb-4">PDF, JPG up to 10MB</p>
            <button className="bg-orange-50 text-orange-600 text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider">
              Upload Now
            </button>
          </div>

          {/* Card 2: ID */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-slate-50 transition-colors">
            <ShieldCheck size={24} className="text-slate-400 mb-3" />
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">Owner ID / Passport</h3>
            <p className="text-[11px] font-medium text-slate-400 mb-4">Front & Back scan</p>
            <span className="bg-green-50 text-green-600 text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={12} /> Verified
            </span>
          </div>

          {/* Card 3: Business License */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-slate-50 transition-colors">
            <Building2 size={24} className="text-slate-400 mb-3" />
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">Business License</h3>
            <p className="text-[11px] font-medium text-slate-400 mb-4">Valid trade license</p>
            <span className="bg-amber-50 text-amber-600 text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider">
              Under Review
            </span>
          </div>
        </div>
      </section>

      {/* 5. Security & Password Section */}
      <section ref={securityRef} className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm border scroll-mt-20 ${activeTab === 'Security Settings' ? 'border-2 border-[#2563EB]' : 'border border-slate-100/50'}`} onClick={() => handleTabClick('Security Settings')}>
        <h2 className="text-lg font-extrabold text-slate-900 mb-6">Security & Password</h2>
        
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Current Password</label>
            <input type="password" defaultValue="********" className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
              <input type="password" defaultValue="********" className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
              <input type="password" defaultValue="********" className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
            <p className="text-xs 2xl:text-sm text-slate-400 font-medium">Password must be at least 12 characters long with symbols.</p>
            <button className="bg-[#EA580C] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md shadow-orange-200 hover:bg-orange-700 transition-colors w-full md:w-auto">
              Update Password
            </button>
          </div>
        </div>
      </section>

      {/* 6. Footer Information */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 mt-1">
        <p className="text-sm font-medium text-slate-500">
          Last login: 2 hours ago from Colombo, Sri Lanka
        </p>
        <button className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
          <Trash2 size={14} />
          Deactivate Account
        </button>
      </div>

    </div>
  );
}

export default SettingsPage;