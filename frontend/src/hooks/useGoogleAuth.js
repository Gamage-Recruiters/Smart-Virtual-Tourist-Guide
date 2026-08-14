import { useState } from 'react';
import { signInWithGoogle } from '../services/firebase';
import { socialAuthAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const getDashboardRoute = (role) => {
  switch (role) {
    case 'tourist_user':     return '/dashboard-Tourist';
    case 'guide_user':       return '/dashboard-Guide';
    case 'hotelowner_user':  return '/dashboard-HotelOwner';
    case 'restaurant_user':  return '/dashboard-Restaurant';
    case 'government_user':  return '/dashboard-Government';
    case 'renter_user':      return '/vehicle-admin';
    case 'driver_user':      return '/dashboard-Driver';
    case 'activityprovider_user': return '/activityprovider/dashboard';
    case 'admin':            return '/dashboard-Admin';
    default:                 return '/';
  }
};

const useGoogleAuth = (navigate, role = null, customRedirect = null) => {
  const { signIn } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const handleGoogleAuth = async () => {
    setGoogleError('');
    setGoogleLoading(true);
    try {
      // Step 1: Firebase popup → Google Authentication → Firebase returns user + idToken
      const { idToken } = await signInWithGoogle();

      // Step 2: POST /api/auth/google → Node.js verifies token → MongoDB check → JWT
      const data = await socialAuthAPI.googleAuth(idToken, role);

      // Step 3: Save token + navigate to dashboard or custom route
      signIn(data.user, data.token);
      
      if (customRedirect) {
        navigate(customRedirect);
      } else {
        navigate(getDashboardRoute(data.user.role));
      }
    } catch (err) {
      setGoogleError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return { handleGoogleAuth, googleLoading, googleError };
};

export default useGoogleAuth;
