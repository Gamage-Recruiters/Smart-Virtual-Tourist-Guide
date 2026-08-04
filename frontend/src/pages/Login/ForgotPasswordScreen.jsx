import React, { useState, useEffect } from 'react';
import AuthLayout from '../../components/Tourist/AuthLayout';
import forgottenPasswordImg from '../../assets/Tourist/forgottenPasswordImg.png';
import leftLoginImg from '../../assets/Tourist/commonImg.png';
import SuccessPopup from './successPage';
import apiClient from '../../services/api';



const ForgotPasswordScreen = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto close popup + clear field after timeout
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        setEmail(''); // ✅ clear input here
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });

      // If server returns error status or user not found, response will have message
      if (response && response.message && (response.message.includes('sent') || response.message.includes('check'))) {
        setShowPopup(true);
      } else {
        setError(response.message || 'Failed to send reset link');
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
      rightImage={forgottenPasswordImg}
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
      {/* CARD */}
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
          rounded-tl-[60px]
          rounded-tr-[10px]
          rounded-br-[60px]
          rounded-bl-[10px]
          relative
        "
      >
        {/* Title */}
        <div className="flex justify-center mb-7">
          <h2 className="text-4xl font-normal text-black">
            <span className="border-b-2 border-black pb-2 inline-block">
              Forgotton
            </span>{' '}
            <span className="text-blue-400">Password</span>
          </h2>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSendResetLink}>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-start text-sm text-gray-500">
            <p>Enter your email to receive a reset link.</p>
          </div>

          <div className="pb-30">
            <input
              type="email"
              placeholder="Username@gmail.com"
              value={email}              // ✅ controlled input
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                px-5
                py-3.5
                rounded-xl
                bg-white
                border
                border-gray-200
                outline-none
                text-gray-700
                text-sm
              "
              required
            />
          </div>

          <div className="flex justify-start text-sm text-gray-500">
            <a href="/" className="hover:text-blue-400">← Back to Sign In</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 w-full text-lg disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>

      {/* Popup */}
      <SuccessPopup
        isOpen={showPopup}
        title="Reset link sent to your inbox. Please check."
      />
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;