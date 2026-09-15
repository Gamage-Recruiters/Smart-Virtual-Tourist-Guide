import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
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

  useEffect(() => {
    let active = true;
    const version = sessionVersion.current;
    const isCurrentSession = () => active && version === sessionVersion.current;
    const token = storedToken();
    if (!token) {
      localStorage.removeItem('token');
      return () => { active = false; };
    }
    apiClient.get('/auth/me')
      .then((data) => {
        if (!isCurrentSession()) return;
        if (!data.user) throw new Error(data.message || 'Unable to restore your session.');
        setUser(data.user);
        localStorage.setItem('userData', JSON.stringify(data.user));
      })
      .catch(() => { if (isCurrentSession()) setUser(null); })
      .finally(() => { if (isCurrentSession()) setLoading(false); });
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    setSession(data) {
      sessionVersion.current += 1;
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      setUser(data.user);
      setLoading(false);
    },
    logout() {
      sessionVersion.current += 1;
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setUser(null);
      setLoading(false);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
