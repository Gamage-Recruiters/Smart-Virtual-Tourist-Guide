import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';

// --- Icons (Lucide React) ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);
const BookingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v16h16"/><path d="m8 8 4 4"/><path d="m16 8-4 4"/></svg>
);
const TourIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);
const EarningsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);

const SidebarItem = ({ icon: Icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${active ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
    <Icon />
    <span className="text-sm">{label}</span>
  </div>
);

const InputField = ({ label, type = "text", placeholder = "" }) => (
  <div className="flex flex-col gap-1 flex-1">
    <label className="text-xs font-semibold text-gray-700">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder} 
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    />
  </div>
);

const CheckboxCard = ({ label, checked = false }) => (
  <div className="flex items-center gap-2 cursor-pointer">
    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${checked ? 'border-blue-600' : 'border-gray-300'}`}>
      {checked && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
    </div>
    <span className="text-xs text-gray-700">{label}</span>
  </div>
);

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    fullName: '', contactNumber: '', email: '',
    guideIdNumber: '', yearsOfExperience: '', bio: '', specialSkills: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { user } = await apiClient.get('/auth/me');
        setFormData(prev => ({
          ...prev,
          fullName: user.fullName || '',
          contactNumber: user.contactNumber || '',
          email: user.email || ''
        }));
        const { profile } = await apiClient.get('/guide');
        if (profile) {
          setFormData(prev => ({
            ...prev,
            guideIdNumber: profile.guideDetails?.guideIdNumber || '',
            yearsOfExperience: profile.guideDetails?.yearsOfExperience || '',
            bio: profile.aboutMe?.bio || '',
            specialSkills: profile.aboutMe?.specialSkills || ''
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (profilePhoto) {
        const fd = new FormData();
        fd.append('profilePhoto', profilePhoto);
        await apiClient.upload('/guide/photo', fd);
      }
      await apiClient.put('/guide', {
        personalInfo: { fullName: formData.fullName, contactNumber: formData.contactNumber },
        guideDetails: { guideIdNumber: formData.guideIdNumber, yearsOfExperience: formData.yearsOfExperience },
        aboutMe: { bio: formData.bio, specialSkills: formData.specialSkills }
      });
      setMessage('Profile saved successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage(err.message || 'Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col">
            <span className="font-bold text-blue-600 text-lg tracking-wide">GUIDE</span>
            <span className="text-[10px] text-gray-400 font-medium tracking-widest">PROFESSIONAL</span>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <SidebarItem icon={DashboardIcon} label="Dashboard" />
          <SidebarItem icon={BookingsIcon} label="Booking Requests" />
          <SidebarItem icon={TourIcon} label="My Tour Packages" />
          <SidebarItem icon={EarningsIcon} label="Earnings" />
          <SidebarItem icon={SettingsIcon} label="Settings" active={true} />
        </nav>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your professional guide identity and preferences.</p>
          </div>

          {message && (
            <div className={`mb-6 p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-10">
            
            {/* Profile Photo Section */}
            <div className="flex flex-col md:flex-row items-start gap-6 pb-8 border-b border-gray-100 mb-8">
              <span className="text-sm font-semibold text-gray-700 pt-2 w-32">Profile Photo</span>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
                    {profilePhoto && <img src={URL.createObjectURL(profilePhoto)} className="w-full h-full object-cover" alt="profile" />}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <label className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition cursor-pointer">
                        Change Photo
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setProfilePhoto(e.target.files[0])} />
                      </label>
                      <button onClick={() => setProfilePhoto(null)} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-200 transition">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Full Name</label>
                  <input type="text" value={formData.fullName} onChange={e => setFormData(p => ({...p, fullName: e.target.value}))} placeholder="Enter full name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Gender</label>
                  <div className="flex items-center gap-6 pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-blue-600 bg-blue-600 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"></div></div>
                      <span className="text-xs text-gray-700">Male</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                      <span className="text-xs text-gray-700">Female</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                      <span className="text-xs text-gray-700">Other</span>
                    </div>
                  </div>
                </div>
                <InputField label="Date of Birth" type="date" />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Contact Number</label>
                  <input type="text" value={formData.contactNumber} onChange={e => setFormData(p => ({...p, contactNumber: e.target.value}))} placeholder="Enter contact number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Email Address</label>
                  <input type="email" value={formData.email} readOnly className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500" />
                </div>
              </div>
            </div>

            {/* Guide Details */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">Guide Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Guide ID Number</label>
                  <input type="text" value={formData.guideIdNumber} onChange={e => setFormData(p => ({...p, guideIdNumber: e.target.value}))} placeholder="Enter ID number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Years of Experience</label>
                  <input type="text" value={formData.yearsOfExperience} onChange={e => setFormData(p => ({...p, yearsOfExperience: e.target.value}))} placeholder="Enter years" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Languages Spoken</label>
                  <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2">
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded flex items-center gap-1">English <span className="cursor-pointer">×</span></span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded flex items-center gap-1">Sinhala <span className="cursor-pointer">×</span></span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded flex items-center gap-1">Tamil <span className="cursor-pointer">×</span></span>
                    <input type="text" placeholder="Add a language..." className="flex-1 min-w-[100px] text-sm outline-none bg-transparent" />
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700">Areas of Expertise</label>
                  <div className="flex flex-wrap gap-6">
                    <CheckboxCard label="Cultural" checked={true} />
                    <CheckboxCard label="Adventure" checked={true} />
                    <CheckboxCard label="Wildlife" checked={true} />
                    <CheckboxCard label="Culinary" />
                  </div>
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">About Me</h3>
              </div>
              <div className="grid grid-cols-1 gap-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Short Professional Bio</label>
                  <textarea value={formData.bio} onChange={e => setFormData(p => ({...p, bio: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Special Skills or Highlights</label>
                  <textarea value={formData.specialSkills} onChange={e => setFormData(p => ({...p, specialSkills: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 h-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                </div>
              </div>
            </div>

            {/* Documents Verification */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">Documents Verification</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-gray-50 transition">
                  <UploadIcon className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-xs font-semibold text-gray-600">Upload a file or drag and drop</p>
                  <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, PDF up to 10MB</p>
                </div>
                <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-gray-50 transition">
                  <UploadIcon className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-xs font-semibold text-gray-600">Upload a file or drag and drop</p>
                  <p className="text-[10px] text-gray-400 mt-1">Add multiple files if needed</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button onClick={() => window.location.reload()} className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition">Cancel Changes</button>
              <button onClick={handleSave} disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}