/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('userData') || 'null');
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const setSession = useCallback((token, nextUser) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(nextUser));
    setUser(nextUser);
    window.dispatchEvent(new Event('auth:changed'));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    window.dispatchEvent(new Event('auth:changed'));
  }, []);

  useEffect(() => {
    const sync = () => setUser(readStoredUser());
    window.addEventListener('storage', sync);
    window.addEventListener('auth:changed', sync);
    window.addEventListener('auth:expired', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('auth:changed', sync);
      window.removeEventListener('auth:expired', sync);
    };
  }, []);

  const value = useMemo(() => ({
    user,
    token: localStorage.getItem('token'),
    setSession,
    logout,
    isAuthenticated: Boolean(user && localStorage.getItem('token')),
  }), [logout, setSession, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
