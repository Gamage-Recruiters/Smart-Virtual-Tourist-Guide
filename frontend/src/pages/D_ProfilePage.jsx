import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
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
  Trash2,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

function D_ProfilePage() {
  const placeholder = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22100%22%3E%3Crect width=%22150%22 height=%22100%22 fill=%22%23e2e8f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22 font-size=%2212%22%3ENo Image%3C/text%3E%3C/svg%3E';

  const [profileData, setProfileData] = useState({
    vehicleType: '',
    vehicleNumber: '',
    licenseNumber: '',
    licenseImages: [placeholder, placeholder],
    regBookImages: [placeholder],
    vehicleImages: [placeholder, placeholder, placeholder]
  });
  const [userInfo, setUserInfo] = useState({ fullName: '', email: '', contactNumber: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const { user } = await apiClient.get('/auth/me');
        setUserInfo({ fullName: user.fullName || '', email: user.email || '', contactNumber: user.contactNumber || '' });
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    try {
      await apiClient.put('/auth/update', {
        fullName: userInfo.fullName,
        contactNumber: userInfo.contactNumber
      });
      setMessage('Profile saved successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage(err.message || 'Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPass !== passwords.confirm) {
      setMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await apiClient.put('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.newPass
      });
      setMessage('Password updated successfully!');
      setPasswords({ current: '', newPass: '', confirm: '' });
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage(err.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (field, file) => {
    // In real implementation, this would upload to cloud storage
    const imageUrl = URL.createObjectURL(file);
    setProfileData(prev => ({
      ...prev,
      [field]: [...prev[field], imageUrl]
    }));
  };

  const handleImageRemove = (field, index) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

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
          
          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          {/* SECTION 1: PROFILE DETAILS */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Profile Details</h3>
              <button onClick={handleSaveProfile} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition disabled:opacity-50">
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Changes'}
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
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                  <input type="text" value={userInfo.fullName} onChange={e => setUserInfo(p => ({...p, fullName: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Contact Email</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-slate-500">{userInfo.email}</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                  <input type="text" value={userInfo.contactNumber} onChange={e => setUserInfo(p => ({...p, contactNumber: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: DRIVER SPECIFIC INFORMATION */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Vehicle & Driver Information</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Vehicle Type</label>
                <input 
                  type="text" 
                  value={profileData.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Vehicle Number</label>
                <input 
                  type="text" 
                  value={profileData.vehicleNumber}
                  onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">License Number</label>
                <input 
                  type="text" 
                  value={profileData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: DOCUMENT IMAGES */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Document Images</h3>
            
            <div className="space-y-8">
              {/* License Images */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-slate-700">License Images</label>
                  <button 
                    onClick={() => document.getElementById('licenseUpload').click()}
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <UploadCloud size={16} />
                    Upload New
                  </button>
                  <input 
                    id="licenseUpload"
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach(file => {
                          handleImageUpload('licenseImages', file);
                        });
                      }
                    }}
                    className="hidden"
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  {profileData.licenseImages.map((url, index) => (
                    <ImageCard 
                      key={index}
                      url={url}
                      onRemove={() => handleImageRemove('licenseImages', index)}
                      title={`License ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Registration Book Images */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-slate-700">Registration Book Images</label>
                  <button 
                    onClick={() => document.getElementById('regBookUpload').click()}
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <UploadCloud size={16} />
                    Upload New
                  </button>
                  <input 
                    id="regBookUpload"
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach(file => {
                          handleImageUpload('regBookImages', file);
                        });
                      }
                    }}
                    className="hidden"
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  {profileData.regBookImages.map((url, index) => (
                    <ImageCard 
                      key={index}
                      url={url}
                      onRemove={() => handleImageRemove('regBookImages', index)}
                      title={`Registration ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Vehicle Images */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-slate-700">Vehicle Images</label>
                  <button 
                    onClick={() => document.getElementById('vehicleUpload').click()}
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <UploadCloud size={16} />
                    Upload New
                  </button>
                  <input 
                    id="vehicleUpload"
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach(file => {
                          handleImageUpload('vehicleImages', file);
                        });
                      }
                    }}
                    className="hidden"
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  {profileData.vehicleImages.map((url, index) => (
                    <ImageCard 
                      key={index}
                      url={url}
                      onRemove={() => handleImageRemove('vehicleImages', index)}
                      title={`Vehicle ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: SECURITY & PASSWORD */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Security & Password</h3>
            
            <div className="space-y-6">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={passwords.current}
                    onChange={e => setPasswords(p => ({...p, current: e.target.value}))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                  <input 
                    type="password" 
                    value={passwords.newPass}
                    onChange={e => setPasswords(p => ({...p, newPass: e.target.value}))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwords.confirm}
                    onChange={e => setPasswords(p => ({...p, confirm: e.target.value}))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-400">Password must be at least 12 characters long with symbols.</p>

              <div className="flex justify-end pt-2">
                <button onClick={handleChangePassword} disabled={loading} className="bg-[#F06B2D] hover:bg-[#d65a22] text-white px-6 py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-50">
                  {loading ? 'Updating...' : 'Update Password'}
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

function ImageCard({ url, onRemove, title }) {
  return (
    <div className="relative group">
      <img 
        src={url} 
        alt={title}
        className="w-32 h-24 object-cover rounded-lg border border-gray-200"
      />
      <button 
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default D_ProfilePage;