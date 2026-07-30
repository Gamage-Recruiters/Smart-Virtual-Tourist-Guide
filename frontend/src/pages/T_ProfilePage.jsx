import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Calendar, Upload } from 'lucide-react';
import { apiClient } from '../api/apiClient';

const T_ProfilePage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vaccinationFiles, setVaccinationFiles] = useState({
    covid19: null, hepatitisA: null, typhoid: null, yellowFever: null
  });

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    country: '',
    passportNumber: '',
    travelType: 'Solo',
    travelPreferences: {
      travelStart: '',
      travelEnd: '',
      budgetRange: { min: 10000, max: 100000, currency: 'LKR' },
      travelStyle: [],
      accommodationType: 'Resort'
    },
    healthInfo: {
      bloodType: '',
      medicalCondition: 'None',
      covid19: { status: '' },
      hepatitisA: { status: '' },
      typhoid: { status: '' },
      yellowFever: { status: '' }
    },
    emergencyContact: {
      name: '',
      phoneNumber: '',
      relationship: '',
      country: ''
    }
  });

  // Fetch existing user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiClient.get('/auth/me');
        const u = data.user;
        setFormData(prev => ({
          ...prev,
          fullName: u.fullName || '',
          username: u.username || '',
          email: u.email || '',
          country: u.country || '',
          passportNumber: u.passportNumber || '',
          travelType: u.travelType || 'Solo',
          travelPreferences: {
            travelStart: u.travelPreferences?.travelStart ? u.travelPreferences.travelStart.slice(0, 10) : '',
            travelEnd: u.travelPreferences?.travelEnd ? u.travelPreferences.travelEnd.slice(0, 10) : '',
            budgetRange: u.travelPreferences?.budgetRange || { min: 10000, max: 100000, currency: 'LKR' },
            travelStyle: u.travelPreferences?.travelStyle || [],
            accommodationType: u.travelPreferences?.accommodationType || 'Resort'
          },
          healthInfo: {
            bloodType: u.healthInfo?.bloodType || '',
            medicalCondition: u.healthInfo?.medicalCondition || 'None',
            covid19: { status: u.healthInfo?.covid19?.status || '' },
            hepatitisA: { status: u.healthInfo?.hepatitisA?.status || '' },
            typhoid: { status: u.healthInfo?.typhoid?.status || '' },
            yellowFever: { status: u.healthInfo?.yellowFever?.status || '' }
          },
          emergencyContact: {
            name: u.emergencyContact?.name || '',
            phoneNumber: u.emergencyContact?.phoneNumber || '',
            relationship: u.emergencyContact?.relationship || '',
            country: u.emergencyContact?.country || ''
          }
        }));
      } catch (err) {
        setError('Data fetching failed: ' + (err.message || 'Unable to load profile'));
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTravelPrefChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      travelPreferences: { ...prev.travelPreferences, [field]: value }
    }));
  };

  const handleTravelStyleToggle = (style) => {
    setFormData(prev => ({
      ...prev,
      travelPreferences: {
        ...prev.travelPreferences,
        travelStyle: prev.travelPreferences.travelStyle.includes(style)
          ? prev.travelPreferences.travelStyle.filter(s => s !== style)
          : [...prev.travelPreferences.travelStyle, style]
      }
    }));
  };

  const handleHealthChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      healthInfo: { ...prev.healthInfo, [field]: value }
    }));
  };

  const handleHealthStatusChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      healthInfo: {
        ...prev.healthInfo,
        [field]: { ...prev.healthInfo[field], status: value }
      }
    }));
  };

  const handleEmergencyChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value }
    }));
  };

  const handleVaccinationFile = (field, file) => {
    setVaccinationFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const fd = new FormData();
      fd.append('fullName', formData.fullName);
      fd.append('username', formData.username);
      fd.append('country', formData.country);
      fd.append('passportNumber', formData.passportNumber);
      fd.append('travelType', formData.travelType);
      fd.append('travelPreferences', JSON.stringify(formData.travelPreferences));
      fd.append('healthInfo', JSON.stringify(formData.healthInfo));
      fd.append('emergencyContact', JSON.stringify(formData.emergencyContact));

      // Append vaccination files if selected
      ['covid19', 'hepatitisA', 'typhoid', 'yellowFever'].forEach(key => {
        if (vaccinationFiles[key]) fd.append(key, vaccinationFiles[key]);
      });

      await apiClient.uploadPut('/auth/update', fd);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const travelStyles = ['Adventure', 'Cultural', 'Relaxation', 'Food & Dining', 'Nature', 'Nightlife', 'Shopping', 'Photography', 'Historical', 'Beach'];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const relationships = ['Spouse', 'Parent', 'Sibling', 'Friend', 'Other'];
  const accommodationTypes = ['Resort', 'Hotel', 'Villa', 'Hostel', 'Apartment', 'Guest House'];
  const travelTypes = ['Solo', 'Couple', 'Family', 'Group'];
  const medicalConditions = ['None', 'Diabetes', 'Heart Disease', 'Asthma', 'High Blood Pressure', 'Other'];

  const steps = [
    { id: 1, label: 'Personal Details' },
    { id: 2, label: 'Trip Preferences' },
    { id: 3, label: 'Health Profile' },
    { id: 4, label: 'Emergency Contact' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f8ff] flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f8ff] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Profile</h1>
          <p className="text-gray-500 mt-2">Tell us about yourself and your travel preferences to get personalized recommendations.</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-12">

            <div className="flex-1 space-y-10">

              {/* SECTION 01: Personal Details */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/50">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">01.</span>
                  <h2 className="text-lg font-semibold text-gray-800">Personal Details</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" value={formData.fullName}
                      onChange={e => handleChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition" />
                    <input type="text" placeholder="Username" value={formData.username}
                      onChange={e => handleChange('username', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition" />
                  </div>
                  <input type="email" placeholder="Email Address" value={formData.email} readOnly
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none text-gray-400 cursor-not-allowed" />
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} placeholder="New Password (leave blank to keep)"
                      value={formData.password} onChange={e => handleChange('password', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select value={formData.country} onChange={e => handleChange('country', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition text-gray-500">
                      <option value="">Country</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="Maldives">Maldives</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Australia">Australia</option>
                      <option value="India">India</option>
                      <option value="Other">Other</option>
                    </select>
                    <input type="text" placeholder="Passport Number" value={formData.passportNumber}
                      onChange={e => handleChange('passportNumber', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition" />
                  </div>
                </div>
              </div>

              {/* SECTION 02: Trip Preferences */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/50">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">02.</span>
                  <h2 className="text-lg font-semibold text-gray-800">Trip Preferences</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Travel Type</label>
                    <select value={formData.travelType} onChange={e => handleChange('travelType', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition text-gray-500">
                      {travelTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <input type="date" value={formData.travelPreferences.travelStart}
                        onChange={e => handleTravelPrefChange('travelStart', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition text-gray-500" />
                      <Calendar className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
                    </div>
                    <div className="relative">
                      <input type="date" value={formData.travelPreferences.travelEnd}
                        onChange={e => handleTravelPrefChange('travelEnd', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition text-gray-500" />
                      <Calendar className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Budget Range (LKR)</span>
                      <span className="font-semibold text-blue-600">LKR {formData.travelPreferences.budgetRange.min.toLocaleString()}</span>
                    </div>
                    <input type="range" min="10000" max="100000" step="1000"
                      value={formData.travelPreferences.budgetRange.min}
                      onChange={e => handleTravelPrefChange('budgetRange', { ...formData.travelPreferences.budgetRange, min: parseInt(e.target.value) })}
                      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>LKR 10,000</span><span>LKR 100,000</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Type</label>
                    <select value={formData.travelPreferences.accommodationType}
                      onChange={e => handleTravelPrefChange('accommodationType', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition text-gray-500">
                      {accommodationTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Travel Style</p>
                    <div className="flex flex-wrap gap-2">
                      {travelStyles.map(style => (
                        <button type="button" key={style} onClick={() => handleTravelStyleToggle(style)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            formData.travelPreferences.travelStyle.includes(style)
                              ? 'bg-blue-600 text-white border border-blue-600'
                              : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200'
                          }`}>
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 03: Health Profile */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/50">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">03.</span>
                  <h2 className="text-lg font-semibold text-gray-800">Health Profile</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select value={formData.healthInfo.bloodType} onChange={e => handleHealthChange('bloodType', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition text-gray-500">
                      <option value="">Blood Type</option>
                      {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <select value={formData.healthInfo.medicalCondition} onChange={e => handleHealthChange('medicalCondition', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition text-gray-500">
                      {medicalConditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200/50 mt-4">
                    {[
                      { key: 'covid19', label: 'Covid-19 Verification' },
                      { key: 'hepatitisA', label: 'Hepatitis A Verification' },
                      { key: 'typhoid', label: 'Typhoid Verification' },
                      { key: 'yellowFever', label: 'Yellow Fever Verification' }
                    ].map(item => (
                      <div key={item.key} className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">{item.label}</label>
                        <div className="flex items-center gap-2">
                          <select value={formData.healthInfo[item.key].status}
                            onChange={e => handleHealthStatusChange(item.key, e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm outline-none focus:border-blue-500">
                            <option value="">Status</option>
                            <option value="Vaccinated">Vaccinated</option>
                            <option value="Not Vaccinated">Not Vaccinated</option>
                            <option value="Exempt">Exempt</option>
                          </select>
                          <label className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition cursor-pointer">
                            <Upload size={18} />
                            <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                              onChange={e => handleVaccinationFile(item.key, e.target.files[0])} />
                          </label>
                        </div>
                        {vaccinationFiles[item.key] && (
                          <span className="text-xs text-green-600 truncate">{vaccinationFiles[item.key].name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 04: Emergency Contact */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/50">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">04.</span>
                  <h2 className="text-lg font-semibold text-gray-800">Emergency Contact</h2>
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="Contact Name" value={formData.emergencyContact.name}
                    onChange={e => handleEmergencyChange('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="tel" placeholder="Phone Number" value={formData.emergencyContact.phoneNumber}
                      onChange={e => handleEmergencyChange('phoneNumber', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition" />
                    <select value={formData.emergencyContact.country} onChange={e => handleEmergencyChange('country', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition text-gray-500">
                      <option value="">Country</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="Maldives">Maldives</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Australia">Australia</option>
                      <option value="India">India</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <select value={formData.emergencyContact.relationship} onChange={e => handleEmergencyChange('relationship', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none transition text-gray-500">
                    <option value="">Relationship</option>
                    {relationships.map(rel => <option key={rel} value={rel}>{rel}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button type="submit" disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-12 rounded-lg shadow-md transition duration-200 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN - Progress Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/50 sticky top-6">
                <h3 className="text-sm font-bold text-gray-800 mb-6 text-center">Registration Progress</h3>
                <div className="relative">
                  <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                  <div className="space-y-8 relative z-10">
                    {steps.map(step => (
                      <div key={step.id} className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveStep(step.id)}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          activeStep >= step.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          {activeStep > step.id ? '✓' : step.id}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-xs font-medium ${activeStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>Step {step.id}</span>
                          <span className={`text-sm font-semibold ${activeStep >= step.id ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default T_ProfilePage;
