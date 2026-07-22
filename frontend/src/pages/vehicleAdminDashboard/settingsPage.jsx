import { useState, useRef } from "react";
import {
  Bell,
  Plus,
  Camera,
  ShieldCheck,
  Building2,
  Trash2,
} from "lucide-react";
import AddVehicleModal from "./addVehicle/addVehicleModal";
import toast from "react-hot-toast";
import axios from "axios";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile Information");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("renterToken");

  // 1. Create refs for each section
  const profileRef = useRef(null);
  const documentsRef = useRef(null);
  const securityRef = useRef(null);

  const tabs = [
    "Profile Information",
    "Documents & Compliance",
    "Security Settings",
  ];

  // 2. Create a handler function to manage state and scrolling
  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Scroll to the corresponding section based on the clicked tab
    if (tab === "Profile Information" && profileRef.current) {
      profileRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (tab === "Documents & Compliance" && documentsRef.current) {
      documentsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (tab === "Security Settings" && securityRef.current) {
      securityRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  function handlePasswordUpdate() {
    try {
      setIsLoading(true);
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
          token,
          password: newPassword,
        })
        .then(() => {
          toast.success("Password Updated Successfully");
          setNewPassword("");
          setConfirmPassword("");
        })
        .catch((e) => {
          // console.error(e.message);
          toast.error(e.response?.data?.message || "Error. Try Again!");
        });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      console.log(newPassword, confirmPassword);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage your provider profile, documentation, and security
            preferences.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button
            className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} strokeWidth={3} />
            ADD NEW VEHICLE
          </button>
        </div>
        <AddVehicleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </header>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center justify-center gap-3 pb-2 my-2 sticky top-0 z-10 w-full">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
              activeTab === tab
                ? "bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-200"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Profile Details Section */}
      <section
        ref={profileRef}
        className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm  ${(activeTab === "Profile Information"|| activeTab === "Documents & Compliance") ? "shadow-xl" : "border border-slate-100/50"} relative scroll-mt-20`}
        onClick={() => handleTabClick("Profile Information")}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-extrabold text-slate-900">
            Profile Details
          </h2>
          <button className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors absolute top-6 right-8">
            Save Changes
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Avatar Upload */}
          <div className="shrink-0 flex justify-center">
            <div className="relative w-28 h-28 bg-slate-200 rounded-full">
              <div className="w-28 h-28 rounded-full">
                <img
                  src={"#"}
                  alt="User"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-slate-400 text-white rounded-full border-2 border-white hover:bg-slate-600 transition-colors shadow-sm">
                <Camera size={17} />
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Full Name
              </label>
              <input
                type="text"
               
                className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                User Name
              </label>
              {/* user cannot change username */}
              <input
                type="text"
                readOnly
                className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Contact Email
              </label>
              <input
                type="email"
                
                className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all"
              />
            </div>
          </div>
        </div>
      

      {/* 4. Verification Documents Section */}
      <div
        ref={documentsRef}
        onClick={() => handleTabClick("Documents & Compliance")}
        className="mt-20"
      >
        <h2 className="text-lg font-extrabold text-slate-900 mb-6">
          Verification Documents
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-10">
          {/* Card 1: ID */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-slate-50 transition-colors">
            <ShieldCheck size={24} className="text-slate-400 mb-3" />
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">
              Owner ID / Passport
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mb-4">
              Front & Back scan
            </p>
            <span className="bg-green-50 text-green-600 text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={12} /> Verified
            </span>
          </div>

          {/* Card 2: Business License */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-slate-50 transition-colors">
            <Building2 size={24} className="text-slate-400 mb-3" />
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">
              Business License
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mb-4">
              Valid trade license
            </p>
            <span className="bg-amber-50 text-amber-600 text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider">
              Under Review
            </span>
          </div>
        </div>
      </div>
      </section>

      {/* 5. Security & Password Section */}
      <section
        ref={securityRef}
        className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm scroll-mt-20 ${activeTab === "Security Settings" ? "shadow-xl" : "border border-slate-100/50"}`}
        onClick={() => handleTabClick("Security Settings")}
      >
        <h2 className="text-lg font-extrabold text-slate-900 mb-6">
          Security & Change Password
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
            <p className="text-xs 2xl:text-sm text-slate-400 font-medium">
              Password must be at least 12 characters long with symbols.
            </p>
            <button
              className={`bg-[#EA580C] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md shadow-orange-200 hover:bg-orange-700 transition-colors w-full md:w-auto cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handlePasswordUpdate}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </section>

      {/* 6. Footer Information */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 mt-1">
        <p className="text-sm font-medium text-slate-500">
          Last login: 2 hours ago from Colombo, Sri Lanka
        </p>
        <button className="flex items-center gap-1.5 text-sm px-5 py-3 rounded-xl bg-red-500 font-bold text-white">
          <Trash2 size={18} />
          Deactivate Account
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
