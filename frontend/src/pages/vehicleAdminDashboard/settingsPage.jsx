import { useState, useRef, useEffect } from "react";
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
import uploadFileToSupabase from "../../utils/fileUpload";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile Information");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [renter, setRenter] = useState("");

  const [nicOrPassport, setNicOrPassport] = useState(null);
  const [nicError, setNicError] = useState("");
  const [businessLicense, setBusinessLicense] = useState(null);
  const [businessLicenseError, setBusinessLicenseError] = useState("");
  const [profileInforLoading, setProfileInforLoading] = useState(false);

  const nicInputRef = useRef(null);
  const businessLicenseInputRef = useRef(null);
  const token = localStorage.getItem("renterToken") || localStorage.getItem("token");

  const resolveApiUrl = (path = "") => {
    const base = (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return base.includes("/api") ? `${base}${normalizedPath}` : `${base}/api${normalizedPath}`;
  };

  // 1. Create refs for each section
  const profileRef = useRef(null);
  const documentsRef = useRef(null);
  const securityRef = useRef(null);

  useEffect(() => {
    axios
      .get(resolveApiUrl("/auth/me"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRenter(res.data.user);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, [token]);

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
        .post(resolveApiUrl("/auth/reset-password"), {
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
    }
  }

  async function handleProfileInfoUpdate() {
    try {
      setProfileInforLoading(true);
      // axios
      //   .post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/update-profile`, {
      //     token,
      //     fullName: renter.fullName,
      //     email: renter.email,
      //     contactNumber: renter.contactNumber,
      //     veificationDocuments:[
      //       nicOrPassport,
      //       businessLicense
      //     ]
      //   })
      //   .then(() => {
      //     toast.success("Profile Updated Successfully");
      //   })
      //   .catch((e) => {
      //     // console.error(e.message);
      //     toast.error(e.response?.data?.message || "Error. Try Again!");
      //   });

      const nicOrPassportUrl = nicOrPassport
        ? await uploadFileToSupabase(nicOrPassport, "renter-verification-documents")
        : null;
      const businessLicenseUrl = businessLicense
        ? await uploadFileToSupabase(businessLicense, "renter-verification-documents")
        : null;
      console.log({
        token,
        fullName: renter.fullName,
        email: renter.email,
        contactNumber: renter.contactNumber,
        veificationDocuments: [nicOrPassportUrl, businessLicenseUrl],
      });
    } catch (err) {
      console.log(err);
    } finally {
      setProfileInforLoading(false);
    }
  }

  const processFile = (file, setError, fieldName) => {
    setError("");

    if (!file) return;

    const validTypes = ["image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid format. Please use PDF, PNG, or JPG.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    if (fieldName === "nicOrPassport") {
      setNicOrPassport(file);
    } else if (fieldName === "businessLicense") {
      setBusinessLicense(file);
    }
  };

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
        className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm  ${activeTab === "Profile Information" || activeTab === "Documents & Compliance" ? "shadow-xl" : "border border-slate-100/50"} relative scroll-mt-20`}
        onClick={() => handleTabClick("Profile Information")}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-extrabold text-slate-900">
            Profile Details
          </h2>
          <button
            className={`text-sm font-bold bg-[#2563EB] text-white transition-colors px-3 py-2 rounded-lg shadow-sm hover:shadow-md hover:bg-[#1d4ed8] ${profileInforLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={handleProfileInfoUpdate}
            disabled={profileInforLoading}
          >
            {profileInforLoading ? "Saving..." : "save changes"}
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
                value={renter?.fullName || ""}
                onChange={(e) =>
                  setRenter({ ...renter, fullName: e.target.value })
                }
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
                value={renter?.username || ""}
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
                value={renter?.email || ""}
                onChange={(e) =>
                  setRenter({ ...renter, email: e.target.value })
                }
                className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Phone Number
              </label>
              <input
                type="text"
                value={renter?.contactNumber || ""}
                onChange={(e) =>
                  setRenter({ ...renter, contactNumber: e.target.value })
                }
                className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all"
              />
            </div>
          </div>
        </div>

        {/* 4. Verification Documents Section */}
        <div
          ref={documentsRef}
          onClick={() => handleTabClick("Documents & Compliance")}
          className="mt-12 border-t border-slate-100 pt-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Verification Documents
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Upload clear scans of your legal documents for account
                verification.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-10">
            {/* Card 1: Owner NIC / Passport */}
            <div
              onClick={() => nicInputRef.current.click()}
              className={`border-2 border-dashed rounded-2xl transition-all cursor-pointer tracking-wider ${
                nicError
                  ? "border-red-500 bg-red-50/20"
                  : nicOrPassport
                    ? "border-green-500 bg-green-50/10"
                    : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                hidden
                ref={nicInputRef}
                onChange={(e) =>
                  processFile(e.target.files[0], setNicError, "nicOrPassport")
                }
              />
              <div className="p-6 flex flex-col items-center text-center relative">
                <ShieldCheck
                  size={32}
                  className={
                    nicOrPassport
                      ? "text-green-600 mb-2"
                      : "text-slate-400 mb-2"
                  }
                />
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  Owner NIC / Passport
                </h3>

                {nicError ? (
                  <span className="text-xs font-bold text-red-500 my-2">
                    {nicError}
                  </span>
                ) : (
                  <p className="text-xs text-slate-400 mb-4">
                    {typeof nicOrPassport === "string" && nicOrPassport
                      ? "File saved on record"
                      : nicOrPassport?.name
                        ? `Selected: ${nicOrPassport.name}`
                        : "JPG, PNG (max 5MB)"}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <div className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                    {nicOrPassport ? "Replace File" : "Choose File"}
                  </div>

                  {nicOrPassport && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNicOrPassport(null);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove document"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: Business License */}
            <div
              onClick={() => businessLicenseInputRef.current.click()}
              className={`border-2 border-dashed rounded-2xl transition-all cursor-pointer tracking-wider ${
                businessLicenseError
                  ? "border-red-500 bg-red-50/20"
                  : businessLicense
                    ? "border-green-500 bg-green-50/10"
                    : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                hidden
                ref={businessLicenseInputRef}
                onChange={(e) =>
                  processFile(
                    e.target.files[0],
                    setBusinessLicenseError,
                    "businessLicense",
                  )
                }
              />
              <div className="p-6 flex flex-col items-center text-center relative">
                <Building2
                  size={32}
                  className={
                    businessLicense
                      ? "text-green-600 mb-2"
                      : "text-slate-400 mb-2"
                  }
                />
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  Business License
                </h3>

                {businessLicenseError ? (
                  <span className="text-xs font-bold text-red-500 my-2">
                    {businessLicenseError}
                  </span>
                ) : (
                  <p className="text-xs text-slate-400 mb-4">
                    {typeof businessLicense === "string" && businessLicense
                      ? "File saved on record"
                      : businessLicense?.name
                        ? `Selected: ${businessLicense.name}`
                        : "JPG, PNG (max 5MB)"}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <div className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                    {businessLicense ? "Replace File" : "Choose File"}
                  </div>

                  {businessLicense && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBusinessLicense(null);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove document"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
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
                className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all mt-2"
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
                className="w-full bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all mt-2"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
            <p className="text-xs 2xl:text-sm text-slate-400 font-medium">
              Password must be at least 12 characters long with symbols.
            </p>
            <button
              className={`bg-[#2563EB] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md shadow-orange-200 hover:bg-[#1d4ed8] transition-colors w-full md:w-auto cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
