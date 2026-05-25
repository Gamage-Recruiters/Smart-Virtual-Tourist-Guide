import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the secure token and user details to browser storage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminInfo', JSON.stringify(data));
        
        // Redirect to Dashboard or User Management page
        navigate('/');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Cannot connect to the server. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EBF4FF] font-inter px-4">
      <div className="max-w-md w-full bg-white rounded-[16px] shadow-lg p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-bold text-[#111111]">
            <span className="text-[#1877F2]">Smart</span> Virtual Guide
          </h1>
          <p className="text-[14px] text-gray-500 mt-2">Admin Dashboard Login</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[14px] rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[13px] font-bold text-[#111111] mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username" 
                className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 bg-gray-50 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] transition-colors" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111111] mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password" 
                className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 bg-gray-50 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1877F2] transition-colors" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`mt-2 w-full flex items-center justify-center gap-2 py-3 ${loading ? 'bg-blue-400' : 'bg-[#1877F2] hover:bg-blue-600'} text-white rounded-[8px] text-[14px] font-bold transition-colors shadow-sm`}
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'} <FiArrowRight />
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;