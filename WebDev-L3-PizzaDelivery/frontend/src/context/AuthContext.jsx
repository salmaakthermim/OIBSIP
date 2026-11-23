import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, avatar = '') => {
    const { data } = await api.post('/auth/register', { name, email, password, avatar });
    return data;
  };

  const googleSignIn = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const { displayName, email, photoURL, uid } = result.user;
    const { data } = await api.post('/auth/google-login', {
      name: displayName || email.split('@')[0],
      email,
      avatar: photoURL || '',
      googleId: uid,
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, googleSignIn, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
