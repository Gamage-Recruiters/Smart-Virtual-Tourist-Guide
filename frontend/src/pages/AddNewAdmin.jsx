import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShield, FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiCheck } from 'react-icons/fi';

const AddNewAdmin = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    role: 'Administrator',
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  // UI State for loading, errors, and success messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const permissions = [
    { id: 1, title: 'Manage Users', desc: 'Add, edit, and remove users' },
    { id: 2, title: 'Manage Listings', desc: 'Approve and manage package listings' },
    { id: 3, title: 'Manage Bookings', desc: 'View and manage all bookings' },
    { id: 4, title: 'View Reports', desc: 'Access business reports' },
    { id: 5, title: 'View Analytics', desc: 'System analytics dashboard' },
    { id: 6, title: 'Manage Site Settings', desc: 'Configure site settings' },
    { id: 7, title: 'Moderate Reviews', desc: 'Approve and manage reviews' },
  ];

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user starts typing again
    if (error) setError('');
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          location: formData.location,
          username: formData.username,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Administrator created successfully! Redirecting...');
        // Save the token to localStorage for future authenticated requests
        localStorage.setItem('adminToken', data.token);
        
        // Redirect to User Management page after 2 seconds
        setTimeout(() => {
          navigate('/user-management');
        }, 2000);
      } else {
        setError(data.message || 'Failed to create administrator');
      }
    } catch (err) {
      setError('Cannot connect to the server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-inter w-full bg-[#EBF4FF] min-h-screen pb-16 pt-8 px-6 md:px-12">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-[32px] font-bold text-[#111111] mb-2">Add New Admin</h1>
          <p className="text-[15px] text-gray-500">Create a new administrator profile for the system</p>
        </div>

        {/* Display Error or Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md shadow-sm">
            {success}
          </div>
        )}

        {/* Form Container */}
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit}>
            
            {/* 1. Account Type */}
            <div className="bg-white rounded-[16px] shadow-sm p-8 border border-red-100">
              <h2 className="text-[16px] font-bold text-[#111111] mb-6 flex items-center gap-2">
                <FiShield className="text-[#1877F2]" size={20} /> Account Type
              </h2>
              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#111111] mb-2">Select Role*</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-[8px] border border-gray-200 bg-white text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2]"
                >
                  <option value="Administrator">Administrator (Full System Access)</option>
                  <option value="Moderator">Moderator (Limited Access)</option>
                  <option value="Editor">Editor (Content Only)</option>
                </select>
              </div>
              <p className="text-[13px] text-blue-600 bg-blue-50 p-3 rounded-[8px] font-medium text-center">
                Administrators have full access to the system and can manage all aspects of the platform.
              </p>
            </div>

            {/* 2. Basic Information */}
            <div className="bg-white rounded-[16px] shadow-sm p-8 border border-red-100 mt-6">
              <h2 className="text-[16px] font-bold text-[#111111] mb-6 flex items-center gap-2">
                <FiUser className="text-[#1877F2]" size={20} /> Basic Information
              </h2>
              
              <div className="mb-6">
                <label className="block text-[13px] font-bold text-[#111111] mb-2">Full Name*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Sahan Anuradha" 
                    className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] placeholder-gray-400" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-2">Email Address*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com" 
                      className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] placeholder-gray-400" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-2">Phone Number*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      placeholder="+94 71 234 5678" 
                      className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] placeholder-gray-400" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-2">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country" 
                    className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] placeholder-gray-400" 
                  />
                </div>
              </div>
            </div>

            {/* 3. Login Credentials */}
            <div className="bg-white rounded-[16px] shadow-sm p-8 border border-red-100 mt-6">
              <h2 className="text-[16px] font-bold text-[#111111] mb-6 flex items-center gap-2">
                <FiLock className="text-[#1877F2]" size={20} /> Login Credentials
              </h2>
              
              <div className="mb-6">
                <label className="block text-[13px] font-bold text-[#111111] mb-2">User name*</label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-[8px] border border-gray-200 bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2]" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-2">Password*</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Minimum 8 characters" 
                    className="w-full px-4 py-3 rounded-[8px] border border-gray-200 bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] placeholder-gray-400" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-2">Confirm Password*</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Re - enter password" 
                    className="w-full px-4 py-3 rounded-[8px] border border-gray-200 bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] placeholder-gray-400" 
                  />
                </div>
              </div>
              <p className="text-[13px] text-blue-600 bg-blue-50 p-3 rounded-[8px] font-medium text-center mt-4">
                Password must be at least 8 characters long and include a mix of letters and numbers.
              </p>
            </div>

            {/* 4. Administrator Permissions */}
            <div className="bg-white rounded-[16px] shadow-sm p-8 border border-red-100 mt-6">
              <h2 className="text-[16px] font-bold text-[#111111] mb-6 flex items-center gap-2">
                <FiShield className="text-[#1877F2]" size={20} /> Administrator Permissions
              </h2>
              
              <div className="flex flex-col gap-3">
                {permissions.map((perm) => (
                  <label key={perm.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-[8px] hover:bg-blue-50/30 cursor-pointer transition-colors">
                    <div className="relative flex items-center justify-center mt-1">
                      <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[4px] checked:bg-[#1877F2] checked:border-[#1877F2] cursor-pointer transition-colors" defaultChecked={perm.id <= 2} />
                      <FiCheck className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-[#111111]">{perm.title}</span>
                      <span className="text-[13px] text-gray-500">{perm.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8 pt-6">
              <Link to="/user-management">
                <button type="button" className="px-10 py-3 bg-white border border-gray-200 rounded-[8px] text-[14px] font-bold text-[#111111] hover:bg-gray-50 transition-colors shadow-sm">
                  Cancel
                </button>
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className={`px-10 py-3 ${loading ? 'bg-blue-400' : 'bg-[#1877F2] hover:bg-blue-600'} border border-transparent rounded-[8px] text-[14px] font-bold text-white transition-colors shadow-sm flex items-center gap-2`}
              >
                <FiUser size={18} /> {loading ? 'Creating...' : 'Create Administrator'}
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
};

export default AddNewAdmin;