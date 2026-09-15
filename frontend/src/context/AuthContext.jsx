/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext(null);
const storedToken = () => {
  const token = localStorage.getItem('token');
  return token && token !== 'null' && token !== 'undefined' ? token : null;
};
const readStoredUser = () => {
  if (!storedToken()) return null;
  try { return JSON.parse(localStorage.getItem('userData') || 'null'); }
  catch { return null; }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(Boolean(storedToken()));
  const sessionVersion = useRef(0);

  const setSession = useCallback((tokenOrSession, nextUser) => {
    const session = typeof tokenOrSession === 'object' ? tokenOrSession : { token: tokenOrSession, user: nextUser };
    sessionVersion.current += 1;
    localStorage.setItem('token', session.token);
    localStorage.setItem('userData', JSON.stringify(session.user));
    setUser(session.user);
    setLoading(false);
    window.dispatchEvent(new Event('auth:changed'));
  }, []);

  const logout = useCallback(() => {
    sessionVersion.current += 1;
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    setLoading(false);
    window.dispatchEvent(new Event('auth:changed'));
  }, []);

  useEffect(() => {
    let active = true;
    const sync = () => {
      const version = ++sessionVersion.current;
      const token = storedToken();
      const isCurrentSession = () => active && version === sessionVersion.current;
      setUser(readStoredUser());
      setLoading(Boolean(token));
      if (!token) return;
      apiClient.get('/auth/me')
        .then((data) => {
          if (!isCurrentSession()) return;
          if (!data.user) throw new Error(data.message || 'Unable to restore your session.');
          setUser(data.user);
          localStorage.setItem('userData', JSON.stringify(data.user));
        })
        .catch(() => { if (isCurrentSession()) setUser(null); })
        .finally(() => { if (isCurrentSession()) setLoading(false); });
    };
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('auth:changed', sync);
    window.addEventListener('auth:expired', sync);
    return () => {
      active = false;
      window.removeEventListener('storage', sync);
      window.removeEventListener('auth:changed', sync);
      window.removeEventListener('auth:expired', sync);
    };
  }, []);

  const value = useMemo(() => ({
    user, loading, token: storedToken(), setSession, logout,
    isAuthenticated: Boolean(user && storedToken()),
  }), [user, loading, setSession, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
