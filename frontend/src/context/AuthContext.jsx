import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, val) => {
    try {
      localStorage.setItem(key, val);
    } catch {
      // Ignore restricted storage write
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore restricted storage removal
    }
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(safeStorage.getItem('token')));

  // Page refresh par token se user wapas load karo & listen for 401 expiry
  useEffect(() => {
    const handleUnauthorized = () => {
      safeStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    };

    window.addEventListener('shopnest:unauthorized', handleUnauthorized);

    const token = safeStorage.getItem('token');
    if (token) {
      api
        .get('/auth/me')
        .then((res) => setUser(res.data?.user || null))
        .catch((err) => {
          if (err?.response?.status === 401) {
            safeStorage.removeItem('token');
            setUser(null);
          }
        })
        .finally(() => setLoading(false));
    }

    return () => {
      window.removeEventListener('shopnest:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    safeStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    safeStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    safeStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = safeStorage.getItem('token');
    if (!token) return null;
    try {
      const res = await api.get('/auth/me');
      setUser(res.data?.user || null);
      return res.data?.user || null;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);