import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('intellireview_token');
    const savedUser = localStorage.getItem('intellireview_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem('intellireview_token', t);
    localStorage.setItem('intellireview_user', JSON.stringify(u));
    toast.success('Welcome back!');
    return res.data;
  };

  const signup = async (name, email, password) => {
    const res = await authAPI.signup({ name, email, password });
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem('intellireview_token', t);
    localStorage.setItem('intellireview_user', JSON.stringify(u));
    toast.success('Account created successfully!');
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('intellireview_token');
    localStorage.removeItem('intellireview_user');
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
