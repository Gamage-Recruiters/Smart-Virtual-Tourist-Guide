import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { MdFlashOn } from 'react-icons/md';
import AuthLayout from '../../components/Tourist/AuthLayout';
import newPasswordImg from '../../assets/Tourist/newPasswordImg.png';
import leftLoginImg from '../../assets/Tourist/commonImg.png';
import SuccessPopup from './successPage';
import apiClient from '../../services/api';



const NewPasswordCreate = () => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Extract the reset token from query string
  const token = new URLSearchParams(window.location.search).get('token');

  // Reset fields when page loads and check for token
  useEffect(() => {
    setPassword1('');
    setPassword2('');
    if (!token) {
      setError('Password reset token is missing or invalid. Please request a new link.');
    }
  }, [token]);

  // Handle popup auto close + navigate to login screen
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        setPassword1('');
        setPassword2('');
        navigate('/'); // Redirect to login screen
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showPopup, navigate]);

  const handleUpdatePassword = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!token) {
      setError('Password reset token is missing. Please request a new link.');
      return;
    }

    if (!password1 || !password2) {
      setError('Please fill in both fields');
      return;
    }

    if (password1 !== password2) {
      setError('Passwords do not match');
      return;
    }

    if (password1.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password: password1,
      });

      if (response && response.message && response.message.toLowerCase().includes('success')) {
        setShowPopup(true);
      } else {
        setError(response.message || 'Failed to update password');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      rightImage={newPasswordImg}
      leftImage={leftLoginImg}
      rightConfig={{
        width: '60%',
        position: 'right top',
        size: 'cover',
        zIndex: 0,
      }}
      leftConfig={{
        width: '55%',
        position: 'left top',
        size: 'cover',
        zIndex: 20,
      }}
    >
      {/* LOGIN CARD */}
      <div
        className="
          glass-card
          w-full
          max-w-[1000px]
          p-20
          pl-10
          bg-white/30
          backdrop-blur-md
          shadow-2xl
          border border-white/20
          rounded-tl-[70px]
          rounded-tr-[20px]
          rounded-br-[70px]
          rounded-bl-[20px]
          relative
        "
      >
        <div className="flex justify-center mb-7">
          <h2 className="text-4xl font-normal text-black">
            <span className="border-b-2 border-black pb-2 inline-block">
              Create
            </span>{' '}
            <span className="text-blue-400">New Password</span>
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleUpdatePassword}>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-lg">
              New Password
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Password must be at least 8 characters with a number & symbol
            </p>

            <div className="relative">
              <input
                type={showPassword1 ? "text" : "password"}
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                placeholder="••••••••••••"
                className="input-field bg-white pr-10 py-3"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword1(!showPassword1)}
              >
                {showPassword1 ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              Confirm New Password
            </label>

            <div className="relative">
              <input
                type={showPassword2 ? "text" : "password"}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="••••••••••••"
                className="input-field bg-white pr-10 py-3"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 w-full text-lg disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>

            <Link
              to="/"
              className="btn-primary bg-[#0066ff] hover:bg-blue-700 py-3 w-full text-lg block text-center"
            >
              ← Back To Login
            </Link>
          </div>
        </form>
      </div>

      {/* Security info */}
      <div className="mt-8 space-y-6">
        <div className="flex items-start gap-3">
          <div className="text-blue-500 mt-1">
            <FaShieldAlt size={24} />
          </div>
          <div>
            <h4 className="text-gray-800 font-semibold mb-1">
              Strong Security
            </h4>
            <p className="text-sm text-gray-500 max-w-[280px]">
              Your new password is protected with the latest encryption standards.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="text-blue-500 mt-1">
            <MdFlashOn size={28} />
          </div>
          <div>
            <h4 className="text-gray-800 font-semibold mb-1">
              Instant Update
            </h4>
            <p className="text-sm text-gray-500 max-w-[280px]">
              Reset your password in seconds and continue using without delay.
            </p>
          </div>
        </div>
      </div>

      {/* Popup */}
      <SuccessPopup
        isOpen={showPopup}
        title="Password Updated Successfully"
      />
    </AuthLayout>
  );
};

export default NewPasswordCreate;